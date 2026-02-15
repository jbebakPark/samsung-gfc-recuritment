#!/bin/bash

################################################################################
# Samsung GFC - Master Auto Setup Script
# 전체 자동화 실행 스크립트
################################################################################

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 로그 함수
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 배너
print_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🚀 Samsung GFC Recruitment - Auto Setup Master v2.0 🚀      ║
║                                                                  ║
║              Database V2.0 완전 자동화 설정 도구                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}\n"
}

# Phase 목록
show_phases() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}실행 가능한 Phase:${NC}\n"
    echo "  ${CYAN}[1]${NC} Phase 1: Database 스키마 자동 설정"
    echo "      → 5개 테이블, 트리거, 인덱스, RLS 정책 생성"
    echo ""
    echo "  ${CYAN}[2]${NC} Phase 2: API 함수 자동 배포 (구현 대기)"
    echo "      → 16개 API 함수, Supabase Functions 배포"
    echo ""
    echo "  ${CYAN}[3]${NC} Phase 3: 지원서 폼 UI 업데이트 (구현 대기)"
    echo "      → 4가지 트랙 구분, 추천인 정보 입력"
    echo ""
    echo "  ${CYAN}[4]${NC} Phase 4: 관리자 페이지 업데이트 (구현 대기)"
    echo "      → Job Fair 탭, 통계 대시보드"
    echo ""
    echo "  ${CYAN}[5]${NC} Phase 5: 카카오톡 알림 설정 (구현 대기)"
    echo "      → Webhook, 동시 전송 설정"
    echo ""
    echo "  ${CYAN}[A]${NC} All Phases: 전체 자동 실행"
    echo "      → Phase 1~5 순차 실행"
    echo ""
    echo "  ${CYAN}[Q]${NC} Quit: 종료"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Phase 1 실행
run_phase1() {
    log_info "Phase 1: Database 스키마 자동 설정 시작..."
    echo ""
    
    if [ -f "scripts/1-setup-database-v2.sh" ]; then
        bash scripts/1-setup-database-v2.sh
        log_success "Phase 1 완료!"
    else
        log_error "scripts/1-setup-database-v2.sh 파일을 찾을 수 없습니다."
        return 1
    fi
}

# Phase 2 실행 (준비 중)
run_phase2() {
    log_warning "Phase 2는 현재 구현 대기 중입니다."
    log_info "API 함수 배포 스크립트를 수동으로 작성하거나,"
    log_info "DATABASE_SCHEMA_V2.md와 supabase-config-v2.example.js를 참고하세요."
    echo ""
    read -p "계속하려면 Enter를 누르세요..."
}

# Phase 3 실행 (준비 중)
run_phase3() {
    log_warning "Phase 3는 현재 구현 대기 중입니다."
    log_info "지원서 폼 UI는 수동으로 업데이트하세요."
    echo ""
    read -p "계속하려면 Enter를 누르세요..."
}

# Phase 4 실행 (준비 중)
run_phase4() {
    log_warning "Phase 4는 현재 구현 대기 중입니다."
    log_info "관리자 페이지는 수동으로 업데이트하세요."
    echo ""
    read -p "계속하려면 Enter를 누르세요..."
}

# Phase 5 실행 (준비 중)
run_phase5() {
    log_warning "Phase 5는 현재 구현 대기 중입니다."
    log_info "카카오톡 알림 설정은 KAKAO_NOTIFICATION_SETUP.md를 참고하세요."
    echo ""
    read -p "계속하려면 Enter를 누르세요..."
}

# 전체 실행
run_all() {
    log_info "전체 Phase 순차 실행을 시작합니다..."
    echo ""
    
    log_warning "⚠️  주의: Phase 2~5는 현재 구현 대기 중입니다."
    log_info "Phase 1만 자동으로 실행됩니다."
    echo ""
    
    read -p "$(echo -e ${YELLOW}계속하시겠습니까? (y/N): ${NC})" -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_phase1
        echo ""
        log_info "Phase 1 완료. Phase 2~5는 수동으로 진행하세요."
    else
        log_info "취소되었습니다."
    fi
}

# 메뉴 선택
handle_choice() {
    local choice=$1
    
    case $choice in
        1)
            run_phase1
            ;;
        2)
            run_phase2
            ;;
        3)
            run_phase3
            ;;
        4)
            run_phase4
            ;;
        5)
            run_phase5
            ;;
        [Aa])
            run_all
            ;;
        [Qq])
            log_info "종료합니다."
            exit 0
            ;;
        *)
            log_error "잘못된 선택입니다. 다시 시도하세요."
            ;;
    esac
}

# 메인 루프
main() {
    print_banner
    
    while true; do
        show_phases
        read -p "$(echo -e ${CYAN}선택하세요 [1-5, A, Q]: ${NC})" choice
        echo ""
        
        handle_choice "$choice"
        
        echo ""
        read -p "$(echo -e ${YELLOW}다른 작업을 수행하시겠습니까? (y/N): ${NC})" -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_success "모든 작업이 완료되었습니다!"
            echo ""
            log_info "다음 단계:"
            log_info "1. Supabase Dashboard에서 테이블 확인"
            log_info "2. .env.local 파일 확인"
            log_info "3. public/js/supabase-config.js 확인"
            log_info "4. 지원서 폼 UI 업데이트 (수동)"
            log_info "5. 관리자 페이지 업데이트 (수동)"
            echo ""
            break
        fi
        
        clear
        print_banner
    done
}

# 스크립트 시작
main "$@"
