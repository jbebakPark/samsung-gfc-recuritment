# 🚀 배포 완료 안내

## Firebase Hosting 배포 준비 완료

삼성생명 GFC 채용 사이트의 Firebase Hosting 배포 설정이 완료되었습니다!

---

## ✅ 완료된 작업

### 1. Firebase CLI 설치 및 설정
- ✅ Firebase Tools 로컬 설치 완료
- ✅ Firebase 프로젝트 연결: `samsung-gfc`
- ✅ Hosting 설정 파일: `firebase.json`

### 2. 배포 스크립트 추가
`package.json`에 다음 스크립트가 추가되었습니다:

```bash
npm run deploy   # 프로덕션 배포
npm run preview  # 미리보기 URL 생성
npm run serve    # 로컬 테스트
```

### 3. 문서 작성
- ✅ **DEPLOYMENT_GUIDE.md**: 상세 배포 가이드
- ✅ **README.md**: 배포 섹션 업데이트

---

## 🎯 다음 단계: 배포 실행

### 방법 1: 로컬에서 수동 배포 (권장)

사용자가 직접 로컬 환경에서 배포하는 방법입니다.

#### 1단계: 저장소 클론
```bash
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment
```

#### 2단계: Firebase CLI 글로벌 설치
```bash
npm install -g firebase-tools
```

#### 3단계: Firebase 로그인
```bash
firebase login
```
브라우저가 열리면 Google 계정으로 로그인합니다.

#### 4단계: 배포 실행
```bash
npm run deploy
```

또는

```bash
firebase deploy --only hosting
```

#### 5단계: 배포 확인
배포가 완료되면 다음 URL에서 사이트 확인:
- **Hosting URL**: https://samsung-gfc.web.app
- **Firebase Console**: https://console.firebase.google.com/project/samsung-gfc

---

### 방법 2: GitHub Actions 자동 배포 (선택사항)

GitHub에 push할 때마다 자동으로 배포되도록 설정할 수 있습니다.

#### 필요한 작업:

1. **Firebase 서비스 계정 생성**
   - Firebase Console > 프로젝트 설정 > 서비스 계정
   - "새 비공개 키 생성" 클릭
   - JSON 파일 다운로드

2. **GitHub Secrets 설정**
   - GitHub 저장소 > Settings > Secrets and variables > Actions
   - "New repository secret" 클릭
   - Name: `FIREBASE_SERVICE_ACCOUNT_SAMSUNG_GFC`
   - Value: JSON 파일 내용 전체 붙여넣기

3. **워크플로우 파일 생성**
   - `.github/workflows/firebase-hosting.yml` 파일 생성
   - 내용은 DEPLOYMENT_GUIDE.md 참조

4. **자동 배포 활성화**
   ```bash
   git push origin main
   ```
   이제 main 브랜치에 push하면 자동으로 배포됩니다!

---

## 📊 배포 후 확인사항

### 1. 사이트 접속 테스트
- [ ] 메인 페이지 로딩 확인
- [ ] 모바일 반응형 확인
- [ ] 네비게이션 메뉴 작동 확인
- [ ] 지원하기 버튼 작동 확인
- [ ] 모든 섹션 스크롤 확인

### 2. 기능 테스트
- [ ] 지원서 페이지 접근
- [ ] 폼 입력 테스트
- [ ] Job Fair 정보 확인
- [ ] 연락처 링크 확인
- [ ] 외부 링크 (카카오톡 등) 확인

### 3. 성능 확인
- [ ] 페이지 로딩 속도
- [ ] 이미지 로딩
- [ ] 스크롤 성능
- [ ] 터치 반응성 (모바일)

---

## 🛠️ 배포 명령어 요약

```bash
# 로컬 테스트 (배포 전 확인)
npm run serve

# 미리보기 배포 (임시 URL 생성)
npm run preview

# 프로덕션 배포
npm run deploy

# Firebase 로그인 (최초 1회)
firebase login

# 배포 기록 확인
firebase hosting:releases:list

# 이전 버전으로 롤백
firebase hosting:rollback
```

---

## 📝 배포 URL

배포가 완료되면 다음 URL에서 사이트에 접근할 수 있습니다:

### 기본 URL
```
https://samsung-gfc.web.app
https://samsung-gfc.firebaseapp.com
```

### 커스텀 도메인 (설정 시)
커스텀 도메인을 연결하려면:
1. Firebase Console > Hosting
2. "커스텀 도메인 추가" 클릭
3. 도메인 소유권 인증
4. DNS 레코드 설정

---

## 🔧 문제 해결

### 배포가 실패하는 경우

1. **인증 문제**
   ```bash
   firebase login --reauth
   ```

2. **권한 문제**
   ```bash
   firebase projects:list
   ```
   올바른 프로젝트가 선택되어 있는지 확인

3. **캐시 문제**
   ```bash
   firebase hosting:disable
   firebase deploy --only hosting
   ```

### Firebase CLI 명령어가 작동하지 않는 경우

```bash
# 글로벌 설치 재시도
npm install -g firebase-tools

# 또는 로컬 버전 사용
npx firebase deploy
```

---

## 📚 추가 문서

자세한 내용은 다음 문서를 참조하세요:

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**: 상세 배포 가이드
- **[README.md](./README.md)**: 프로젝트 전체 문서
- **[Firebase 공식 문서](https://firebase.google.com/docs/hosting)**: Firebase Hosting 가이드

---

## 🎉 배포 완료 체크리스트

배포를 완료하려면 다음 단계를 수행하세요:

- [ ] 1. 로컬에서 `firebase login` 실행
- [ ] 2. `npm run deploy` 실행
- [ ] 3. 배포 완료 메시지 확인
- [ ] 4. https://samsung-gfc.web.app 접속 테스트
- [ ] 5. 모바일/PC에서 모든 기능 테스트
- [ ] 6. Firebase Console에서 배포 기록 확인

---

**배포 준비 완료! 🚀**

이제 `npm run deploy`를 실행하여 사이트를 배포하세요!
