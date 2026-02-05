# 관리자 페이지 문서

## 개요

삼성생명 GFC 채용 사이트의 관리자 페이지 모음입니다.

## 페이지 목록

### 1. 인터뷰 관리 (`interviews.html`)

**URL**: `/admin/interviews.html`

#### 주요 기능

- ✅ **카테고리별 필터링**
  - 전체 인터뷰
  - 언론사 (매일경제, 한국경제 등)
  - 포털/웹 (네이버, 다음 등)
  - 유튜브 (영상 인터뷰)
  - 블로그 (개인 블로그 인터뷰)

- ✅ **검색 기능**
  - 제목, 매체명, 인터뷰어 이름으로 검색
  - 실시간 검색 결과 표시
  - Enter 키 지원

- ✅ **정렬 기능**
  - 최신순
  - 오래된순
  - 제목순 (ㄱ-ㅎ)

- ✅ **인터뷰 카드 정보**
  - 제목
  - 카테고리 뱃지
  - 매체명
  - 인터뷰어 이름
  - 날짜
  - 조회수
  - 내용 요약

- ✅ **액션 버튼**
  - 보기 (외부 링크로 이동)
  - 수정 (Phase 2 구현 예정)
  - 삭제 (Phase 2 구현 예정)

#### 데이터 구조

```javascript
{
  id: 1,
  title: "인터뷰 제목",
  category: "press", // press, portal, youtube, blog
  source: "매체명",
  interviewer: "인터뷰어 이름",
  date: "2024-12-15",
  url: "https://example.com/interview",
  content: "인터뷰 내용 요약...",
  views: 1250,
  tags: ["태그1", "태그2"]
}
```

#### 샘플 데이터

현재 8개의 샘플 인터뷰가 포함되어 있습니다:

1. 매일경제 - "삼성생명 GFC, 정년 없는 전문직으로 제2의 인생 설계"
2. 재무 컨설턴트 TV - "GFC 현직자가 말하는 실제 연봉과 업무 환경"
3. 네이버 비즈니스 - "삼성생명 GFC 지점장이 말하는 성공 비결"
4. 커리어 스토리 블로그 - "전직 CEO가 GFC로 전환한 이유"
5. 한국경제 - "삼성생명, GFC 채용 확대... 300명 모집"
6. 금융교육 채널 - "GFC 교육 프로그램 A to Z"
7. 인생 2막 블로그 - "50대 퇴직 후 GFC로 성공한 스토리"
8. 다음 뉴스 - "GFC 실무 가이드: 고객 발굴부터 계약까지"

#### 사용 방법

1. **카테고리 필터링**
   - 상단 탭을 클릭하여 카테고리별로 필터링
   - 각 탭에는 해당 카테고리의 인터뷰 개수 표시

2. **검색**
   - 검색창에 키워드 입력
   - 검색 버튼 클릭 또는 Enter 키 입력
   - 제목, 매체명, 인터뷰어 이름에서 검색

3. **정렬**
   - 우측 상단 정렬 드롭다운 선택
   - 최신순, 오래된순, 제목순 선택 가능

4. **인터뷰 보기**
   - "보기" 버튼 클릭 시 외부 링크로 이동

#### 반응형 디자인

- **Desktop (1024px+)**
  - 전체 너비 카드 레이아웃
  - 모든 정보 표시

- **Tablet (768px - 1023px)**
  - 최적화된 카드 레이아웃
  - 주요 정보 유지

- **Mobile (< 768px)**
  - 1열 레이아웃
  - 카테고리 탭 스크롤 가능
  - 버튼 풀 width
  - 터치 친화적 UI

#### 스타일 가이드

**카테고리 색상**

- 언론사 (press): 빨강 계열 (#e74c3c)
- 포털/웹 (portal): 파랑 계열 (#3498db)
- 유튜브 (youtube): 주황 계열 (#e67e22)
- 블로그 (blog): 보라 계열 (#9b59b6)

**뱃지 색상**

- press: 연한 빨강 배경 (#fee)
- portal: 연한 파랑 배경 (#e3f2fd)
- youtube: 연한 주황 배경 (#fff3e0)
- blog: 연한 보라 배경 (#f3e5f5)

### 2. 대시보드 (`index.html`)

**URL**: `/admin/index.html`

#### 현재 상태

Phase 1 완료, Phase 2 개발 예정

#### 예정 기능

- 지원자 관리
- 통계 대시보드
- 자료실 관리
- Supabase 연동

## 데이터베이스 스키마

### interviews 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | text | 고유 ID (UUID) |
| title | text | 인터뷰 제목 |
| category | text | 카테고리 (press/portal/youtube/blog) |
| source | text | 매체명 |
| interviewer | text | 인터뷰어 이름 |
| date | datetime | 인터뷰 날짜 |
| url | text | 인터뷰 URL |
| content | rich_text | 인터뷰 내용 요약 |
| views | number | 조회수 |
| tags | array | 태그 목록 |

## Phase 2 개발 예정

### 인터뷰 관리

- [ ] RESTful API 연동
- [ ] 인터뷰 추가 폼
- [ ] 인터뷰 수정 기능
- [ ] 인터뷰 삭제 (soft delete)
- [ ] 이미지 업로드
- [ ] 태그 관리
- [ ] 조회수 자동 업데이트
- [ ] 통계 차트

### 인증/권한

- [ ] 관리자 로그인
- [ ] 권한 관리
- [ ] 활동 로그

## 기술 스택

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- RESTful Table API (Phase 2)

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)
- 모바일 브라우저

## 로컬 개발

```bash
# 루트 디렉토리에서
python -m http.server 8000

# 브라우저에서
http://localhost:8000/admin/interviews.html
```

## 문의

- **이메일**: jb2park@naver.com
- **전화**: 010-5137-2327

---

**최종 업데이트**: 2026-01-02  
**버전**: 1.0.0
