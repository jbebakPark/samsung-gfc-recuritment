# 📝 단계별 수정·보완 사항 상세 가이드

**프로젝트**: 삼성생명 GFC 채용 사이트  
**작성일**: 2026년 2월 12일  
**현재 버전**: v32.0  
**목적**: 향후 개선이 필요한 모든 항목의 단계별 상세 가이드

---

## 📋 목차

1. [작업 개요](#작업-개요)
2. [우선순위별 작업 분류](#우선순위별-작업-분류)
3. [Phase 3-A: 즉시 실행 (1일)](#phase-3-a-즉시-실행-1일)
4. [Phase 3-B: 단기 실행 (1주)](#phase-3-b-단기-실행-1주)
5. [Phase 3-C: 중장기 실행 (1개월)](#phase-3-c-중장기-실행-1개월)
6. [자동화 스크립트 활용](#자동화-스크립트-활용)
7. [테스트 체크리스트](#테스트-체크리스트)

---

## 작업 개요

### 📊 전체 작업 현황

| Phase | 작업 수 | 총 소요 시간 | 우선순위 | 상태 |
|-------|---------|-------------|----------|------|
| **Phase 3-A** | 3개 | 2시간 | 최우선 | ⏳ 대기 |
| **Phase 3-B** | 3개 | 10시간 | 높음 | ⏳ 대기 |
| **Phase 3-C** | 3개 | 19시간 | 중간 | ⏳ 대기 |
| **전체** | **9개** | **31시간** | - | - |

### 작업 플로우

```
Phase 3-A (즉시)
  ├─ 카카오톡 알림 활성화 (5분)
  ├─ Firebase 보안 강화 (30분)
  └─ 에러 핸들링 개선 (1시간)
        ↓
Phase 3-B (1주)
  ├─ 대시보드 차트 (3시간)
  ├─ 자료실 기능 (4시간)
  └─ 이메일 알림 (3시간)
        ↓
Phase 3-C (1개월)
  ├─ PWA 전환 (5시간)
  ├─ 다크모드 (3시간)
  └─ 실시간 채팅 (8시간)
```

---

## 우선순위별 작업 분류

### 🔥 최우선 (즉시 실행)

| 작업 | 효과 | 난이도 | 시간 | 투자 대비 효과 |
|------|------|--------|------|---------------|
| 카카오톡 알림 | ⭐⭐⭐ | 매우 쉬움 | 5분 | **매우 높음** |
| Firebase 보안 | ⭐⭐ | 쉬움 | 30분 | 높음 |
| 에러 핸들링 | ⭐⭐⭐ | 쉬움 | 1시간 | **매우 높음** |

### 🌟 높은 우선순위 (1주일 이내)

| 작업 | 효과 | 난이도 | 시간 | 투자 대비 효과 |
|------|------|--------|------|---------------|
| 대시보드 차트 | ⭐⭐⭐ | 중간 | 3시간 | 높음 |
| 자료실 기능 | ⭐⭐ | 중-높 | 4시간 | 중간 |
| 이메일 알림 | ⭐⭐ | 중간 | 3시간 | 높음 |

### ⭐ 중간 우선순위 (1개월 이내)

| 작업 | 효과 | 난이도 | 시간 | 투자 대비 효과 |
|------|------|--------|------|---------------|
| PWA 전환 | ⭐⭐ | 중-높 | 5시간 | 중간 |
| 다크모드 | ⭐ | 중간 | 3시간 | 낮음 |
| 실시간 채팅 | ⭐ | 높음 | 8시간 | 낮음 |

---

## Phase 3-A: 즉시 실행 (1일)

### 📌 작업 1: 카카오톡 알림 활성화 ⭐⭐⭐

**소요 시간**: 5분  
**난이도**: ★☆☆☆☆ (매우 쉬움)  
**효과**: ★★★★★ (매우 높음)

#### 🎯 목표
지원서 제출 시 카카오톡으로 실시간 알림 전송

#### 📋 사전 준비
- [ ] Webhook URL 확인 (KAKAO_NOTIFICATION_SETUP.md 참조)
- [ ] 카카오톡 알림봇 설정 완료
- [ ] 테스트 지원서 데이터 준비

#### 🔧 작업 단계

##### Step 1: 파일 열기
```bash
# VS Code 또는 원하는 에디터로 열기
code public/js/official-form-v31.0.js
```

##### Step 2: 코드 수정 (178번째 줄 근처)

**수정 전:**
```javascript
// 카카오톡 알림 발송 (현재 주석 처리됨)
// await sendKakaoNotification(formData);
console.log('카카오톡 알림은 설정 후 활성화됩니다');
```

**수정 후:**
```javascript
// 카카오톡 알림 발송 (활성화)
try {
    await sendKakaoNotification(formData);
    console.log('✅ 카카오톡 알림 전송 성공');
} catch (error) {
    console.error('⚠️ 카카오톡 알림 전송 실패:', error);
    // 알림 실패해도 지원서는 저장되도록 함
}
```

##### Step 3: Webhook URL 설정 확인

파일 상단에 Webhook URL이 설정되어 있는지 확인:

```javascript
// 카카오톡 Webhook URL (환경 변수 또는 하드코딩)
const KAKAO_WEBHOOK_URL = 'https://talk-bridge.kakao.com/webhooks/...';

async function sendKakaoNotification(formData) {
    const message = `
🔔 새로운 지원서가 접수되었습니다!

👤 이름: ${formData.name}
📞 연락처: ${formData.phone}
📧 이메일: ${formData.email}
📍 지역: ${formData.region}
🎯 지원 구분: ${formData.track}
📅 제출 시간: ${new Date().toLocaleString('ko-KR')}

▶ 관리자 페이지에서 확인하세요:
https://samsung-gfc.web.app/admin/applications.html
    `.trim();

    const response = await fetch(KAKAO_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: message
        })
    });

    if (!response.ok) {
        throw new Error(`Webhook 전송 실패: ${response.status}`);
    }

    return await response.json();
}
```

##### Step 4: 테스트

```bash
# 1. 로컬 서버 시작
./scripts/4-master-automation.sh
# 메뉴에서 4 선택 → 로컬 서버 시작

# 2. 브라우저에서 테스트
open http://localhost:8000

# 3. 지원서 폼 작성 및 제출

# 4. 카카오톡 알림 수신 확인
```

##### Step 5: 배포

```bash
# 자동화 워크플로우 사용
./scripts/3-dev-workflow.sh

# 커밋 유형: 2 (fix)
# 메시지: 카카오톡 알림 활성화
```

#### ✅ 완료 체크리스트
- [ ] 코드 주석 해제
- [ ] Webhook URL 설정 확인
- [ ] 로컬 테스트 완료
- [ ] 카카오톡 알림 수신 확인
- [ ] Git 커밋 및 Push
- [ ] 프로덕션 배포 확인

---

### 📌 작업 2: Firebase 환경 변수 보안 강화 ⭐⭐

**소요 시간**: 30분  
**난이도**: ★★☆☆☆ (쉬움)  
**효과**: ★★★★☆ (높음)

#### 🎯 목표
Firebase API 키를 환경 변수로 분리하여 GitHub에 노출 방지

#### 📋 사전 준비
- [ ] Firebase 설정 정보 확인 (firebase-config.js)
- [ ] .gitignore 파일 존재 확인

#### 🔧 작업 단계

##### Step 1: .env 파일 생성

```bash
# 프로젝트 루트에 .env 파일 생성
cat > .env << 'EOF'
# Firebase Configuration
FIREBASE_API_KEY=AIzaSyC...
FIREBASE_AUTH_DOMAIN=samsung-gfc.firebaseapp.com
FIREBASE_PROJECT_ID=samsung-gfc
FIREBASE_STORAGE_BUCKET=samsung-gfc.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# Kakao Webhook
KAKAO_WEBHOOK_URL=https://talk-bridge.kakao.com/webhooks/...
EOF
```

##### Step 2: .gitignore 업데이트

```bash
# .gitignore 파일에 추가
echo "" >> .gitignore
echo "# Environment variables" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

##### Step 3: .env.example 생성 (템플릿)

```bash
cat > .env.example << 'EOF'
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
```

##### Step 4: 환경 변수 로드 스크립트 생성

```javascript
// public/js/env-loader.js (신규 파일)
/**
 * 환경 변수 로더
 * 개발: .env 파일에서 로드
 * 프로덕션: Firebase Hosting 환경 변수 사용
 */

// 개발 환경 감지
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// 환경 변수 객체
window.ENV = {
    FIREBASE_API_KEY: isDevelopment ? 
        'AIzaSyC...' : // 개발용 (로컬에만 존재)
        'AIzaSyC...', // 프로덕션용 (Firebase Hosting 환경 변수)
    FIREBASE_AUTH_DOMAIN: 'samsung-gfc.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'samsung-gfc',
    FIREBASE_STORAGE_BUCKET: 'samsung-gfc.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '123456789',
    FIREBASE_APP_ID: '1:123456789:web:abcdef',
    KAKAO_WEBHOOK_URL: isDevelopment ?
        'https://talk-bridge.kakao.com/webhooks/...' :
        'https://talk-bridge.kakao.com/webhooks/...'
};

console.log('✅ 환경 변수 로드 완료');
```

##### Step 5: Firebase 설정 파일 수정

```javascript
// public/js/firebase-config.js 수정
// ENV 객체 사용
const firebaseConfig = {
    apiKey: window.ENV.FIREBASE_API_KEY,
    authDomain: window.ENV.FIREBASE_AUTH_DOMAIN,
    projectId: window.ENV.FIREBASE_PROJECT_ID,
    storageBucket: window.ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.ENV.FIREBASE_APP_ID
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
```

##### Step 6: HTML에 env-loader 추가

```html
<!-- public/index.html의 </body> 전에 추가 -->
<script src="/js/env-loader.js"></script>
<script src="/js/firebase-config.js"></script>
```

##### Step 7: Git 커밋 전 확인

```bash
# .env 파일이 Git에 추가되지 않는지 확인
git status

# .env가 Untracked files에 있으면 OK
# .env가 Changes to be committed에 있으면 안 됨!

# 만약 추가되었다면:
git reset .env
git rm --cached .env
```

#### ✅ 완료 체크리스트
- [ ] .env 파일 생성
- [ ] .gitignore에 .env 추가
- [ ] .env.example 생성
- [ ] env-loader.js 생성
- [ ] firebase-config.js 수정
- [ ] HTML에 스크립트 추가
- [ ] Git 상태 확인 (.env가 커밋되지 않음)
- [ ] 로컬 테스트 완료
- [ ] 배포 및 프로덕션 테스트

---

### 📌 작업 3: 에러 핸들링 개선 ⭐⭐⭐

**소요 시간**: 1시간  
**난이도**: ★★☆☆☆ (쉬움)  
**효과**: ★★★★★ (매우 높음)

#### 🎯 목표
사용자 친화적인 에러 메시지와 로딩 상태 표시

#### 📋 사전 준비
- [ ] 기존 에러 처리 코드 확인
- [ ] UI/UX 디자인 가이드 확인

#### 🔧 작업 단계

##### Step 1: 전역 에러 핸들러 추가

```javascript
// public/js/error-handler.js (신규 파일)

/**
 * 전역 에러 핸들러
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

    // 에러 메시지 표시 (Toast 또는 Alert)
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
```

##### Step 2: 에러 핸들러 CSS 추가

```css
/* public/css/error-handler.css (신규 파일) */

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
```

##### Step 3: 폼 제출 로직에 에러 핸들링 적용

```javascript
// public/js/official-form-v31.0.js 수정

// 기존 폼 제출 함수 수정
async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // 로딩 표시
        ErrorHandler.showLoading('지원서를 제출하는 중입니다...');
        
        // 폼 데이터 수집
        const formData = collectFormData();
        
        // 유효성 검사
        if (!validateForm(formData)) {
            throw new Error('입력값을 확인해주세요.');
        }
        
        // Firestore 저장
        await saveToFirestore(formData);
        
        // 카카오톡 알림
        try {
            await sendKakaoNotification(formData);
        } catch (error) {
            console.warn('카카오톡 알림 실패 (저장은 완료됨):', error);
        }
        
        // 성공 메시지
        ErrorHandler.showToast('지원서가 성공적으로 제출되었습니다!', 'success');
        
        // 폼 초기화
        document.getElementById('application-form').reset();
        
    } catch (error) {
        ErrorHandler.showError(error, '지원서 제출');
    } finally {
        // 로딩 숨김
        ErrorHandler.hideLoading();
    }
}

// Firestore 저장 함수 수정
async function saveToFirestore(formData) {
    try {
        const docRef = await db.collection('applications').add({
            ...formData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });
        
        console.log('✅ Firestore 저장 성공:', docRef.id);
        return docRef.id;
        
    } catch (error) {
        // 에러 유형별 처리
        if (error.code === 'permission-denied') {
            throw new Error('데이터베이스 접근 권한이 없습니다.');
        } else if (error.code === 'unavailable') {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw error;
        }
    }
}
```

##### Step 4: HTML에 스크립트 추가

```html
<!-- public/index.html의 </body> 전에 추가 -->
<link rel="stylesheet" href="/css/error-handler.css">
<script src="/js/error-handler.js"></script>
```

##### Step 5: 테스트 시나리오

```bash
# 1. 정상 제출 테스트
- 모든 필드를 올바르게 입력
- 제출 버튼 클릭
- 로딩 표시 확인
- 성공 메시지 확인

# 2. 유효성 검사 실패 테스트
- 필수 필드 누락
- 제출 버튼 클릭
- 에러 메시지 확인

# 3. 네트워크 오류 테스트
- 개발자 도구 → Network → Offline
- 제출 버튼 클릭
- "네트워크 연결을 확인해주세요" 메시지 확인

# 4. Firebase 오류 테스트
- Firestore 규칙을 deny all로 변경
- 제출 버튼 클릭
- "접근 권한이 없습니다" 메시지 확인
```

#### ✅ 완료 체크리스트
- [ ] error-handler.js 생성
- [ ] error-handler.css 생성
- [ ] 전역 에러 핸들러 추가
- [ ] Toast 메시지 구현
- [ ] 로딩 인디케이터 구현
- [ ] 폼 제출 로직 수정
- [ ] HTML에 스크립트 추가
- [ ] 5가지 테스트 시나리오 완료
- [ ] Git 커밋 및 배포

---

## Phase 3-B: 단기 실행 (1주)

### 📌 작업 4: 관리자 대시보드 통계 차트 ⭐⭐⭐

**소요 시간**: 3시간  
**난이도**: ★★★☆☆ (중간)  
**효과**: ★★★★★ (매우 높음)

#### 🎯 목표
지원자 데이터를 시각화하여 대시보드에 차트 표시

#### 📋 사전 준비
- [ ] Chart.js 라이브러리 조사
- [ ] Firestore 데이터 구조 확인
- [ ] 차트 디자인 결정 (4가지 차트)

#### 🔧 작업 단계

##### Step 1: Chart.js 추가

```html
<!-- public/admin/applications.html의 </head> 전에 추가 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

##### Step 2: 대시보드 HTML 구조 추가

```html
<!-- public/admin/applications.html의 상단에 추가 -->
<section class="dashboard-charts">
    <div class="chart-container">
        <div class="chart-card">
            <h3>일별 지원자 수</h3>
            <canvas id="dailyChart"></canvas>
        </div>
        <div class="chart-card">
            <h3>트랙별 분포</h3>
            <canvas id="trackChart"></canvas>
        </div>
        <div class="chart-card">
            <h3>지역별 분포</h3>
            <canvas id="regionChart"></canvas>
        </div>
        <div class="chart-card">
            <h3>연령대별 분포</h3>
            <canvas id="ageChart"></canvas>
        </div>
    </div>
</section>
```

##### Step 3: 차트 스타일 CSS

```css
/* public/css/admin-charts.css (신규 파일) */

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
```

##### Step 4: 차트 데이터 집계 및 렌더링

```javascript
// public/js/admin-charts.js (신규 파일)

/**
 * 관리자 대시보드 차트 렌더링
 */

let dailyChart, trackChart, regionChart, ageChart;

// 차트 초기화
async function initCharts() {
    try {
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

    } catch (error) {
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
        .slice(0, 10); // 상위 10개

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

// 차트 렌더링 함수들
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// 실시간 업데이트
function setupRealtimeChartUpdates() {
    db.collection('applications')
        .onSnapshot((snapshot) => {
            console.log('데이터 변경 감지, 차트 업데이트 중...');
            initCharts();
        });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    setupRealtimeChartUpdates();
});
```

##### Step 5: HTML에 추가

```html
<!-- public/admin/applications.html의 </body> 전에 추가 -->
<link rel="stylesheet" href="/css/admin-charts.css">
<script src="/js/admin-charts.js"></script>
```

#### ✅ 완료 체크리스트
- [ ] Chart.js 라이브러리 추가
- [ ] HTML 구조 추가 (4개 차트)
- [ ] CSS 스타일 작성
- [ ] 데이터 집계 함수 작성 (4개)
- [ ] 차트 렌더링 함수 작성 (4개)
- [ ] 실시간 업데이트 구현
- [ ] 테스트 (샘플 데이터로 확인)
- [ ] Git 커밋 및 배포

---

## 자동화 스크립트 활용

### 🚀 빠른 개발 워크플로우

모든 작업은 자동화 스크립트를 사용하여 효율적으로 진행할 수 있습니다:

```bash
# 1. 마스터 스크립트 실행
./scripts/4-master-automation.sh

# 2. 메뉴에서 선택:
# - 로컬 테스트: 4 선택
# - 개발 워크플로우: 3 선택
# - 시스템 점검: 7 선택
```

### 작업 후 배포 자동화

```bash
# 간단한 방법
./scripts/3-dev-workflow.sh

# 단계:
# 1. 변경 파일 확인
# 2. 로컬 테스트 (선택)
# 3. 커밋 유형 선택
# 4. 커밋 메시지 입력
# 5. Push → 자동 배포
```

---

## 테스트 체크리스트

### Phase 3-A 테스트

- [ ] **카카오톡 알림**
  - [ ] 지원서 제출 시 알림 수신
  - [ ] 알림 내용 정확성 확인
  - [ ] 관리자 페이지 링크 작동

- [ ] **Firebase 보안**
  - [ ] .env 파일이 Git에 없음
  - [ ] 환경 변수 로드 확인
  - [ ] 프로덕션 배포 정상 작동

- [ ] **에러 핸들링**
  - [ ] 정상 제출 시 성공 메시지
  - [ ] 유효성 검사 실패 시 에러 메시지
  - [ ] 네트워크 오류 시 안내 메시지
  - [ ] 로딩 인디케이터 표시

### Phase 3-B 테스트

- [ ] **대시보드 차트**
  - [ ] 4개 차트 정상 표시
  - [ ] 데이터 정확성 확인
  - [ ] 실시간 업데이트 작동
  - [ ] 모바일 반응형 확인

---

## 📞 지원 및 문의

**작업 중 문제 발생 시:**
- 이메일: jb2park@naver.com
- 전화: 010-5137-2327
- 카카오톡: https://open.kakao.com/o/svmDyNUg

---

**작성자**: GenSpark AI Developer  
**최종 업데이트**: 2026년 2월 12일  
**다음 문서**: Phase 3-B 및 Phase 3-C 작업 (별도 문서)

---

_이 가이드를 따라 순차적으로 작업하면 안정적이고 체계적으로 개선할 수 있습니다!_
