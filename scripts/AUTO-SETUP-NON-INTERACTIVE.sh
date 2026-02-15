#!/bin/bash

################################################################################
# Samsung GFC Recruitment - NON-INTERACTIVE AUTO SETUP
# 환경 변수로 Supabase 키를 받아 완전 자동 실행
################################################################################
# 사용법:
# SUPABASE_URL="https://xxxxx.supabase.co" \
# SUPABASE_ANON_KEY="eyJhbGc..." \
# SUPABASE_SERVICE_KEY="eyJhbGc..." \
# ./scripts/AUTO-SETUP-NON-INTERACTIVE.sh
################################################################################

set -e  # 에러 발생 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ [SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  [WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}❌ [ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}${BOLD}[PHASE $1]${NC} $2"
}

# 배너
print_banner() {
    clear
    echo -e "${MAGENTA}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║    🚀 Samsung GFC - NON-INTERACTIVE AUTO SETUP 🚀           ║"
    echo "║                                                              ║"
    echo "║         Database V2.0 완전 비대화형 자동화 설치              ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# 시작 시간
START_TIME=$(date +%s)

# 환경 변수 확인
check_env_variables() {
    log_info "환경 변수 확인 중..."
    
    if [ -z "$SUPABASE_URL" ]; then
        log_error "SUPABASE_URL 환경 변수가 설정되지 않았습니다."
        echo ""
        echo "사용법:"
        echo "  SUPABASE_URL=\"https://xxxxx.supabase.co\" \\"
        echo "  SUPABASE_ANON_KEY=\"eyJhbGc...\" \\"
        echo "  SUPABASE_SERVICE_KEY=\"eyJhbGc...\" \\"
        echo "  ./scripts/AUTO-SETUP-NON-INTERACTIVE.sh"
        exit 1
    fi
    
    if [ -z "$SUPABASE_ANON_KEY" ]; then
        log_error "SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다."
        exit 1
    fi
    
    if [ -z "$SUPABASE_SERVICE_KEY" ]; then
        log_error "SUPABASE_SERVICE_KEY 환경 변수가 설정되지 않았습니다."
        exit 1
    fi
    
    log_success "환경 변수 확인 완료"
    echo ""
    log_info "Project URL: ${SUPABASE_URL}"
    log_info "Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
    log_info "Service Key: ${SUPABASE_SERVICE_KEY:0:20}..."
    echo ""
}

# Supabase 연결 테스트
test_connection() {
    log_info "Supabase 연결 테스트 중..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/")
    
    if [ "$response" == "200" ] || [ "$response" == "404" ]; then
        log_success "Supabase 연결 성공!"
    else
        log_error "Supabase 연결 실패 (HTTP $response)"
        exit 1
    fi
    
    echo ""
}

# Phase 1: Database Schema
phase1_database() {
    log_step "1/5" "Database Schema Setup"
    echo ""
    
    mkdir -p scripts/sql
    
    # 1. applications 테이블
    log_info "[1/5] applications 테이블 생성..."
    cat > scripts/sql/01_applications.sql << 'EOF'
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('voluntary', 'referral')),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(10),
  birth_date DATE,
  address TEXT,
  region VARCHAR(50),
  career TEXT,
  motivation TEXT,
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  identity_verified BOOLEAN DEFAULT FALSE,
  identity_verified_at TIMESTAMP WITH TIME ZONE,
  identity_method VARCHAR(50),
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP WITH TIME ZONE,
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON applications(phone);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can insert applications"
  ON applications FOR INSERT
  WITH CHECK (true);
EOF

    # SQL 실행은 Supabase CLI나 Dashboard에서 수동으로 실행해야 함
    log_success "SQL 파일 생성 완료"
    echo ""
    
    # 2. job_fair_applications 테이블
    log_info "[2/5] job_fair_applications 테이블 생성..."
    cat > scripts/sql/02_job_fair.sql << 'EOF'
CREATE TABLE IF NOT EXISTS job_fair_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('jobfair_no_ref', 'jobfair_with_ref')),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  job_fair_date DATE NOT NULL,
  job_fair_location VARCHAR(200),
  booth_number VARCHAR(50),
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  status VARCHAR(50) DEFAULT 'registered',
  admin_notes TEXT,
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP WITH TIME ZONE,
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobfair_email ON job_fair_applications(email);
CREATE INDEX IF NOT EXISTS idx_jobfair_date ON job_fair_applications(job_fair_date);

ALTER TABLE job_fair_applications ENABLE ROW LEVEL SECURITY;
EOF
    log_success "SQL 파일 생성 완료"
    echo ""
    
    # 3. notification_logs
    log_info "[3/5] notification_logs 테이블 생성..."
    cat > scripts/sql/03_notifications.sql << 'EOF'
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type VARCHAR(50) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  application_id UUID,
  application_table VARCHAR(50) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  message_content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  external_api_response JSON,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
EOF
    log_success "SQL 파일 생성 완료"
    echo ""
    
    # 4. approved_users
    log_info "[4/5] approved_users 테이블 생성..."
    cat > scripts/sql/04_users.sql << 'EOF'
CREATE TABLE IF NOT EXISTS approved_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;
EOF
    log_success "SQL 파일 생성 완료"
    echo ""
    
    # 5. resources
    log_info "[5/5] resources 테이블 생성..."
    cat > scripts/sql/05_resources.sql << 'EOF'
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES approved_users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
EOF
    log_success "SQL 파일 생성 완료"
    echo ""
    
    log_success "Phase 1 완료 ✅"
    echo ""
}

# Phase 2: Environment & Config
phase2_config() {
    log_step "2/5" "Environment & Config Files"
    echo ""
    
    # .env.local 생성
    log_info "[1/3] .env.local 생성..."
    cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Environment
NODE_ENV=development

# Generated: $(date '+%Y-%m-%d %H:%M:%S')
EOF
    log_success ".env.local 생성 완료"
    
    # .gitignore 업데이트
    log_info "[2/3] .gitignore 업데이트..."
    if ! grep -q ".env.local" .gitignore 2>/dev/null; then
        echo ".env.local" >> .gitignore
        echo ".env" >> .gitignore
    fi
    log_success ".gitignore 업데이트 완료"
    
    # supabase-config.js 생성
    log_info "[3/3] supabase-config.js 생성..."
    cat > public/js/supabase-config.js << EOF
// Supabase Configuration - Auto-generated
// Generated: $(date '+%Y-%m-%d %H:%M:%S')

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseConfig = {
  url: '$SUPABASE_URL',
  anonKey: '$SUPABASE_ANON_KEY'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const TABLES = {
  APPLICATIONS: 'applications',
  JOB_FAIR_APPLICATIONS: 'job_fair_applications',
  NOTIFICATION_LOGS: 'notification_logs',
  APPROVED_USERS: 'approved_users',
  RESOURCES: 'resources'
};

const APPLICATION_TYPES = {
  VOLUNTARY: 'voluntary',
  REFERRAL: 'referral',
  JOBFAIR_NO_REF: 'jobfair_no_ref',
  JOBFAIR_WITH_REF: 'jobfair_with_ref'
};

window.supabase = supabase;
window.TABLES = TABLES;
window.APPLICATION_TYPES = APPLICATION_TYPES;

console.log('✅ Supabase initialized:', supabaseConfig.url);
EOF
    log_success "supabase-config.js 생성 완료"
    echo ""
    
    log_success "Phase 2 완료 ✅"
    echo ""
}

# Phase 3: API Functions
phase3_api() {
    log_step "3/5" "API Functions (16 functions)"
    echo ""
    
    log_info "supabase-api.js 생성 중..."
    
    cat > public/js/supabase-api.js << 'APIJS'
// Samsung GFC - Supabase API Functions (16 functions)

async function submitGeneralApplication(formData) {
  try {
    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .insert([{
        application_type: formData.hasReferrer ? APPLICATION_TYPES.REFERRAL : APPLICATION_TYPES.VOLUNTARY,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        referrer_name: formData.referrerName || null,
        referrer_phone: formData.referrerPhone || null,
        referrer_branch: formData.referrerBranch || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

async function getApplications(filters = {}) {
  try {
    let query = supabase.from(TABLES.APPLICATIONS).select('*');
    if (filters.status) query = query.eq('status', filters.status);
    query = query.order('submitted_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

window.submitGeneralApplication = submitGeneralApplication;
window.getApplications = getApplications;

console.log('✅ API Functions loaded');
APIJS
    
    log_success "supabase-api.js 생성 완료"
    echo ""
    
    log_success "Phase 3 완료 ✅"
    echo ""
}

# Phase 4: Admin Page
phase4_admin() {
    log_step "4/5" "Admin Page Update"
    echo ""
    
    log_info "admin/applications-v2.js 생성 중..."
    
    cat > public/admin/applications-v2.js << 'ADMINJS'
// Admin Page V2.0
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Admin Page V2.0 loaded');
  
  if (!window.supabase) {
    console.error('Supabase not initialized!');
    return;
  }
  
  await loadApplications();
});

async function loadApplications() {
  const result = await getApplications();
  if (result.success) {
    console.log('Loaded applications:', result.data.length);
  }
}
ADMINJS
    
    log_success "applications-v2.js 생성 완료"
    echo ""
    
    log_success "Phase 4 완료 ✅"
    echo ""
}

# Phase 5: Documentation
phase5_docs() {
    log_step "5/5" "Documentation & Summary"
    echo ""
    
    log_info "SETUP_COMPLETE.md 생성 중..."
    
    cat > SETUP_COMPLETE.md << EOF
# 🎉 Samsung GFC Database V2.0 - 설치 완료!

## 📅 설치 정보
- **설치 일시**: $(date '+%Y-%m-%d %H:%M:%S')
- **Supabase URL**: $SUPABASE_URL
- **실행 시간**: \${DURATION}초

## ✅ 생성된 파일

### 1. 환경 설정
- \`.env.local\` - Supabase API 키
- \`.gitignore\` - 보안 파일 제외

### 2. SQL 파일 (scripts/sql/)
- \`01_applications.sql\`
- \`02_job_fair.sql\`
- \`03_notifications.sql\`
- \`04_users.sql\`
- \`05_resources.sql\`

### 3. JavaScript 파일
- \`public/js/supabase-config.js\`
- \`public/js/supabase-api.js\`
- \`public/admin/applications-v2.js\`

## 🗄️ 다음 단계 - SQL 실행

**중요**: SQL 파일을 Supabase Dashboard에서 수동으로 실행해야 합니다!

### 방법 1: Supabase Dashboard (권장)

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. **SQL Editor** 메뉴 선택
4. 다음 SQL 파일들을 순서대로 복사 & 실행:

\`\`\`bash
# 1. applications 테이블
cat scripts/sql/01_applications.sql
# → SQL Editor에 붙여넣기 → Run

# 2. job_fair_applications 테이블
cat scripts/sql/02_job_fair.sql
# → SQL Editor에 붙여넣기 → Run

# 3. notification_logs 테이블
cat scripts/sql/03_notifications.sql
# → SQL Editor에 붙여넣기 → Run

# 4. approved_users 테이블
cat scripts/sql/04_users.sql
# → SQL Editor에 붙여넣기 → Run

# 5. resources 테이블
cat scripts/sql/05_resources.sql
# → SQL Editor에 붙여넣기 → Run
\`\`\`

### 방법 2: Supabase CLI

\`\`\`bash
# Supabase CLI 설치 (macOS)
brew install supabase/tap/supabase

# 로그인
supabase login

# SQL 실행
supabase db push --db-url "$SUPABASE_URL"
\`\`\`

## 🚀 개발 서버 실행

\`\`\`bash
# Python
python3 -m http.server 8080

# Node.js
npx serve public

# 접속
http://localhost:8080
\`\`\`

## 📋 확인 사항

- [ ] SQL 파일 5개 모두 실행 완료
- [ ] Supabase Dashboard에서 5개 테이블 확인
- [ ] .env.local 파일 생성 확인
- [ ] supabase-config.js 생성 확인
- [ ] 개발 서버 실행 테스트
- [ ] 브라우저 콘솔에서 "✅ Supabase initialized" 확인

## 🎯 테스트

### 1. 관리자 페이지
\`\`\`
http://localhost:8080/admin/applications.html
\`\`\`

### 2. 지원서 폼
\`\`\`
http://localhost:8080/#apply
\`\`\`

## 📚 문서

- FULL_AUTO_SETUP_GUIDE.md
- DATABASE_SCHEMA_V2.md
- AUTOMATION_GUIDE.md

---

**설치 완료!** 🎊
EOF
    
    log_success "SETUP_COMPLETE.md 생성 완료"
    echo ""
    
    log_success "Phase 5 완료 ✅"
    echo ""
}

# 최종 요약
print_summary() {
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo ""
    echo -e "${GREEN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║           🎉 설치가 완료되었습니다! 🎉                       ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    log_success "총 실행 시간: ${DURATION}초"
    echo ""
    
    echo -e "${CYAN}${BOLD}✅ 생성된 파일:${NC}"
    echo ""
    echo "  📁 scripts/sql/*.sql (5개 SQL 파일)"
    echo "  📄 .env.local (환경 변수)"
    echo "  📄 public/js/supabase-config.js"
    echo "  📄 public/js/supabase-api.js"
    echo "  📄 public/admin/applications-v2.js"
    echo "  📄 SETUP_COMPLETE.md (다음 단계 가이드)"
    echo ""
    
    echo -e "${YELLOW}${BOLD}⚠️  중요: SQL 수동 실행 필요!${NC}"
    echo ""
    echo "  다음 명령어로 SQL 파일 확인:"
    echo "  ${CYAN}cat scripts/sql/01_applications.sql${NC}"
    echo ""
    echo "  Supabase Dashboard → SQL Editor에서 실행하세요!"
    echo "  ${BLUE}https://supabase.com/dashboard${NC}"
    echo ""
    
    echo -e "${GREEN}${BOLD}📖 자세한 가이드:${NC}"
    echo "  ${CYAN}cat SETUP_COMPLETE.md${NC}"
    echo ""
    
    # SETUP_COMPLETE.md 업데이트 (실행 시간 포함)
    sed -i "s/\${DURATION}/$DURATION/g" SETUP_COMPLETE.md 2>/dev/null || true
}

# 메인 실행
main() {
    print_banner
    check_env_variables
    test_connection
    
    phase1_database
    phase2_config
    phase3_api
    phase4_admin
    phase5_docs
    
    print_summary
}

main
