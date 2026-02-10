// ============================================
// GFC 지원자 정보 관리 시스템
// ============================================

// Firebase 초기화 확인
if (typeof firebase === 'undefined') {
    console.error('Firebase가 로드되지 않았습니다.');
}

const db = firebase.firestore();

/**
 * 지원자 정보 저장
 * @param {Object} formData - 지원서 폼 데이터
 * @returns {Promise<Object>} - 저장된 문서 정보
 */
async function saveApplicantData(formData) {
    try {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        // 지원자 데이터 구조화
        const applicantData = {
            // 기본 정보
            personalInfo: {
                name: formData.get('name'),
                birthDate: formData.get('birth_date'),
                gender: formData.get('gender'),
                maritalStatus: formData.get('marital_status'),
                phone: formData.get('phone'),
                homePhone: formData.get('home_phone') || '',
                email: formData.get('email'),
                address: formData.get('address'),
                addressDetail: formData.get('address_detail') || ''
            },
            
            // 지원 구분
            applicationType: formData.get('application_type'),
            applicationTypeLabel: getApplicationTypeLabel(formData.get('application_type')),
            
            // 서류 접수 방법 (기본값: 전자접수)
            submissionMethod: 'online',
            submissionMethodLabel: '전자접수',
            
            // 지점 정보
            branch: formData.get('branch'),
            recruiter: formData.get('recruiter'),
            
            // 학력 정보
            education: {
                level: formData.get('education_level'),
                status: formData.get('education_status'),
                school: formData.get('education_school'),
                major: formData.get('education_major') || ''
            },
            
            // 경력 정보
            career: {
                hasInsuranceExperience: formData.get('insurance_experience') === 'yes',
                insuranceCompany: formData.get('insurance_company') || '',
                insurancePeriod: formData.get('insurance_period') || '',
                insuranceSalary: formData.get('insurance_salary') || '',
                hasOtherExperience: formData.get('other_experience') === 'yes',
                otherCompany: formData.get('other_company') || '',
                otherPosition: formData.get('other_position') || '',
                otherPeriod: formData.get('other_period') || ''
            },
            
            // 금융 정보
            financial: {
                hasDelinquency: formData.get('financial_delinquency') === 'yes'
            },
            
            // 지원 동기
            motivation: {
                reason: formData.get('motivation'),
                introduction: formData.get('introduction')
            },
            
            // 동의 정보
            consents: {
                collection: formData.get('consent_collection') === 'on',
                thirdParty: formData.get('consent_third_party') === 'on',
                creditInquiry: formData.get('consent_credit_inquiry') === 'on',
                marketing: formData.get('consent_marketing') === 'on'
            },
            
            // 진행 상태
            status: 'submitted',
            statusLabel: '접수완료',
            statusHistory: [{
                status: 'submitted',
                statusLabel: '접수완료',
                timestamp: timestamp,
                note: '지원서 접수 완료'
            }],
            
            // 알림 이력
            notifications: [],
            
            // 문서 정보
            documents: [],
            
            // 메타 정보
            createdAt: timestamp,
            updatedAt: timestamp,
            submittedAt: timestamp,
            ipAddress: await getUserIP(),
            userAgent: navigator.userAgent,
            
            // 관리자 메모
            adminNotes: []
        };
        
        // Job Fair 정보 추가
        if (formData.get('application_type') === 'jobfair') {
            applicantData.jobFairInfo = {
                date: formData.get('jobfair_date'),
                time: formData.get('jobfair_time'),
                attendanceConfirmed: false
            };
        }
        
        // 추천인 정보 추가
        if (formData.get('application_type') === 'referral') {
            applicantData.referralInfo = {
                name: formData.get('referrer_name'),
                phone: formData.get('referrer_phone'),
                branch: formData.get('referrer_branch')
            };
        }
        
        // Firestore에 저장
        const docRef = await db.collection('applicants').add(applicantData);
        
        console.log('✅ 지원자 정보 저장 완료:', docRef.id);
        
        // 활동 로그 기록
        await logActivity({
            type: 'application_submit',
            applicantId: docRef.id,
            action: '지원서 제출',
            description: `${applicantData.personalInfo.name}님의 지원서가 제출되었습니다.`,
            metadata: {
                applicationType: applicantData.applicationType,
                submissionMethod: applicantData.submissionMethod
            }
        });
        
        // 접수 완료 알림 발송
        await sendNotification({
            applicantId: docRef.id,
            type: 'application_received',
            recipient: {
                name: applicantData.personalInfo.name,
                phone: applicantData.personalInfo.phone,
                email: applicantData.personalInfo.email
            }
        });
        
        return {
            success: true,
            applicantId: docRef.id,
            data: applicantData
        };
        
    } catch (error) {
        console.error('❌ 지원자 정보 저장 실패:', error);
        
        // 에러 로그 기록
        await logActivity({
            type: 'error',
            action: '지원서 제출 실패',
            description: error.message,
            metadata: { error: error.toString() }
        });
        
        throw error;
    }
}

/**
 * 지원 구분 라벨 가져오기
 */
function getApplicationTypeLabel(type) {
    const labels = {
        'jobfair': '채용설명회 참가',
        'referral': '추천인 경로',
        'direct': '직접 지원'
    };
    return labels[type] || type;
}

/**
 * 사용자 IP 주소 가져오기
 */
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('IP 조회 실패:', error);
        return 'unknown';
    }
}

/**
 * 활동 로그 기록
 */
async function logActivity(logData) {
    try {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        const activityLog = {
            ...logData,
            timestamp: timestamp,
            ipAddress: await getUserIP(),
            userAgent: navigator.userAgent,
            createdAt: timestamp
        };
        
        await db.collection('activity_logs').add(activityLog);
        console.log('📝 활동 로그 기록 완료');
        
    } catch (error) {
        console.error('❌ 활동 로그 기록 실패:', error);
    }
}

/**
 * 알림 발송
 */
async function sendNotification(notificationData) {
    try {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        // 알림 메시지 생성
        const messages = getNotificationMessages(notificationData.type, notificationData.recipient);
        
        // 알림 대기열에 추가
        const notifications = [];
        
        // 카카오톡 알림
        if (messages.kakao) {
            notifications.push({
                type: 'kakao',
                recipient: notificationData.recipient,
                message: messages.kakao,
                applicantId: notificationData.applicantId,
                status: 'pending',
                scheduledAt: timestamp,
                createdAt: timestamp,
                updatedAt: timestamp
            });
        }
        
        // SMS 알림
        if (messages.sms) {
            notifications.push({
                type: 'sms',
                recipient: notificationData.recipient,
                message: messages.sms,
                applicantId: notificationData.applicantId,
                status: 'pending',
                scheduledAt: timestamp,
                createdAt: timestamp,
                updatedAt: timestamp
            });
        }
        
        // 이메일 알림
        if (messages.email) {
            notifications.push({
                type: 'email',
                recipient: notificationData.recipient,
                message: messages.email,
                applicantId: notificationData.applicantId,
                status: 'pending',
                scheduledAt: timestamp,
                createdAt: timestamp,
                updatedAt: timestamp
            });
        }
        
        // 알림 대기열에 저장
        for (const notification of notifications) {
            await db.collection('notification_queue').add(notification);
        }
        
        console.log('📨 알림 발송 대기열에 추가:', notifications.length, '개');
        
        // 지원자 문서에 알림 기록 추가
        await db.collection('applicants').doc(notificationData.applicantId).update({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                type: 'all',
                status: 'queued',
                message: '접수 완료 알림',
                sentAt: timestamp
            })
        });
        
    } catch (error) {
        console.error('❌ 알림 발송 실패:', error);
    }
}

/**
 * 알림 메시지 생성
 */
function getNotificationMessages(type, recipient) {
    const messages = {};
    
    if (type === 'application_received') {
        messages.kakao = {
            title: '[삼성생명 GFC] 지원서 접수 완료',
            body: `${recipient.name}님,\n\nGFC 지원서가 성공적으로 접수되었습니다.\n\n심사 후 연락드리겠습니다.\n감사합니다.`,
            templateId: 'application_received'
        };
        
        messages.sms = {
            body: `[삼성생명 GFC] ${recipient.name}님의 지원서가 접수되었습니다. 심사 후 연락드리겠습니다.`
        };
        
        messages.email = {
            subject: '[삼성생명 GFC] 지원서 접수 완료',
            body: `${recipient.name}님,\n\nGFC 지원서가 성공적으로 접수되었습니다.\n\n담당자가 검토 후 연락드리겠습니다.\n\n감사합니다.\n\n삼성생명 GFC 채용팀`
        };
    }
    
    return messages;
}

/**
 * 지원자 상태 업데이트
 */
async function updateApplicantStatus(applicantId, newStatus, note = '') {
    try {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const statusLabel = getStatusLabel(newStatus);
        
        // 현재 지원자 정보 가져오기
        const applicantDoc = await db.collection('applicants').doc(applicantId).get();
        const applicantData = applicantDoc.data();
        
        // 상태 업데이트
        await db.collection('applicants').doc(applicantId).update({
            status: newStatus,
            statusLabel: statusLabel,
            statusHistory: firebase.firestore.FieldValue.arrayUnion({
                status: newStatus,
                statusLabel: statusLabel,
                timestamp: timestamp,
                note: note || `상태 변경: ${statusLabel}`
            }),
            updatedAt: timestamp
        });
        
        console.log('✅ 상태 업데이트 완료:', applicantId, newStatus);
        
        // 활동 로그 기록
        await logActivity({
            type: 'status_change',
            applicantId: applicantId,
            action: '상태 변경',
            description: `${applicantData.personalInfo.name}님의 상태가 ${statusLabel}(으)로 변경되었습니다.`,
            before: { status: applicantData.status },
            after: { status: newStatus },
            metadata: { note: note }
        });
        
        // 상태 변경 알림 발송
        await sendStatusChangeNotification(applicantId, newStatus, applicantData);
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ 상태 업데이트 실패:', error);
        throw error;
    }
}

/**
 * 상태 라벨 가져오기
 */
function getStatusLabel(status) {
    const labels = {
        'submitted': '접수완료',
        'reviewing': '심사중',
        'interview_scheduled': '면접통보',
        'interview_completed': '면접완료',
        'accepted': '합격',
        'rejected': '불합격'
    };
    return labels[status] || status;
}

/**
 * 상태 변경 알림 발송
 */
async function sendStatusChangeNotification(applicantId, newStatus, applicantData) {
    const messages = getStatusChangeMessages(newStatus, applicantData.personalInfo.name);
    
    if (messages) {
        await sendNotification({
            applicantId: applicantId,
            type: 'status_change',
            recipient: {
                name: applicantData.personalInfo.name,
                phone: applicantData.personalInfo.phone,
                email: applicantData.personalInfo.email
            },
            messages: messages
        });
    }
}

/**
 * 상태 변경 메시지 생성
 */
function getStatusChangeMessages(status, name) {
    const messages = {};
    
    switch (status) {
        case 'reviewing':
            messages.sms = {
                body: `[삼성생명 GFC] ${name}님의 지원서 심사가 시작되었습니다.`
            };
            break;
            
        case 'interview_scheduled':
            messages.sms = {
                body: `[삼성생명 GFC] ${name}님의 면접이 예정되었습니다. 자세한 내용은 이메일을 확인해주세요.`
            };
            break;
            
        case 'accepted':
            messages.sms = {
                body: `[삼성생명 GFC] ${name}님, 합격을 축하드립니다! 자세한 내용은 이메일을 확인해주세요.`
            };
            break;
            
        case 'rejected':
            messages.sms = {
                body: `[삼성생명 GFC] ${name}님, 아쉽게도 이번 채용에서는 인연이 닿지 않았습니다. 감사합니다.`
            };
            break;
    }
    
    return messages;
}

// 폼 제출 이벤트 리스너 수정
document.getElementById('applicationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    
    try {
        const formData = new FormData(this);
        const result = await saveApplicantData(formData);
        
        if (result.success) {
            // 성공 모달 표시
            showSuccessModal(result.applicantId);
        }
        
    } catch (error) {
        alert('지원서 제출에 실패했습니다. 다시 시도해 주세요.\n\n오류: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 지원서 제출하기';
    }
});

/**
 * 성공 모달 표시
 */
function showSuccessModal(applicantId) {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // 지원서 ID를 모달에 표시 (옵션)
        const messageElement = modal.querySelector('.success-message');
        if (messageElement) {
            const originalMessage = messageElement.innerHTML;
            messageElement.innerHTML = originalMessage + `<br><br><small>지원서 번호: ${applicantId.substring(0, 8).toUpperCase()}</small>`;
        }
    }
}
