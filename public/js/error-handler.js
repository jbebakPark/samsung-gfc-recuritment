/**
 * 전역 에러 핸들러
 * 사용자 친화적인 에러 메시지와 로딩 상태 표시
 */

// 에러 유형별 메시지
const ERROR_MESSAGES = {
    'permission-denied': '접근 권한이 없습니다. 관리자에게 문의하세요.',
    'unavailable': '네트워크 연결을 확인해주세요.',
    'unauthenticated': '로그인이 필요합니다.',
    'not-found': '요청한 데이터를 찾을 수 없습니다.',
    'already-exists': '이미 존재하는 데이터입니다.',
    'invalid-argument': '입력값이 올바르지 않습니다.',
    'deadline-exceeded': '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    'default': '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
};

// 사용자 친화적 에러 메시지 표시
function showError(error, context = '') {
    console.error(`[에러] ${context}:`, error);

    let message = ERROR_MESSAGES['default'];
    
    if (error.code && ERROR_MESSAGES[error.code]) {
        message = ERROR_MESSAGES[error.code];
    } else if (error.message) {
        // 개발 환경에서만 상세 메시지 표시
        if (window.location.hostname === 'localhost') {
            message = error.message;
        }
    }

    // 에러 메시지 표시 (Toast)
    showToast(message, 'error');
    
    // 에러 로깅 (선택)
    logErrorToAnalytics(error, context);
}

// Toast 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 로딩 인디케이터
function showLoading(message = '처리 중...') {
    const loading = document.createElement('div');
    loading.id = 'global-loading';
    loading.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.remove();
    }
}

// 에러 로깅 (Analytics)
function logErrorToAnalytics(error, context) {
    // Firebase Analytics 또는 다른 로깅 서비스 연동
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: `${context}: ${error.message}`,
            fatal: false
        });
    }
}

// 전역 에러 이벤트 리스너
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showError(event.error, 'Uncaught Error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showError(event.reason, 'Promise Rejection');
});

// Export
window.ErrorHandler = {
    showError,
    showToast,
    showLoading,
    hideLoading
};

console.log('✅ 전역 에러 핸들러 초기화 완료');
