# 💾 Database 설계 및 대응 현황

## 📊 현재 상태: Phase 1 (프론트엔드만 구현됨)

### ❌ 실제 Database는 연동되지 않음

현재 사이트는 **Phase 1 단계**로, 다음 사항들이 준비되었지만 **실제로는 작동하지 않습니다**:

- ✅ **설계 완료**: Database 스키마 설계 문서 존재
- ✅ **프론트엔드 완료**: 지원서 폼 UI 완성
- ✅ **API 함수 준비**: `supabase-config.example.js`에 코드 작성됨
- ❌ **실제 연동 없음**: 폼 제출 시 데이터가 저장되지 않음
- ❌ **관리자 페이지**: 샘플 데이터만 표시

---

## 🗂️ Database 설계 현황

### 1. **설계 문서**: `DATABASE_GUIDE.md`

완전한 Database 설계 및 구현 가이드가 작성되어 있습니다:

#### 📋 테이블 설계 (PostgreSQL)

**1) applications (지원서 테이블)**
```sql
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  track VARCHAR(50) NOT NULL,              -- 'jobfair', 'referral', 'direct'
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birth DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  region VARCHAR(50),
  fair_date VARCHAR(50),
  career TEXT,
  motivation TEXT,
  referrer_name VARCHAR(100),
  referrer_branch VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',    -- 'pending', 'approved', 'rejected'
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
```

**2) approved_users (승인된 사용자 테이블)**
```sql
CREATE TABLE approved_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  approved_at TIMESTAMP DEFAULT NOW()
);
```

**3) resources (자료실 테이블)**
```sql
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  access_level VARCHAR(20) DEFAULT 'approved',  -- 'public', 'approved'
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

**4) job_fairs (채용설명회 일정 테이블)**
```sql
CREATE TABLE job_fairs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open',  -- 'open', 'closed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. **API 함수 준비**: `public/js/supabase-config.example.js`

다음 함수들이 이미 작성되어 있으며, **Phase 2에서 활성화**하면 됩니다:

#### 지원자 관리 API
- `submitApplication(formData)` - 지원서 제출
- `getApplications(filters)` - 지원서 목록 조회 (관리자)
- `updateApplicationStatus(applicationId, status)` - 상태 업데이트

#### 자료실 API
- `uploadResource(file, metadata)` - 자료 업로드 (관리자)
- `getResources(userEmail)` - 자료 목록 조회
- `downloadResource(resourceId, userEmail)` - 자료 다운로드

#### 사용자 승인 API
- `approveUser(applicationId)` - 사용자 승인 (관리자)

---

## 🎯 구현 방법 3가지 (준비됨)

### 방법 1: Supabase (권장) ⭐

**장점**:
- ✅ 무료 티어 충분 (월 500MB DB, 1GB Storage)
- ✅ PostgreSQL 기반 (강력한 관계형 DB)
- ✅ 실시간 기능 내장
- ✅ Row Level Security (RLS) - 보안 강화
- ✅ 자동 REST API 생성
- ✅ Firebase 대비 유연함

**구현 시간**: 약 3-4시간

**구현 단계**:
1. Supabase 프로젝트 생성 (10분)
2. SQL 스크립트 실행 - 테이블 생성 (5분)
3. RLS 정책 설정 (10분)
4. JavaScript 코드 활성화 (30분)
5. 테스트 (1시간)

**비용**: 무료 (데이터 50만 행까지)

---

### 방법 2: Google Sheets (간단) 🚀

**장점**:
- ✅ 설정 초간단 (DB 지식 불필요)
- ✅ 완전 무료
- ✅ 엑셀처럼 관리 가능
- ✅ 자동 백업

**단점**:
- 보안 취약 (공개 API)
- 대용량 부적합 (5,000행 이상 느려짐)
- 복잡한 쿼리 불가

**구현 시간**: 약 1시간

**구현 단계**:
1. Google Sheets 생성 (5분)
2. Apps Script 작성 (20분)
3. 웹 앱으로 배포 (10분)
4. JavaScript 연동 (15분)
5. 테스트 (10분)

**비용**: 무료

---

### 방법 3: EmailJS (최간단) 📧

**장점**:
- ✅ 즉시 구현 가능 (1시간)
- ✅ DB 불필요
- ✅ 이메일로 바로 확인

**단점**:
- 검색 불편
- 통계/관리 불편
- 자동화 어려움

**구현 시간**: 약 1시간

**구현 단계**:
1. EmailJS 가입 (5분)
2. 이메일 템플릿 생성 (10분)
3. JavaScript 코드 추가 (15분)
4. 테스트 (5분)

**비용**: 무료 (월 200통까지)

---

## 📁 관련 파일 위치

### 설계 문서
- `DATABASE_GUIDE.md` - 완전한 구현 가이드 (490줄)
- `IMPLEMENTATION_GUIDE.md` - Firebase/Firestore 설정 가이드
- `README.md` - 프로젝트 개요 및 Database 언급

### 코드 파일
- `public/js/supabase-config.example.js` - API 함수 (241줄)
  - 실제 사용 시 `.example` 제거 후 설정값 입력
- `public/admin/applications.js` - 관리자 페이지 로직
  - 현재는 샘플 데이터 사용 중
  - RESTful API 호출 코드 준비됨 (38번째 줄)

### Firebase 설정
- `firebase.json` - Firebase Hosting 설정
- `.firebaserc` - 프로젝트 ID: `samsung-gfc`

---

## 🚦 현재 동작 방식 (Phase 1)

### 지원서 폼 제출 시

**현재 (Phase 1)**:
```javascript
// public/index.html 내부 JavaScript
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // 1. 폼 유효성 검사만 수행
  if (validateForm()) {
    console.log('✅ 폼 검증 통과');
    console.log('📝 제출 데이터:', formData);
    
    // 2. 성공 메시지 표시
    alert('✅ 지원서가 제출되었습니다!');
    
    // 3. 폼 초기화
    form.reset();
    
    // ⚠️ 실제로 저장되지 않음!
  }
});
```

**Phase 2 (연동 후)**:
```javascript
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // 1. 폼 데이터 수집
  const formData = collectFormData();
  
  // 2. Supabase에 저장
  const result = await submitApplication(formData);
  
  if (result.success) {
    // 3. 카카오톡 알림 전송 (관리자에게)
    await sendKakaoNotification(formData);
    
    // 4. 성공 메시지
    alert('✅ 지원서가 제출되었습니다!');
    
    // 5. 확인 이메일 발송 (선택)
    await sendConfirmationEmail(formData.email);
  }
});
```

---

## 📊 관리자 페이지 현황

### `public/admin/applications.html`

**현재 동작**:
- 샘플 데이터 표시 (하드코딩된 20개 지원서)
- 필터링/검색/정렬 UI 작동
- 상세보기/수정/삭제 버튼 존재 (실제 동작 안 함)

**코드 상태**:
```javascript
// applications.js (25번째 줄)
async function loadApplications() {
  try {
    // RESTful API 호출 준비됨
    const response = await fetch('/tables/gfc_applications?limit=1000&sort=-submitted_at');
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    const result = await response.json();
    allApplications = result.data || [];
    
  } catch (error) {
    console.error('Error loading applications:', error);
    
    // ⚠️ 현재는 샘플 데이터로 대체
    allApplications = getSampleApplications();
  }
}
```

**Phase 2 연동 시**: `/tables/gfc_applications` 엔드포인트가 실제 Database에서 데이터를 가져옴

---

## ✅ Database 대응 완료 항목

### 1. **스키마 설계** ✅
- 4개 테이블 설계 완료
- PostgreSQL DDL 작성 완료
- 인덱스 최적화 설계
- 외래키 관계 정의

### 2. **API 함수** ✅
- 8개 CRUD 함수 작성 완료
- 에러 핸들링 포함
- TypeScript 타입 주석 (JSDoc)

### 3. **보안 설계** ✅
- Row Level Security (RLS) 정책 작성
- 권한 레벨 설계 (public, approved, admin)
- 이메일 인증 방식 설계

### 4. **UI/UX** ✅
- 지원서 폼 완성 (3가지 트랙)
- 관리자 대시보드 UI 완성
- 통계 카드 구현
- 필터/검색/정렬 기능

---

## ⏳ Phase 2 구현 시 필요한 작업

### 1. Supabase 프로젝트 설정 (30분)
```bash
# 1. Supabase 가입 및 프로젝트 생성
# 2. SQL Editor에서 테이블 생성
# 3. RLS 정책 활성화
# 4. API Keys 복사
```

### 2. JavaScript 파일 수정 (20분)
```bash
# 1. supabase-config.example.js → supabase-config.js 이름 변경
# 2. URL 및 API Key 입력
# 3. index.html에서 import 활성화
```

### 3. 폼 제출 로직 연동 (30분)
```javascript
// index.html 내부
// 기존 코드:
console.log('Form submitted', formData);

// 변경 후:
const result = await submitApplication(formData);
if (result.success) {
  alert('✅ 지원서가 제출되었습니다!');
}
```

### 4. 관리자 페이지 연동 (1시간)
```javascript
// applications.js
// 샘플 데이터 제거, 실제 API 호출로 변경
```

### 5. 테스트 (1시간)
- 지원서 제출 테스트
- 관리자 페이지 조회 테스트
- 필터/검색 기능 테스트
- 권한 관리 테스트

---

## 🎯 권장 구현 순서

### 즉시 구현 (1시간) - EmailJS
```
✅ 빠른 테스트용
✅ DB 없이 이메일로 수신
✅ 1시간 내 완성 가능
```

### 단기 구현 (3시간) - Google Sheets
```
✅ 중소규모 적합
✅ 엑셀처럼 관리 가능
✅ 하루 내 완성 가능
```

### 장기 구현 (4시간) - Supabase
```
⭐ 권장 방법
✅ 확장성 좋음
✅ 보안 강화
✅ 실시간 기능
✅ 무료 티어 충분
```

---

## 📞 다음 단계

### Database를 즉시 연동하려면:

**Option A: Supabase (권장)**
```bash
# 1. https://supabase.com 가입
# 2. New Project 생성
# 3. SQL Editor → DATABASE_GUIDE.md의 SQL 실행
# 4. Settings → API → URL과 Key 복사
# 5. supabase-config.example.js 파일 수정
# 6. index.html에서 import 활성화
# 7. 테스트
```

**Option B: Google Sheets (간단)**
```bash
# 1. Google Sheets 생성
# 2. Extensions → Apps Script
# 3. DATABASE_GUIDE.md의 코드 붙여넣기
# 4. Deploy → New Deployment → Web app
# 5. URL 복사
# 6. index.html에서 URL 설정
# 7. 테스트
```

**Option C: EmailJS (최간단)**
```bash
# 1. https://www.emailjs.com 가입
# 2. Email Services 추가
# 3. Email Templates 생성
# 4. Public Key 복사
# 5. index.html에 코드 추가
# 6. 테스트
```

---

## 📌 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| **Database 스키마 설계** | ✅ 완료 | PostgreSQL DDL 작성됨 |
| **API 함수 작성** | ✅ 완료 | 8개 함수, 주석 포함 |
| **프론트엔드 UI** | ✅ 완료 | 지원서 폼, 관리자 페이지 |
| **보안 설계** | ✅ 완료 | RLS 정책 작성됨 |
| **실제 Database 연동** | ❌ 미완료 | Phase 2 예정 |
| **데이터 저장 기능** | ❌ 미완료 | Phase 2 예정 |
| **관리자 CRUD 기능** | ❌ 미완료 | Phase 2 예정 |

---

## 🎉 결론

**Database 설계는 완전히 대응되어 있습니다!**

- ✅ **스키마**: 4개 테이블 설계 완료
- ✅ **코드**: API 함수 8개 작성 완료
- ✅ **UI**: 지원서 폼 + 관리자 페이지 완성
- ✅ **가이드**: 3가지 구현 방법 문서화
- ❌ **연동**: 실제 Database 연결만 남음

**Phase 2에서 Supabase 연동 시 약 4시간이면 완전히 작동합니다.**

---

**작성일**: 2026-02-13  
**버전**: 1.0  
**작성자**: AI Assistant  
**참조 문서**: DATABASE_GUIDE.md, supabase-config.example.js
