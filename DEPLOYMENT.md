# GitHub Pages 배포 가이드

이 문서는 삼성생명 GFC 채용 사이트를 GitHub Pages로 배포하는 방법을 단계별로 설명합니다.

## 사전 준비

- GitHub 계정
- Git 설치
- 프로젝트 파일

## 배포 단계

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 **+** 버튼 → **New repository** 클릭
3. Repository 정보 입력:
   - Repository name: `samsung-gfc-recruitment` (원하는 이름)
   - Description: "삼성생명 GFC 기업재무컨설턴트 채용 사이트"
   - Public 선택
   - README 체크 해제 (이미 있음)
4. **Create repository** 클릭

### 2단계: 로컬 Git 설정

터미널 또는 명령 프롬프트에서 프로젝트 폴더로 이동:

```bash
# 프로젝트 폴더로 이동
cd /path/to/your/project

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Samsung Life GFC Recruitment Site"

# 기본 브랜치 이름을 main으로 변경 (필요시)
git branch -M main

# GitHub 원격 저장소 추가
git remote add origin https://github.com/YOUR-USERNAME/samsung-gfc-recruitment.git

# 푸시
git push -u origin main
```

**주의:** `YOUR-USERNAME`을 실제 GitHub 사용자명으로 변경하세요.

### 3단계: GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. 상단 메뉴에서 **Settings** 클릭
3. 왼쪽 사이드바에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Branch: **main** 선택
   - Folder: **/ (root)** 선택
5. **Save** 버튼 클릭

### 4단계: 배포 확인

1. 약 1~2분 대기
2. Pages 설정 페이지 상단에 배포 URL 표시:
   ```
   Your site is live at https://YOUR-USERNAME.github.io/samsung-gfc-recruitment/
   ```
3. URL 클릭하여 사이트 확인

## 업데이트 방법

사이트 내용을 수정한 후:

```bash
# 변경 사항 스테이징
git add .

# 커밋
git commit -m "Update: 설명 메시지"

# 푸시
git push origin main
```

푸시 후 1~2분 내에 사이트가 자동으로 업데이트됩니다.

## 커스텀 도메인 설정 (선택사항)

자체 도메인을 사용하려면:

1. GitHub Pages 설정에서 **Custom domain** 입력
2. 도메인 제공업체(hosting provider)에서 DNS 설정:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```
3. GitHub에서 **Enforce HTTPS** 체크

## 문제 해결

### 페이지가 표시되지 않는 경우

1. **Actions** 탭에서 배포 상태 확인
2. index.html 파일이 루트 디렉토리에 있는지 확인
3. 브라우저 캐시 삭제 후 재시도
4. GitHub Pages 설정이 올바른지 재확인

### 스타일이 적용되지 않는 경우

1. CSS/JS 파일 경로 확인:
   ```html
   <!-- 절대 경로 대신 상대 경로 사용 -->
   <link rel="stylesheet" href="css/style.css">
   <script src="js/main.js"></script>
   ```

2. 이미지 경로 확인:
   ```html
   <img src="images/samsung-life-logo.png" alt="삼성생명">
   ```

### 모바일에서 제대로 표시되지 않는 경우

HTML head에 viewport meta 태그가 있는지 확인:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Phase 2: Supabase 연동 준비

GitHub Pages는 정적 사이트만 지원하므로, 데이터베이스 기능을 추가하려면:

### 옵션 1: Supabase (권장)

1. [Supabase](https://supabase.com) 프로젝트 생성
2. 환경 변수를 JavaScript에 직접 포함 (임시 방법)
3. 또는 Netlify/Vercel로 마이그레이션 (환경 변수 지원)

### 옵션 2: Netlify로 마이그레이션

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod
```

### 옵션 3: Vercel로 마이그레이션

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인 및 배포
vercel --prod
```

## 보안 고려사항

### API 키 보호

**절대 하지 말아야 할 것:**
- Private API keys를 JavaScript에 직접 포함
- 민감한 정보를 GitHub에 커밋

**권장 방법:**
- Supabase anon key만 클라이언트에서 사용
- Row Level Security (RLS) 활성화
- Netlify/Vercel의 환경 변수 기능 사용

## 성능 최적화

### 이미지 최적화

1. PNG/JPG를 WebP로 변환
2. 이미지 압축 도구 사용:
   - [TinyPNG](https://tinypng.com)
   - [Squoosh](https://squoosh.app)

### CDN 활용

외부 라이브러리는 CDN 사용:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
```

### 브라우저 캐싱

GitHub Pages는 자동으로 캐싱 설정을 관리합니다.

## 모니터링

### Google Analytics 추가 (선택사항)

```html
<!-- index.html의 </head> 직전에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 백업 및 버전 관리

### 정기 백업

```bash
# 로컬에 백업
git pull origin main

# 또는 전체 저장소 다운로드
git clone https://github.com/YOUR-USERNAME/samsung-gfc-recruitment.git backup-folder
```

### 버전 태그

```bash
# 버전 태그 생성
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# 태그 푸시
git push origin v1.0.0
```

## 지원

문제가 발생하면:
1. [GitHub Pages 문서](https://docs.github.com/en/pages) 참조
2. [Issues](https://github.com/YOUR-USERNAME/samsung-gfc-recruitment/issues) 탭에서 질문
3. 프로젝트 관리자에게 문의

---

**작성일:** 2026년 1월 1일  
**작성자:** 삼성생명 GFC 채용팀  
**버전:** 1.0.0