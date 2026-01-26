# 🎉 삼성생명 GFC 지원서 시스템 - 빠른 시작 가이드

**버전**: 1.0.0  
**업데이트**: 2026-01-02

---

## 🚀 5분 안에 시작하기

### 1️⃣ **지원자용 - 지원서 작성**

#### 접속 URL
```
https://your-domain.com/apply.html
```

#### 작성 순서
1. 지원 유형 선택 (채용설명회/추천인/직접지원)
2. 기본 정보 입력 (성명, 연락처, 이메일 등)
3. 학력/경력 정보 입력
4. 지원 동기 작성
5. 개인정보 동의 (4가지)
6. 제출 버튼 클릭

**소요 시간**: 10-15분

---

### 2️⃣ **관리자용 - 지원서 관리**

#### 접속 URL
```
https://your-domain.com/admin/applications.html
```

#### 관리 방법
1. 대시보드 통계 확인
2. 필터 선택 (유형/상태)
3. 지원자 "상세" 버튼 클릭
4. 내용 검토 후 "승인" 또는 "거부"

**소요 시간**: 지원자 1명당 3-5분

---

## 📋 주요 기능

### 지원서 제출 (`apply.html`)
✅ 3가지 지원 유형 (채용설명회/추천인/직접)  
✅ 실시간 폼 검증  
✅ 전화번호 자동 포맷팅  
✅ 개인정보 동의서 통합  
✅ 완전 반응형 (모바일/태블릿/PC)

### 관리자 페이지 (`admin/applications.html`)
✅ 실시간 통계 대시보드  
✅ 필터링 & 검색  
✅ 지원서 상세 보기  
✅ 상태 변경 (승인/거부)  
✅ RESTful API 연동

---

## 🗂️ 파일 구조

```
.
├── apply.html              # 지원서 제출 페이지
├── js/
│   └── application.js      # 제출 로직
├── admin/
│   ├── applications.html   # 관리자 페이지
│   └── applications.js     # 관리 로직
└── css/
    └── style.css           # 스타일
```

---

## 🎯 데이터베이스

### 테이블: `gfc_applications`
- **32개 필드**
- 기본 정보, 학력, 경력, 동의서 등
- RESTful Table API 사용

### API 엔드포인트
```javascript
POST   /tables/gfc_applications      # 지원서 제출
GET    /tables/gfc_applications      # 목록 조회
PATCH  /tables/gfc_applications/{id} # 상태 변경
```

---

## 🔧 로컬 테스트

```bash
# 1. 로컬 서버 실행
python -m http.server 8000

# 2. 브라우저 접속
http://localhost:8000/apply.html
http://localhost:8000/admin/applications.html
```

---

## 📞 문의

- 이메일: jb2park@naver.com
- 전화: 010-5137-2327

---

**상세 문서**: `APPLICATION_SYSTEM_REPORT.md` 참조
