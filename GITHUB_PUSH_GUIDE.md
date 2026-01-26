# GitHub 저장소 푸시 가이드

## 📋 GitHub 저장소 정보
- **저장소 URL**: https://github.com/jbebakPark/samsung-gfc-recruitment.git
- **저장소 이름**: samsung-gfc-recruitment
- **소유자**: jbebakPark

---

## 🔧 Git 설치 확인

### Windows에서 Git 설치
1. **Git 다운로드**: https://git-scm.com/download/win
2. 설치 파일 실행
3. 기본 설정으로 설치 진행
4. 설치 완료 후 PowerShell 재시작

---

## 📦 프로젝트를 GitHub에 푸시하는 방법

### 방법 1: Git Bash 사용 (권장)

```bash
# 1. 프로젝트 디렉토리로 이동
cd d:/Project/jbpark/recurit/samsung-gfc-recruitment

# 2. Git 저장소 초기화
git init

# 3. README.md 생성
echo "# Samsung GFC Recruitment System" > README.md

# 4. .gitignore 생성 (중요!)
cat > .gitignore << EOF
# Node modules
node_modules/
functions/node_modules/

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Environment variables
.env
.env.local
functions/.env

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Build
dist/
build/

# Firebase config (보안상 제외)
firebase-config.js
EOF

# 5. 모든 파일 스테이징
git add .

# 6. 첫 커밋
git commit -m "Initial commit: Samsung GFC Recruitment System

- 관리자 대시보드 구현
- 지원자 관리 시스템
- 실시간 알림 (카카오톡 + 이메일)
- PDF 출력 기능
- 개인정보 동의서
- 지원 자격 사전 체크
- JOB 설명회 참석 신청
- GFC 공식 홍보 영상 임베드"

# 7. 메인 브랜치 이름 설정
git branch -M main

# 8. 원격 저장소 추가
git remote add origin https://github.com/jbebakPark/samsung-gfc-recruitment.git

# 9. GitHub에 푸시
git push -u origin main
```

---

### 방법 2: GitHub Desktop 사용 (GUI)

1. **GitHub Desktop 다운로드**: https://desktop.github.com/
2. 설치 및 GitHub 계정 로그인
3. `File` → `Add Local Repository`
4. 프로젝트 폴더 선택: `d:\Project\jbpark\recurit\samsung-gfc-recruitment`
5. `Publish repository` 클릭
6. 저장소 이름 확인: `samsung-gfc-recruitment`
7. `Publish repository` 버튼 클릭

---

### 방법 3: VS Code에서 직접 푸시

1. **VS Code 열기**
2. 프로젝트 폴더 열기: `d:\Project\jbpark\recurit\samsung-gfc-recruitment`
3. 좌측 사이드바에서 **Source Control** (Ctrl+Shift+G) 클릭
4. `Initialize Repository` 클릭
5. 모든 파일 스테이징 (`+` 버튼)
6. 커밋 메시지 입력:
   ```
   Initial commit: Samsung GFC Recruitment System
   ```
7. `Commit` 버튼 클릭
8. `...` 메뉴 → `Remote` → `Add Remote`
9. URL 입력: `https://github.com/jbebakPark/samsung-gfc-recruitment.git`
10. `Publish Branch` 클릭

---

## 📝 .gitignore 파일 생성 (필수!)

프로젝트 루트에 `.gitignore` 파일을 생성하고 아래 내용을 추가하세요:

```gitignore
# Node modules
node_modules/
functions/node_modules/

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# Environment variables
.env
.env.local
functions/.env
.runtimeconfig.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
dist/
build/
.cache/

# Firebase config (보안상 제외 - 실제 키는 환경 변수로 관리)
firebase-config.js
serviceAccountKey.json

# Temporary files
*.tmp
*.temp
~*
```

---

## 📋 README.md 생성 (권장)

프로젝트 루트에 `README.md` 파일을 생성하세요:

```markdown
# 삼성생명 GFC 채용 시스템

삼성생명 기업재무컨설턴트(GFC) 채용을 위한 통합 관리 시스템입니다.

## 🎯 주요 기능

### 1. 지원자 관리 시스템
- 관리자 대시보드
- 지원자 목록 조회 및 필터링
- 상태 관리 (접수/검토/합격/불합격)
- 기간별 통계
- Excel 다운로드

### 2. 실시간 알림
- 카카오톡 알림톡
- 이메일 알림
- 지원서 제출 즉시 발송
- 상태 변경 시 자동 알림

### 3. PDF 출력
- 당사 양식 기반 PDF 생성
- 관리번호 자동 부여
- 다운로드 및 인쇄 기능

### 4. 지원 자격 체크
- 제재 이력 확인
- 자격 정지 확인
- 지원 불가 시 제출 차단

### 5. JOB 설명회
- 참석 신청 시스템
- 일정별 잔여 석수 관리
- 자동 알림 발송

## 🚀 기술 스택

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Functions (Node.js)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Notifications**: 카카오톡 알림톡, Nodemailer

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
cd functions
npm install
cd ..
```

### 2. Firebase 설정
```bash
firebase login
firebase init
```

### 3. 로컬 실행
```bash
firebase serve
```

### 4. 배포
```bash
firebase deploy
```

## 📞 문의

- 이메일: admin@example.com
- 전화: 02-1234-5678

## 📄 라이선스

Copyright © 2026 Samsung Life Insurance. All rights reserved.
```

---

## ⚠️ 보안 주의사항

### GitHub에 푸시하기 전 확인할 사항:

1. **Firebase API 키 제거**
   - `public/admin.js`, `public/job-fair.html` 등에서 실제 API 키를 환경 변수로 변경

2. **이메일 비밀번호 제거**
   - Firebase Functions 환경 변수로 관리

3. **카카오 API 키 제거**
   - Firebase Functions 환경 변수로 관리

4. **`.gitignore` 파일 생성**
   - 위에서 제공한 내용으로 생성

---

## 🎯 푸시 후 확인 사항

푸시 완료 후 GitHub 저장소에서 확인:
- ✅ 모든 파일이 정상적으로 업로드되었는지
- ✅ `.gitignore`가 적용되어 `node_modules/`가 제외되었는지
- ✅ 민감한 정보(API 키, 비밀번호)가 포함되지 않았는지

---

## 📌 다음 단계

1. **Git 설치** (아직 안 되어 있다면)
2. **`.gitignore` 파일 생성**
3. **README.md 파일 생성**
4. **위 명령어로 GitHub에 푸시**
5. **GitHub Actions 설정** (선택사항)

---

**Git 설치 후 위 명령어를 순서대로 실행하시면 됩니다!** 🚀
