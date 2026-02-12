#!/bin/bash
# now-execute.sh
# Samsung Life GFC Recruitment Site - Firebase Deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${CYAN}=====================================================================${NC}"
echo -e "${CYAN}                                                                     ${NC}"
echo -e "${CYAN}     ${MAGENTA}Samsung Life GFC Recruitment Site Deployment Guide${CYAN}       ${NC}"
echo -e "${CYAN}                                                                     ${NC}"
echo -e "${CYAN}=====================================================================${NC}"
echo ""

# Current Status Check
echo -e "${YELLOW}Current Status Check${NC}"
echo "---------------------------------------------------------------------"

# Git Status
if [ -d ".git" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    COMMITS_AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    echo -e "${GREEN}[OK] Git Repository: main branch${NC}"
    if [ "$COMMITS_AHEAD" -gt 0 ]; then
        echo -e "${YELLOW}   [!] Unpushed commits: ${COMMITS_AHEAD}${NC}"
    else
        echo -e "${GREEN}   [OK] All changes pushed${NC}"
    fi
else
    echo -e "${RED}[X] Not a Git repository${NC}"
fi

# Firebase Config
if [ -f "firebase.json" ]; then
    echo -e "${GREEN}[OK] Firebase configuration verified${NC}"
else
    echo -e "${RED}[X] firebase.json not found${NC}"
    exit 1
fi

# Deployment Script
if [ -f "scripts/5-deploy-now.sh" ]; then
    echo -e "${GREEN}[OK] Deployment script ready${NC}"
else
    echo -e "${RED}[X] Deployment script not found${NC}"
    exit 1
fi

echo "---------------------------------------------------------------------"
echo ""

# Execution Methods
echo -e "${CYAN}Execution Methods${NC}"
echo "---------------------------------------------------------------------"
echo ""
echo -e "${YELLOW}Method 1: Quick Deploy (Recommended)${NC}"
echo -e "   ${CYAN}./scripts/5-deploy-now.sh${NC}"
echo -e "   ${BLUE}-> Takes 1-2 minutes${NC}"
echo ""
echo -e "${YELLOW}Method 2: Integrated Menu${NC}"
echo -e "   ${CYAN}./scripts/4-master-automation.sh${NC}"
echo -e "   ${BLUE}-> Select option 5${NC}"
echo ""
echo -e "${YELLOW}Method 3: Direct Command${NC}"
echo -e "   ${CYAN}npx firebase deploy --only hosting${NC}"
echo ""
echo "---------------------------------------------------------------------"
echo ""

# Execute Now Option
echo -e "${MAGENTA}Ready to deploy now?${NC}"
echo ""
read -p "Press Enter to start deployment (Cancel: Ctrl+C): " -r
echo ""

echo -e "${GREEN}Starting deployment script...${NC}"
echo ""
sleep 1

# Execute Deployment Script
./scripts/5-deploy-now.sh

echo ""
echo -e "${GREEN}=====================================================================${NC}"
echo -e "${GREEN}                                                                     ${NC}"
echo -e "${GREEN}                    ${YELLOW}All Tasks Complete!${GREEN}                            ${NC}"
echo -e "${GREEN}                                                                     ${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo ""
echo -e "${CYAN}Reference Documents:${NC}"
echo -e "   * ${YELLOW}EXECUTE_NOW.txt${NC} - Quick Start Guide"
echo -e "   * ${YELLOW}DEPLOYMENT_COMPARISON_AND_GUIDE.md${NC} - Detailed Deployment Guide"
echo -e "   * ${YELLOW}NEXT_STEPS_DETAILED.md${NC} - Next Phase Tasks"
echo ""
echo -e "${CYAN}Contact:${NC}"
echo -e "   * Email: jb2park@naver.com"
echo -e "   * Phone: 010-5137-2327"
echo -e "   * KakaoTalk: https://open.kakao.com/o/svmDyNUg"
echo ""
