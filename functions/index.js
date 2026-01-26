const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');

admin.initializeApp();

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.password
    }
});

// 카카오톡 알림톡 API 설정
const KAKAO_API_KEY = functions.config().kakao.api_key;
const KAKAO_SENDER_KEY = functions.config().kakao.sender_key;

/**
 * 지원서 제출 시 실시간 알림 전송
 */
exports.onApplicationSubmit = functions.firestore
    .document('applications/{applicationId}')
    .onCreate(async (snap, context) => {
        const application = snap.data();
        const applicationId = context.params.applicationId;

        try {
            // 1. 관리번호 생성 및 업데이트
            const managementNumber = await generateManagementNumber();
            await snap.ref.update({ managementNumber });

            // 2. 관리자에게 알림 전송
            await sendAdminNotification(application, managementNumber);

            // 3. 지원자에게 확인 알림 전송
            await sendApplicantConfirmation(application, managementNumber);

            console.log(`지원서 접수 완료: ${managementNumber}`);
            return { success: true, managementNumber };
        } catch (error) {
            console.error('알림 전송 오류:', error);
            return { success: false, error: error.message };
        }
    });

/**
 * 관리번호 생성
 */
async function generateManagementNumber() {
    const year = new Date().getFullYear();
    const db = admin.firestore();

    // 오늘 날짜의 지원서 수 조회
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const snapshot = await db.collection('applications')
        .where('createdAt', '>=', today)
        .get();

    const sequence = (snapshot.size + 1).toString().padStart(4, '0');
    return `GFC-${year}-${sequence}`;
}

/**
 * 관리자에게 알림 전송
 */
async function sendAdminNotification(application, managementNumber) {
    const adminEmail = functions.config().admin.email;
    const adminPhone = functions.config().admin.phone;

    // 이메일 전송
    const emailOptions = {
        from: functions.config().email.user,
        to: adminEmail,
        subject: `[GFC 지원] 새로운 지원자 접수 - ${application.personalInfo.name}`,
        html: `
            <h2>새로운 GFC 지원자가 접수되었습니다</h2>
            <hr>
            <p><strong>관리번호:</strong> ${managementNumber}</p>
            <p><strong>이름:</strong> ${application.personalInfo.name}</p>
            <p><strong>연락처:</strong> ${application.personalInfo.phone}</p>
            <p><strong>이메일:</strong> ${application.personalInfo.email}</p>
            <p><strong>지원 구분:</strong> ${application.applicationInfo.type === 'jobfair' ? 'Job Fair 참가' : '추천인 경로'}</p>
            <p><strong>접수 일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            <hr>
            <p><a href="https://your-domain.com/admin.html">관리자 대시보드에서 확인하기</a></p>
        `
    };

    await transporter.sendMail(emailOptions);

    // 카카오톡 알림톡 전송
    await sendKakaoNotification(adminPhone, {
        templateCode: 'ADMIN_NEW_APPLICATION',
        variables: {
            managementNumber,
            name: application.personalInfo.name,
            phone: application.personalInfo.phone,
            type: application.applicationInfo.type === 'jobfair' ? 'Job Fair' : '추천인'
        }
    });
}

/**
 * 지원자에게 확인 알림 전송
 */
async function sendApplicantConfirmation(application, managementNumber) {
    const { personalInfo } = application;

    // 이메일 전송
    const emailOptions = {
        from: functions.config().email.user,
        to: personalInfo.email,
        subject: `[삼성생명 GFC] 지원서 접수 완료 - ${personalInfo.name}님`,
        html: `
            <h2>${personalInfo.name}님, 지원서가 정상적으로 접수되었습니다</h2>
            <hr>
            <p><strong>관리번호:</strong> ${managementNumber}</p>
            <p><strong>접수 일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            <p><strong>지원 구분:</strong> ${application.applicationInfo.type === 'jobfair' ? 'Job Fair 참가' : '추천인 경로'}</p>
            <hr>
            <p>빠른 시일 내에 검토 후 연락드리겠습니다.</p>
            <p>감사합니다.</p>
            <br>
            <p><strong>삼성생명 GFC 채용팀</strong></p>
        `
    };

    await transporter.sendMail(emailOptions);

    // 카카오톡 알림톡 전송 (안 1: 공식적이고 전문적인 톤)
    const typeText = application.applicationInfo.type === 'jobfair' ? 'Job Fair 참가' : '추천인 경로';
    const kakaoMessage = `[삼성생명 GFC]
${personalInfo.name}님, 지원서가 정상적으로 접수되었습니다.

📋 관리번호: ${managementNumber}
📅 접수일시: ${new Date().toLocaleString('ko-KR')}
📍 지원구분: ${typeText}

빠른 시일 내에 검토 후 개별 연락드리겠습니다.

▶ 지원 내용 확인
https://gfc-recruit.com/status/${application.id || 'pending'}

문의: 02-1234-5678
삼성생명 GFC 채용팀`;

    await sendKakaoNotification(personalInfo.phone, {
        templateCode: 'APPLICANT_CONFIRMATION',
        message: kakaoMessage,
        variables: {
            name: personalInfo.name,
            managementNumber,
            date: new Date().toLocaleString('ko-KR'),
            type: typeText
        }
    });
}

/**
 * 상태 변경 시 알림 전송
 */
exports.sendStatusChangeNotification = functions.https.onCall(async (data, context) => {
    const { applicationId, name, email, phone, newStatus, memo } = data;

    const statusText = {
        'pending': '접수 대기',
        'review': '검토 중',
        'approved': '합격',
        'rejected': '불합격'
    };

    // 이메일 전송
    const emailOptions = {
        from: functions.config().email.user,
        to: email,
        subject: `[삼성생명 GFC] 지원 상태 변경 안내 - ${name}님`,
        html: `
            <h2>${name}님의 지원 상태가 변경되었습니다</h2>
            <hr>
            <p><strong>변경된 상태:</strong> ${statusText[newStatus]}</p>
            ${memo ? `<p><strong>안내사항:</strong> ${memo}</p>` : ''}
            <hr>
            <p>추가 문의사항이 있으시면 연락 주시기 바랍니다.</p>
            <p>감사합니다.</p>
            <br>
            <p><strong>삼성생명 GFC 채용팀</strong></p>
        `
    };

    await transporter.sendMail(emailOptions);

    // 카카오톡 알림톡 전송
    await sendKakaoNotification(phone, {
        templateCode: 'STATUS_CHANGE',
        variables: {
            name,
            status: statusText[newStatus],
            memo: memo || '없음'
        }
    });

    return { success: true };
});

/**
 * 카카오톡 알림톡 전송
 */
async function sendKakaoNotification(phone, { templateCode, variables }) {
    try {
        const response = await axios.post(
            'https://api.kakao.com/v2/api/talk/send',
            {
                receiver: phone.replace(/-/g, ''),
                template_code: templateCode,
                template_args: variables,
                sender_key: KAKAO_SENDER_KEY
            },
            {
                headers: {
                    'Authorization': `Bearer ${KAKAO_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('카카오톡 전송 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error('카카오톡 전송 실패:', error);
        // 카카오톡 실패 시에도 전체 프로세스는 계속 진행
        return null;
    }
}

/**
 * 일괄 알림 전송 (관리자용)
 */
exports.sendBulkNotifications = functions.https.onCall(async (data, context) => {
    // 관리자 권한 확인
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', '관리자 권한이 필요합니다.');
    }

    const { applicationIds, message, type } = data;
    const db = admin.firestore();

    const results = [];

    for (const appId of applicationIds) {
        try {
            const doc = await db.collection('applications').doc(appId).get();
            const application = doc.data();

            if (type === 'email') {
                await transporter.sendMail({
                    from: functions.config().email.user,
                    to: application.personalInfo.email,
                    subject: '[삼성생명 GFC] 안내',
                    html: message
                });
            } else if (type === 'kakao') {
                await sendKakaoNotification(application.personalInfo.phone, {
                    templateCode: 'BULK_MESSAGE',
                    variables: { message }
                });
            }

            results.push({ id: appId, success: true });
        } catch (error) {
            results.push({ id: appId, success: false, error: error.message });
        }
    }

    return { results };
});

/**
 * JOB 설명회 참석 신청 시 알림 전송
 */
exports.sendJobFairNotification = functions.https.onCall(async (data, context) => {
    const { managementNumber, name, phone, eventInfo } = data;

    // 참석자에게 카카오톡 알림 전송
    await sendKakaoNotification(phone, {
        templateCode: 'JOB_FAIR_CONFIRMATION',
        variables: {
            name,
            managementNumber,
            eventDate: eventInfo.date,
            eventTime: eventInfo.time,
            eventLocation: eventInfo.location
        }
    });

    // 관리자에게도 알림
    const adminPhone = functions.config().admin.phone;
    await sendKakaoNotification(adminPhone, {
        templateCode: 'ADMIN_JOB_FAIR_REGISTRATION',
        variables: {
            name,
            phone,
            managementNumber,
            eventDate: eventInfo.date
        }
    });

    return { success: true };
});

