/**
 * Firebase 설정 (환경 변수 통합)
 * env-loader.js에서 로드한 환경 변수 사용
 */

// 환경 변수가 로드될 때까지 대기
function initializeFirebase() {
    try {
        // Firebase가 로드되었는지 확인
        if (typeof firebase === 'undefined') {
            console.warn('⚠️  Firebase SDK가 로드되지 않았습니다.');
            console.warn('💡 로컬 스토리지를 사용하여 데이터를 임시 저장합니다.');
            return;
        }
        
        // env-loader.js가 window.ENV를 설정할 때까지 대기
        if (!window.ENV) {
            console.warn('⚠️  환경 변수가 아직 로드되지 않았습니다. 기본값 사용');
        }
        
        const firebaseConfig = {
            apiKey: window.ENV?.FIREBASE_API_KEY || "AIzaSyCxxx", // 실제 값으로 변경 필요
            authDomain: window.ENV?.FIREBASE_AUTH_DOMAIN || "samsung-gfc.firebaseapp.com",
            projectId: window.ENV?.FIREBASE_PROJECT_ID || "samsung-gfc",
            storageBucket: window.ENV?.FIREBASE_STORAGE_BUCKET || "samsung-gfc.appspot.com",
            messagingSenderId: window.ENV?.FIREBASE_MESSAGING_SENDER_ID || "123456789",
            appId: window.ENV?.FIREBASE_APP_ID || "1:123456789:web:abcdef"
        };
        
        // Firebase 초기화
        if (!firebase.apps || firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase 초기화 완료');
        }
        
        // Firestore 인스턴스
        window.db = firebase.firestore();
        
        console.log('✅ Firestore 연결 완료');
    } catch (error) {
        console.error('❌ Firebase 초기화 실패:', error);
        console.warn('💡 로컬 스토리지를 사용하여 데이터를 임시 저장합니다.');
    }
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}
