# 💾 Database 스키마 설계 V2.0 - 개선된 지원자 관리 시스템

## 📋 개요

### 📌 주요 변경사항
- **4가지 지원자 유형 구분**: 자발적, 추천인, Job Fair (추천인 무), Job Fair (추천인 유)
- **추천인 정보 수집**: 성명, 전화번호, 소속 관리
- **Job Fair 전용 테이블**: 별도 테이블로 분리 관리
- **카카오톡 동시 알림**: 지원자 + 추천인 동시 알림
- **실명 확인 프로세스**: 지원자 본인 확인 추가
- **알림 상태 추적**: 통지 여부 및 일시 기록

---

## 🗂️ 테이블 구조

### 1. `applications` - 일반 지원자 테이블

자발적 지원 및 추천인 지원자 (Job Fair 제외) 관리

```sql
CREATE TABLE applications (
  -- 기본 정보
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE NOT NULL,  -- 지원번호 (자동생성: APP-YYYYMMDD-0001)
  
  -- 지원 유형 (4가지 구분)
  application_type VARCHAR(30) NOT NULL,
  -- 'voluntary'        : 자발적 지원자 (추천인 없음)
  -- 'referral'         : 추천인 지원자 (추천인 있음)
  -- 'jobfair_no_ref'   : Job Fair 참석 (추천인 없음) → job_fair_applications로 이관
  -- 'jobfair_with_ref' : Job Fair 참석 (추천인 있음) → job_fair_applications로 이관
  
  -- 지원자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  gender VARCHAR(10) NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER,                             -- 자동 계산
  address TEXT,
  region VARCHAR(50),
  
  -- 추천인 정보 (referral 타입에만 해당)
  referrer_name VARCHAR(100),              -- 추천인 성명
  referrer_phone VARCHAR(20),              -- 추천인 전화번호
  referrer_branch VARCHAR(100),            -- 추천인 소속
  
  -- 경력 및 동기
  career TEXT,                             -- 경력사항
  motivation TEXT,                         -- 지원동기
  
  -- 실명 확인
  identity_verified BOOLEAN DEFAULT FALSE, -- 실명 확인 여부
  identity_verified_at TIMESTAMP,          -- 실명 확인 일시
  identity_method VARCHAR(50),             -- 확인 방법 (phone, email, manual)
  
  -- 지원 상태
  status VARCHAR(20) DEFAULT 'pending',
  -- 'pending'   : 검토 중
  -- 'approved'  : 승인
  -- 'rejected'  : 반려
  -- 'contacted' : 연락 완료
  -- 'scheduled' : 면접 예정
  
  -- 알림 상태 (지원자)
  applicant_notified BOOLEAN DEFAULT FALSE,    -- 지원자 알림 여부
  applicant_notified_at TIMESTAMP,             -- 지원자 알림 일시
  applicant_notification_method VARCHAR(20),   -- 알림 방법 (kakao, sms, email)
  
  -- 알림 상태 (추천인)
  referrer_notified BOOLEAN DEFAULT FALSE,     -- 추천인 알림 여부
  referrer_notified_at TIMESTAMP,              -- 추천인 알림 일시
  referrer_notification_method VARCHAR(20),    -- 알림 방법 (kakao, sms, email)
  
  -- 메타 정보
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_by VARCHAR(100),               -- 처리자 (관리자 이름)
  notes TEXT,                              -- 관리자 메모
  
  -- 제약조건
  CONSTRAINT chk_application_type CHECK (
    application_type IN ('voluntary', 'referral', 'jobfair_no_ref', 'jobfair_with_ref')
  ),
  CONSTRAINT chk_status CHECK (
    status IN ('pending', 'approved', 'rejected', 'contacted', 'scheduled')
  ),
  CONSTRAINT chk_referrer_info CHECK (
    (application_type IN ('referral', 'jobfair_with_ref') AND referrer_name IS NOT NULL AND referrer_phone IS NOT NULL)
    OR
    (application_type IN ('voluntary', 'jobfair_no_ref'))
  )
);

-- 인덱스
CREATE INDEX idx_applications_type ON applications(application_type);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_phone ON applications(phone);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_submitted ON applications(submitted_at DESC);
CREATE INDEX idx_applications_referrer_phone ON applications(referrer_phone);

-- 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_applications_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_applications_updated
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_applications_timestamp();

-- 나이 자동 계산 트리거
CREATE OR REPLACE FUNCTION calculate_age()
RETURNS TRIGGER AS $$
BEGIN
  NEW.age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birth_date));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_age
BEFORE INSERT OR UPDATE OF birth_date ON applications
FOR EACH ROW
EXECUTE FUNCTION calculate_age();
```

---

### 2. `job_fair_applications` - Job Fair 지원자 전용 테이블

채용설명회 참석 지원자 별도 관리

```sql
CREATE TABLE job_fair_applications (
  -- 기본 정보
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE NOT NULL,  -- 지원번호 (JF-YYYYMMDD-0001)
  
  -- 지원 유형
  has_referrer BOOLEAN DEFAULT FALSE,      -- 추천인 있음/없음
  
  -- 지원자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  gender VARCHAR(10),
  birth_date DATE,
  age INTEGER,
  
  -- Job Fair 정보
  job_fair_date DATE NOT NULL,             -- Job Fair 참석 예정일
  job_fair_session VARCHAR(50),            -- 세션 시간 (오전/오후)
  job_fair_location VARCHAR(200),          -- 장소
  attendance_confirmed BOOLEAN DEFAULT FALSE, -- 참석 확인 여부
  attended BOOLEAN DEFAULT FALSE,          -- 실제 참석 여부
  attended_at TIMESTAMP,                   -- 참석 확인 일시
  
  -- 추천인 정보 (has_referrer = TRUE인 경우)
  referrer_name VARCHAR(100),              -- 추천인 성명
  referrer_phone VARCHAR(20),              -- 추천인 전화번호
  referrer_branch VARCHAR(100),            -- 추천인 소속
  
  -- 실명 확인
  identity_verified BOOLEAN DEFAULT FALSE,
  identity_verified_at TIMESTAMP,
  identity_method VARCHAR(50),
  
  -- 지원 상태
  status VARCHAR(20) DEFAULT 'registered',
  -- 'registered' : 등록 완료
  -- 'confirmed'  : 참석 확인
  -- 'attended'   : 참석 완료
  -- 'no_show'    : 불참
  -- 'follow_up'  : 추가 연락 필요
  
  -- 알림 상태 (지원자)
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP,
  applicant_notification_method VARCHAR(20),
  applicant_notification_content TEXT,     -- 알림 내용
  
  -- 알림 상태 (추천인)
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP,
  referrer_notification_method VARCHAR(20),
  referrer_notification_content TEXT,      -- 알림 내용
  
  -- 메타 정보
  submitted_at TIMESTAMP DEFAULT NOW(),    -- 지원 일시
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_by VARCHAR(100),
  notes TEXT,
  
  -- 제약조건
  CONSTRAINT chk_referrer_required CHECK (
    (has_referrer = TRUE AND referrer_name IS NOT NULL AND referrer_phone IS NOT NULL)
    OR
    (has_referrer = FALSE)
  ),
  CONSTRAINT chk_job_fair_status CHECK (
    status IN ('registered', 'confirmed', 'attended', 'no_show', 'follow_up')
  )
);

-- 인덱스
CREATE INDEX idx_job_fair_date ON job_fair_applications(job_fair_date);
CREATE INDEX idx_job_fair_phone ON job_fair_applications(phone);
CREATE INDEX idx_job_fair_email ON job_fair_applications(email);
CREATE INDEX idx_job_fair_status ON job_fair_applications(status);
CREATE INDEX idx_job_fair_submitted ON job_fair_applications(submitted_at DESC);
CREATE INDEX idx_job_fair_referrer_phone ON job_fair_applications(referrer_phone);
CREATE INDEX idx_job_fair_has_referrer ON job_fair_applications(has_referrer);

-- 자동 업데이트 트리거
CREATE TRIGGER trigger_job_fair_updated
BEFORE UPDATE ON job_fair_applications
FOR EACH ROW
EXECUTE FUNCTION update_applications_timestamp();

-- 나이 자동 계산 트리거
CREATE TRIGGER trigger_job_fair_age
BEFORE INSERT OR UPDATE OF birth_date ON job_fair_applications
FOR EACH ROW
EXECUTE FUNCTION calculate_age();
```

---

### 3. `notification_logs` - 알림 로그 테이블

모든 알림 전송 내역 추적

```sql
CREATE TABLE notification_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- 연관 정보
  application_id UUID,                     -- applications 또는 job_fair_applications의 ID
  application_type VARCHAR(30),            -- 'application' 또는 'job_fair'
  
  -- 수신자 정보
  recipient_type VARCHAR(20) NOT NULL,     -- 'applicant' 또는 'referrer'
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(100),
  
  -- 알림 정보
  notification_method VARCHAR(20) NOT NULL, -- 'kakao', 'sms', 'email'
  notification_type VARCHAR(50),           -- 'application_received', 'referral_notification', 'job_fair_reminder' 등
  subject VARCHAR(200),                    -- 제목
  content TEXT,                            -- 내용
  
  -- 전송 상태
  status VARCHAR(20) DEFAULT 'pending',
  -- 'pending'  : 대기 중
  -- 'sent'     : 전송 완료
  -- 'failed'   : 전송 실패
  -- 'retry'    : 재시도 필요
  
  -- 전송 결과
  sent_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- 메타 정보
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_recipient_type CHECK (recipient_type IN ('applicant', 'referrer')),
  CONSTRAINT chk_notification_method CHECK (notification_method IN ('kakao', 'sms', 'email')),
  CONSTRAINT chk_notification_status CHECK (status IN ('pending', 'sent', 'failed', 'retry'))
);

-- 인덱스
CREATE INDEX idx_notif_application ON notification_logs(application_id);
CREATE INDEX idx_notif_status ON notification_logs(status);
CREATE INDEX idx_notif_phone ON notification_logs(recipient_phone);
CREATE INDEX idx_notif_created ON notification_logs(created_at DESC);
CREATE INDEX idx_notif_type ON notification_logs(notification_type);
```

---

### 4. `approved_users` - 승인된 사용자 테이블

자료실 접근 권한 관리

```sql
CREATE TABLE approved_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- 지원서 연결
  application_id UUID,                     -- applications 테이블 참조
  job_fair_application_id UUID,            -- job_fair_applications 테이블 참조
  
  -- 사용자 정보
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  
  -- 권한 정보
  access_level VARCHAR(20) DEFAULT 'basic',
  -- 'basic'  : 기본 자료 접근
  -- 'premium': 프리미엄 자료 접근
  -- 'admin'  : 관리자 권한
  
  -- 승인 정보
  approved_at TIMESTAMP DEFAULT NOW(),
  approved_by VARCHAR(100),                -- 승인자
  expires_at TIMESTAMP,                    -- 만료일 (선택)
  
  -- 메타 정보
  last_access_at TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  
  CONSTRAINT chk_access_level CHECK (access_level IN ('basic', 'premium', 'admin'))
);

-- 인덱스
CREATE INDEX idx_approved_email ON approved_users(email);
CREATE INDEX idx_approved_phone ON approved_users(phone);
CREATE INDEX idx_approved_level ON approved_users(access_level);
```

---

### 5. `resources` - 자료실 테이블

```sql
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- 파일 정보
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(200),
  file_type VARCHAR(50),
  file_size INTEGER,                       -- bytes
  
  -- 접근 권한
  access_level VARCHAR(20) DEFAULT 'basic',
  -- 'public'  : 누구나 접근
  -- 'basic'   : 승인된 사용자
  -- 'premium' : 프리미엄 사용자
  -- 'admin'   : 관리자만
  
  -- 카테고리
  category VARCHAR(50),                    -- 'brochure', 'training', 'case_study', 'video'
  
  -- 통계
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- 메타 정보
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_resource_access CHECK (access_level IN ('public', 'basic', 'premium', 'admin'))
);

-- 인덱스
CREATE INDEX idx_resource_access ON resources(access_level);
CREATE INDEX idx_resource_category ON resources(category);
CREATE INDEX idx_resource_uploaded ON resources(uploaded_at DESC);
```

---

## 📊 지원자 구분 및 처리 흐름

### 1️⃣ 자발적 지원자 (Voluntary)
```
지원자 → 지원서 작성 → applications 테이블 저장
       → application_type = 'voluntary'
       → referrer_name = NULL
       → 지원자에게만 카카오톡 알림
```

### 2️⃣ 추천인 지원자 (Referral)
```
지원자 → 지원서 작성 + 추천인 정보 입력
       → applications 테이블 저장
       → application_type = 'referral'
       → referrer_name, referrer_phone, referrer_branch 필수
       → 지원자 + 추천인 동시 카카오톡 알림
```

### 3️⃣ Job Fair 지원자 (추천인 없음)
```
지원자 → Job Fair 신청 → job_fair_applications 테이블 저장
       → has_referrer = FALSE
       → job_fair_date 필수
       → 지원자에게만 카카오톡 알림 (참석 안내)
```

### 4️⃣ Job Fair 지원자 (추천인 있음)
```
지원자 → Job Fair 신청 + 추천인 정보 입력
       → job_fair_applications 테이블 저장
       → has_referrer = TRUE
       → referrer_name, referrer_phone, referrer_branch 필수
       → job_fair_date 필수
       → 지원자 + 추천인 동시 카카오톡 알림
```

---

## 🔔 카카오톡 알림 흐름

### 알림 시나리오

#### 1. 일반 지원 접수 시 (자발적)
```javascript
// 지원자에게만 전송
{
  recipient: 'applicant',
  message: `
    [삼성생명 GFC 채용]
    ${name}님의 지원서가 접수되었습니다.
    
    지원번호: ${application_number}
    접수일시: ${submitted_at}
    
    검토 후 영업일 기준 3일 이내 연락드리겠습니다.
  `
}
```

#### 2. 추천인 지원 접수 시
```javascript
// 지원자에게 전송
{
  recipient: 'applicant',
  message: `
    [삼성생명 GFC 채용]
    ${name}님의 지원서가 접수되었습니다.
    
    지원번호: ${application_number}
    추천인: ${referrer_name} (${referrer_branch})
    접수일시: ${submitted_at}
    
    검토 후 연락드리겠습니다.
  `
}

// 추천인에게 동시 전송
{
  recipient: 'referrer',
  message: `
    [삼성생명 GFC 채용]
    ${referrer_name}님이 추천하신 ${name}님의 지원서가 접수되었습니다.
    
    지원번호: ${application_number}
    지원자: ${name} (${phone})
    접수일시: ${submitted_at}
    
    감사합니다.
  `
}
```

#### 3. Job Fair 신청 시 (추천인 없음)
```javascript
// 지원자에게만 전송
{
  recipient: 'applicant',
  message: `
    [삼성생명 GFC 채용설명회]
    ${name}님의 참석 신청이 완료되었습니다.
    
    신청번호: ${application_number}
    일시: ${job_fair_date} ${job_fair_session}
    장소: ${job_fair_location}
    
    당일 신분증을 지참해주세요.
  `
}
```

#### 4. Job Fair 신청 시 (추천인 있음)
```javascript
// 지원자에게 전송
{
  recipient: 'applicant',
  message: `
    [삼성생명 GFC 채용설명회]
    ${name}님의 참석 신청이 완료되었습니다.
    
    신청번호: ${application_number}
    일시: ${job_fair_date} ${job_fair_session}
    장소: ${job_fair_location}
    추천인: ${referrer_name}
    
    당일 신분증을 지참해주세요.
  `
}

// 추천인에게 동시 전송
{
  recipient: 'referrer',
  message: `
    [삼성생명 GFC 채용설명회]
    ${referrer_name}님이 추천하신 ${name}님이 채용설명회에 신청하셨습니다.
    
    신청번호: ${application_number}
    일시: ${job_fair_date} ${job_fair_session}
    지원자: ${name} (${phone})
    
    감사합니다.
  `
}
```

---

## 🔐 실명 확인 프로세스

### 방법 1: 휴대폰 본인 인증 (권장)
```javascript
// 본인인증 API 연동 (NICE, KCB 등)
{
  method: 'phone',
  name: '입력된 이름',
  phone: '입력된 전화번호',
  birth_date: '입력된 생년월일'
}

// 인증 성공 시
identity_verified = TRUE
identity_verified_at = NOW()
identity_method = 'phone'
```

### 방법 2: 이메일 인증
```javascript
// 이메일로 인증 링크 발송
{
  method: 'email',
  email: '입력된 이메일',
  verification_code: '6자리 코드'
}

// 인증 성공 시
identity_verified = TRUE
identity_verified_at = NOW()
identity_method = 'email'
```

### 방법 3: 관리자 수동 확인
```javascript
// 관리자가 직접 확인 후 승인
{
  method: 'manual',
  verified_by: '관리자 이름',
  notes: '확인 메모'
}

// 승인 시
identity_verified = TRUE
identity_verified_at = NOW()
identity_method = 'manual'
```

---

## 📈 통계 및 리포트 쿼리

### 1. 지원자 유형별 통계
```sql
-- 일반 지원자 통계
SELECT 
  application_type,
  COUNT(*) as count,
  COUNT(CASE WHEN referrer_name IS NOT NULL THEN 1 END) as with_referrer
FROM applications
GROUP BY application_type;

-- Job Fair 지원자 통계
SELECT 
  job_fair_date,
  COUNT(*) as total_applicants,
  COUNT(CASE WHEN has_referrer = TRUE THEN 1 END) as with_referrer,
  COUNT(CASE WHEN attended = TRUE THEN 1 END) as attended
FROM job_fair_applications
GROUP BY job_fair_date
ORDER BY job_fair_date DESC;
```

### 2. 추천인별 지원자 수
```sql
-- 일반 지원에서 추천인별 집계
SELECT 
  referrer_name,
  referrer_phone,
  referrer_branch,
  COUNT(*) as referral_count
FROM applications
WHERE application_type IN ('referral', 'jobfair_with_ref')
  AND referrer_name IS NOT NULL
GROUP BY referrer_name, referrer_phone, referrer_branch
ORDER BY referral_count DESC;

-- Job Fair 추천인별 집계
SELECT 
  referrer_name,
  referrer_phone,
  referrer_branch,
  COUNT(*) as referral_count
FROM job_fair_applications
WHERE has_referrer = TRUE
GROUP BY referrer_name, referrer_phone, referrer_branch
ORDER BY referral_count DESC;
```

### 3. 알림 전송 현황
```sql
SELECT 
  notification_method,
  recipient_type,
  status,
  COUNT(*) as count
FROM notification_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY notification_method, recipient_type, status;
```

---

## 🎯 마이그레이션 가이드

### V1.0 → V2.0 데이터 마이그레이션

```sql
-- 1. 기존 applications 데이터 백업
CREATE TABLE applications_backup AS SELECT * FROM applications;

-- 2. 새 테이블 생성 (위의 DDL 실행)

-- 3. 데이터 마이그레이션
INSERT INTO applications (
  application_type,
  name,
  phone,
  email,
  gender,
  birth_date,
  region,
  career,
  motivation,
  referrer_name,
  referrer_branch,
  status,
  submitted_at
)
SELECT 
  CASE 
    WHEN track = 'jobfair' AND referrer_name IS NULL THEN 'jobfair_no_ref'
    WHEN track = 'jobfair' AND referrer_name IS NOT NULL THEN 'jobfair_with_ref'
    WHEN track = 'referral' THEN 'referral'
    ELSE 'voluntary'
  END as application_type,
  name,
  phone,
  email,
  gender,
  birth as birth_date,
  region,
  career,
  motivation,
  referrer_name,
  referrer_branch,
  status,
  submitted_at
FROM applications_backup;

-- 4. Job Fair 데이터 분리
INSERT INTO job_fair_applications (
  has_referrer,
  name,
  phone,
  email,
  job_fair_date,
  referrer_name,
  referrer_phone,
  referrer_branch,
  submitted_at
)
SELECT 
  CASE WHEN referrer_name IS NOT NULL THEN TRUE ELSE FALSE END,
  name,
  phone,
  email,
  fair_date::DATE,
  referrer_name,
  NULL as referrer_phone,  -- V1에서는 없었으므로 NULL
  referrer_branch,
  submitted_at
FROM applications_backup
WHERE track = 'jobfair';

-- 5. 기존 Job Fair 데이터 제거
DELETE FROM applications WHERE application_type IN ('jobfair_no_ref', 'jobfair_with_ref');
```

---

## 📝 체크리스트

### Phase 2 구현 시 확인사항

- [ ] **테이블 생성**: 5개 테이블 DDL 실행
- [ ] **트리거 설정**: 자동 업데이트, 나이 계산
- [ ] **인덱스 생성**: 검색 성능 최적화
- [ ] **제약조건 확인**: 데이터 무결성
- [ ] **API 함수 수정**: 새 스키마 대응
- [ ] **폼 UI 업데이트**: 4가지 트랙 구분
- [ ] **카카오톡 알림**: 동시 전송 로직
- [ ] **실명 확인**: 본인인증 연동
- [ ] **관리자 페이지**: Job Fair 탭 추가
- [ ] **통계 대시보드**: 유형별 집계
- [ ] **데이터 마이그레이션**: V1 → V2 이관
- [ ] **테스트**: 전체 시나리오 검증

---

## 🔗 관련 문서

- `DATABASE_STATUS.md` - 현재 구현 상태
- `DATABASE_GUIDE.md` - V1.0 구현 가이드
- `API_DOCUMENTATION_V2.md` - API 함수 명세 (작성 예정)
- `KAKAO_NOTIFICATION_GUIDE.md` - 카카오톡 알림 설정

---

**작성일**: 2026-02-13  
**버전**: 2.0  
**작성자**: AI Assistant  
**상태**: 설계 완료, 구현 대기
