# 삼성생명 GFC 채용 사이트 - 실행 가이드

> **박재박** 팀장님  
> 삼성생명 경기법인지역단 GFC 채용 사이트  
> **제작일**: 2026년 1월 19일

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [빠른 시작](#빠른-시작)
3. [로컬 테스트](#로컬-테스트)
4. [배포 방법](#배포-방법)
5. [콘텐츠 수정](#콘텐츠-수정)
6. [주요 기능](#주요-기능)
7. [문의사항](#문의사항)

---

## 🎯 프로젝트 개요

### 사이트 정보
- **목적**: 삼성생명 GFC 기업재무컨설턴트 채용
- **대상**: 경기법인지역단 지원자
- **현황**: Phase 1 완료 (17개 섹션 구현)

### 주요 특징
✅ **완전 반응형** - 모바일/태블릿/데스크톱 최적화  
✅ **2026년 최신 정보** - 1월 채용설명회 일정 반영  
✅ **관리자 시스템** - 지원자/인터뷰 관리  
✅ **카카오톡 알림** - 실시간 지원 알림 (설정 필요)  
✅ **SEO 최적화** - 검색엔진 노출 대비

---

## 🚀 빠른 시작

### 필요한 파일 확인
```
📁 프로젝트 폴더/
├── 📄 index.html          # 메인 페이지 (필수)
├── 📄 apply.html           # 지원서 페이지
├── 📁 css/
│   └── style.css          # 스타일시트 (필수)
├── 📁 js/
│   ├── main.js            # 메인 로직 (필수)
│   ├── application.js     # 지원서 로직
│   └── kakao-notification.js
├── 📁 images/
│   ├── samsung-life-logo.png
│   └── samsung-life-logo-white.png
└── 📁 admin/
    ├── index.html
    ├── interviews.html
    ├── applications.html
    └── applications.js
```

---

## 💻 로컬 테스트

### 방법 1: VS Code Live Server (추천)
1. VS Code 실행
2. 확장 프로그램 설치: `Live Server`
3. `index.html` 우클릭 → **"Open with Live Server"**
4. 브라우저가 자동으로 열립니다

### 방법 2: Python 서버
```bash
# 프로젝트 폴더로 이동
cd 프로젝트폴더경로

# Python 3 서버 실행
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000
```

### 방법 3: 직접 열기 (제한적)
- `index.html`을 더블클릭하여 브라우저로 열기
- ⚠️ 일부 기능 제한될 수 있음 (CORS 문제)

---

## 🌐 배포 방법

### Option A: GitHub Pages (무료, 추천)

#### 1단계: GitHub 저장소 생성
1. [GitHub](https://github.com) 로그인
2. 우측 상단 **"+"** → **"New repository"**
3. Repository 이름: `samsung-gfc-recruitment`
4. **Public** 선택
5. **"Create repository"**

#### 2단계: 파일 업로드
```bash
# 프로젝트 폴더에서 실행
git init
git add .
git commit -m "Initial commit: Samsung Life GFC 채용 사이트"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/samsung-gfc-recruitment.git
git push -u origin main
```

#### 3단계: GitHub Pages 활성화
1. Repository → **Settings**
2. 좌측 메뉴 → **Pages**
3. **Source**: `main` 브랜치 선택
4. **Save** 클릭

#### 4단계: 사이트 확인 (1~2분 소요)
```
https://YOUR-USERNAME.github.io/samsung-gfc-recruitment/
```

---

### Option B: Netlify (추천, 더 빠름)

#### 방법 1: 드래그 앤 드롭
1. [Netlify](https://netlify.com) 로그인
2. **"Add new site"** → **"Deploy manually"**
3. 프로젝트 폴더를 드래그 앤 드롭
4. 자동 배포 완료 (1분 소요)
5. 무료 도메인 제공: `https://random-name.netlify.app`

#### 방법 2: GitHub 연동
1. GitHub에 업로드 (위 방법)
2. Netlify에서 **"Import from Git"**
3. 저장소 선택 및 자동 배포 설정

---

### Option C: Vercel (개발자 친화적)

1. [Vercel](https://vercel.com) 로그인
2. **"Add New Project"**
3. GitHub 저장소 선택
4. **Deploy** 클릭
5. 자동 배포 및 도메인 제공

---

## ✏️ 콘텐츠 수정

### 📅 채용설명회 일정 변경

**파일**: `index.html` (약 230-270번 줄)

```html
<!-- 기존 일정 찾기 -->
<div class="schedule-item">
    <div class="schedule-date">
        <span class="month">1월</span>
        <span class="day">8일</span>
        <span class="weekday">(목)</span>
    </div>
    <!-- 새 일정으로 변경 -->
</div>
```

### 📞 연락처 변경

**전화번호** (여러 곳에 있음):
- Hero 섹션 (약 54번 줄)
- Job Fair 섹션 (약 267번 줄)
- Contact 섹션 (약 2100번 줄)

```html
<!-- 검색: 010-5137-2327 -->
<!-- 변경: 새 전화번호 -->
```

### 📊 통계 수치 업데이트

**파일**: `index.html` (약 60-77번 줄)

```html
<div class="hero-stats">
    <div class="stat-item">
        <span class="stat-number">315.7조</span> <!-- 총 자산 -->
        <span class="stat-label">총 자산 (국내 1위)</span>
    </div>
    <div class="stat-item">
        <span class="stat-number">5,000+</span> <!-- 현직 GFC -->
        <span class="stat-label">현직 GFC</span>
    </div>
    <!-- 수치 변경 가능 -->
</div>
```

### 🎨 색상 변경

**파일**: `css/style.css` (상단 변수 부분)

```css
:root {
    /* 메인 색상 */
    --primary-color: #0047AB;      /* 삼성 블루 */
    --secondary-color: #00C7B7;    /* 포인트 색상 */
    --accent-color: #FF6B6B;       /* 강조 색상 */
    
    /* 변경 예시 */
    --primary-color: #1E3A8A;      /* 더 진한 블루 */
}
```

---

## 🎯 주요 기능

### 1. 메인 페이지 (index.html)

#### 17개 완성 섹션
1. **Hero** - 히어로 배너 + 4개 통계
2. **About GFC** - GFC 소개
3. **Why Join** - 4가지 경쟁력
4. **Target Profile** - 적합 인재상
5. **Job Fair** - 채용설명회 일정
6. **GTC Training** - 교육 일정
7. **Age Criteria** - 연령 기준
8. **Recruitment Tracks** - 2가지 채용 경로
9. **Process** - 7단계 채용 프로세스
10. **Main Duties** - 주요 업무 4-Plan
11. **Core Competencies** - 핵심 역량
12. **Career Path** - 경력 발전 경로
13. **Support System** - 지원 시스템
14. **Insider Insights** - 현직자 인사이트
15. **Success Stories** - GFC 성공스토리
16. **Press Archive** - 보도자료
17. **Application** - 지원서 접수
18. **Resources** - 자료실
19. **FAQ** - 자주 묻는 질문
20. **Contact** - 문의하기

### 2. 관리자 페이지 (/admin/)

#### applications.html - 지원자 관리
- 41개 필드 완전 구현
- 실시간 검색/필터링
- 카카오톡 알림 연동 준비

#### interviews.html - 인터뷰 관리
- 카테고리별 필터 (언론사/포털웹/유튜브/블로그)
- 8개 샘플 데이터
- CRUD 기능 완비

### 3. 지원서 시스템

#### 2가지 지원 트랙
- **Job Fair 참가 경로**
  - 일정 선택 (1/8 또는 1/27)
  - 기본 정보 입력
  
- **현직 GFC 추천인 경로**
  - 추천인 정보 입력
  - 추천서 첨부

#### 자동 유효성 검사
- 전화번호 포맷팅 (010-XXXX-XXXX)
- 이메일 형식 확인
- 필수 항목 체크

---

## 📱 카카오톡 알림 설정 (선택)

### 준비 사항
- 카카오톡 계정: `2jbark`
- Webhook URL (Zapier 또는 Make.com)

### 설정 방법
1. **KAKAO_NOTIFICATION_SETUP.md** 파일 참조
2. Webhook URL 설정
3. `js/kakao-notification.js` 수정
4. 테스트 지원서 제출

---

## 🔧 기술 스택

### Frontend
- **HTML5** - Semantic HTML
- **CSS3** - Grid, Flexbox, Custom Properties
- **JavaScript (ES6+)** - Vanilla JS
- **Font Awesome** - 아이콘
- **Google Fonts** - Noto Sans KR

### 향후 확장 (Phase 2)
- **Supabase** - 데이터베이스 (지원자 정보 저장)
- **Supabase Auth** - 사용자 인증
- **Supabase Storage** - 파일 관리

---

## 📊 성능 최적화

### 이미지 최적화
```bash
# 이미지 압축 권장 (TinyPNG, ImageOptim)
# WebP 포맷 사용 권장
```

### 로딩 속도
- CSS/JS 파일 압축
- 이미지 Lazy Loading
- CDN 사용 (Font Awesome, Google Fonts)

---

## 🌏 브라우저 지원

✅ Chrome (최신)  
✅ Firefox (최신)  
✅ Safari (최신)  
✅ Edge (최신)  
✅ 모바일 브라우저 (iOS Safari, Chrome Mobile)

---

## 📞 문의사항

### 연락처
- **전화**: 010-5137-2327
- **이메일**: jb2park@naver.com
- **카카오톡**: [삼성생명 GFC 채용 오픈챗](https://open.kakao.com/o/s15lHyCh)

### 기술 지원
- 사이트 오류 발생 시
- 콘텐츠 수정 요청
- 새 기능 추가 문의

---

## 📝 체크리스트

### 배포 전 확인사항

- [ ] 모든 링크 작동 확인
- [ ] 전화번호/이메일 정확한지 확인
- [ ] 채용설명회 일정 최신인지 확인
- [ ] 이미지 모두 로드되는지 확인
- [ ] 모바일에서 테스트
- [ ] 태블릿에서 테스트
- [ ] 데스크톱에서 테스트
- [ ] FAQ 내용 최신인지 확인
- [ ] 지원서 폼 제출 테스트

### 배포 후 확인사항

- [ ] 메인 페이지 접속 확인
- [ ] 모든 섹션 스크롤 확인
- [ ] 네비게이션 메뉴 작동 확인
- [ ] 지원서 제출 테스트
- [ ] 관리자 페이지 접근 확인
- [ ] Google Analytics 설정 (선택)
- [ ] 도메인 연결 (선택)

---

## 🎉 다음 단계 (Phase 2)

### 1. Supabase 데이터베이스 연동
- 지원자 정보 저장
- 실시간 대시보드
- 자료실 파일 관리

### 2. 카카오톡 알림 활성화
- Webhook URL 설정 (5분 소요)
- 즉시 알림 전송

### 3. 관리자 기능 확장
- 지원자 상태 관리
- 자료실 업로드/다운로드
- 승인된 사용자 권한 관리

### 4. 이메일 알림
- 지원 완료 자동 메일
- 관리자 알림 메일

---

## 📚 참고 문서

- `README.md` - 프로젝트 전체 문서
- `DEPLOYMENT.md` - 상세 배포 가이드
- `QUICKSTART.md` - 빠른 시작 가이드
- `KAKAO_NOTIFICATION_SETUP.md` - 카카오톡 알림 설정

---

**제작**: Claude AI + 박재박 팀장  
**버전**: 1.4.1  
**최종 업데이트**: 2026년 1월 19일  
**라이선스**: © 2026 삼성생명보험주식회사

---

## 💡 팁

### 빠른 수정 팁
1. **Ctrl + F** (또는 Cmd + F)로 텍스트 검색
2. 전화번호, 이메일 등 한번에 찾아서 수정
3. 수정 후 반드시 저장 (Ctrl + S)
4. 브라우저 새로고침 (F5)으로 확인

### 백업 권장
- 수정 전 항상 원본 파일 백업
- `프로젝트폴더_백업_날짜` 형식으로 저장

### 문제 해결
- **페이지가 안 열려요**: 파일 경로 확인
- **스타일이 깨져요**: CSS 파일 경로 확인
- **버튼이 안 눌려요**: JavaScript 파일 로드 확인
- **이미지가 안 나와요**: images 폴더 확인

---

**성공적인 채용 사이트 운영을 기원합니다! 🎊**
