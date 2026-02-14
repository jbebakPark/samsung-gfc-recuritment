# 🚀 Samsung GFC Recruitment - 완전 자동화 스크립트 가이드

## 📋 개요

Database V2.0 설계를 완전 자동화하는 5단계 스크립트 패키지입니다.

---

## 🎯 전체 구조

```
scripts/
├── 1-setup-database-v2.sh         ✅ Phase 1: Database 스키마 자동 설정
├── 2-setup-api-v2.sh              ⏳ Phase 2: API 함수 자동 배포
├── 3-update-form-ui-v2.sh         ⏳ Phase 3: 지원서 폼 UI 업데이트
├── 4-update-admin-page-v2.sh      ⏳ Phase 4: 관리자 페이지 업데이트
├── 5-setup-kakao-notification.sh  ⏳ Phase 5: 카카오톡 알림 설정
├── run-all-setup.sh               ⏳ 마스터: 전체 자동 실행
└── sql/                           📁 SQL 스크립트 (자동 생성됨)
    ├── 01_create_applications.sql
    ├── 02_create_job_fair_applications.sql
    ├── 03_create_notification_logs.sql
    ├── 04_create_approved_users.sql
    ├── 05_create_resources.sql
    ├── 06_create_triggers.sql
    ├── 07_create_rls_policies.sql
    └── 08_insert_sample_data.sql
```

---

## ✅ Phase 1: Database 스키마 자동 설정

### 📝 설명

**파일**: `scripts/1-setup-database-v2.sh`  
**목적**: Supabase Database에 모든 테이블, 트리거, 인덱스, RLS 정책 자동 생성

### 🎯 수행 작업

1. **Supabase 정보 입력** - URL, Anon Key, Service Key
2. **SQL 스크립트 생성** - 8개 SQL 파일 자동 생성
3. **Supabase CLI 확인** - 필요 시 자동 설치
4. **테이블 생성** - 5개 테이블 (applications, job_fair_applications, notification_logs, approved_users, resources)
5. **트리거 생성** - 자동 업데이트, 나이 계산
6. **인덱스 생성** - 20개 인덱스 (성능 최적화)
7. **RLS 정책** - Row Level Security 설정
8. **샘플 데이터** - 테스트용 데이터 (선택)
9. **환경 변수** - `.env.local` 파일 생성
10. **JavaScript 설정** - `supabase-config.js` 생성

### 📊 생성되는 테이블

| 테이블 | 용도 | 필드 수 |
|--------|------|---------|
| `applications` | 일반 지원자 (자발적, 추천인) | 30+ |
| `job_fair_applications` | Job Fair 지원자 전용 | 25+ |
| `notification_logs` | 알림 전송 로그 | 15+ |
| `approved_users` | 승인된 사용자 | 10+ |
| `resources` | 자료실 | 12+ |

### 🔧 실행 방법

#### 방법 1: 직접 실행
```bash
cd /home/user/webapp
./scripts/1-setup-database-v2.sh
```

#### 방법 2: Bash로 실행
```bash
cd /home/user/webapp
bash scripts/1-setup-database-v2.sh
```

### 📋 실행 전 준비사항

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - 로그인 후 "New Project" 클릭
   - 프로젝트 이름: `samsung-gfc-recruitment`
   - 리전: `Northeast Asia (Seoul)` 권장
   - Database Password 설정 (안전하게 보관)

2. **API Keys 확인**
   - Supabase Dashboard → Settings → API
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 🎬 실행 과정 (대화형)

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        Samsung GFC Recruitment - Database V2.0 Setup        ║
║                                                              ║
║  Phase 1: Supabase Database 자동 설정                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

[STEP 1/10] Supabase 프로젝트 정보 입력

Supabase 프로젝트를 아직 생성하지 않았다면:
1. https://supabase.com 접속
2. 로그인 후 'New Project' 클릭
3. 프로젝트 이름: samsung-gfc-recruitment
4. 리전: Northeast Asia (Seoul) 권장
5. 생성 완료 후 아래 정보 입력

Supabase Project URL을 입력하세요 (예: https://xxxxx.supabase.co): 
Supabase Anon Key를 입력하세요: 
Supabase Service Role Key를 입력하세요: 

[SUCCESS] Supabase 정보 입력 완료

[STEP 2/10] SQL 스크립트 파일 생성 중...
[SUCCESS] SQL 스크립트 파일 생성 완료 (8개 파일)
Progress: [====================] 20%

[STEP 3/10] Supabase CLI 확인 중...
[SUCCESS] Supabase CLI 확인 완료
Progress: [==============================] 30%

[STEP 4/10] Database 테이블 생성 중...
[INFO] [1/7] 실행 중: 01_create_applications.sql
[INFO] [2/7] 실행 중: 02_create_job_fair_applications.sql
[INFO] [3/7] 실행 중: 03_create_notification_logs.sql
[INFO] [4/7] 실행 중: 04_create_approved_users.sql
[INFO] [5/7] 실행 중: 05_create_resources.sql
[INFO] [6/7] 실행 중: 06_create_triggers.sql
[INFO] [7/7] 실행 중: 07_create_rls_policies.sql
[SUCCESS] 모든 테이블 생성 완료
Progress: [========================================] 40%

[STEP 5/10] 샘플 데이터 삽입 (선택사항)
테스트용 샘플 데이터를 삽입하시겠습니까? (y/N): y
[INFO] 샘플 데이터 삽입 중...
[SUCCESS] 샘플 데이터 삽입 완료
Progress: [==================================================] 50%

[STEP 6/10] 환경 변수 파일 생성 중...
[SUCCESS] 환경 변수 파일 생성 완료: .env.local
[WARNING] ⚠️  .env.local 파일은 Git에 커밋하지 마세요!
Progress: [============================================================] 60%

[STEP 7/10] JavaScript 설정 파일 생성 중...
[SUCCESS] JavaScript 설정 파일 생성 완료
Progress: [======================================================================] 70%

[STEP 8/10] Database 연결 테스트 중...
[INFO] 테이블 목록 조회 중...
          table_name          
------------------------------
 applications
 approved_users
 job_fair_applications
 notification_logs
 resources
(5 rows)

[SUCCESS] Database 연결 테스트 완료
Progress: [================================================================================] 80%

[STEP 9/10] 설정 통계 확인 중...

📊 Database V2.0 설정 통계:

        table_name         | record_count 
---------------------------+--------------
 applications              |            2
 job_fair_applications     |            2
 notification_logs         |            0
 approved_users            |            0
 resources                 |            0
(5 rows)

Progress: [=========================================================================================] 90%

[STEP 10/10] 설정 완료!
Progress: [==================================================================================================] 100%


[SUCCESS] ✅ Database V2.0 설정이 완료되었습니다!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
생성된 테이블:
  1. applications             - 일반 지원자 (자발적, 추천인)
  2. job_fair_applications    - Job Fair 지원자 전용
  3. notification_logs        - 알림 전송 로그
  4. approved_users           - 승인된 사용자
  5. resources                - 자료실

생성된 파일:
  • .env.local                - 환경 변수
  • public/js/supabase-config.js - JavaScript 설정
  • scripts/sql/*.sql         - SQL 스크립트 (8개)

다음 단계:
  1. Phase 2 스크립트 실행: ./scripts/2-setup-api-v2.sh
  2. 또는 전체 자동화: ./scripts/run-all-setup.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### ✅ 생성되는 파일

#### 1. `.env.local` (환경 변수)
```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Settings
NODE_ENV=development
APP_NAME=Samsung GFC Recruitment
APP_VERSION=2.0

# Database Version
DB_VERSION=V2.0
DB_SETUP_DATE=2026-02-13 14:30:00
```

#### 2. `public/js/supabase-config.js` (JavaScript 설정)
```javascript
// Supabase Configuration - V2.0
const supabaseConfig = {
  url: 'https://xxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export { supabase, supabaseConfig };
```

#### 3. `scripts/sql/*.sql` (8개 SQL 스크립트)
- `01_create_applications.sql` - applications 테이블
- `02_create_job_fair_applications.sql` - job_fair_applications 테이블
- `03_create_notification_logs.sql` - notification_logs 테이블
- `04_create_approved_users.sql` - approved_users 테이블
- `05_create_resources.sql` - resources 테이블
- `06_create_triggers.sql` - 트리거 함수 (3개)
- `07_create_rls_policies.sql` - RLS 정책 (6개)
- `08_insert_sample_data.sql` - 샘플 데이터

### 🔍 검증 방법

#### 1. Supabase Dashboard 확인
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
→ Table Editor
→ 5개 테이블 확인
```

#### 2. SQL로 확인
```sql
-- 테이블 목록
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' 
ORDER BY table_name;

-- 레코드 수
SELECT 
  'applications' AS table_name, COUNT(*) AS count FROM applications
UNION ALL
SELECT 'job_fair_applications', COUNT(*) FROM job_fair_applications
UNION ALL
SELECT 'notification_logs', COUNT(*) FROM notification_logs
UNION ALL
SELECT 'approved_users', COUNT(*) FROM approved_users
UNION ALL
SELECT 'resources', COUNT(*) FROM resources;
```

#### 3. JavaScript로 확인
```javascript
import { supabase } from './public/js/supabase-config.js';

// 테이블 조회 테스트
const { data, error } = await supabase
  .from('applications')
  .select('*')
  .limit(1);

console.log('Test result:', data, error);
```

### ⚠️ 주의사항

1. **`.env.local` 파일 보안**
   - Git에 절대 커밋하지 마세요!
   - `.gitignore`에 자동으로 추가됨
   - 프로덕션에서는 환경 변수 사용

2. **Service Role Key**
   - 클라이언트 코드에 노출 금지
   - 서버 사이드에서만 사용
   - 관리자 작업에만 사용

3. **Supabase CLI**
   - macOS: Homebrew로 자동 설치
   - Linux: 자동 다운로드 및 설치
   - Windows: 수동 설치 필요

4. **Database Password**
   - 프로젝트 생성 시 설정한 비밀번호
   - 안전하게 보관
   - 스크립트에서는 Service Key 사용

### 🐛 문제 해결

#### 문제 1: Supabase CLI 설치 실패
```bash
# 수동 설치 (macOS)
brew install supabase/tap/supabase

# 수동 설치 (Linux)
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

#### 문제 2: psql 명령 없음
```bash
# PostgreSQL 클라이언트 설치
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# CentOS/RHEL
sudo yum install postgresql
```

#### 문제 3: 연결 실패
```bash
# URL 형식 확인
# 올바른 형식: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
# 예시: postgresql://postgres:mypass@db.xxxxx.supabase.co:5432/postgres

# 직접 연결 테스트
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

#### 문제 4: 권한 오류
```bash
# Service Role Key가 올바른지 확인
# Supabase Dashboard → Settings → API → service_role
# ⚠️  anon key가 아닌 service_role key를 사용해야 합니다!
```

### 📊 예상 실행 시간

| 단계 | 시간 |
|------|------|
| 정보 입력 | 2분 |
| SQL 파일 생성 | 10초 |
| CLI 확인/설치 | 30초 ~ 2분 |
| 테이블 생성 | 30초 |
| 샘플 데이터 | 5초 |
| 환경 변수 생성 | 2초 |
| JS 설정 | 2초 |
| 연결 테스트 | 5초 |
| 통계 확인 | 5초 |
| **총 소요 시간** | **약 4~7분** |

---

## ⏳ Phase 2 ~ 5 (작성 중)

다음 Phase들은 순차적으로 작성 중입니다:

- **Phase 2**: API 함수 자동 배포 (작성 중)
- **Phase 3**: 지원서 폼 UI 업데이트 (작성 중)
- **Phase 4**: 관리자 페이지 업데이트 (작성 중)
- **Phase 5**: 카카오톡 알림 설정 (작성 중)
- **마스터 스크립트**: 전체 자동 실행 (작성 중)

---

## 📞 지원

문제 발생 시:
1. 에러 메시지 확인
2. Supabase Dashboard에서 수동 확인
3. SQL 스크립트 직접 실행 시도
4. DATABASE_SCHEMA_V2.md 문서 참조

---

**작성일**: 2026-02-13  
**버전**: 2.0  
**상태**: Phase 1 완료, Phase 2~5 작성 중
