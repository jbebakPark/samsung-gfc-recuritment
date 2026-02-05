# 🚀 GitHub Pages 업로드 가이드

## 📝 Step 1: GitHub 저장소 생성

### 1-1. GitHub 접속 및 로그인
1. 브라우저에서 **https://github.com** 접속
2. 우측 상단 **"Sign in"** 클릭 (계정이 없으면 "Sign up")
3. 로그인 완료

### 1-2. 새 저장소 만들기
1. 로그인 후 우측 상단 **"+"** 버튼 클릭
2. **"New repository"** 선택

### 1-3. 저장소 정보 입력
```
Repository name: samsung-gfc-recruitment
Description: 삼성생명 GFC 기업재무컨설턴트 채용 사이트

⚠️ 매우 중요:
✓ Public 선택 (반드시!)
✗ Add a README file 체크 해제
✗ Add .gitignore 선택 안 함
✗ Choose a license 선택 안 함
```

4. **"Create repository"** 클릭

---

## 📤 Step 2: 파일 업로드

### 2-1. 업로드 페이지로 이동
저장소 생성 후 나오는 페이지에서:
- **"uploading an existing file"** 링크 클릭
- 또는 페이지 중간의 **"upload files"** 클릭

### 2-2. 파일 업로드
**방법 A: 드래그 앤 드롭 (추천)**
1. Windows 파일 탐색기에서 모든 파일 선택
2. GitHub 페이지의 업로드 영역으로 드래그
3. 파일이 업로드되는 동안 대기 (1-2분)

**방법 B: 파일 선택**
1. **"choose your files"** 클릭
2. 파일 탐색기에서 모든 파일 선택
3. **"열기"** 클릭

### 2-3. 업로드할 파일 목록
✅ **admin/** 폴더
✅ **css/** 폴더
✅ **images/** 폴더
✅ **js/** 폴더
✅ **apply.html**
✅ **index.html**
✅ **배포_체크리스트.md**
✅ **시작하기.md**
✅ **프로젝트_실행_가이드.md**
✅ **서버실행.sh**
✅ **서버실행.bat**

**⚠️ 주의사항:**
- 모든 파일과 폴더를 한 번에 선택
- 폴더 구조가 유지되어야 함
- 최대 100개 파일까지 한 번에 업로드 가능

### 2-4. 커밋 메시지 입력
페이지 하단:
```
Commit message: Initial commit - Samsung Life GFC 채용 사이트

Extended description (선택):
삼성생명 GFC 기업재무컨설턴트 채용 사이트
- 17개 완성 섹션
- 반응형 디자인
- 2026년 1월 최신 정보
```

### 2-5. 커밋 완료
**"Commit changes"** 버튼 클릭

---

## 🌐 Step 3: GitHub Pages 활성화

### 3-1. Settings로 이동
1. 업로드 완료 후 저장소 메인 페이지로 이동
2. 상단 메뉴에서 **"Settings"** (톱니바퀴 아이콘) 클릭

### 3-2. Pages 설정 찾기
1. 왼쪽 사이드바에서 **"Pages"** 클릭
2. Pages 설정 페이지가 열립니다

### 3-3. Source 설정
**"Build and deployment"** 섹션:
```
Source: Deploy from a branch

Branch:
- 첫 번째 드롭다운: main 선택
- 두 번째 드롭다운: / (root) 선택
```

### 3-4. 저장
**"Save"** 버튼 클릭

### 3-5. 배포 완료 대기
- 페이지 상단에 알림이 나타납니다
- **"Visit site"** 버튼이 나타날 때까지 1-2분 대기
- 페이지를 새로고침(F5)하면 URL 확인 가능

---

## 🎉 Step 4: 배포 확인

### 4-1. URL 확인
배포가 완료되면 다음과 같은 URL이 생성됩니다:
```
https://YOUR-USERNAME.github.io/samsung-gfc-recruitment/
```

**예시:**
```
https://jbpark.github.io/samsung-gfc-recruitment/
```

### 4-2. 사이트 접속
1. 생성된 URL 클릭
2. 새 탭에서 사이트가 열립니다

### 4-3. 확인사항 체크리스트
- [ ] 메인 페이지가 정상적으로 표시되나요?
- [ ] 삼성생명 로고가 보이나요?
- [ ] 4개 통계가 표시되나요?
- [ ] 네비게이션 메뉴가 작동하나요?
- [ ] 이미지가 모두 로드되나요?
- [ ] 스크롤이 부드럽게 작동하나요?
- [ ] 지원하기 버튼이 작동하나요?

---

## 🔧 문제 해결

### 문제 1: 404 에러 (페이지를 찾을 수 없음)
**원인:** 배포가 아직 완료되지 않음
**해결:** 2-3분 더 대기 후 새로고침

### 문제 2: 이미지가 보이지 않음
**원인:** 파일 경로 문제
**해결:** 
1. GitHub 저장소에서 images 폴더 확인
2. 폴더 구조가 올바른지 확인

### 문제 3: CSS 스타일이 적용되지 않음
**원인:** css 폴더 업로드 누락
**해결:**
1. GitHub 저장소에서 css 폴더 확인
2. style.css 파일이 있는지 확인

### 문제 4: JavaScript가 작동하지 않음
**원인:** js 폴더 업로드 누락
**해결:**
1. GitHub 저장소에서 js 폴더 확인
2. main.js 파일이 있는지 확인

---

## 📱 배포 후 추가 작업

### 1. 커스텀 도메인 연결 (선택)
GitHub Pages → Custom domain 섹션:
```
예: gfc-recruit.samsunglife.com
```

### 2. HTTPS 강제 적용
GitHub Pages 설정에서:
```
✓ Enforce HTTPS (체크)
```

### 3. Google Analytics 연동 (선택)
index.html 수정하여 추적 코드 추가

### 4. 사이트 공유
- 카카오톡 오픈챗에 URL 공유
- 명함에 URL 추가
- 이메일 서명에 URL 추가

---

## 🔄 파일 수정 방법 (배포 후)

### 방법 1: GitHub 웹에서 직접 수정
1. 저장소에서 수정할 파일 클릭
2. 연필 아이콘 (Edit) 클릭
3. 수정 후 **"Commit changes"** 클릭
4. 1-2분 후 자동 반영

### 방법 2: 파일 삭제 후 재업로드
1. GitHub에서 파일 클릭
2. 휴지통 아이콘으로 삭제
3. 새 파일 업로드

### 방법 3: Git 설치 후 동기화 (고급)
- 나중에 Git을 설치하면 더 편리하게 관리 가능

---

## 📊 배포 현황 모니터링

### GitHub Actions 확인
1. 저장소 → **"Actions"** 탭
2. 배포 진행 상황 실시간 확인
3. 녹색 체크 표시 = 성공
4. 빨간 X 표시 = 실패 (로그 확인 필요)

---

## ✅ 최종 체크리스트

### 배포 전
- [ ] GitHub 계정 생성/로그인 완료
- [ ] 저장소 생성 완료
- [ ] 모든 파일 업로드 완료
- [ ] GitHub Pages 활성화 완료

### 배포 후
- [ ] URL 접속 확인
- [ ] 모든 페이지 작동 확인
- [ ] 모바일 반응형 확인
- [ ] 지원서 폼 테스트
- [ ] 관리자 페이지 접근 확인

### 공유
- [ ] URL 명함에 추가
- [ ] 카카오톡 오픈챗 공유
- [ ] 이메일 서명 추가
- [ ] 팀원들과 공유

---

## 🎯 성공 사례

배포 완료 시 다음과 같은 URL이 생성됩니다:
```
https://jbpark.github.io/samsung-gfc-recruitment/

또는

https://YOUR-USERNAME.github.io/samsung-gfc-recruitment/
```

이 URL을 통해 전 세계 어디서나 사이트 접속 가능!

---

## 📞 도움이 필요하면?

- GitHub 문서: https://docs.github.com/pages
- 이 가이드를 참조하세요
- 스크린샷과 함께 질문하세요

---

**작성일:** 2026년 1월 20일  
**버전:** 1.0  
**작성자:** Claude AI

**성공적인 배포를 기원합니다! 🎊**
