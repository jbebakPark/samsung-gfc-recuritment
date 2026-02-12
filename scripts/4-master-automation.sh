#!/bin/bash
# 4-master-automation.sh
# 설명: 모든 자동화 스크립트를 통합한 마스터 스크립트
# 사용법: chmod +x 4-master-automation.sh && ./4-master-automation.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# 프로젝트 정보
REPO_URL="https://github.com/jbebakPark/samsung-gfc-recuritment"
PROD_URL="https://samsung-gfc.web.app"

# 메뉴 표시
show_menu() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  삼성생명 GFC 마스터 자동화 도구     ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${MAGENTA}▶ 초기 설정 (최초 1회)${NC}"
    echo "  1) 개발 환경 설정"
    echo "  2) Firebase 자동 배포 설정"
    echo ""
    echo -e "${MAGENTA}▶ 일상 작업${NC}"
    echo "  3) 개발 워크플로우 (코드 수정 → 배포)"
    echo "  4) 로컬 서버 시작"
    echo "  5) Firebase 수동 배포"
    echo ""
    echo -e "${MAGENTA}▶ 정보 및 관리${NC}"
    echo "  6) Git 상태 확인"
    echo "  7) 전체 시스템 점검"
    echo "  8) 최적화 보고서 보기"
    echo "  9) 프로젝트 문서 열기"
    echo ""
    echo -e "${MAGENTA}▶ 고급 작업${NC}"
    echo " 10) 전체 자동화 실행 (초기 설정부터 배포까지)"
    echo " 11) Firebase Functions 배포"
    echo " 12) 데이터베이스 백업"
    echo ""
    echo "  0) 종료"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 1. 개발 환경 설정
setup_dev() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}개발 환경 설정${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ -f "./scripts/1-setup-dev-environment.sh" ]; then
        bash ./scripts/1-setup-dev-environment.sh
    else
        echo -e "${RED}❌ 스크립트를 찾을 수 없습니다${NC}"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 2. Firebase 자동 배포 설정
setup_firebase() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Firebase 자동 배포 설정${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ -f "./scripts/2-auto-deploy-firebase.sh" ]; then
        bash ./scripts/2-auto-deploy-firebase.sh
    else
        echo -e "${RED}❌ 스크립트를 찾을 수 없습니다${NC}"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 3. 개발 워크플로우
dev_workflow() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}개발 워크플로우${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ -f "./scripts/3-dev-workflow.sh" ]; then
        bash ./scripts/3-dev-workflow.sh
    else
        echo -e "${RED}❌ 스크립트를 찾을 수 없습니다${NC}"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 4. 로컬 서버 시작
start_server() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}로컬 서버 시작${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ ! -d "public" ]; then
        echo -e "${RED}❌ public 디렉토리를 찾을 수 없습니다${NC}"
        read -p "계속하려면 Enter..."
        return 1
    fi
    
    echo "서버 시작 중..."
    echo -e "${GREEN}🌐 http://localhost:8000${NC}"
    echo ""
    echo "종료하려면 Ctrl+C를 누르세요"
    echo ""
    
    cd public
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        python -m http.server 8000
    else
        npx http-server -p 8000
    fi
    cd ..
}

# 5. Firebase 수동 배포
manual_deploy() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Firebase 수동 배포${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if ! command -v firebase &> /dev/null; then
        echo -e "${RED}❌ Firebase CLI가 설치되지 않았습니다${NC}"
        echo "먼저 '1) 개발 환경 설정'을 실행하세요"
        read -p "계속하려면 Enter..."
        return 1
    fi
    
    echo "배포 시작..."
    if firebase deploy --only hosting; then
        echo ""
        echo -e "${GREEN}✅ 배포 완료!${NC}"
        echo -e "${GREEN}🌐 ${PROD_URL}${NC}"
    else
        echo ""
        echo -e "${RED}❌ 배포 실패${NC}"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 6. Git 상태 확인
check_git() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Git 상태 확인${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Git 저장소가 아닙니다${NC}"
        read -p "계속하려면 Enter..."
        return 1
    fi
    
    echo -e "${YELLOW}현재 브랜치:${NC} $(git branch --show-current)"
    echo ""
    echo -e "${YELLOW}최근 커밋 (5개):${NC}"
    git log --oneline --graph -n 5
    echo ""
    echo -e "${YELLOW}변경된 파일:${NC}"
    if [ -z "$(git status --short)" ]; then
        echo -e "${GREEN}✅ 변경 사항 없음${NC}"
    else
        git status --short
    fi
    echo ""
    echo -e "${YELLOW}리모트 정보:${NC}"
    git remote -v
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 7. 전체 시스템 점검
system_check() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}전체 시스템 점검${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Node.js
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✅ Node.js: $(node -v)${NC}"
    else
        echo -e "${RED}❌ Node.js: 미설치${NC}"
    fi
    
    # npm
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✅ npm: v$(npm -v)${NC}"
    else
        echo -e "${RED}❌ npm: 미설치${NC}"
    fi
    
    # Git
    if command -v git &> /dev/null; then
        echo -e "${GREEN}✅ Git: $(git --version | cut -d' ' -f3)${NC}"
    else
        echo -e "${RED}❌ Git: 미설치${NC}"
    fi
    
    # Firebase CLI
    if command -v firebase &> /dev/null; then
        echo -e "${GREEN}✅ Firebase CLI: $(firebase --version)${NC}"
    else
        echo -e "${RED}❌ Firebase CLI: 미설치${NC}"
    fi
    
    # Python
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}✅ Python 3: $(python3 --version | cut -d' ' -f2)${NC}"
    else
        echo -e "${YELLOW}⚠️  Python 3: 미설치 (선택사항)${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}디렉토리 구조:${NC}"
    
    DIRS=("public" "public/css" "public/js" "public/admin" "scripts" ".git" ".github")
    for dir in "${DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✅ ${dir}${NC}"
        else
            echo -e "${RED}❌ ${dir}${NC}"
        fi
    done
    
    echo ""
    echo -e "${YELLOW}주요 파일:${NC}"
    FILES=("package.json" "firebase.json" "README.md" ".gitignore")
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ ${file}${NC}"
        else
            echo -e "${RED}❌ ${file}${NC}"
        fi
    done
    
    echo ""
    echo -e "${YELLOW}프로젝트 정보:${NC}"
    echo "작업 디렉토리: $(pwd)"
    if [ -d ".git" ]; then
        echo "Git 브랜치: $(git branch --show-current)"
        echo "최근 커밋: $(git log --oneline -n 1)"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 8. 최적화 보고서 보기
view_report() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}최적화 보고서${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    REPORTS=(
        "작업현황_비교표_및_개선사항.md"
        "PC_MOBILE_OPTIMIZATION_COMPLETE.md"
        "FINAL_SUMMARY.md"
        "AUTO_DEPLOY_COMPLETE_GUIDE.md"
    )
    
    echo "사용 가능한 보고서:"
    for i in "${!REPORTS[@]}"; do
        if [ -f "${REPORTS[$i]}" ]; then
            echo -e "${GREEN}  $((i+1))) ${REPORTS[$i]}${NC}"
        else
            echo -e "${RED}  $((i+1))) ${REPORTS[$i]} (없음)${NC}"
        fi
    done
    
    echo ""
    read -p "보고서 번호를 선택하세요 (1-${#REPORTS[@]}, 0=취소): " choice
    
    if [ "$choice" -ge 1 ] && [ "$choice" -le "${#REPORTS[@]}" ]; then
        REPORT="${REPORTS[$((choice-1))]}"
        if [ -f "$REPORT" ]; then
            clear
            echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${YELLOW}${REPORT}${NC}"
            echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            cat "$REPORT" | head -100
            echo ""
            echo "... (전체 내용은 파일을 직접 확인하세요)"
        else
            echo -e "${RED}파일을 찾을 수 없습니다${NC}"
        fi
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 9. 프로젝트 문서 열기
open_docs() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}프로젝트 문서${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo "1) README.md - 프로젝트 개요"
    echo "2) 배포 가이드 - DEPLOYMENT_GUIDE.md"
    echo "3) 데이터베이스 가이드 - DATABASE_GUIDE.md"
    echo "4) 카카오톡 알림 설정 - KAKAO_NOTIFICATION_SETUP.md"
    echo "5) GitHub 저장소 열기"
    echo "6) 프로덕션 사이트 열기"
    echo "7) Firebase Console 열기"
    echo "0) 돌아가기"
    echo ""
    read -p "선택하세요 (0-7): " choice
    
    case $choice in
        1) [ -f "README.md" ] && cat README.md | less || echo "파일 없음" ;;
        2) [ -f "DEPLOYMENT_GUIDE.md" ] && cat DEPLOYMENT_GUIDE.md | less || echo "파일 없음" ;;
        3) [ -f "DATABASE_GUIDE.md" ] && cat DATABASE_GUIDE.md | less || echo "파일 없음" ;;
        4) [ -f "KAKAO_NOTIFICATION_SETUP.md" ] && cat KAKAO_NOTIFICATION_SETUP.md | less || echo "파일 없음" ;;
        5) open_url "$REPO_URL" ;;
        6) open_url "$PROD_URL" ;;
        7) open_url "https://console.firebase.google.com/project/samsung-gfc" ;;
    esac
    
    echo ""
    read -p "계속하려면 Enter..."
}

# URL 열기 함수
open_url() {
    local url=$1
    echo "브라우저에서 여는 중: $url"
    
    if command -v open &> /dev/null; then
        open "$url"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$url"
    elif command -v start &> /dev/null; then
        start "$url"
    else
        echo "브라우저를 수동으로 열어주세요: $url"
    fi
}

# 10. 전체 자동화 실행
full_automation() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}전체 자동화 실행${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "다음 작업이 순차적으로 실행됩니다:"
    echo "  1. 개발 환경 설정"
    echo "  2. Firebase 자동 배포 설정"
    echo "  3. 시스템 점검"
    echo ""
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    echo ""
    setup_dev
    echo ""
    setup_firebase
    echo ""
    system_check
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}전체 자동화 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    read -p "계속하려면 Enter..."
}

# 11. Firebase Functions 배포
deploy_functions() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Firebase Functions 배포${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ -d "functions" ]; then
        echo "Functions 배포 중..."
        firebase deploy --only functions
    else
        echo -e "${YELLOW}⚠️  functions 디렉토리가 없습니다${NC}"
        echo "Firebase Functions를 사용하지 않는 프로젝트입니다"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 12. 데이터베이스 백업
backup_database() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}데이터베이스 백업${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo "이 기능은 Firebase Console에서 수동으로 수행해야 합니다:"
    echo ""
    echo "1. Firebase Console 접속:"
    echo "   https://console.firebase.google.com/project/samsung-gfc"
    echo ""
    echo "2. Firestore Database → 백업/복원"
    echo ""
    echo "또는 gcloud CLI를 사용하여 자동화할 수 있습니다"
    echo ""
    read -p "Firebase Console을 여시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_url "https://console.firebase.google.com/project/samsung-gfc/firestore"
    fi
    
    echo ""
    read -p "계속하려면 Enter..."
}

# 메인 루프
while true; do
    show_menu
    read -p "선택하세요 (0-12): " choice
    
    case $choice in
        1) setup_dev ;;
        2) setup_firebase ;;
        3) dev_workflow ;;
        4) start_server ;;
        5) manual_deploy ;;
        6) check_git ;;
        7) system_check ;;
        8) view_report ;;
        9) open_docs ;;
        10) full_automation ;;
        11) deploy_functions ;;
        12) backup_database ;;
        0) echo -e "${GREEN}종료합니다. 좋은 하루 되세요!${NC}"; exit 0 ;;
        *) 
            echo -e "${RED}잘못된 선택입니다${NC}"
            sleep 1
            ;;
    esac
done
