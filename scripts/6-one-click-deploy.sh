#!/bin/bash
# 6-one-click-deploy.sh
# 완전 자동화 원클릭 배포 스크립트
# 사용법: chmod +x 6-one-click-deploy.sh && ./6-one-click-deploy.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# 프로젝트 정보
REPO_URL="https://github.com/jbebakPark/samsung-gfc-recuritment"
REPO_NAME="samsung-gfc-recuritment"
FIREBASE_PROJECT="samsung-gfc"
PROD_URL="https://samsung-gfc.web.app"

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}${BOLD}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 헤더 표시
show_header() {
    clear
    echo -e "${MAGENTA}"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║                                                       ║"
    echo "║      🚀 삼성생명 GFC 원클릭 배포 자동화 도구       ║"
    echo "║                                                       ║"
    echo "║       Complete Automated Deployment Script           ║"
    echo "║                                                       ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Step 1: 시스템 요구사항 확인
check_requirements() {
    log_step "Step 1: 시스템 요구사항 확인 중..."
    
    local missing_tools=()
    
    # Git 확인
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
        log_error "Git이 설치되어 있지 않습니다"
    else
        log_success "Git 설치됨: $(git --version)"
    fi
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
        log_error "Node.js가 설치되어 있지 않습니다"
    else
        log_success "Node.js 설치됨: $(node --version)"
    fi
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
        log_error "npm이 설치되어 있지 않습니다"
    else
        log_success "npm 설치됨: $(npm --version)"
    fi
    
    # 필수 도구 누락 시 안내
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo ""
        log_error "필수 도구가 누락되었습니다: ${missing_tools[*]}"
        echo ""
        log_info "설치 방법:"
        echo "  - Git: https://git-scm.com/downloads"
        echo "  - Node.js (npm 포함): https://nodejs.org/"
        echo ""
        exit 1
    fi
    
    log_success "모든 필수 도구가 설치되어 있습니다!"
}

# Step 2: Firebase CLI 설치
install_firebase_cli() {
    log_step "Step 2: Firebase CLI 설치 중..."
    
    if command -v firebase &> /dev/null; then
        log_info "Firebase CLI가 이미 설치되어 있습니다: $(firebase --version)"
        log_info "최신 버전으로 업데이트 중..."
    else
        log_info "Firebase CLI 설치 중..."
    fi
    
    npm install -g firebase-tools
    
    log_success "Firebase CLI 설치 완료!"
    firebase --version
}

# Step 3: 프로젝트 클론 또는 업데이트
clone_or_update_repo() {
    log_step "Step 3: 프로젝트 준비 중..."
    
    if [ -d "$REPO_NAME" ]; then
        log_info "프로젝트가 이미 존재합니다. 최신 코드로 업데이트 중..."
        cd "$REPO_NAME"
        
        # 현재 변경사항 확인
        if [ -n "$(git status --porcelain)" ]; then
            log_warning "변경된 파일이 있습니다. 백업 후 진행합니다."
            git stash push -m "Auto-backup before deploy $(date +%Y%m%d_%H%M%S)"
        fi
        
        git fetch origin
        git pull origin main
        log_success "최신 코드로 업데이트 완료!"
    else
        log_info "프로젝트 클론 중..."
        git clone "$REPO_URL" "$REPO_NAME"
        cd "$REPO_NAME"
        log_success "프로젝트 클론 완료!"
    fi
    
    log_info "현재 위치: $(pwd)"
    log_info "최신 커밋: $(git log -1 --oneline)"
}

# Step 4: Firebase 로그인
firebase_login() {
    log_step "Step 4: Firebase 인증 중..."
    
    # 이미 로그인되어 있는지 확인
    if firebase projects:list &> /dev/null; then
        log_success "Firebase에 이미 로그인되어 있습니다!"
        firebase projects:list | head -5
    else
        log_info "Firebase 로그인이 필요합니다."
        log_info "브라우저가 열리면 Google 계정으로 로그인하세요..."
        echo ""
        
        firebase login
        
        if [ $? -eq 0 ]; then
            log_success "Firebase 로그인 성공!"
        else
            log_error "Firebase 로그인 실패"
            exit 1
        fi
    fi
}

# Step 5: Firebase 프로젝트 확인
check_firebase_project() {
    log_step "Step 5: Firebase 프로젝트 확인 중..."
    
    # .firebaserc 파일이 있는지 확인
    if [ -f ".firebaserc" ]; then
        log_success ".firebaserc 파일이 존재합니다"
        cat .firebaserc
    else
        log_warning ".firebaserc 파일이 없습니다. 프로젝트를 연결합니다..."
        firebase use "$FIREBASE_PROJECT" 2>/dev/null || firebase use --add
    fi
    
    # firebase.json 확인
    if [ -f "firebase.json" ]; then
        log_success "firebase.json 파일이 존재합니다"
    else
        log_error "firebase.json 파일이 없습니다"
        exit 1
    fi
}

# Step 6: 배포 전 검증
pre_deploy_check() {
    log_step "Step 6: 배포 전 검증 중..."
    
    # public 디렉토리 확인
    if [ -d "public" ]; then
        log_success "public 디렉토리 확인됨"
        log_info "파일 수: $(find public -type f | wc -l)개"
    else
        log_error "public 디렉토리가 없습니다"
        exit 1
    fi
    
    # index.html 확인
    if [ -f "public/index.html" ]; then
        log_success "index.html 확인됨"
        log_info "파일 크기: $(du -h public/index.html | cut -f1)"
    else
        log_error "public/index.html이 없습니다"
        exit 1
    fi
    
    # 배포할 파일 미리보기
    log_info "주요 파일 목록:"
    echo "  - public/index.html"
    echo "  - public/css/ ($(ls public/css 2>/dev/null | wc -l)개 파일)"
    echo "  - public/js/ ($(ls public/js 2>/dev/null | wc -l)개 파일)"
    echo "  - public/images/ ($(ls public/images 2>/dev/null | wc -l)개 파일)"
    
    log_success "배포 전 검증 완료!"
}

# Step 7: Firebase 배포
deploy_to_firebase() {
    log_step "Step 7: Firebase에 배포 중..."
    
    log_info "프로젝트: $FIREBASE_PROJECT"
    log_info "배포 URL: $PROD_URL"
    echo ""
    
    log_warning "배포를 시작합니다. 약 1-2분 소요됩니다..."
    echo ""
    
    # 배포 실행
    firebase deploy --only hosting --project "$FIREBASE_PROJECT"
    
    if [ $? -eq 0 ]; then
        log_success "배포 완료!"
    else
        log_error "배포 실패"
        exit 1
    fi
}

# Step 8: 배포 확인
verify_deployment() {
    log_step "Step 8: 배포 확인 중..."
    
    log_info "배포된 사이트 URL: $PROD_URL"
    
    # HTTP 상태 코드 확인
    log_info "사이트 응답 확인 중..."
    
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")
        
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "사이트가 정상적으로 작동합니다! (HTTP $HTTP_CODE)"
        else
            log_warning "HTTP 상태 코드: $HTTP_CODE"
        fi
    else
        log_warning "curl이 설치되어 있지 않아 자동 확인을 건너뜁니다"
    fi
    
    log_success "배포 확인 완료!"
}

# Step 9: 캐시 정리 안내
cache_clear_guide() {
    log_step "Step 9: 최종 안내"
    
    echo ""
    log_success "🎉 배포가 성공적으로 완료되었습니다!"
    echo ""
    
    log_info "배포된 사이트:"
    echo -e "  ${BOLD}${GREEN}$PROD_URL${NC}"
    echo ""
    
    log_warning "브라우저 캐시 정리 방법:"
    echo "  - Chrome/Edge: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)"
    echo "  - Firefox: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)"
    echo "  - Safari: Cmd+Option+R (Mac)"
    echo ""
    
    log_info "Firebase Console에서 확인:"
    echo "  https://console.firebase.google.com/project/$FIREBASE_PROJECT/hosting"
    echo ""
    
    log_info "GitHub 저장소:"
    echo "  $REPO_URL"
    echo ""
}

# 메인 실행 함수
main() {
    show_header
    
    log_info "자동 배포를 시작합니다..."
    log_info "예상 소요 시간: 3-5분"
    echo ""
    
    # 사용자 확인
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "배포가 취소되었습니다."
        exit 0
    fi
    
    # 시작 시간 기록
    START_TIME=$(date +%s)
    
    # 각 단계 실행
    check_requirements
    install_firebase_cli
    clone_or_update_repo
    firebase_login
    check_firebase_project
    pre_deploy_check
    deploy_to_firebase
    verify_deployment
    cache_clear_guide
    
    # 종료 시간 계산
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log_success "전체 작업이 완료되었습니다!"
    log_info "소요 시간: ${DURATION}초"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 에러 핸들링
trap 'echo ""; log_error "스크립트 실행 중 오류가 발생했습니다. (Exit code: $?)"; exit 1' ERR

# 메인 함수 실행
main
