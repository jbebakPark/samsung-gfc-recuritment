# 🚀 스크립트 실행 가이드

## 방법 1: 마스터 스크립트 (권장)

### 1단계: 터미널에서 실행
```bash
cd /home/user/webapp
./scripts/run-all-setup.sh
```

### 2단계: 메뉴에서 선택
화면에 다음과 같은 메뉴가 표시됩니다:
```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🚀 Samsung GFC Recruitment - Auto Setup Master v2.0 🚀      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
실행 가능한 Phase:

  [1] Phase 1: Database 스키마 자동 설정
  [2] Phase 2: API 함수 자동 배포 (구현 대기)
  [3] Phase 3: 지원서 폼 UI 업데이트 (구현 대기)
  [4] Phase 4: 관리자 페이지 업데이트 (구현 대기)
  [5] Phase 5: 카카오톡 알림 설정 (구현 대기)
  [A] All Phases: 전체 자동 실행
  [Q] Quit: 종료

선택하세요 [1-5, A, Q]: 
```

### 3단계: [1] 입력
키보드로 **1**을 누르고 **Enter**를 누르세요.

### 4단계: Supabase 정보 입력
스크립트가 다음 정보를 물어봅니다:
```
Supabase Project URL을 입력하세요 (예: https://xxxxx.supabase.co): 
```
→ 여기에 Supabase Project URL을 붙여넣고 Enter

```
Supabase Anon Key를 입력하세요: 
```
→ Anon Key를 붙여넣고 Enter

```
Supabase Service Role Key를 입력하세요: 
```
→ Service Role Key를 붙여넣고 Enter

### 5단계: 자동 진행
이제 스크립트가 자동으로 모든 작업을 수행합니다!
- SQL 스크립트 생성
- 테이블 생성
- 트리거 생성
- 인덱스 생성
- 환경 변수 파일 생성

약 4~7분 후 완료됩니다!

---

## 방법 2: 직접 실행 (고급)

### 터미널에서 바로 실행
```bash
cd /home/user/webapp
./scripts/1-setup-database-v2.sh
```

이 방법은 마스터 스크립트를 거치지 않고 Phase 1을 바로 실행합니다.
단계는 방법 1의 4~5단계와 동일합니다.

---

## ⚠️ Supabase 프로젝트가 없다면?

### 1. Supabase 가입 및 프로젝트 생성

1. **https://supabase.com** 접속
2. **"Start your project"** 또는 **"Sign In"** 클릭
3. GitHub 또는 이메일로 가입/로그인
4. **"New Project"** 클릭
5. Organization 선택 (또는 새로 생성)
6. 프로젝트 정보 입력:
   - **Name**: `samsung-gfc-recruitment`
   - **Database Password**: 안전한 비밀번호 입력 (메모장에 저장!)
   - **Region**: `Northeast Asia (Seoul)` 권장
   - **Pricing Plan**: Free 선택
7. **"Create new project"** 클릭
8. 약 2분 대기 (프로젝트 생성 중...)

### 2. API Keys 확인

프로젝트 생성 완료 후:

1. 왼쪽 메뉴에서 **Settings** (⚙️) 클릭
2. **API** 클릭
3. 다음 정보를 복사하세요:
   - **URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

이 정보를 메모장에 복사해두세요!

---

## 🎬 실행 데모 (예상 화면)

```
$ cd /home/user/webapp
$ ./scripts/run-all-setup.sh

╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🚀 Samsung GFC Recruitment - Auto Setup Master v2.0 🚀      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

선택하세요 [1-5, A, Q]: 1

╔══════════════════════════════════════════════════════════════╗
║        Samsung GFC Recruitment - Database V2.0 Setup        ║
╚══════════════════════════════════════════════════════════════╝

[STEP 1/10] Supabase 프로젝트 정보 입력

Supabase Project URL을 입력하세요: https://abcdefgh.supabase.co
Supabase Anon Key를 입력하세요: eyJhbGci...
Supabase Service Role Key를 입력하세요: eyJhbGci...

[SUCCESS] Supabase 정보 입력 완료

[STEP 2/10] SQL 스크립트 파일 생성 중...
[SUCCESS] SQL 스크립트 파일 생성 완료 (8개 파일)
Progress: [====================] 20%

[STEP 3/10] Supabase CLI 확인 중...
[SUCCESS] Supabase CLI 확인 완료
Progress: [==============================] 30%

...

[STEP 10/10] 설정 완료!
Progress: [==================================] 100%

[SUCCESS] ✅ Database V2.0 설정이 완료되었습니다!
```

---

## ✅ 실행 후 확인

### 1. Supabase Dashboard에서 확인
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
→ **Table Editor** 클릭
→ 5개 테이블 확인:
   - applications
   - job_fair_applications
   - notification_logs
   - approved_users
   - resources

### 2. 로컬 파일 확인
```bash
# 환경 변수 파일
cat .env.local

# JavaScript 설정
cat public/js/supabase-config.js

# SQL 스크립트
ls -la scripts/sql/
```

---

## 🐛 문제 해결

### 문제 1: "permission denied" 에러
```bash
chmod +x scripts/run-all-setup.sh
chmod +x scripts/1-setup-database-v2.sh
```

### 문제 2: Supabase CLI 없음
스크립트가 자동으로 설치를 시도합니다.
만약 실패하면:
```bash
# macOS
brew install supabase/tap/supabase

# Linux
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

### 문제 3: psql 명령 없음
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client
```

---

## 📞 도움말

더 자세한 정보는 다음 문서를 참조하세요:
- `READY_TO_RUN.md` - 실행 준비 가이드
- `AUTOMATION_GUIDE.md` - 상세 자동화 가이드
- `DATABASE_SCHEMA_V2.md` - Database 설계
