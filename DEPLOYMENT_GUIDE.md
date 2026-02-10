# Firebase 배포 가이드

## 배포 방법

### 방법 1: GitHub Actions 자동 배포 (권장)

#### 1. Firebase 서비스 계정 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택 (samsung-gfc)
3. 프로젝트 설정 > 서비스 계정
4. "새 비공개 키 생성" 클릭
5. JSON 파일 다운로드

#### 2. GitHub Secrets 설정

1. GitHub 저장소 페이지로 이동
2. Settings > Secrets and variables > Actions
3. "New repository secret" 클릭
4. 다음 시크릿 추가:
   - Name: `FIREBASE_SERVICE_ACCOUNT_SAMSUNG_GFC`
   - Value: 다운로드한 JSON 파일의 내용 전체를 붙여넣기

#### 3. 자동 배포 활성화

이제 `main` 브랜치에 push하면 자동으로 Firebase에 배포됩니다!

```bash
git push origin main
```

배포 상태는 GitHub Actions 탭에서 확인할 수 있습니다.

---

### 방법 2: 로컬에서 수동 배포

#### 1. Firebase CLI 설치 (최초 1회)

```bash
npm install -g firebase-tools
```

#### 2. Firebase 로그인

```bash
firebase login
```

브라우저가 열리면 Google 계정으로 로그인합니다.

#### 3. 배포 실행

```bash
firebase deploy
```

#### 4. 배포 확인

배포가 완료되면 다음 URL에서 확인할 수 있습니다:
- **Hosting URL**: https://samsung-gfc.web.app
- **Firebase Console**: https://console.firebase.google.com/project/samsung-gfc

---

## 배포 스크립트 (package.json)

프로젝트에 다음 스크립트가 추가되어 있습니다:

```bash
# 배포
npm run deploy

# 배포 미리보기
npm run preview

# 로컬 테스트
npm run serve
```

---

## 배포 전 체크리스트

### ✅ 필수 확인 사항

- [ ] 모든 변경사항이 Git에 커밋되었는가?
- [ ] 로컬에서 정상 작동하는가?
- [ ] 모바일 반응형이 잘 작동하는가?
- [ ] 모든 링크가 올바르게 작동하는가?
- [ ] 지원서 제출이 정상 작동하는가?

### ✅ 테스트 항목

1. **PC 테스트**
   - Chrome, Safari, Firefox, Edge에서 테스트
   - 네비게이션 메뉴 작동 확인
   - 모든 섹션 스크롤 확인
   - 지원하기 버튼 작동 확인

2. **모바일 테스트**
   - iOS Safari에서 테스트
   - Android Chrome에서 테스트
   - 햄버거 메뉴 작동 확인
   - 터치 인터랙션 확인
   - 폼 입력 확인

---

## 배포 후 확인사항

### 1. 사이트 접속 확인
```bash
# 기본 URL
https://samsung-gfc.web.app

# 커스텀 도메인 (설정된 경우)
https://your-custom-domain.com
```

### 2. Firebase Console 확인
- Hosting 페이지에서 배포 기록 확인
- Analytics에서 트래픽 확인
- Performance에서 성능 지표 확인

### 3. 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 네비게이션 작동
- [ ] 지원서 페이지 접근
- [ ] 폼 제출 테스트
- [ ] 모든 링크 확인

---

## 롤백 (이전 버전으로 되돌리기)

문제가 발생한 경우 이전 버전으로 롤백할 수 있습니다:

### Firebase Console 사용
1. Firebase Console > Hosting
2. 릴리스 기록에서 이전 버전 선택
3. "롤백" 버튼 클릭

### CLI 사용
```bash
# 이전 버전 목록 확인
firebase hosting:releases:list

# 특정 버전으로 롤백
firebase hosting:rollback
```

---

## 커스텀 도메인 연결

### 1. Firebase Console에서 도메인 추가
1. Firebase Console > Hosting
2. "커스텀 도메인 추가" 클릭
3. 도메인 입력 (예: www.samsung-gfc.com)

### 2. DNS 레코드 설정
Firebase에서 제공하는 값으로 DNS 레코드를 추가합니다:
- 타입: A 레코드
- 이름: @ 또는 www
- 값: Firebase에서 제공한 IP 주소

### 3. SSL 인증서 자동 발급
도메인 인증이 완료되면 SSL 인증서가 자동으로 발급됩니다.

---

## 환경별 배포 (선택사항)

### 개발 환경
```bash
firebase hosting:channel:deploy dev
```

### 스테이징 환경
```bash
firebase hosting:channel:deploy staging
```

### 프로덕션 환경
```bash
firebase deploy --only hosting
```

---

## 문제 해결

### 배포가 실패하는 경우

#### 1. 인증 문제
```bash
firebase login --reauth
```

#### 2. 권한 문제
```bash
firebase projects:list
```
올바른 프로젝트가 선택되어 있는지 확인

#### 3. 캐시 문제
```bash
firebase hosting:disable
firebase deploy --only hosting
```

### GitHub Actions 실패

1. **Secrets 확인**: `FIREBASE_SERVICE_ACCOUNT_SAMSUNG_GFC` 설정 확인
2. **권한 확인**: 서비스 계정이 "Firebase Hosting 관리자" 역할이 있는지 확인
3. **로그 확인**: Actions 탭에서 상세 로그 확인

---

## 성능 모니터링

배포 후 성능을 모니터링할 수 있습니다:

### Firebase Performance Monitoring
```bash
# Performance SDK 추가 (선택사항)
npm install firebase
```

### Google Analytics
Firebase Console에서 자동으로 제공되는 Analytics로 다음을 추적:
- 페이지뷰
- 이벤트
- 사용자 행동
- 전환율

---

## 백업 및 복구

### 소스 코드 백업
```bash
# Git 저장소에 자동 백업됨
git push origin main
```

### Firebase Hosting 기록
- Firebase는 자동으로 배포 기록을 보관합니다
- Firebase Console에서 언제든지 이전 버전으로 롤백 가능

---

## 지원 및 문의

문제가 발생하면 다음을 확인하세요:

1. **Firebase 문서**: https://firebase.google.com/docs/hosting
2. **GitHub Issues**: 프로젝트 이슈 페이지
3. **Firebase Support**: https://firebase.google.com/support

---

## 빠른 배포 명령어

```bash
# 전체 배포
npm run deploy

# 미리보기 URL 생성
npm run preview

# 로컬 서버 실행
npm run serve

# GitHub에 푸시 (자동 배포 트리거)
git add .
git commit -m "배포 준비 완료"
git push origin main
```

---

**배포 완료! 🚀**
