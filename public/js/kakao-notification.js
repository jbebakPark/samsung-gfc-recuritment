// 카카오톡 알림 전송 함수
// 카카오톡 ID: 2jbark

async function sendKakaoNotification(applicationData) {
    try {
        // 지원 유형별 메시지 구성
        const typeText = {
            'jobfair': '📅 채용설명회 참가',
            'referral': '👥 추천인 경로',
            'direct': '🌐 직접 지원'
        };
        
        // 메시지 구성
        const message = `
🔔 [신규 GFC 지원서 접수]

📋 지원 구분: ${typeText[applicationData.application_type]}
━━━━━━━━━━━━━━━━━━

👤 기본 정보
• 성명: ${applicationData.name}
• 생년월일: ${applicationData.birth_date}
• 성별: ${applicationData.gender}
• 결혼: ${applicationData.marital_status}

📞 연락처
• 휴대전화: ${applicationData.phone}
${applicationData.home_phone ? `• 자택전화: ${applicationData.home_phone}` : ''}
• 이메일: ${applicationData.email}

🏢 지점 정보
• 지점명: ${applicationData.branch}
• 유치자: ${applicationData.recruiter}

🎓 학력
• ${applicationData.education_level} (${applicationData.education_status})
• ${applicationData.education_school}
${applicationData.education_major ? `• 전공: ${applicationData.education_major}` : ''}

💼 경력
• 총 경력: ${applicationData.career_years}년
• 보험사 경력: ${applicationData.insurance_experience === 'yes' ? '✅ 있음' : '❌ 없음'}
${applicationData.insurance_experience === 'yes' ? `  - ${applicationData.insurance_company} (${applicationData.insurance_period}, 월 ${applicationData.insurance_salary}만원)` : ''}
${applicationData.certificates ? `• 자격증: ${applicationData.certificates}` : ''}

⚠️ 금융불량: ${applicationData.financial_delinquency === 'yes' ? '⚠️ YES (불량)' : '✅ NO (정상)'}

${applicationData.application_type === 'jobfair' ? `
📅 채용설명회 정보
• 희망 날짜: ${applicationData.job_fair_date}
• 희망 지역: ${applicationData.job_fair_location}
` : ''}

${applicationData.application_type === 'referral' ? `
👥 추천인 정보
• 추천인: ${applicationData.referrer_name}
• 연락처: ${applicationData.referrer_phone}
• 소속: ${applicationData.referrer_branch}
` : ''}

📝 지원 동기
${applicationData.motivation.substring(0, 100)}${applicationData.motivation.length > 100 ? '...' : ''}

⏰ 제출 시간: ${new Date(applicationData.submitted_at).toLocaleString('ko-KR')}

━━━━━━━━━━━━━━━━━━
🔗 관리자 페이지에서 상세 확인
        `.trim();
        
        // 카카오톡 메시지 전송 API 호출
        // 방법 1: 카카오톡 오픈채팅 웹훅 사용
        const kakaoWebhookUrl = 'https://open.kakao.com/o/gTj6ox9h'; // 카카오톡 오픈채팅 URL
        
        // 방법 2: 카카오톡 비즈메시지 API 사용
        const kakaoApiUrl = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
        
        // 방법 3: 간단한 이메일 알림 (대체 방법)
        const emailApiUrl = '/api/send-notification';
        
        console.log('=== 카카오톡 알림 내용 ===');
        console.log(message);
        console.log('========================');
        console.log('📱 카카오톡 오픈채팅방:', kakaoWebhookUrl);
        console.log('⚠️  참고: 현재 URL은 채팅방 참여 링크입니다.');
        console.log('⚠️  실시간 자동 전송을 위해서는 Webhook API URL이 필요합니다.');
        console.log('⚠️  대안: Discord/Telegram/Email 알림 사용 권장');
        
        // 실제 API 호출 (Webhook URL 설정 시 활성화)
        // 현재는 카카오톡 오픈채팅방 참여 링크이므로 자동 전송 불가
        // Discord, Telegram, 또는 EmailJS 사용 권장
        // 
        // await fetch(kakaoWebhookUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ text: message })
        // });
        
        return { success: true, message };
        
    } catch (error) {
        console.error('카카오톡 알림 전송 실패:', error);
        return { success: false, error };
    }
}

// 전역으로 내보내기
window.sendKakaoNotification = sendKakaoNotification;
