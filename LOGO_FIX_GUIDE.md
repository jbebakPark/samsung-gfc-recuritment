# 🖼️ 로고 표시 문제 해결 가이드

## 현재 상태
- ✅ 로고 이미지 파일: `images/samsung-life-logo.png` (5,905 bytes)
- ✅ 화이트 버전: `images/samsung-life-logo-white.png` (5,905 bytes)
- ✅ HTML 경로: `<img src="images/samsung-life-logo.png">`
- ✅ CSS 스타일: `height: 40px; width: auto;`

## 로고가 보이지 않는 경우 해결 방법

### 1. 브라우저 캐시 삭제
- **Chrome/Edge:** Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
- **Firefox:** Ctrl + F5 (Windows) / Cmd + Shift + R (Mac)
- **Safari:** Cmd + Option + R (Mac)

### 2. 개발자 도구로 확인
1. F12 또는 우클릭 → 검사
2. Console 탭에서 에러 확인
3. Network 탭에서 이미지 로딩 상태 확인
4. Elements 탭에서 `<img>` 태그 확인

### 3. 파일 경로 확인
```
프로젝트 폴더/
├── index.html
└── images/
    └── samsung-life-logo.png  ← 이 파일이 있어야 함
```

### 4. 로컬 서버 실행
단순히 HTML 파일을 더블클릭하면 경로 문제가 발생할 수 있습니다.

**VS Code Live Server 사용 (권장):**
1. VS Code 설치
2. Live Server 확장 프로그램 설치
3. `index.html` 우클릭 → "Open with Live Server"

**Python HTTP 서버:**
```bash
cd /프로젝트/폴더
python -m http.server 8000
# http://localhost:8000 접속
```

**Node.js http-server:**
```bash
npm install -g http-server
cd /프로젝트/폴더
http-server
# http://localhost:8080 접속
```

### 5. 이미지 파일 확인
```bash
# 파일 크기 확인 (정상: 5,905 bytes)
ls -lh images/samsung-life-logo.png

# 또는 Windows에서
dir images\samsung-life-logo.png
```

### 6. 브라우저에서 직접 열기
브라우저 주소창에 입력:
```
file:///전체경로/images/samsung-life-logo.png
```

이미지가 표시되면 파일은 정상이고, HTML 경로 문제입니다.

---

## 긴급 해결: Base64 인라인 이미지 사용

로고가 계속 보이지 않는다면, HTML에 직접 이미지를 임베드할 수 있습니다.

**방법:**
1. 이미지를 Base64로 변환: https://www.base64-image.de/
2. `index.html`에서 다음과 같이 수정:

```html
<!-- 기존 -->
<img src="images/samsung-life-logo.png" alt="삼성생명" class="logo">

<!-- Base64 버전 -->
<img src="data:image/png;base64,iVBORw0KG..." alt="삼성생명" class="logo">
```

하지만 이 방법은 파일 크기를 증가시키므로 권장하지 않습니다.

---

## GitHub Pages 배포 후에도 로고가 안 보인다면?

### 1. 파일 업로드 확인
GitHub 저장소에서 `images/samsung-life-logo.png` 파일이 있는지 확인

### 2. 대소문자 확인
- HTML: `images/samsung-life-logo.png`
- 파일명: `Images/Samsung-Life-Logo.PNG` ❌

Linux/Unix 시스템(GitHub Pages)은 대소문자를 구분합니다!

### 3. .gitignore 확인
`.gitignore`에 `images/` 또는 `*.png`가 포함되어 있지 않은지 확인

```bash
# 이미지가 Git에 추가되었는지 확인
git ls-files images/
```

---

## 테스트 체크리스트

- [ ] `images/samsung-life-logo.png` 파일이 존재하는가?
- [ ] 파일 크기가 5,905 bytes인가?
- [ ] 로컬 서버를 실행 중인가? (Live Server 또는 Python)
- [ ] 브라우저 캐시를 삭제했는가? (Ctrl+Shift+R)
- [ ] 개발자 도구 Console에 에러가 없는가?
- [ ] Network 탭에서 이미지가 200 OK로 로드되는가?

---

## 여전히 문제가 있다면?

1. **이미지 파일 재다운로드:**
   - 원본 URL: https://www.genspark.ai/api/files/s/6lM7UYgt
   - 다운로드 후 `images/` 폴더에 저장

2. **이미지 뷰어로 열기:**
   - `images/samsung-life-logo.png`를 이미지 뷰어로 열어보기
   - 이미지가 손상되지 않았는지 확인

3. **다른 브라우저로 테스트:**
   - Chrome, Firefox, Safari, Edge에서 각각 테스트

---

**도움이 필요하시면 다음 정보를 알려주세요:**
1. 어떤 브라우저를 사용 중인가요?
2. 로컬 서버를 실행 중인가요?
3. 개발자 도구 Console에 에러 메시지가 있나요?
4. `images/samsung-life-logo.png` 파일이 존재하나요?

이 정보가 있으면 더 정확한 해결책을 제시할 수 있습니다! 😊