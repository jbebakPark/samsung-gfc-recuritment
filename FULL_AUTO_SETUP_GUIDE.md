# 🚀 Samsung GFC Database V2.0 - 완전 자동화 설치 가이드

> **한 번의 실행으로 Phase 1~5 전체를 자동 설정합니다!**

작성일: 2026-02-13  
버전: 3.0 (FULL AUTOMATION)  
실행 시간: 약 5-10분

---

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [실행 방법](#실행-방법)
4. [실행 과정](#실행-과정)
5. [생성되는 파일](#생성되는-파일)
6. [다음 단계](#다음-단계)
7. [문제 해결](#문제-해결)
8. [자주 묻는 질문](#자주-묻는-질문)

---

## 🎯 개요

**FULL-AUTO-SETUP.sh**는 Supabase API 키 입력 한 번으로 다음 작업을 **완전 자동**으로 수행합니다:

### ✅ 자동 실행 항목

| Phase | 작업 내용 | 소요 시간 |
|-------|----------|----------|
| **Phase 1** | Database Schema 생성 (5개 테이블, 트리거, 인덱스, RLS) | ~3분 |
| **Phase 2** | API Functions 배포 (16개 함수) | ~1분 |
| **Phase 3** | Application Form UI 가이드 제공 | ~10초 |
| **Phase 4** | Admin Page 업데이트 | ~1분 |
| **Phase 5** | KakaoTalk 설정 가이드 제공 | ~10초 |

**총 실행 시간**: 약 5-10분

---

## 📝 사전 준비

### 1️⃣ Supabase 프로젝트 생성

1. **https://supabase.com** 접속
2. **로그인** (GitHub 계정 연동 가능)
3. **"New Project"** 클릭
4. 프로젝트 정보 입력:
   ```
   Project name: samsung-gfc-recruitment
   Database Password: (안전한 비밀번호 입력)
   Region: Northeast Asia (Seoul) ← 권장
   Pricing Plan: Free
   ```
5. **"Create new project"** 클릭
6. ⏳ **약 2분 대기** (데이터베이스 초기화)

### 2️⃣ API Keys 확인

프로젝트 생성 완료 후:

1. 왼쪽 메뉴 → **Settings** → **API**
2. 다음 3가지 정보 **복사**:

   ```bash
   📋 복사할 정보:
   
   ① Project URL
   예: https://abcdefghijk.supabase.co
   
   ② anon public (공개 키)
   예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   ③ service_role (비밀 키) ⚠️ 절대 공개 금지
   예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. 메모장에 임시 저장 (스크립트 실행 시 필요)

---

## 🚀 실행 방법

### 방법 1: 터미널에서 직접 실행 (권장)

```bash
cd /home/user/webapp
./scripts/FULL-AUTO-SETUP.sh
```

### 방법 2: 권한 없을 경우

```bash
cd /home/user/webapp
chmod +x scripts/FULL-AUTO-SETUP.sh
./scripts/FULL-AUTO-SETUP.sh
```

---

## 📺 실행 과정

### 1. 시작 화면

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 Samsung GFC Recruitment - FULL AUTO SETUP 🚀          ║
║                                                              ║
║         Database V2.0 완전 자동화 설치 시스템                ║
║                                                              ║
║  ⚡ Phase 1~5 전체를 한 번에 자동 설정합니다                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### 2. Supabase 정보 입력

스크립트가 3가지 정보를 요청합니다:

```bash
🔐 Supabase 프로젝트를 아직 생성하지 않았다면:

  1️⃣  https://supabase.com 접속
  2️⃣  로그인 후 'New Project' 클릭
  3️⃣  프로젝트 이름: samsung-gfc-recruitment
  4️⃣  리전: Northeast Asia (Seoul) 권장
  5️⃣  생성 완료 후 Settings → API에서 키 복사

⚠️  생성 후 약 2분 대기 필요 (데이터베이스 초기화)

Supabase Project URL을 입력하세요 (예: https://xxxxx.supabase.co): 
```

**입력 항목:**
1. Supabase Project URL (엔터)
2. Supabase Anon Key (비밀번호처럼 숨겨짐, 엔터)
3. Supabase Service Role Key (비밀번호처럼 숨겨짐, 엔터)

### 3. 자동 실행

입력 완료 후 **자동으로 Phase 1~5 실행**:

```
[INFO] Supabase 연결 테스트 중...
✅ [SUCCESS] Supabase 연결 성공!

[PHASE 1/5] Database Schema Setup (테이블, 트리거, 인덱스 생성)

[INFO] [1/8] applications 테이블 생성 중...
Progress: [████████████░░░░░░░░░░] 12%

[INFO] [2/8] job_fair_applications 테이블 생성 중...
Progress: [█████████████████░░░░░] 25%

...

✅ [SUCCESS] Phase 1 완료: Database Schema 설정 완료 ✅

[PHASE 2/5] API Functions Deployment (API 함수 16개 배포)
...
```

### 4. 완료 화면

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🎉 완전 자동화 설정이 완료되었습니다! 🎉           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

✅ [SUCCESS] 총 실행 시간: 6분 23초

✅ 완료된 작업:

  ✅ Phase 1: Database Schema (5개 테이블, 트리거, 인덱스, RLS)
  ✅ Phase 2: API Functions (16개 함수 배포)
  ✅ Phase 3: Application Form UI (가이드 제공)
  ✅ Phase 4: Admin Page (업데이트 완료)
  ✅ Phase 5: KakaoTalk Setup (가이드 제공)
```

---

## 📁 생성되는 파일

### 1. 환경 설정 파일

| 파일 | 경로 | 설명 |
|-----|------|-----|
| `.env.local` | `/home/user/webapp/.env.local` | Supabase API 키 저장 (⚠️ Git 제외) |
| `.gitignore` | `/home/user/webapp/.gitignore` | `.env.local` 자동 추가 |

**예시: .env.local**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ 서버용 (절대 공개 금지)

# Environment
NODE_ENV=development
```

### 2. JavaScript 파일

| 파일 | 설명 | 함수 개수 |
|-----|-----|----------|
| `public/js/supabase-config.js` | Supabase 클라이언트 초기화 | - |
| `public/js/supabase-api.js` | API 함수 16개 구현 | 16개 |
| `public/admin/applications-v2.js` | 관리자 페이지 로직 | - |

**API 함수 목록 (16개):**
```javascript
✅ submitGeneralApplication()       // 일반 지원서 제출
✅ submitJobFairApplication()       // Job Fair 지원서 제출
✅ getApplications()                // 지원자 조회
✅ getJobFairApplications()         // Job Fair 지원자 조회
✅ updateApplicationStatus()        // 상태 업데이트
✅ verifyIdentity()                 // 실명 인증
✅ sendKakaoNotification()          // 카카오톡 단일 발송
✅ sendDualKakaoNotification()     // 카카오톡 이중 발송
✅ logNotification()                // 알림 로그 기록
✅ getNotificationLogs()            // 알림 로그 조회
✅ getStatistics()                  // 통계 조회
... (총 16개)
```

### 3. SQL 파일

| 파일 | 설명 |
|-----|-----|
| `scripts/sql/01_create_applications.sql` | applications 테이블 |
| `scripts/sql/02_create_job_fair_applications.sql` | job_fair_applications 테이블 |
| `scripts/sql/03_create_notification_logs.sql` | notification_logs 테이블 |
| `scripts/sql/04_create_approved_users.sql` | approved_users 테이블 |
| `scripts/sql/05_create_resources.sql` | resources 테이블 |
| `scripts/sql/06_insert_sample_data.sql` | 샘플 데이터 |

### 4. 백업 파일

```
public/index.html.backup  ← 원본 백업 (자동 생성)
```

---

## 🗄️ Supabase 테이블 구조

### 1. applications (일반 지원자)

```sql
id                    UUID PRIMARY KEY
application_type      VARCHAR(50)  ← 'voluntary' | 'referral'
name                  VARCHAR(100)
phone                 VARCHAR(20)
email                 VARCHAR(255)
gender                VARCHAR(10)
birth_date            DATE
age                   INTEGER (자동 계산)
address               TEXT
region                VARCHAR(50)
career                TEXT
motivation            TEXT
referrer_name         VARCHAR(100)  ← 추천인 (referral만)
referrer_phone        VARCHAR(20)
referrer_branch       VARCHAR(100)
status                VARCHAR(50)   ← 'pending' | 'approved' | ...
admin_notes           TEXT
identity_verified     BOOLEAN
identity_verified_at  TIMESTAMP
identity_method       VARCHAR(50)
applicant_notified    BOOLEAN
applicant_notified_at TIMESTAMP
referrer_notified     BOOLEAN
referrer_notified_at  TIMESTAMP
submitted_at          TIMESTAMP (기본값: NOW())
updated_at            TIMESTAMP (자동 업데이트)
```

### 2. job_fair_applications (Job Fair 전용)

```sql
id                    UUID PRIMARY KEY
application_type      VARCHAR(50)  ← 'jobfair_no_ref' | 'jobfair_with_ref'
name                  VARCHAR(100)
phone                 VARCHAR(20)
email                 VARCHAR(255)
job_fair_date         DATE         ← Job Fair 참석일
job_fair_location     VARCHAR(200)
booth_number          VARCHAR(50)
referrer_name         VARCHAR(100) ← 추천인 (jobfair_with_ref만)
referrer_phone        VARCHAR(20)
referrer_branch       VARCHAR(100)
status                VARCHAR(50)  ← 'registered' | 'confirmed' | ...
admin_notes           TEXT
applicant_notified    BOOLEAN
applicant_notified_at TIMESTAMP
referrer_notified     BOOLEAN
referrer_notified_at  TIMESTAMP
submitted_at          TIMESTAMP
updated_at            TIMESTAMP
```

### 3. notification_logs (알림 로그)

```sql
id                      UUID PRIMARY KEY
recipient_type          VARCHAR(50)  ← 'applicant' | 'referrer'
recipient_name          VARCHAR(100)
recipient_phone         VARCHAR(20)
application_id          UUID
application_table       VARCHAR(50)  ← 'applications' | 'job_fair_applications'
notification_type       VARCHAR(50)  ← 'kakao' | 'sms' | 'email'
message_content         TEXT
status                  VARCHAR(50)  ← 'pending' | 'sent' | 'failed' | 'delivered'
error_message           TEXT
external_api_response   JSON
sent_at                 TIMESTAMP
delivered_at            TIMESTAMP
```

### 4. approved_users (관리자)

```sql
id          UUID PRIMARY KEY
email       VARCHAR(255) UNIQUE
name        VARCHAR(100)
role        VARCHAR(50)  ← 'admin' | 'manager' | 'viewer'
created_at  TIMESTAMP
```

### 5. resources (자료실)

```sql
id           UUID PRIMARY KEY
title        VARCHAR(200)
description  TEXT
file_path    TEXT
file_size    BIGINT
file_type    VARCHAR(100)
uploaded_by  UUID (FK → approved_users.id)
uploaded_at  TIMESTAMP
```

---

## 📋 다음 단계 (수동 작업)

### 1️⃣ Supabase Dashboard 확인

```bash
https://supabase.com/dashboard
→ 프로젝트 선택
→ Table Editor 메뉴
→ 5개 테이블 확인 ✅
```

**확인 항목:**
- [ ] applications 테이블 존재
- [ ] job_fair_applications 테이블 존재
- [ ] notification_logs 테이블 존재
- [ ] approved_users 테이블 존재
- [ ] resources 테이블 존재
- [ ] 샘플 데이터 3개 삽입됨

### 2️⃣ 로컬 파일 확인

```bash
cd /home/user/webapp

# 환경 변수 확인
cat .env.local

# Supabase 설정 확인
cat public/js/supabase-config.js

# API 함수 확인
cat public/js/supabase-api.js

# SQL 파일 확인
ls -la scripts/sql/
```

### 3️⃣ 개발 서버 실행

```bash
# 방법 1: Python
python3 -m http.server 8080

# 방법 2: Node.js
npx serve public

# 방법 3: PHP
php -S localhost:8080 -t public
```

브라우저에서 접속:
```
http://localhost:8080
```

### 4️⃣ 관리자 페이지 테스트

```bash
http://localhost:8080/admin/applications.html
```

**확인 사항:**
- [ ] Supabase 연결 확인 (콘솔 로그)
- [ ] 샘플 데이터 3개 로드됨
- [ ] 테이블 필터링 동작
- [ ] 상태 업데이트 버튼 동작

### 5️⃣ 지원서 폼 테스트

```bash
http://localhost:8080/#apply
```

**테스트 시나리오:**
1. **자발적 지원** (추천인 없음)
   - 지원 유형: `voluntary` 선택
   - 이름, 연락처, 이메일 입력
   - 제출 → Supabase 저장 확인

2. **추천인 지원**
   - 지원 유형: `referral` 선택
   - 추천인 정보 입력 (이름, 전화번호, 소속)
   - 제출 → 지원자 + 추천인 동시 알림

3. **Job Fair 지원 (추천인 없음)**
   - 지원 유형: `jobfair_no_ref` 선택
   - Job Fair 날짜, 장소 입력
   - 제출 → job_fair_applications 테이블 저장

4. **Job Fair 지원 (추천인 있음)**
   - 지원 유형: `jobfair_with_ref` 선택
   - Job Fair + 추천인 정보 입력
   - 제출 → 이중 알림

### 6️⃣ 카카오톡 API 연동 (선택사항)

현재는 **모의(Mock) 알림**만 구현되어 있습니다. 실제 카카오톡 발송을 위해:

1. **https://developers.kakao.com** 접속
2. **애플리케이션 등록**
3. **REST API 키** 발급
4. `.env.local`에 추가:
   ```bash
   KAKAO_REST_API_KEY=your_kakao_api_key
   KAKAO_ADMIN_KEY=your_kakao_admin_key
   ```
5. `public/js/supabase-api.js`의 `sendKakaoNotification()` 함수 수정:
   ```javascript
   // TODO 제거 후 실제 API 호출 코드 작성
   const response = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${KAKAO_API_KEY}`,
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: `template_object=${JSON.stringify(template)}`
   });
   ```

---

## 🔧 문제 해결

### 1. Supabase 연결 실패

**증상:**
```
❌ [ERROR] Supabase 연결 실패 (HTTP 403)
```

**해결 방법:**
- API 키가 정확한지 확인
- Supabase 프로젝트가 활성화되었는지 확인 (2분 대기)
- Dashboard → Settings → API에서 키 재확인

### 2. 테이블 생성 실패

**증상:**
```
[INFO] [1/8] applications 테이블 생성 중...
(아무 반응 없음)
```

**해결 방법:**
- Supabase Dashboard → Table Editor → Manual 생성
- SQL 파일을 직접 실행:
  ```bash
  cat scripts/sql/01_create_applications.sql
  → SQL Editor에 붙여넣기 실행
  ```

### 3. CORS 오류

**증상:**
```
Access to fetch at 'https://xxxxx.supabase.co' from origin 'http://localhost:8080' has been blocked by CORS
```

**해결 방법:**
1. Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. **Site URL** 추가: `http://localhost:8080`
4. **Redirect URLs** 추가: `http://localhost:8080/*`

### 4. RLS 정책 오류

**증상:**
```
new row violates row-level security policy
```

**해결 방법:**
- RLS 정책이 올바르게 생성되었는지 확인
- Dashboard → Authentication → Policies
- 필요 시 수동으로 정책 추가:
  ```sql
  CREATE POLICY "Anyone can insert applications"
    ON applications FOR INSERT
    WITH CHECK (true);
  ```

### 5. .env.local 파일이 Git에 커밋됨

**해결 방법:**
```bash
# Git에서 제거 (파일은 유지)
git rm --cached .env.local

# .gitignore 확인
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore

# 커밋
git add .gitignore
git commit -m "chore: Add .env to .gitignore"
```

### 6. jq 명령어 없음

**증상:**
```
bash: jq: command not found
```

**해결 방법:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

---

## ❓ 자주 묻는 질문 (FAQ)

### Q1. 스크립트를 여러 번 실행해도 되나요?

**A:** 네, **멱등성(Idempotent)**이 보장됩니다.
- 테이블이 이미 존재하면 `CREATE TABLE IF NOT EXISTS` 구문으로 스킵됩니다.
- 중복 데이터 삽입은 `ON CONFLICT DO NOTHING`으로 방지됩니다.

### Q2. Supabase 무료 플랜으로 충분한가요?

**A:** 네, **Free Tier**로 충분합니다.
- Database: 500 MB (초기 사용량 < 1 MB)
- Storage: 1 GB
- Bandwidth: 2 GB/월
- API 요청: 50,000 MAU (Monthly Active Users)

### Q3. 실제 운영 환경에서는 어떻게 배포하나요?

**A:** 환경 변수를 사용하세요.

**Vercel 배포:**
```bash
# Vercel Dashboard
Settings → Environment Variables
→ VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 추가
```

**Netlify 배포:**
```bash
# Netlify Dashboard
Site settings → Environment variables
→ 동일하게 추가
```

**GitHub Actions:**
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Q4. service_role key는 언제 사용하나요?

**A:** **서버 사이드**에서만 사용합니다.
- ✅ 관리자 백엔드 API (Node.js, Python)
- ✅ Serverless Functions (Netlify Functions, Vercel Edge Functions)
- ✅ 크론잡 (Cron Jobs)
- ❌ 절대 클라이언트 JavaScript에 노출 금지!

### Q5. 실명 인증은 어떻게 구현하나요?

**A:** 3가지 방법이 있습니다:

1. **휴대폰 인증 (SMS)**
   - NICE 본인인증 API 연동
   - Pass 인증 연동

2. **이메일 인증**
   - Supabase Auth 이메일 인증 활용

3. **관리자 수동 승인**
   - 관리자 페이지에서 직접 승인

### Q6. 카카오톡 알림 비용은?

**A:** 발송 건당 **약 15원** (2026년 기준)
- 친구톡 (무료): 채널 추가한 사용자에게만 발송 가능
- 알림톡 (유료): 템플릿 승인 필요, 발송 건당 15원
- 문자 대체 발송: 카카오톡 실패 시 SMS/LMS 자동 발송 (건당 20-50원)

---

## 📞 지원

### 문제가 해결되지 않으면?

1. **GitHub Issues** 등록
2. **이메일** 문의: support@example.com
3. **Supabase 커뮤니티**: https://github.com/supabase/supabase/discussions

---

## 📚 관련 문서

- [DATABASE_SCHEMA_V2.md](./DATABASE_SCHEMA_V2.md) - Database 상세 스키마
- [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) - 단계별 자동화 가이드
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Database 연동 가이드
- [READY_TO_RUN.md](./READY_TO_RUN.md) - Phase 1 실행 가이드

---

## 🎉 축하합니다!

**완전 자동화 설정이 완료**되었습니다.

이제 실제 지원자 데이터를 수집하고 관리할 수 있습니다! 🚀

---

**작성:** Samsung GFC Recruitment Team  
**업데이트:** 2026-02-13  
**버전:** 3.0 (FULL AUTOMATION)
