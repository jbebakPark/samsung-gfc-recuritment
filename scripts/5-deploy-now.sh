#!/bin/bash
# 5-deploy-now.sh
# 설명: 즉시 Firebase 배포 실행 스크립트
# 사용법: chmod +x 5-deploy-now.sh && ./5-deploy-now.sh

set -e

echo "🚀 Firebase 즉시 배포 스크립트"
echo "================================"

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 프로젝트 정보
PROJECT_ID="samsung-gfc"
DEPLOY_URL="https://samsung-gfc.web.app"

# 1. 현재 디렉토리 확인
echo -e "\n${YELLOW}[1/6] 현재 디렉토리 확인...${NC}"
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}❌ firebase.json을 찾을 수 없습니다${NC}"
    echo "프로젝트 루트 디렉토리에서 실행하세요"
    exit 1
fi
echo -e "${GREEN}✅ Firebase 프로젝트 확인됨${NC}"

# 2. Firebase CLI 확인
echo -e "\n${YELLOW}[2/6] Firebase CLI 확인...${NC}"
if ! command -v firebase &> /dev/null && ! npx firebase --version &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI가 설치되지 않았습니다${NC}"
    echo "설치 중..."
    npm install firebase-tools --save-dev
fi
FIREBASE_VERSION=$(npx firebase --version 2>/dev/null || firebase --version)
echo -e "${GREEN}✅ Firebase CLI ${FIREBASE_VERSION}${NC}"

# 3. Firebase 로그인 확인
echo -e "\n${YELLOW}[3/6] Firebase 로그인 확인...${NC}"
if ! npx firebase projects:list &> /dev/null && ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Firebase 로그인이 필요합니다${NC}"
    echo -e "${CYAN}브라우저가 열리면 Google 계정으로 로그인하세요${NC}"
    npx firebase login || firebase login
fi
echo -e "${GREEN}✅ 로그인 완료${NC}"

# 4. 배포 전 확인
echo -e "\n${YELLOW}[4/6] 배포 전 확인...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "프로젝트 ID: ${PROJECT_ID}"
echo "배포 URL: ${DEPLOY_URL}"
echo "배포 디렉토리: public/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "배포를 진행하시겠습니까? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "배포가 취소되었습니다"
    exit 0
fi

# 5. Firebase 배포 실행
echo -e "\n${YELLOW}[5/6] Firebase 배포 실행 중...${NC}"
echo -e "${BLUE}이 작업은 1-2분 소요됩니다...${NC}"
echo ""

if npx firebase deploy --only hosting 2>/dev/null || firebase deploy --only hosting; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ 배포 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ 배포 실패${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi

# 6. 배포 결과 확인
echo -e "\n${YELLOW}[6/6] 배포 결과${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "🌐 프로덕션 URL: ${CYAN}${DEPLOY_URL}${NC}"
echo -e "📱 관리자 페이지: ${CYAN}${DEPLOY_URL}/admin/${NC}"
echo -e "📊 Firebase Console: ${CYAN}https://console.firebase.google.com/project/${PROJECT_ID}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 7. 배포 후 캐시 정리 안내
echo ""
echo -e "${YELLOW}⚠️  중요: 브라우저 캐시 정리${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "변경 사항이 보이지 않으면:"
echo "1. Ctrl + Shift + R (Windows/Linux)"
echo "2. Cmd + Shift + R (macOS)"
echo "3. 브라우저 시크릿 모드로 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 8. 사이트 열기 (선택)
echo ""
read -p "배포된 사이트를 지금 여시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "${DEPLOY_URL}"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "${DEPLOY_URL}"
    elif command -v start &> /dev/null; then
        start "${DEPLOY_URL}"
    else
        echo "브라우저를 수동으로 열어주세요: ${DEPLOY_URL}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 배포 프로세스 완료!${NC}"
