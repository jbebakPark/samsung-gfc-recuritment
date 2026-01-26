# 🚀 빠른 시작 가이드

## 5분 안에 배포하기!

### 1️⃣ 파일 다운로드
- 모든 프로젝트 파일을 로컬에 다운로드

### 2️⃣ GitHub 저장소 생성
```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Samsung Life GFC Site"

# GitHub 저장소 연결 (YOUR-USERNAME 변경)
git remote add origin https://github.com/YOUR-USERNAME/samsung-gfc-recruitment.git

# 푸시
git push -u origin main
```

### 3️⃣ GitHub Pages 활성화
1. GitHub 저장소 → **Settings**
2. 왼쪽 메뉴 → **Pages**
3. Source → **main** 브랜치 선택
4. **Save** 클릭

### 4️⃣ 사이트 확인 ✅
1~2분 후 다음 주소에서 확인:
```
https://YOUR-USERNAME.github.io/samsung-gfc-recruitment/
```

---

## 📱 로컬 테스트

### VS Code Live Server 사용
1. VS Code 설치
2. Live Server 확장 프로그램 설치
3. `index.html` 우클릭 → "Open with Live Server"

### Python HTTP 서버
```bash
python -m http.server 8000
# http://localhost:8000 접속
```

---

## ✏️ 콘텐츠 수정

### Job Fair 일정 변경
`index.html` 파일의 Job Fair 섹션에서 날짜와 장소를 수정하세요.

### 통계 수치 업데이트
Hero 섹션과 Why Join 섹션의 숫자를 최신 데이터로 업데이트하세요.

### 로고 교체
`images/` 폴더의 로고 파일을 실제 삼성생명 로고로 교체하세요.

---

## 🔗 유용한 링크

- [상세 README](./README.md)
- [배포 가이드](./DEPLOYMENT.md)
- [프로젝트 요약](./PROJECT_SUMMARY.md)
- [관리자 대시보드](./admin/index.html)

---

## 💡 다음 단계

Phase 2 개발을 진행하려면:
1. [Supabase](https://supabase.com) 가입
2. `js/supabase-config.example.js` 참고
3. 데이터베이스 설정
4. 관리자 대시보드 활성화

---

**문의:** jb2park@naver.com | 010-5137-2327