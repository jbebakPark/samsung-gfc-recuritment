# 🚀 최종 배포 가이드

## ✅ 준비 완료 상태

모든 코드 수정이 완료되고 GitHub에 푸시되었습니다!
- 최신 커밋: `fed7853`
- 브랜치: `main`
- 저장소: https://github.com/jbebakPark/samsung-gfc-recuritment

### 완료된 수정사항 (2026-02-10)

1. ✅ **모바일 좌우 여백 개선 및 레이아웃 최적화**
2. ✅ **보도자료 타입 텍스트 가독성 개선** (흰색 배경에 파란색 텍스트)
3. ✅ **지원하기 버튼 연결 및 URL 파라미터 처리**
4. ✅ **PC 및 모바일 최적화** (터치, 폰트, 성능, 호환성)
5. ✅ **보도자료 날짜 박스 텍스트 가시성 개선**
6. ✅ **햄버거 메뉴 표시 및 버튼 중앙 정렬 완전 수정** ⭐ 최종

---

## 📋 배포 전 체크리스트

- [x] 모든 코드 수정 완료
- [x] GitHub에 커밋 및 푸시 완료
- [x] Firebase 프로젝트 설정 확인 (`samsung-gfc`)
- [x] firebase.json 설정 확인
- [x] public 폴더 구조 확인
- [ ] **Firebase 로그인 필요** (로컬에서 실행)
- [ ] **배포 실행** (아래 단계 참조)

---

## 🎯 배포 방법

### 옵션 1: 로컬 환경에서 배포 (권장)

#### 1단계: 환경 준비

```bash
# Node.js 18 이상 설치 확인
node --version

# npm 버전 확인
npm --version
```

#### 2단계: 저장소 클론 및 설정

```bash
# 저장소 클론 (처음만)
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment

# 또는 이미 클론된 경우 최신 코드 가져오기
cd samsung-gfc-recuritment
git pull origin main

# 의존성 설치
npm install
```

#### 3단계: Firebase 로그인

```bash
# Firebase CLI 설치 (글로벌)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 확인
firebase projects:list
```

#### 4단계: 배포 실행

```bash
# 방법 A: npm 스크립트 사용 (권장)
npm run deploy

# 방법 B: 직접 명령어
npx firebase deploy --only hosting

# 방법 C: 특정 사이트 배포
npx firebase deploy --only hosting:samsung-gfc
```

---

### 옵션 2: Firebase CI 토큰 사용 (자동화)

#### 1단계: CI 토큰 생성

```bash
# 로컬에서 토큰 생성
firebase login:ci
```

위 명령어를 실행하면 토큰이 출력됩니다. 이 토큰을 안전하게 저장하세요.

#### 2단계: 토큰으로 배포

```bash
# 환경 변수 설정
export FIREBASE_TOKEN="your-token-here"

# 토큰으로 배포
npx firebase deploy --token "$FIREBASE_TOKEN"
```

---

### 옵션 3: GitHub Actions (자동 배포)

GitHub Actions 워크플로우는 권한 문제로 제외되었습니다.
로컬에서 배포하거나 CI 토큰을 사용하세요.

---

## 🌐 배포 URL

배포가 완료되면 다음 URL에서 접속 가능합니다:

### 메인 URL
- 🌐 https://samsung-gfc.web.app
- 🌐 https://samsung-gfc.firebaseapp.com

### Firebase 콘솔
- 🔧 https://console.firebase.google.com/project/samsung-gfc

---

## ✅ 배포 후 테스트

### 필수 테스트 항목

#### 모바일 테스트 (iPhone, Android)
```
1. 햄버거 메뉴
   - [ ] 우측 상단에 햄버거 버튼(☰)이 보이는가?
   - [ ] 햄버거 버튼 클릭 시 메뉴가 열리는가?
   - [ ] 메뉴 항목들이 제대로 표시되는가?
   - [ ] 메뉴 닫기(X) 버튼이 작동하는가?

2. 버튼 정렬
   - [ ] "전화 상담" 버튼의 아이콘과 텍스트가 중앙 정렬되었는가?
   - [ ] "카카오톡 문의" 버튼의 아이콘과 텍스트가 중앙 정렬되었는가?
   - [ ] "지금 바로 지원하기" 버튼이 중앙 정렬되었는가?

3. 레이아웃
   - [ ] 좌우 여백이 적절한가? (최소 1.5rem)
   - [ ] 컨텐츠가 화면 밖으로 넘치지 않는가?
   - [ ] 모든 섹션이 제대로 표시되는가?

4. 보도자료 섹션
   - [ ] 날짜 박스의 텍스트가 명확히 보이는가? (파란색 텍스트)
   - [ ] 타입 배지(인터뷰, 언론사 등)가 보이는가?
   - [ ] 보도자료 카드 레이아웃이 정상인가?

5. 지원하기 기능
   - [ ] 각 "지원하기" 버튼이 apply.html로 이동하는가?
   - [ ] Job Fair 버튼 클릭 시 "채용설명회 참가"가 자동 선택되는가?
   - [ ] 일반 지원 버튼 클릭 시 "직접 지원"이 자동 선택되는가?
```

#### PC 테스트 (Chrome, Safari, Firefox, Edge)
```
1. 네비게이션
   - [ ] 상단 메뉴가 정상 표시되는가?
   - [ ] 드롭다운 메뉴가 작동하는가?
   - [ ] 스크롤 시 헤더가 고정되는가?

2. 레이아웃
   - [ ] 최대 너비 1200px가 적용되었는가?
   - [ ] 모든 섹션이 제대로 정렬되었는가?
   - [ ] 이미지와 텍스트가 깨지지 않는가?

3. 인터랙션
   - [ ] 호버 효과가 작동하는가?
   - [ ] 버튼 클릭이 정상 작동하는가?
   - [ ] 앵커 링크가 올바른 섹션으로 스크롤되는가?
```

---

## 🔍 문제 해결

### 배포 실패 시

1. **Firebase 로그인 문제**
```bash
# 로그아웃 후 재로그인
firebase logout
firebase login
```

2. **권한 문제**
```bash
# Firebase 프로젝트 확인
firebase projects:list

# 올바른 프로젝트 사용 중인지 확인
firebase use samsung-gfc
```

3. **빌드 오류**
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 다시 배포 시도
npm run deploy
```

### 배포는 되었으나 변경사항이 안 보일 때

1. **브라우저 캐시 삭제**
   - Chrome: `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
   - 또는 시크릿 모드에서 테스트

2. **Firebase 캐시 무효화**
```bash
# Firebase 콘솔에서 Hosting > 릴리스 히스토리 확인
# 최신 버전이 배포되었는지 확인
```

3. **하드 리프레시**
   - Chrome: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

---

## 📊 배포 상태 확인

### Firebase CLI로 확인

```bash
# 최근 배포 히스토리
firebase hosting:releases:list

# 현재 배포된 버전 확인
firebase hosting:channel:list
```

### Firebase 콘솔에서 확인

1. https://console.firebase.google.com/project/samsung-gfc
2. 왼쪽 메뉴 > Hosting
3. 배포 히스토리 및 도메인 확인

---

## 🎉 배포 완료 체크리스트

배포가 성공적으로 완료되면:

- [ ] 메인 URL(https://samsung-gfc.web.app) 접속 확인
- [ ] 모바일에서 햄버거 메뉴 작동 확인
- [ ] 버튼 중앙 정렬 확인
- [ ] 모든 링크 작동 확인
- [ ] 보도자료 섹션 날짜/타입 가시성 확인
- [ ] 지원하기 버튼 동작 확인
- [ ] 여러 브라우저에서 테스트
- [ ] 모바일 디바이스에서 실제 테스트

---

## 📞 지원

배포 관련 문제가 있을 경우:

1. **Firebase 공식 문서**: https://firebase.google.com/docs/hosting
2. **Firebase 지원**: https://firebase.google.com/support
3. **GitHub Issues**: https://github.com/jbebakPark/samsung-gfc-recuritment/issues

---

## 📝 배포 히스토리

| 날짜 | 커밋 | 주요 변경사항 |
|------|------|--------------|
| 2026-02-10 | fed7853 | 문서 업데이트 |
| 2026-02-10 | 0f643f1 | 햄버거 메뉴 및 버튼 중앙 정렬 수정 |
| 2026-02-10 | 24c812b | 모바일 UI 개선 |
| 2026-02-10 | 6526103 | 보도자료 날짜 박스 가시성 개선 |
| 2026-02-10 | 1defb5f | 지원하기 버튼 연결 개선 |
| 2026-02-10 | 06cab04 | 보도자료 타입 텍스트 가독성 개선 |
| 2026-02-10 | 988f46e | 모바일 여백 개선 |

---

## 🚀 지금 배포하세요!

```bash
# 한 줄 명령어로 배포
cd samsung-gfc-recuritment && git pull && npm run deploy
```

배포 성공을 기원합니다! 🎊
