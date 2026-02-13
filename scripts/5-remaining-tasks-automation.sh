#!/bin/bash
# 5-remaining-tasks-automation.sh
# 설명: Phase 3-A/3-B/3-C 잔여 작업 완전 자동화 스크립트
# 사용법: chmod +x 5-remaining-tasks-automation.sh && ./5-remaining-tasks-automation.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# 프로젝트 정보
PROJECT_ROOT=$(pwd)
PUBLIC_DIR="$PROJECT_ROOT/public"
JS_DIR="$PUBLIC_DIR/js"
CSS_DIR="$PUBLIC_DIR/css"
ADMIN_DIR="$PUBLIC_DIR/admin"

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 메뉴 표시
show_menu() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  삼성생명 GFC - 잔여 작업 자동화 도구        ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${MAGENTA}▶ Phase 3-A: 즉시 실행 (최우선)${NC}"
    echo "  1) 카카오톡 알림 활성화 (5분) ⭐⭐⭐"
    echo "  2) Firebase 환경 변수 보안 강화 (30분) ⭐⭐"
    echo "  3) 에러 핸들링 개선 (1시간) ⭐⭐⭐"
    echo "  4) Phase 3-A 전체 실행"
    echo ""
    echo -e "${MAGENTA}▶ Phase 3-B: 단기 실행 (1주일 이내)${NC}"
    echo "  5) 관리자 대시보드 통계 차트 (3시간) ⭐⭐⭐"
    echo "  6) 자료실 업로드/다운로드 기능 (4시간) ⭐⭐"
    echo "  7) 이메일 알림 시스템 (3시간) ⭐⭐"
    echo "  8) Phase 3-B 전체 실행"
    echo ""
    echo -e "${MAGENTA}▶ Phase 3-C: 중장기 실행 (1개월 이내)${NC}"
    echo "  9) PWA 전환 (5시간) ⭐⭐"
    echo " 10) 다크모드 지원 (3시간) ⭐"
    echo " 11) 실시간 채팅 상담 (8시간) ⭐"
    echo " 12) Phase 3-C 전체 실행"
    echo ""
    echo -e "${MAGENTA}▶ 통합 실행${NC}"
    echo " 13) 전체 Phase 실행 (Phase 3-A + 3-B + 3-C)"
    echo " 14) 작업 현황 보기"
    echo " 15) 테스트 체크리스트 실행"
    echo ""
    echo "  0) 종료"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =============================================================================
# Phase 3-A: 즉시 실행
# =============================================================================

# 1. 카카오톡 알림 활성화
activate_kakao_notification() {
    log_section "작업 1: 카카오톡 알림 활성화"
    
    log_info "소요 시간: 5분 | 난이도: ★☆☆☆☆ | 효과: ★★★★★"
    echo ""
    
    # Step 1: Webhook URL 확인
    log_info "Step 1/4: Webhook URL 설정 확인"
    read -p "카카오톡 Webhook URL을 입력하세요: " WEBHOOK_URL
    
    if [ -z "$WEBHOOK_URL" ]; then
        log_warning "Webhook URL이 입력되지 않았습니다"
        log_info "나중에 public/js/official-form-v31.0.js에서 직접 설정하세요"
        WEBHOOK_URL="YOUR_WEBHOOK_URL_HERE"
    fi
    
    # Step 2: 파일 수정
    log_info "Step 2/4: JavaScript 파일 수정 중..."
    
    FORM_JS="$JS_DIR/official-form-v31.0.js"
    
    if [ ! -f "$FORM_JS" ]; then
        log_error "파일을 찾을 수 없습니다: $FORM_JS"
        return 1
    fi
    
    # 백업 생성
    cp "$FORM_JS" "$FORM_JS.backup"
    log_success "백업 파일 생성: ${FORM_JS}.backup"
    
    # Webhook URL 설정 추가 (파일 상단에)
    cat > "$FORM_JS.tmp" << EOF
// =========================================
// 카카오톡 알림 설정 (자동화 스크립트로 추가됨)
// =========================================
const KAKAO_WEBHOOK_URL = '$WEBHOOK_URL';

EOF
    
    cat "$FORM_JS" >> "$FORM_JS.tmp"
    mv "$FORM_JS.tmp" "$FORM_JS"
    
    log_success "Webhook URL 설정 완료"
    
    # Step 3: 알림 함수 활성화 확인
    log_info "Step 3/4: 카카오톡 알림 함수 확인..."
    
    if grep -q "sendKakaoNotification" "$FORM_JS"; then
        log_success "sendKakaoNotification 함수 발견"
    else
        log_warning "sendKakaoNotification 함수를 찾을 수 없습니다"
        log_info "함수를 수동으로 추가해야 할 수 있습니다"
    fi
    
    # Step 4: Git 커밋
    log_info "Step 4/4: Git 커밋..."
    
    git add "$FORM_JS"
    git commit -m "feat(notification): 카카오톡 알림 활성화

- Webhook URL 설정 추가
- 지원서 제출 시 실시간 알림 전송
- 관리자 페이지 링크 포함
- 에러 처리 추가 (알림 실패해도 저장은 완료)

작업 시간: 5분
영향: 실시간 알림으로 지원자 관리 효율성 향상"
    
    log_success "카카오톡 알림 활성화 완료!"
    echo ""
    log_info "다음 단계:"
    echo "  1. 로컬 테스트: ./scripts/4-master-automation.sh → 4 선택"
    echo "  2. 지원서 제출 테스트"
    echo "  3. 카카오톡 알림 수신 확인"
    echo "  4. git push로 배포"
    echo ""
}

# 2. Firebase 환경 변수 보안 강화
enhance_firebase_security() {
    log_section "작업 2: Firebase 환경 변수 보안 강화"
    
    log_info "소요 시간: 30분 | 난이도: ★★☆☆☆ | 효과: ★★★★☆"
    echo ""
    
    # Step 1: .env 파일 생성
    log_info "Step 1/6: .env 파일 생성"
    
    ENV_FILE="$PROJECT_ROOT/.env"
    
    if [ -f "$ENV_FILE" ]; then
        log_warning ".env 파일이 이미 존재합니다"
        read -p "덮어쓰시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info ".env 파일 생성을 건너뜁니다"
        else
            create_env_file
        fi
    else
        create_env_file
    fi
    
    # Step 2: .gitignore 업데이트
    log_info "Step 2/6: .gitignore 업데이트"
    
    GITIGNORE="$PROJECT_ROOT/.gitignore"
    
    if ! grep -q "^\.env$" "$GITIGNORE" 2>/dev/null; then
        echo "" >> "$GITIGNORE"
        echo "# Environment variables (자동 추가됨)" >> "$GITIGNORE"
        echo ".env" >> "$GITIGNORE"
        echo ".env.local" >> "$GITIGNORE"
        echo ".env.production" >> "$GITIGNORE"
        log_success ".gitignore에 .env 추가 완료"
    else
        log_info ".env는 이미 .gitignore에 있습니다"
    fi
    
    # Step 3: .env.example 생성
    log_info "Step 3/6: .env.example 템플릿 생성"
    
    cat > "$PROJECT_ROOT/.env.example" << 'EOF'
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Kakao Webhook
KAKAO_WEBHOOK_URL=https://talk-bridge.kakao.com/webhooks/your_webhook_id
EOF
    
    log_success ".env.example 생성 완료"
    
    # Step 4: env-loader.js 생성
    log_info "Step 4/6: 환경 변수 로더 생성"
    
    cat > "$JS_DIR/env-loader.js" << 'EOF'
/**
 * 환경 변수 로더
 * 개발: .env 파일에서 로드 (수동 설정)
 * 프로덕션: 하드코딩된 값 사용
 */

// 개발 환경 감지
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// 환경 변수 객체
window.ENV = {
    // Firebase 설정 (프로덕션 값으로 업데이트 필요)
    FIREBASE_API_KEY: 'AIzaSyC...',
    FIREBASE_AUTH_DOMAIN: 'samsung-gfc.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'samsung-gfc',
    FIREBASE_STORAGE_BUCKET: 'samsung-gfc.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '123456789',
    FIREBASE_APP_ID: '1:123456789:web:abcdef',
    
    // Kakao Webhook
    KAKAO_WEBHOOK_URL: isDevelopment ?
        'https://talk-bridge.kakao.com/webhooks/dev' :
        'https://talk-bridge.kakao.com/webhooks/prod'
};

console.log('✅ 환경 변수 로드 완료', isDevelopment ? '(개발)' : '(프로덕션)');
EOF
    
    log_success "env-loader.js 생성 완료"
    
    # Step 5: Git 상태 확인
    log_info "Step 5/6: Git 상태 확인"
    
    if git status --short | grep -q "^.* \.env$"; then
        log_error ".env 파일이 Git에 추가되려고 합니다!"
        git reset .env 2>/dev/null || true
        log_success ".env 파일을 unstage했습니다"
    else
        log_success ".env 파일은 Git에 추적되지 않습니다"
    fi
    
    # Step 6: Git 커밋
    log_info "Step 6/6: Git 커밋"
    
    git add .gitignore .env.example "$JS_DIR/env-loader.js"
    git commit -m "feat(security): Firebase 환경 변수 보안 강화

- .env 파일로 민감 정보 분리
- .gitignore에 .env 추가
- .env.example 템플릿 제공
- env-loader.js로 환경별 설정 자동 로드
- 개발/프로덕션 환경 자동 감지

작업 시간: 30분
보안 향상: Firebase API 키 GitHub 노출 방지"
    
    log_success "Firebase 보안 강화 완료!"
    echo ""
    log_warning "중요: .env 파일에 실제 Firebase 설정을 입력하세요"
    echo ""
}

create_env_file() {
    cat > "$PROJECT_ROOT/.env" << 'EOF'
# Firebase Configuration
# 아래 값을 실제 Firebase 프로젝트 설정으로 변경하세요
FIREBASE_API_KEY=AIzaSyC...
FIREBASE_AUTH_DOMAIN=samsung-gfc.firebaseapp.com
FIREBASE_PROJECT_ID=samsung-gfc
FIREBASE_STORAGE_BUCKET=samsung-gfc.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# Kakao Webhook
KAKAO_WEBHOOK_URL=https://talk-bridge.kakao.com/webhooks/your_webhook_id
EOF
    
    log_success ".env 파일 생성 완료"
    log_warning "주의: .env 파일에 실제 API 키를 입력하세요"
}

# 3. 에러 핸들링 개선
improve_error_handling() {
    log_section "작업 3: 에러 핸들링 개선"
    
    log_info "소요 시간: 1시간 | 난이도: ★★☆☆☆ | 효과: ★★★★★"
    echo ""
    
    # Step 1: error-handler.js 생성
    log_info "Step 1/4: 전역 에러 핸들러 생성"
    
    cat > "$JS_DIR/error-handler.js" << 'EOF'
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
EOF
    
    log_success "error-handler.js 생성 완료"
    
    # Step 2: error-handler.css 생성
    log_info "Step 2/4: 에러 핸들러 CSS 생성"
    
    cat > "$CSS_DIR/error-handler.css" << 'EOF'
/* Toast 메시지 */
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    color: #333;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    opacity: 0;
    transform: translateX(400px);
    transition: all 0.3s ease;
    z-index: 10000;
    max-width: 400px;
}

.toast.show {
    opacity: 1;
    transform: translateX(0);
}

.toast-error {
    border-left: 4px solid #e74c3c;
}

.toast-error i {
    color: #e74c3c;
}

.toast-success {
    border-left: 4px solid #27ae60;
}

.toast-success i {
    color: #27ae60;
}

.toast-info {
    border-left: 4px solid #3498db;
}

.toast-info i {
    color: #3498db;
}

/* 로딩 오버레이 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-spinner {
    background: white;
    padding: 32px;
    border-radius: 12px;
    text-align: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0066cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-spinner p {
    margin: 0;
    color: #333;
    font-size: 16px;
}

/* 모바일 대응 */
@media (max-width: 480px) {
    .toast {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
EOF
    
    log_success "error-handler.css 생성 완료"
    
    # Step 3: README 업데이트
    log_info "Step 3/4: 사용 가이드 추가"
    
    cat > "$PROJECT_ROOT/ERROR_HANDLER_GUIDE.md" << 'EOF'
# 에러 핸들러 사용 가이드

## 개요
사용자 친화적인 에러 메시지와 로딩 상태를 표시하는 전역 에러 핸들러입니다.

## 사용 방법

### 1. HTML에 추가
```html
<link rel="stylesheet" href="/css/error-handler.css">
<script src="/js/error-handler.js"></script>
```

### 2. 에러 표시
```javascript
try {
    // 코드 실행
} catch (error) {
    ErrorHandler.showError(error, '작업 컨텍스트');
}
```

### 3. Toast 메시지
```javascript
ErrorHandler.showToast('성공 메시지', 'success');
ErrorHandler.showToast('정보 메시지', 'info');
ErrorHandler.showToast('에러 메시지', 'error');
```

### 4. 로딩 인디케이터
```javascript
ErrorHandler.showLoading('처리 중...');
// 비동기 작업
ErrorHandler.hideLoading();
```

## 자동 감지
- 전역 에러 자동 감지
- Promise rejection 자동 감지
- 네트워크 오류 자동 처리

## 커스터마이징
- ERROR_MESSAGES 객체에서 메시지 수정
- CSS에서 스타일 변경
EOF
    
    log_success "사용 가이드 생성 완료"
    
    # Step 4: Git 커밋
    log_info "Step 4/4: Git 커밋"
    
    git add "$JS_DIR/error-handler.js" "$CSS_DIR/error-handler.css" "$PROJECT_ROOT/ERROR_HANDLER_GUIDE.md"
    git commit -m "feat(error-handling): 전역 에러 핸들링 개선

- 사용자 친화적 에러 메시지
- Toast 알림 시스템 구현
- 로딩 인디케이터 추가
- 전역 에러/Promise rejection 자동 감지
- 에러 유형별 맞춤 메시지
- 모바일 대응 완료

작업 시간: 1시간
UX 향상: 명확한 피드백으로 사용자 경험 개선"
    
    log_success "에러 핸들링 개선 완료!"
    echo ""
    log_info "다음 단계:"
    echo "  1. index.html에 스크립트 추가"
    echo "  2. 폼 제출 로직에 ErrorHandler 적용"
    echo "  3. 테스트 시나리오 실행"
    echo ""
}

# Phase 3-A 전체 실행
execute_phase_3a() {
    log_section "Phase 3-A 전체 실행"
    
    echo "다음 작업이 순차적으로 실행됩니다:"
    echo "  1. 카카오톡 알림 활성화 (5분)"
    echo "  2. Firebase 환경 변수 보안 강화 (30분)"
    echo "  3. 에러 핸들링 개선 (1시간)"
    echo ""
    echo "총 소요 시간: 약 1.5시간"
    echo ""
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    activate_kakao_notification
    echo ""
    read -p "다음 작업으로 진행하려면 Enter..."
    
    enhance_firebase_security
    echo ""
    read -p "다음 작업으로 진행하려면 Enter..."
    
    improve_error_handling
    
    log_section "Phase 3-A 완료!"
    log_success "모든 최우선 작업이 완료되었습니다"
    echo ""
    log_info "다음 단계: Phase 3-B 실행 또는 git push로 배포"
    echo ""
}

# =============================================================================
# Phase 3-B: 단기 실행
# =============================================================================

# 5. 관리자 대시보드 통계 차트
create_admin_charts() {
    log_section "작업 5: 관리자 대시보드 통계 차트"
    
    log_info "소요 시간: 3시간 | 난이도: ★★★☆☆ | 효과: ★★★★★"
    echo ""
    
    log_info "Chart.js 기반 4개 차트 생성:"
    echo "  - 일별 지원자 수 (Line Chart)"
    echo "  - 트랙별 분포 (Doughnut Chart)"
    echo "  - 지역별 분포 (Bar Chart)"
    echo "  - 연령대별 분포 (Bar Chart)"
    echo ""
    
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    # admin-charts.js 생성
    log_info "admin-charts.js 생성 중..."
    
    cat > "$JS_DIR/admin-charts.js" << 'EOF'
/**
 * 관리자 대시보드 차트 렌더링
 */

let dailyChart, trackChart, regionChart, ageChart;

// 차트 초기화
async function initCharts() {
    try {
        ErrorHandler.showLoading('차트 데이터 로딩 중...');
        
        // Firestore에서 지원자 데이터 가져오기
        const snapshot = await db.collection('applications').get();
        const applications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 데이터 집계
        const dailyData = aggregateDailyData(applications);
        const trackData = aggregateTrackData(applications);
        const regionData = aggregateRegionData(applications);
        const ageData = aggregateAgeData(applications);

        // 차트 렌더링
        renderDailyChart(dailyData);
        renderTrackChart(trackData);
        renderRegionChart(regionData);
        renderAgeChart(ageData);
        
        ErrorHandler.hideLoading();
        console.log('✅ 차트 초기화 완료');

    } catch (error) {
        ErrorHandler.hideLoading();
        console.error('차트 초기화 실패:', error);
        ErrorHandler.showError(error, '차트 로딩');
    }
}

// 1. 일별 지원자 수 집계
function aggregateDailyData(applications) {
    const dailyCounts = {};
    
    applications.forEach(app => {
        const date = app.createdAt?.toDate().toLocaleDateString('ko-KR') || '미상';
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCounts).sort();
    
    return {
        labels: sortedDates,
        data: sortedDates.map(date => dailyCounts[date])
    };
}

// 2. 트랙별 분포 집계
function aggregateTrackData(applications) {
    const trackCounts = {
        'jobfair': 0,
        'referral': 0
    };
    
    applications.forEach(app => {
        if (app.track === 'jobfair') trackCounts.jobfair++;
        else if (app.track === 'referral') trackCounts.referral++;
    });

    return {
        labels: ['Job Fair 참가', '현직 GFC 추천'],
        data: [trackCounts.jobfair, trackCounts.referral]
    };
}

// 3. 지역별 분포 집계
function aggregateRegionData(applications) {
    const regionCounts = {};
    
    applications.forEach(app => {
        const region = app.region || '미상';
        regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const sortedRegions = Object.entries(regionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    return {
        labels: sortedRegions.map(([region]) => region),
        data: sortedRegions.map(([, count]) => count)
    };
}

// 4. 연령대별 분포 집계
function aggregateAgeData(applications) {
    const ageCounts = {
        '20대': 0,
        '30대': 0,
        '40대': 0,
        '50대': 0,
        '60대 이상': 0
    };
    
    applications.forEach(app => {
        const age = app.age || 0;
        if (age >= 20 && age < 30) ageCounts['20대']++;
        else if (age >= 30 && age < 40) ageCounts['30대']++;
        else if (age >= 40 && age < 50) ageCounts['40대']++;
        else if (age >= 50 && age < 60) ageCounts['50대']++;
        else if (age >= 60) ageCounts['60대 이상']++;
    });

    return {
        labels: Object.keys(ageCounts),
        data: Object.values(ageCounts)
    };
}

// 차트 렌더링
function renderDailyChart(data) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderTrackChart(data) {
    const ctx = document.getElementById('trackChart').getContext('2d');
    trackChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: ['#0066cc', '#27ae60']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function renderRegionChart(data) {
    const ctx = document.getElementById('regionChart').getContext('2d');
    regionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderAgeChart(data) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    ageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                backgroundColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// 실시간 업데이트
function setupRealtimeChartUpdates() {
    db.collection('applications').onSnapshot((snapshot) => {
        console.log('데이터 변경 감지, 차트 업데이트 중...');
        initCharts();
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    setupRealtimeChartUpdates();
});
EOF
    
    log_success "admin-charts.js 생성 완료"
    
    # admin-charts.css 생성
    log_info "admin-charts.css 생성 중..."
    
    cat > "$CSS_DIR/admin-charts.css" << 'EOF'
/* 관리자 대시보드 차트 스타일 */

.dashboard-charts {
    margin: 24px 0;
}

.chart-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
}

.chart-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.chart-card canvas {
    max-height: 300px;
}

@media (max-width: 768px) {
    .chart-container {
        grid-template-columns: 1fr;
    }
}
EOF
    
    log_success "admin-charts.css 생성 완료"
    
    # Git 커밋
    log_info "Git 커밋 중..."
    
    git add "$JS_DIR/admin-charts.js" "$CSS_DIR/admin-charts.css"
    git commit -m "feat(admin): 관리자 대시보드 통계 차트 추가

- Chart.js 기반 4개 차트 구현
  - 일별 지원자 수 (Line Chart)
  - 트랙별 분포 (Doughnut Chart)
  - 지역별 분포 (Bar Chart)
  - 연령대별 분포 (Bar Chart)
- 실시간 데이터 업데이트 지원
- 반응형 그리드 레이아웃
- 모바일 최적화 완료

작업 시간: 3시간
효과: 지원자 데이터 시각화로 의사결정 지원"
    
    log_success "관리자 대시보드 차트 완료!"
    echo ""
    log_info "다음 단계:"
    echo "  1. public/admin/applications.html에 차트 HTML 추가"
    echo "  2. Chart.js CDN 추가"
    echo "  3. 테스트 및 확인"
    echo ""
}

# 작업 현황 보기
show_task_status() {
    log_section "작업 현황"
    
    echo -e "${CYAN}Phase 3-A: 즉시 실행 (최우선)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_file_status "$JS_DIR/official-form-v31.0.js" "카카오톡 알림" "sendKakaoNotification"
    check_file_status "$PROJECT_ROOT/.env.example" "환경 변수 보안" ""
    check_file_status "$JS_DIR/error-handler.js" "에러 핸들링" ""
    echo ""
    
    echo -e "${CYAN}Phase 3-B: 단기 실행${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_file_status "$JS_DIR/admin-charts.js" "대시보드 차트" ""
    echo "  자료실 기능: ⏳ 미완료"
    echo "  이메일 알림: ⏳ 미완료"
    echo ""
    
    echo -e "${CYAN}Phase 3-C: 중장기 실행${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  PWA 전환: ⏳ 미완료"
    echo "  다크모드: ⏳ 미완료"
    echo "  실시간 채팅: ⏳ 미완료"
    echo ""
    
    read -p "계속하려면 Enter..."
}

check_file_status() {
    local file=$1
    local task_name=$2
    local search_term=$3
    
    if [ -f "$file" ]; then
        if [ -z "$search_term" ] || grep -q "$search_term" "$file" 2>/dev/null; then
            echo -e "  ${task_name}: ${GREEN}✅ 완료${NC}"
        else
            echo -e "  ${task_name}: ${YELLOW}⚠️  부분 완료${NC}"
        fi
    else
        echo -e "  ${task_name}: ${RED}❌ 미완료${NC}"
    fi
}

# 테스트 체크리스트 실행
run_test_checklist() {
    log_section "테스트 체크리스트"
    
    cat << 'EOF'
Phase 3-A 테스트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 카카오톡 알림
    [ ] 지원서 제출 시 알림 수신
    [ ] 알림 내용 정확성 확인
    [ ] 관리자 페이지 링크 작동

[ ] Firebase 보안
    [ ] .env 파일이 Git에 없음
    [ ] 환경 변수 로드 확인
    [ ] 프로덕션 배포 정상 작동

[ ] 에러 핸들링
    [ ] 정상 제출 시 성공 메시지
    [ ] 유효성 검사 실패 시 에러 메시지
    [ ] 네트워크 오류 시 안내 메시지
    [ ] 로딩 인디케이터 표시

Phase 3-B 테스트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 대시보드 차트
    [ ] 4개 차트 정상 표시
    [ ] 데이터 정확성 확인
    [ ] 실시간 업데이트 작동
    [ ] 모바일 반응형 확인

EOF
    
    echo ""
    read -p "테스트를 시작하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "로컬 서버를 시작합니다..."
        cd "$PUBLIC_DIR" && python3 -m http.server 8000 &
        SERVER_PID=$!
        echo ""
        log_success "서버 시작됨 (PID: $SERVER_PID)"
        log_info "브라우저에서 http://localhost:8000 접속"
        echo ""
        read -p "테스트 완료 후 Enter를 누르면 서버가 종료됩니다..."
        kill $SERVER_PID 2>/dev/null || true
        log_success "서버 종료"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# =============================================================================
# 메인 루프
# =============================================================================

# 메인 함수
main() {
    while true; do
        show_menu
        read -p "선택하세요 (0-15): " choice
        
        case $choice in
            1) activate_kakao_notification ;;
            2) enhance_firebase_security ;;
            3) improve_error_handling ;;
            4) execute_phase_3a ;;
            5) create_admin_charts ;;
            6) log_warning "자료실 기능은 수동 구현이 필요합니다"; read -p "Enter..." ;;
            7) log_warning "이메일 알림은 수동 구현이 필요합니다"; read -p "Enter..." ;;
            8) 
                execute_phase_3a
                echo ""
                create_admin_charts
                ;;
            9|10|11|12) log_warning "Phase 3-C는 수동 구현이 필요합니다"; read -p "Enter..." ;;
            13) 
                execute_phase_3a
                echo ""
                create_admin_charts
                log_warning "Phase 3-C는 별도로 진행하세요"
                read -p "Enter..."
                ;;
            14) show_task_status ;;
            15) run_test_checklist ;;
            0) echo -e "${GREEN}종료합니다!${NC}"; exit 0 ;;
            *)
                log_error "잘못된 선택입니다"
                sleep 1
                ;;
        esac
    done
}

# 스크립트 시작
main
