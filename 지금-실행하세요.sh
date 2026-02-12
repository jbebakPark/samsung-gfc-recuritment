#!/bin/bash
# 지금-실행하세요.sh
# 삼성생명 GFC 채용 사이트 Firebase 배포 실행

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║         ${MAGENTA}🚀 삼성생명 GFC 채용 사이트 배포 가이드${CYAN}           ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 현재 상태 확인
echo -e "${YELLOW}📊 현재 상태 확인${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Git 상태
if [ -d ".git" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    COMMITS_AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ Git 저장소: main 브랜치${NC}"
    if [ "$COMMITS_AHEAD" -gt 0 ]; then
        echo -e "${YELLOW}   ⚠️  푸시되지 않은 커밋: ${COMMITS_AHEAD}개${NC}"
    else
        echo -e "${GREEN}   ✅ 모든 변경사항 푸시 완료${NC}"
    fi
else
    echo -e "${RED}❌ Git 저장소가 아닙니다${NC}"
fi

# Firebase 설정
if [ -f "firebase.json" ]; then
    echo -e "${GREEN}✅ Firebase 설정 확인됨${NC}"
else
    echo -e "${RED}❌ firebase.json 파일이 없습니다${NC}"
    exit 1
fi

# 자동화 스크립트
if [ -f "scripts/5-deploy-now.sh" ]; then
    echo -e "${GREEN}✅ 배포 스크립트 준비 완료${NC}"
else
    echo -e "${RED}❌ 배포 스크립트를 찾을 수 없습니다${NC}"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 다음 단계 안내
echo -e "${CYAN}📋 실행 방법${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}방법 1: 빠른 배포 (추천)${NC}"
echo -e "   ${CYAN}./scripts/5-deploy-now.sh${NC}"
echo -e "   ${BLUE}→ 1-2분 소요${NC}"
echo ""
echo -e "${YELLOW}방법 2: 통합 메뉴${NC}"
echo -e "   ${CYAN}./scripts/4-master-automation.sh${NC}"
echo -e "   ${BLUE}→ 메뉴에서 5번 선택${NC}"
echo ""
echo -e "${YELLOW}방법 3: 직접 명령${NC}"
echo -e "   ${CYAN}npx firebase deploy --only hosting${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 바로 실행 옵션
echo -e "${MAGENTA}💡 지금 바로 배포하시겠습니까?${NC}"
echo ""
read -p "🚀 Enter를 누르면 배포가 시작됩니다 (취소: Ctrl+C): " -r
echo ""

echo -e "${GREEN}✨ 배포 스크립트를 실행합니다...${NC}"
echo ""
sleep 1

# 배포 스크립트 실행
./scripts/5-deploy-now.sh

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║                    ${YELLOW}✅ 모든 작업 완료!${GREEN}                         ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📚 참고 문서:${NC}"
echo -e "   • ${YELLOW}실행방법_QUICKSTART.md${NC} - 빠른 시작 가이드"
echo -e "   • ${YELLOW}DEPLOYMENT_COMPARISON_AND_GUIDE.md${NC} - 배포 상세 가이드"
echo -e "   • ${YELLOW}NEXT_STEPS_DETAILED.md${NC} - 다음 단계 작업"
echo ""
echo -e "${CYAN}📞 문의:${NC}"
echo -e "   • 이메일: jb2park@naver.com"
echo -e "   • 전화: 010-5137-2327"
echo -e "   • 카카오톡: https://open.kakao.com/o/svmDyNUg"
echo ""
