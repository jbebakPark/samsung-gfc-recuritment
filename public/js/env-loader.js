/**
 * 환경 변수 로더
 * 개발: .env 파일에서 로드 (수동 설정)
 * 프로덕션: 하드코딩된 값 사용
 */

// 개발 환경 감지
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('sandbox');

// 환경 변수 객체
window.ENV = {
    // Firebase 설정 (프로덕션 값으로 업데이트 필요)
    FIREBASE_API_KEY: '',
    FIREBASE_AUTH_DOMAIN: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_STORAGE_BUCKET: '',
    FIREBASE_MESSAGING_SENDER_ID: '',
    FIREBASE_APP_ID: '',
    
    // Kakao Webhook
    KAKAO_WEBHOOK_URL: isDevelopment ?
        'https://talk-bridge.kakao.com/webhooks/dev' :
        'https://talk-bridge.kakao.com/webhooks/prod',
    
    MODE: isDevelopment ? 'development' : 'production'
};

// 로컬 스토리지에서 환경 변수 오버라이드 시도 (개발용)
try {
    const storedEnv = localStorage.getItem('ENV_CONFIG');
    if (storedEnv) {
        const parsedEnv = JSON.parse(storedEnv);
        window.ENV = { ...window.ENV, ...parsedEnv };
        console.log('✅ 로컬 스토리지에서 환경 변수 오버라이드 완료');
    }
} catch (error) {
    // 무시
}

console.log('✅ 환경 변수 로드 완료', window.ENV.MODE === 'development' ? '(개발)' : '(프로덕션)');
