# 🚀 Firebase 배포 가이드

## 📋 현재 상태

**Git Push 완료**: ✅
- Commit: `c465ee3`
- Branch: `main`
- GitHub: https://github.com/jbebakPark/samsung-gfc-recuritment

**로컬 Firebase 배포**: ⚠️ 인증 필요
- Firebase 프로젝트: `samsung-gfc`
- Error: "Failed to authenticate, have you run firebase login?"

---

## 🎯 Firebase 배포 방법

### 방법 1: GitHub Actions 자동 배포 (권장) ⭐

**현재 상태**: GitHub에 push 완료됨

**필요한 작업**:
1. Firebase 프로젝트에서 CI/CD 토큰 생성
2. GitHub Secrets에 토큰 저장
3. GitHub Actions 워크플로우 추가

#### 1단계: Firebase CI 토큰 생성 (로컬에서)
```bash
# Firebase 로그인
firebase login

# CI 토큰 생성
firebase login:ci

# 출력된 토큰을 복사 (예: 1//abcdefgh...)
```

#### 2단계: GitHub Secrets 설정
1. GitHub 저장소로 이동: https://github.com/jbebakPark/samsung-gfc-recuritment
2. **Settings** → **Secrets and variables** → **Actions** 클릭
3. **New repository secret** 클릭
4. Name: `FIREBASE_TOKEN`
5. Value: 위에서 복사한 토큰
6. **Add secret** 클릭

#### 3단계: GitHub Actions 워크플로우 파일 생성

`.github/workflows/firebase-deploy.yml` 파일을 생성하고 다음 내용 추가:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: samsung-gfc
```

#### 4단계: 자동 배포 확인
- 파일을 커밋하고 push하면 자동으로 배포됨
- **Actions** 탭에서 배포 진행 상황 확인

---

### 방법 2: 수동 배포 (로컬)

#### 사전 요구사항
```bash
# Firebase CLI 설치 (최초 1회)
npm install -g firebase-tools

# Firebase 로그인
firebase login
```

#### 배포 명령어
```bash
# 프로젝트 디렉토리로 이동
cd /home/user/webapp

# 배포 실행
npm run deploy

# 또는 직접 명령어
firebase deploy --only hosting
```

#### 배포 완료 후
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/samsung-gfc
Hosting URL: https://samsung-gfc.web.app
```

---

### 방법 3: Firebase Console에서 수동 업로드

#### 1단계: 빌드 파일 준비
프로젝트의 `public` 폴더가 배포될 파일입니다.

#### 2단계: Firebase Console 접속
1. https://console.firebase.google.com/project/samsung-gfc/hosting
2. **Hosting** 섹션 선택
3. **Add another site** 또는 기존 사이트 선택

#### 3단계: 수동 업로드 (드래그 앤 드롭)
1. `public` 폴더의 모든 파일 선택
2. Firebase Console의 업로드 영역에 드래그

---

## 📊 배포 체크리스트

### 배포 전 확인사항
- [x] Git 커밋 완료
- [x] GitHub push 완료
- [x] Firebase 프로젝트 설정 확인 (samsung-gfc)
- [x] firebase.json 설정 확인
- [x] public 폴더에 모든 파일 존재
- [ ] Firebase 인증 완료

### 배포 후 확인사항
- [ ] 배포 URL 접속: https://samsung-gfc.web.app
- [ ] v31.0 공식 양식 확인
- [ ] Firebase SDK 로드 확인
- [ ] 지원서 제출 테스트
- [ ] Firestore에 데이터 저장 확인
- [ ] 모바일 반응형 확인

---

## 🔥 Firebase 프로젝트 정보

**프로젝트 ID**: `samsung-gfc`
**프로젝트 URL**: https://console.firebase.google.com/project/samsung-gfc

**Hosting URL**:
- Production: https://samsung-gfc.web.app
- Alternative: https://samsung-gfc.firebaseapp.com

**Firestore Database**:
- Collection: `applications`
- Rules: 읽기(관리자만), 쓰기(누구나)

---

## 🛠️ Firebase 설정

### firebase.json
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "samsung-gfc"
  }
}
```

---

## 🚨 문제 해결

### 인증 오류 (Failed to authenticate)
```bash
# 해결 방법
firebase login
firebase logout
firebase login --reauth
```

### 배포 권한 오류
- Firebase Console에서 계정 권한 확인
- IAM 설정에서 배포 권한 부여

### Firestore 규칙 오류
- firestore.rules 파일 확인
- Firebase Console에서 규칙 수동 배포

---

## 📞 추가 지원

**Firebase 문서**: https://firebase.google.com/docs/hosting
**GitHub 저장소**: https://github.com/jbebakPark/samsung-gfc-recuritment

**프로젝트 문의**:
- 📧 이메일: jb2park@naver.com
- 📞 전화: 010-5137-2327

---

**작성일**: 2026-02-11  
**상태**: Git push 완료, Firebase 배포 대기 중
**다음 단계**: Firebase 로그인 후 배포 실행
