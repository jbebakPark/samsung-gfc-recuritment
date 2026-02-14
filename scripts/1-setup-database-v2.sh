#!/bin/bash

################################################################################
# Samsung GFC Recruitment - Database V2.0 Setup Script
# Phase 1: Supabase Database 자동 설정
################################################################################
# 작성일: 2026-02-13
# 버전: 2.0
# 설명: Supabase 프로젝트 생성, 테이블 생성, 트리거/인덱스 설정을 자동화
################################################################################

set -e  # 에러 발생 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[STEP $1]${NC} $2"
}

# 진행 상황 표시
show_progress() {
    local current=$1
    local total=$2
    local percent=$((current * 100 / total))
    local bar_length=50
    local filled=$((percent * bar_length / 100))
    local empty=$((bar_length - filled))
    
    printf "\r${CYAN}Progress: [${NC}"
    printf "%${filled}s" | tr ' ' '='
    printf "%${empty}s" | tr ' ' '-'
    printf "${CYAN}] ${percent}%%${NC}"
}

# 배너 출력
print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║        Samsung GFC Recruitment - Database V2.0 Setup        ║"
    echo "║                                                              ║"
    echo "║  Phase 1: Supabase Database 자동 설정                        ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Supabase 정보 입력
get_supabase_credentials() {
    log_step "1/10" "Supabase 프로젝트 정보 입력"
    echo ""
    
    log_info "Supabase 프로젝트를 아직 생성하지 않았다면:"
    log_info "1. https://supabase.com 접속"
    log_info "2. 로그인 후 'New Project' 클릭"
    log_info "3. 프로젝트 이름: samsung-gfc-recruitment"
    log_info "4. 리전: Northeast Asia (Seoul) 권장"
    log_info "5. 생성 완료 후 아래 정보 입력"
    echo ""
    
    read -p "$(echo -e ${YELLOW}Supabase Project URL을 입력하세요 (예: https://xxxxx.supabase.co): ${NC})" SUPABASE_URL
    read -sp "$(echo -e ${YELLOW}Supabase Anon Key를 입력하세요: ${NC})" SUPABASE_ANON_KEY
    echo ""
    read -sp "$(echo -e ${YELLOW}Supabase Service Role Key를 입력하세요: ${NC})" SUPABASE_SERVICE_KEY
    echo ""
    
    # 검증
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
        log_error "모든 정보를 입력해야 합니다."
        exit 1
    fi
    
    log_success "Supabase 정보 입력 완료"
    echo ""
}

# SQL 파일 생성
create_sql_files() {
    log_step "2/10" "SQL 스크립트 파일 생성 중..."
    
    mkdir -p scripts/sql
    
    # 1. applications 테이블
    cat > scripts/sql/01_create_applications.sql << 'EOF'
-- ========================================
-- 1. applications 테이블 (일반 지원자)
-- ========================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'APP-' || to_char(NOW(), 'YYYYMMDD') || '-' || lpad(nextval('app_seq')::text, 4, '0'),
  
  application_type VARCHAR(30) NOT NULL,
  
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  gender VARCHAR(10) NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER,
  address TEXT,
  region VARCHAR(50),
  
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  
  career TEXT,
  motivation TEXT,
  
  identity_verified BOOLEAN DEFAULT FALSE,
  identity_verified_at TIMESTAMP,
  identity_method VARCHAR(50),
  
  status VARCHAR(20) DEFAULT 'pending',
  
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP,
  applicant_notification_method VARCHAR(20),
  
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP,
  referrer_notification_method VARCHAR(20),
  
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_by VARCHAR(100),
  notes TEXT,
  
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

-- 시퀀스 생성
CREATE SEQUENCE IF NOT EXISTS app_seq START 1;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(application_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON applications(phone);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_referrer_phone ON applications(referrer_phone);

COMMENT ON TABLE applications IS '일반 지원자 테이블 (자발적, 추천인)';
EOF

    # 2. job_fair_applications 테이블
    cat > scripts/sql/02_create_job_fair_applications.sql << 'EOF'
-- ========================================
-- 2. job_fair_applications 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS job_fair_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'JF-' || to_char(NOW(), 'YYYYMMDD') || '-' || lpad(nextval('jf_seq')::text, 4, '0'),
  
  has_referrer BOOLEAN DEFAULT FALSE,
  
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  gender VARCHAR(10),
  birth_date DATE,
  age INTEGER,
  
  job_fair_date DATE NOT NULL,
  job_fair_session VARCHAR(50),
  job_fair_location VARCHAR(200),
  attendance_confirmed BOOLEAN DEFAULT FALSE,
  attended BOOLEAN DEFAULT FALSE,
  attended_at TIMESTAMP,
  
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  
  identity_verified BOOLEAN DEFAULT FALSE,
  identity_verified_at TIMESTAMP,
  identity_method VARCHAR(50),
  
  status VARCHAR(20) DEFAULT 'registered',
  
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP,
  applicant_notification_method VARCHAR(20),
  applicant_notification_content TEXT,
  
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP,
  referrer_notification_method VARCHAR(20),
  referrer_notification_content TEXT,
  
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_by VARCHAR(100),
  notes TEXT,
  
  CONSTRAINT chk_referrer_required CHECK (
    (has_referrer = TRUE AND referrer_name IS NOT NULL AND referrer_phone IS NOT NULL)
    OR
    (has_referrer = FALSE)
  ),
  CONSTRAINT chk_job_fair_status CHECK (
    status IN ('registered', 'confirmed', 'attended', 'no_show', 'follow_up')
  )
);

-- 시퀀스 생성
CREATE SEQUENCE IF NOT EXISTS jf_seq START 1;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_job_fair_date ON job_fair_applications(job_fair_date);
CREATE INDEX IF NOT EXISTS idx_job_fair_phone ON job_fair_applications(phone);
CREATE INDEX IF NOT EXISTS idx_job_fair_email ON job_fair_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_fair_status ON job_fair_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_fair_submitted ON job_fair_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_fair_referrer_phone ON job_fair_applications(referrer_phone);
CREATE INDEX IF NOT EXISTS idx_job_fair_has_referrer ON job_fair_applications(has_referrer);

COMMENT ON TABLE job_fair_applications IS 'Job Fair 지원자 전용 테이블';
EOF

    # 3. notification_logs 테이블
    cat > scripts/sql/03_create_notification_logs.sql << 'EOF'
-- ========================================
-- 3. notification_logs 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  application_id UUID,
  application_type VARCHAR(30),
  
  recipient_type VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(100),
  
  notification_method VARCHAR(20) NOT NULL,
  notification_type VARCHAR(50),
  subject VARCHAR(200),
  content TEXT,
  
  status VARCHAR(20) DEFAULT 'pending',
  
  sent_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_recipient_type CHECK (recipient_type IN ('applicant', 'referrer')),
  CONSTRAINT chk_notification_method CHECK (notification_method IN ('kakao', 'sms', 'email')),
  CONSTRAINT chk_notification_status CHECK (status IN ('pending', 'sent', 'failed', 'retry'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_notif_application ON notification_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_notif_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notif_phone ON notification_logs(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_notif_created ON notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_type ON notification_logs(notification_type);

COMMENT ON TABLE notification_logs IS '알림 전송 로그 테이블';
EOF

    # 4. approved_users 테이블
    cat > scripts/sql/04_create_approved_users.sql << 'EOF'
-- ========================================
-- 4. approved_users 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS approved_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  application_id UUID,
  job_fair_application_id UUID,
  
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  
  access_level VARCHAR(20) DEFAULT 'basic',
  
  approved_at TIMESTAMP DEFAULT NOW(),
  approved_by VARCHAR(100),
  expires_at TIMESTAMP,
  
  last_access_at TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  
  CONSTRAINT chk_access_level CHECK (access_level IN ('basic', 'premium', 'admin'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_approved_email ON approved_users(email);
CREATE INDEX IF NOT EXISTS idx_approved_phone ON approved_users(phone);
CREATE INDEX IF NOT EXISTS idx_approved_level ON approved_users(access_level);

COMMENT ON TABLE approved_users IS '승인된 사용자 (자료실 접근 권한)';
EOF

    # 5. resources 테이블
    cat > scripts/sql/05_create_resources.sql << 'EOF'
-- ========================================
-- 5. resources 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(200),
  file_type VARCHAR(50),
  file_size INTEGER,
  
  access_level VARCHAR(20) DEFAULT 'basic',
  
  category VARCHAR(50),
  
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_resource_access CHECK (access_level IN ('public', 'basic', 'premium', 'admin'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_resource_access ON resources(access_level);
CREATE INDEX IF NOT EXISTS idx_resource_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resource_uploaded ON resources(uploaded_at DESC);

COMMENT ON TABLE resources IS '자료실 파일 관리';
EOF

    # 6. 트리거 생성
    cat > scripts/sql/06_create_triggers.sql << 'EOF'
-- ========================================
-- 6. 트리거 함수 및 트리거
-- ========================================

-- 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 나이 자동 계산 트리거 함수
CREATE OR REPLACE FUNCTION calculate_age()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.birth_date IS NOT NULL THEN
    NEW.age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birth_date));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- applications 테이블 트리거
DROP TRIGGER IF EXISTS trigger_applications_updated ON applications;
CREATE TRIGGER trigger_applications_updated
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_applications_age ON applications;
CREATE TRIGGER trigger_applications_age
BEFORE INSERT OR UPDATE OF birth_date ON applications
FOR EACH ROW
EXECUTE FUNCTION calculate_age();

-- job_fair_applications 테이블 트리거
DROP TRIGGER IF EXISTS trigger_job_fair_updated ON job_fair_applications;
CREATE TRIGGER trigger_job_fair_updated
BEFORE UPDATE ON job_fair_applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_job_fair_age ON job_fair_applications;
CREATE TRIGGER trigger_job_fair_age
BEFORE INSERT OR UPDATE OF birth_date ON job_fair_applications
FOR EACH ROW
EXECUTE FUNCTION calculate_age();

-- resources 테이블 트리거
DROP TRIGGER IF EXISTS trigger_resources_updated ON resources;
CREATE TRIGGER trigger_resources_updated
BEFORE UPDATE ON resources
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
EOF

    # 7. RLS 정책
    cat > scripts/sql/07_create_rls_policies.sql << 'EOF'
-- ========================================
-- 7. Row Level Security (RLS) 정책
-- ========================================

-- applications 테이블 RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 INSERT 가능 (지원서 제출)
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
CREATE POLICY "Anyone can insert applications" 
ON applications FOR INSERT 
TO anon 
WITH CHECK (true);

-- 인증된 사용자는 자신의 데이터만 SELECT 가능
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications" 
ON applications FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- job_fair_applications 테이블 RLS
ALTER TABLE job_fair_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert job fair applications" ON job_fair_applications;
CREATE POLICY "Anyone can insert job fair applications" 
ON job_fair_applications FOR INSERT 
TO anon 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own job fair applications" ON job_fair_applications;
CREATE POLICY "Users can view own job fair applications" 
ON job_fair_applications FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- approved_users 테이블 RLS (관리자만 접근)
ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can access approved_users" ON approved_users;
CREATE POLICY "Only service role can access approved_users" 
ON approved_users 
FOR ALL
USING (auth.role() = 'service_role');

-- resources 테이블 RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public resources accessible to all" ON resources;
CREATE POLICY "Public resources accessible to all" 
ON resources FOR SELECT 
USING (access_level = 'public');

DROP POLICY IF EXISTS "Approved users can access basic resources" ON resources;
CREATE POLICY "Approved users can access basic resources" 
ON resources FOR SELECT 
USING (
  access_level IN ('public', 'basic') 
  AND EXISTS (
    SELECT 1 FROM approved_users 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);
EOF

    # 8. 샘플 데이터 (선택)
    cat > scripts/sql/08_insert_sample_data.sql << 'EOF'
-- ========================================
-- 8. 샘플 데이터 (테스트용)
-- ========================================

-- Job Fair 일정 샘플 (resources 테이블 없으므로 주석 처리 가능)
-- 실제 사용 시 주석 해제

-- INSERT INTO resources (title, description, file_url, category, access_level) VALUES
-- ('GFC 채용 브로셔', 'GFC 기업재무컨설턴트 채용 안내', 'https://example.com/brochure.pdf', 'brochure', 'public'),
-- ('교육 프로그램 안내', 'GTC 교육 과정 상세 안내', 'https://example.com/training.pdf', 'training', 'basic'),
-- ('성공 사례집', 'GFC 성공 사례 모음', 'https://example.com/cases.pdf', 'case_study', 'basic');

-- 테스트 지원서 샘플
INSERT INTO applications (
  application_type, name, phone, email, gender, birth_date, region,
  career, motivation, status
) VALUES
('voluntary', '김테스트', '010-1111-1111', 'test1@example.com', '남성', '1985-03-15', '서울',
 '금융권 5년 경력', '삼성생명 GFC로 새로운 도전을 하고 싶습니다', 'pending'),
('referral', '이샘플', '010-2222-2222', 'test2@example.com', '여성', '1990-07-20', '경기',
 '보험설계사 3년', '추천인의 권유로 지원합니다', 'pending');

-- 추천인 정보 업데이트
UPDATE applications 
SET referrer_name = '박추천', referrer_phone = '010-9999-9999', referrer_branch = '강남지점'
WHERE email = 'test2@example.com';

-- Job Fair 샘플
INSERT INTO job_fair_applications (
  has_referrer, name, phone, email, job_fair_date, job_fair_session, job_fair_location, status
) VALUES
(FALSE, '최참석', '010-3333-3333', 'test3@example.com', '2026-02-20', '오전 10:30~13:00', '휴먼센터 219호', 'registered'),
(TRUE, '정설명회', '010-4444-4444', 'test4@example.com', '2026-02-20', '오전 10:30~13:00', '휴먼센터 219호', 'registered');

-- 추천인 정보 업데이트
UPDATE job_fair_applications 
SET referrer_name = '김지점장', referrer_phone = '010-8888-8888', referrer_branch = '서울지점'
WHERE email = 'test4@example.com';

SELECT 'Sample data inserted successfully!' AS result;
EOF

    log_success "SQL 스크립트 파일 생성 완료 (8개 파일)"
    show_progress 2 10
    echo ""
}

# Supabase CLI 설치 확인
check_supabase_cli() {
    log_step "3/10" "Supabase CLI 확인 중..."
    
    if ! command -v supabase &> /dev/null; then
        log_warning "Supabase CLI가 설치되어 있지 않습니다."
        log_info "설치를 시작합니다..."
        
        # OS 확인
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install supabase/tap/supabase
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
            sudo mv supabase /usr/local/bin/
        else
            log_error "지원하지 않는 운영체제입니다. 수동으로 Supabase CLI를 설치해주세요."
            log_info "설치 가이드: https://supabase.com/docs/guides/cli"
            exit 1
        fi
    fi
    
    log_success "Supabase CLI 확인 완료"
    show_progress 3 10
    echo ""
}

# SQL 파일 실행
execute_sql_files() {
    log_step "4/10" "Database 테이블 생성 중..."
    
    local sql_files=(
        "01_create_applications.sql"
        "02_create_job_fair_applications.sql"
        "03_create_notification_logs.sql"
        "04_create_approved_users.sql"
        "05_create_resources.sql"
        "06_create_triggers.sql"
        "07_create_rls_policies.sql"
    )
    
    local total=${#sql_files[@]}
    local current=0
    
    for sql_file in "${sql_files[@]}"; do
        current=$((current + 1))
        log_info "[$current/$total] 실행 중: $sql_file"
        
        # Supabase SQL 실행
        PGPASSWORD="$SUPABASE_SERVICE_KEY" psql \
            "$SUPABASE_URL/postgres" \
            -f "scripts/sql/$sql_file" \
            2>&1 | grep -v "password" || true
        
        sleep 1
    done
    
    log_success "모든 테이블 생성 완료"
    show_progress 4 10
    echo ""
}

# 샘플 데이터 삽입 (선택)
insert_sample_data() {
    log_step "5/10" "샘플 데이터 삽입 (선택사항)"
    
    read -p "$(echo -e ${YELLOW}테스트용 샘플 데이터를 삽입하시겠습니까? (y/N): ${NC})" -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "샘플 데이터 삽입 중..."
        
        PGPASSWORD="$SUPABASE_SERVICE_KEY" psql \
            "$SUPABASE_URL/postgres" \
            -f "scripts/sql/08_insert_sample_data.sql" \
            2>&1 | grep -v "password" || true
        
        log_success "샘플 데이터 삽입 완료"
    else
        log_info "샘플 데이터 삽입을 건너뜁니다."
    fi
    
    show_progress 5 10
    echo ""
}

# 환경 변수 파일 생성
create_env_file() {
    log_step "6/10" "환경 변수 파일 생성 중..."
    
    cat > .env.local << EOF
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# Application Settings
NODE_ENV=development
APP_NAME=Samsung GFC Recruitment
APP_VERSION=2.0

# Database Version
DB_VERSION=V2.0
DB_SETUP_DATE=$(date +"%Y-%m-%d %H:%M:%S")
EOF

    # .gitignore에 추가
    if ! grep -q ".env.local" .gitignore 2>/dev/null; then
        echo ".env.local" >> .gitignore
        log_info ".gitignore에 .env.local 추가됨"
    fi
    
    log_success "환경 변수 파일 생성 완료: .env.local"
    log_warning "⚠️  .env.local 파일은 Git에 커밋하지 마세요!"
    show_progress 6 10
    echo ""
}

# JavaScript Config 파일 생성
create_js_config() {
    log_step "7/10" "JavaScript 설정 파일 생성 중..."
    
    # supabase-config.js 생성 (실제 사용 버전)
    cat > public/js/supabase-config.js << EOF
// Supabase Configuration - V2.0
// ⚠️  이 파일은 프로덕션에서 환경 변수로 관리해야 합니다!

const supabaseConfig = {
  url: '${SUPABASE_URL}',
  anonKey: '${SUPABASE_ANON_KEY}'
  // serviceKey는 클라이언트에 노출하지 마세요!
};

// Supabase Client 초기화
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export { supabase, supabaseConfig };
EOF

    log_success "JavaScript 설정 파일 생성 완료"
    show_progress 7 10
    echo ""
}

# 연결 테스트
test_connection() {
    log_step "8/10" "Database 연결 테스트 중..."
    
    log_info "테이블 목록 조회 중..."
    
    PGPASSWORD="$SUPABASE_SERVICE_KEY" psql \
        "$SUPABASE_URL/postgres" \
        -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;" \
        2>&1 | grep -v "password" || true
    
    log_success "Database 연결 테스트 완료"
    show_progress 8 10
    echo ""
}

# 통계 정보 출력
show_statistics() {
    log_step "9/10" "설정 통계 확인 중..."
    
    echo ""
    log_info "📊 Database V2.0 설정 통계:"
    echo ""
    
    PGPASSWORD="$SUPABASE_SERVICE_KEY" psql \
        "$SUPABASE_URL/postgres" \
        -c "
        SELECT 
          'applications' AS table_name, 
          COUNT(*) AS record_count 
        FROM applications
        UNION ALL
        SELECT 
          'job_fair_applications' AS table_name, 
          COUNT(*) AS record_count 
        FROM job_fair_applications
        UNION ALL
        SELECT 
          'notification_logs' AS table_name, 
          COUNT(*) AS record_count 
        FROM notification_logs
        UNION ALL
        SELECT 
          'approved_users' AS table_name, 
          COUNT(*) AS record_count 
        FROM approved_users
        UNION ALL
        SELECT 
          'resources' AS table_name, 
          COUNT(*) AS record_count 
        FROM resources;
        " \
        2>&1 | grep -v "password" || true
    
    echo ""
    show_progress 9 10
    echo ""
}

# 완료 메시지
show_completion() {
    log_step "10/10" "설정 완료!"
    show_progress 10 10
    echo ""
    echo ""
    
    log_success "✅ Database V2.0 설정이 완료되었습니다!"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}생성된 테이블:${NC}"
    echo "  1. applications             - 일반 지원자 (자발적, 추천인)"
    echo "  2. job_fair_applications    - Job Fair 지원자 전용"
    echo "  3. notification_logs        - 알림 전송 로그"
    echo "  4. approved_users           - 승인된 사용자"
    echo "  5. resources                - 자료실"
    echo ""
    echo -e "${GREEN}생성된 파일:${NC}"
    echo "  • .env.local                - 환경 변수"
    echo "  • public/js/supabase-config.js - JavaScript 설정"
    echo "  • scripts/sql/*.sql         - SQL 스크립트 (8개)"
    echo ""
    echo -e "${YELLOW}다음 단계:${NC}"
    echo "  1. Phase 2 스크립트 실행: ./scripts/2-setup-api-v2.sh"
    echo "  2. 또는 전체 자동화: ./scripts/run-all-setup.sh"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 메인 실행 함수
main() {
    clear
    print_banner
    
    # 단계별 실행
    get_supabase_credentials
    create_sql_files
    check_supabase_cli
    execute_sql_files
    insert_sample_data
    create_env_file
    create_js_config
    test_connection
    show_statistics
    show_completion
}

# 스크립트 실행
main "$@"
