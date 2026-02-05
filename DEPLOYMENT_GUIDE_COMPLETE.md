# 🚀 삼성생명 GFC 채용 사이트 - 종합 배포 가이드

> **작성일:** 2026년 2월 5일  
> **버전:** 2.0  
> **상태:** ✅ 배포 준비 완료

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [배포 옵션](#배포-옵션)
3. [GitHub Pages 배포](#github-pages-배포)
4. [Firebase 배포](#firebase-배포)
5. [카카오톡 알림 설정](#카카오톡-알림-설정)
6. [로컬 개발 환경](#로컬-개발-환경)
7. [문제 해결](#문제-해결)

---

## 🎯 프로젝트 개요

### 기술 스택
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **호스팅**: GitHub Pages / Firebase Hosting
- **알림**: 카카오톡 비즈니스 API
- **데이터베이스**: Supabase (Phase 2)

### 디렉토리 구조
```
samsung-gfc-recruitment/
├── public/                 # 배포용 소스 파일
│   ├── index.html         # 메인 페이지
│   ├── css/
│   │   ├── style.css      # 메인 스타일시트
│   │   ├── admin.css      # 관리자 스타일
│   │   └── admin.html     # 관리자 페이지
│   ├── js/
│   │   ├── main.js        # 메인 JavaScript
│   │   ├── application.js # 지원서 처리
│   │   ├── kakao-notification.js  # 카카오톡 알림
│   │   └── jobfair-manager.js     # 채용설명회 관리
│   ├── images/            # 이미지 파일
│   │   ├── samsung-life-logo.png
│   │   └── samsung-life-logo-white.png
│   ├── admin.html         # 관리자 대시보드
│   ├── apply.html         # 지원서 작성 페이지
│   ├── eligibility-check.html  # 자격 확인
│   ├── job-fair.html      # 채용설명회 상세
│   └── privacy-consent.html    # 개인정보 동의
├── admin/                 # 관리자 전용 페이지
│   ├── index.html
│   ├── applications.html  # 지원자 관리
│   └── interviews.html    # 인터뷰 관리
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 워크플로우
├── firebase.json          # Firebase 설정
├── .firebaserc           # Firebase 프로젝트 설정
└── README.md             # 프로젝트 문서
```

---

## 🌐 배포 옵션

### 옵션 1: GitHub Pages (무료, 추천)
- ✅ **장점**: 무료, 자동 배포, 커스텀 도메인 지원
- ⚠️ **제한**: 정적 파일만 가능, 서버 사이드 불가
- 🔗 **URL 형식**: `https://[username].github.io/samsung-gfc-recruitment/`

### 옵션 2: Firebase Hosting (무료 티어 제공)
- ✅ **장점**: 빠른 CDN, SSL 자동, Cloud Functions 연동
- ⚠️ **제한**: 무료 티어 제한 (10GB 저장, 360MB/일 전송)
- 🔗 **URL 형식**: `https://samsung-gfc.web.app/`

---

## 🚀 GitHub Pages 배포

### 1단계: GitHub 저장소 설정

#### 방법 A: 기존 저장소 사용
```bash
cd /home/user/webapp

# 변경사항 확인
git status

# 모든 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: Optimize project structure for deployment

- Reorganize JS files into js/ directory
- Move CSS files to css/ directory
- Add GitHub Actions workflow for auto-deploy
- Fix 404 errors in resource paths
- Update image paths in public directory"

# 원격 저장소로 푸시
git push origin main
```

#### 방법 B: 새 저장소 생성
```bash
cd /home/user/webapp

# Git 초기화
git init

# 원격 저장소 추가
git remote add origin https://github.com/jbebakPark/samsung-gfc-recruitment.git

# 첫 커밋
git add .
git commit -m "Initial commit: Samsung Life GFC Recruitment Site"

# 푸시
git push -u origin main
```

### 2단계: GitHub Pages 활성화

#### 옵션 A: GitHub Actions 자동 배포 (추천)

1. **GitHub 저장소로 이동**
   - https://github.com/jbebakPark/samsung-gfc-recruitment

2. **Settings → Pages**
   - Source: **GitHub Actions** 선택
   - `.github/workflows/deploy.yml` 자동 감지

3. **배포 확인**
   - Actions 탭에서 워크플로우 실행 확인
   - 완료 후 URL 확인: `https://jbebakpark.github.io/samsung-gfc-recruitment/`

#### 옵션 B: 직접 배포 (간단)

1. **Settings → Pages**
2. **Source**: `Deploy from a branch` 선택
3. **Branch**: `main` 선택
4. **Folder**: `/public` 선택
5. **Save** 클릭

### 3단계: 커스텀 도메인 설정 (선택)

```bash
# public/CNAME 파일 생성
cd /home/user/webapp/public
echo "gfc.samsunglife.com" > CNAME

git add CNAME
git commit -m "Add custom domain"
git push
```

**DNS 설정 (도메인 제공업체에서)**:
```
Type: CNAME
Name: gfc
Value: jbebakpark.github.io
```

---

## 🔥 Firebase 배포

### 1단계: Firebase CLI 설치 및 로그인

```bash
# Firebase CLI 설치 (전역)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (이미 완료됨)
# firebase init hosting
```

### 2단계: Firebase 프로젝트 확인

현재 설정된 프로젝트:
```json
{
  "projects": {
    "default": "samsung-gfc"
  }
}
```

### 3단계: 배포 실행

```bash
cd /home/user/webapp

# 배포
firebase deploy --only hosting

# 특정 프로젝트로 배포
firebase deploy --project samsung-gfc --only hosting
```

### 4단계: 배포 확인

```bash
# 배포 URL 확인
firebase hosting:channel:list

# 브라우저에서 접속
# https://samsung-gfc.web.app/
# 또는
# https://samsung-gfc.firebaseapp.com/
```

### Firebase 설정 파일 설명

**firebase.json**:
```json
{
  "hosting": {
    "public": "public",           // 배포할 디렉토리
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [                 // SPA 라우팅 지원
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 💬 카카오톡 알림 설정

### 준비물
- 카카오톡 비즈니스 계정
- 채널 관리자 권한
- Webhook URL

### 1단계: 카카오톡 채널 생성

1. **카카오톡 채널 관리자센터** 접속
   - https://center-pf.kakao.com/

2. **새 채널 만들기**
   - 채널명: "삼성생명 GFC 채용"
   - 검색용 ID: `@samsung-gfc` (예시)

3. **채널 ID 확인**
   - 설정 → 일반 → 채널 ID 복사

### 2단계: Webhook 설정

**현재 설정된 수신자 ID**: `2jbark`

```javascript
// public/js/kakao-notification.js
async function sendKakaoNotification(applicationData) {
    const webhookUrl = 'YOUR_WEBHOOK_URL'; // 여기에 Webhook URL 입력
    
    const message = {
        receiver: '2jbark',
        type: 'text',
        content: formatMessage(applicationData)
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Kakao notification failed:', error);
        return false;
    }
}
```

### 3단계: 알림 활성화

1. **Webhook URL 발급**
   - 카카오톡 채널 관리자센터 → API → Webhook
   - URL 생성 및 복사

2. **코드 수정**
   ```bash
   cd /home/user/webapp/public/js
   # kakao-notification.js 파일에서 webhookUrl 변수에 URL 입력
   ```

3. **테스트**
   ```bash
   # 로컬 서버 실행
   cd /home/user/webapp/public
   python3 -m http.server 8000
   
   # 브라우저에서 지원서 작성 테스트
   # http://localhost:8000/apply.html
   ```

### 알림 메시지 형식

```
🎯 새로운 지원서가 접수되었습니다!

👤 지원자 정보
━━━━━━━━━━━━━━━━
• 이름: 홍길동
• 생년월일: 1985-01-15
• 연락처: 010-1234-5678
• 이메일: hong@example.com
• 지역: 서울/강남

📌 지원 구분: 채용설명회 참가
📅 참가 희망일: 2026-01-27

💼 경력사항:
삼성전자 15년 근무
영업팀장 8년 경력

💡 지원동기:
제2의 인생을 위한 새로운 도전...

⏰ 접수시간: 2026-02-05 12:30:45

🔗 관리자 페이지에서 상세 확인
```

---

## 💻 로컬 개발 환경

### 방법 1: Python HTTP 서버 (추천)

```bash
cd /home/user/webapp/public
python3 -m http.server 8000

# 브라우저 접속
# http://localhost:8000
```

### 방법 2: Node.js http-server

```bash
# 설치
npm install -g http-server

# 실행
cd /home/user/webapp/public
http-server -p 8000

# 브라우저 접속
# http://localhost:8000
```

### 방법 3: VS Code Live Server

1. VS Code 확장 프로그램 설치: "Live Server"
2. `public/index.html` 우클릭
3. "Open with Live Server" 클릭

### 개발 시 주의사항

- ✅ `public/` 디렉토리에서 작업
- ✅ 변경 후 즉시 테스트
- ✅ 브라우저 콘솔에서 에러 확인
- ✅ 모바일 반응형 테스트 (F12 → Device Toolbar)

---

## 🐛 문제 해결

### 404 에러 발생 시

#### 증상: 이미지나 JS 파일이 로드되지 않음

**해결방법 1**: 경로 확인
```bash
cd /home/user/webapp/public

# 파일 존재 확인
ls -la images/
ls -la js/
ls -la css/

# HTML에서 경로 확인
grep -n "src=\|href=" index.html
```

**해결방법 2**: 상대 경로 사용
```html
<!-- ❌ 절대 경로 (GitHub Pages에서 문제 발생 가능) -->
<img src="/images/logo.png">

<!-- ✅ 상대 경로 (권장) -->
<img src="images/logo.png">
```

### GitHub Pages 배포 실패

#### 증상: Actions 탭에서 빨간색 X 표시

**해결방법**:
1. Actions 탭 → 실패한 워크플로우 클릭
2. 로그 확인
3. 권한 설정 확인:
   - Settings → Actions → General
   - Workflow permissions: "Read and write permissions" 선택

### Firebase 배포 오류

#### 증상: `firebase deploy` 실패

**해결방법 1**: 로그인 재확인
```bash
firebase logout
firebase login
```

**해결방법 2**: 프로젝트 재선택
```bash
firebase use --add
# 프로젝트 목록에서 samsung-gfc 선택
```

**해결방법 3**: 권한 확인
```bash
firebase projects:list
# samsung-gfc 프로젝트가 목록에 있는지 확인
```

### 카카오톡 알림 미작동

#### 증상: 지원서 제출 후 알림 없음

**체크리스트**:
- [ ] Webhook URL이 올바르게 설정되었는가?
- [ ] 채널 관리자 권한이 있는가?
- [ ] 브라우저 콘솔에 에러가 있는가?
- [ ] 네트워크 탭에서 API 호출이 성공했는가?

**디버깅**:
```javascript
// kakao-notification.js에 로그 추가
console.log('Sending notification:', applicationData);
console.log('Webhook URL:', webhookUrl);
console.log('Response:', response);
```

### 반응형 디자인 깨짐

#### 증상: 모바일에서 레이아웃 이상

**해결방법**:
```html
<!-- viewport 메타 태그 확인 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**테스트 방법**:
1. F12 (개발자 도구)
2. Device Toolbar 활성화 (Ctrl+Shift+M)
3. 다양한 디바이스 크기로 테스트
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

---

## 📱 QR 코드 생성 (선택)

배포 후 QR 코드를 생성하여 오프라인 홍보에 활용:

```bash
# QR 코드 생성기 사용
# https://www.qr-code-generator.com/

# 입력할 URL:
https://jbebakpark.github.io/samsung-gfc-recruitment/
```

---

## 📊 성능 최적화 체크리스트

- [x] 이미지 최적화 (PNG, 크기 최적화)
- [x] CSS/JS 파일 정리 (디렉토리 구조화)
- [x] 불필요한 파일 제거 (.gitignore 활용)
- [ ] 이미지 Lazy Loading 추가 (Phase 2)
- [ ] CSS/JS 압축 (Phase 2)
- [ ] CDN 활용 (Font Awesome, Google Fonts는 이미 적용)

---

## 🔐 보안 체크리스트

- [x] API 키는 환경 변수로 관리 (.env 파일, .gitignore에 추가)
- [x] 민감한 정보는 서버 사이드에서 처리
- [ ] HTTPS 강제 (GitHub Pages/Firebase 자동 적용)
- [ ] CORS 정책 설정 (Phase 2)
- [ ] Rate Limiting 추가 (Phase 2)

---

## 📞 지원 및 문의

### 기술 지원
- **이메일**: jb2park@naver.com
- **전화**: 010-5137-2327

### 카카오톡 오픈챗
- **링크**: https://open.kakao.com/o/s15lHyCh
- **채팅방**: "삼성생명 GFC 채용 문의"

### GitHub 이슈
- **저장소**: https://github.com/jbebakPark/samsung-gfc-recruitment
- **이슈 등록**: Issues 탭에서 새 이슈 생성

---

## 📚 추가 문서

- [README.md](./README.md) - 프로젝트 개요
- [QUICKSTART.md](./QUICKSTART.md) - 빠른 시작 가이드
- [KAKAO_NOTIFICATION_SETUP.md](./KAKAO_NOTIFICATION_SETUP.md) - 카카오톡 알림 상세 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드 (이 문서)

---

## 🎯 Next Steps (Phase 2)

### 계획된 기능
1. **Supabase 데이터베이스 연동**
   - 지원서 데이터 영구 저장
   - 실시간 지원 현황 대시보드

2. **관리자 대시보드 고도화**
   - 지원자 필터링 및 검색
   - 통계 및 분석 차트
   - 엑셀 다운로드 기능

3. **이메일 알림**
   - 지원 완료 자동 메일
   - 관리자 알림 메일

4. **성능 최적화**
   - 이미지 Lazy Loading
   - CSS/JS 파일 압축
   - 페이지 로드 속도 개선

---

**📅 최종 업데이트**: 2026년 2월 5일  
**✅ 상태**: 배포 준비 완료  
**🚀 다음 단계**: GitHub/Firebase 배포 실행
