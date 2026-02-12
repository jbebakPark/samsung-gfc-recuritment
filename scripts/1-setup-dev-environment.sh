#!/bin/bash
# 1-setup-dev-environment.sh
# 설명: 개발 환경 자동 설정 스크립트
# 사용법: chmod +x 1-setup-dev-environment.sh && ./1-setup-dev-environment.sh

set -e  # 에러 발생 시 중단

echo "🚀 삼성생명 GFC 개발 환경 설정"
echo "=================================="

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Node.js 설치 확인
echo -e "\n${YELLOW}[1/8] Node.js 설치 확인...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되지 않았습니다.${NC}"
    echo "다음 링크에서 설치하세요: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} 설치됨${NC}"

# 2. Git 설치 확인
echo -e "\n${YELLOW}[2/8] Git 설치 확인...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git이 설치되지 않았습니다.${NC}"
    echo "다음 링크에서 설치하세요: https://git-scm.com/"
    exit 1
fi
GIT_VERSION=$(git --version)
echo -e "${GREEN}✅ ${GIT_VERSION} 설치됨${NC}"

# 3. 저장소 확인 (이미 존재하면 스킵)
echo -e "\n${YELLOW}[3/8] 저장소 확인...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git 저장소가 아닙니다${NC}"
    echo "이 스크립트는 프로젝트 루트 디렉토리에서 실행해야 합니다"
    exit 1
fi
echo -e "${GREEN}✅ Git 저장소 확인됨${NC}"
git pull origin main 2>/dev/null || echo "리모트 업데이트 건너뛰기"

# 4. npm 패키지 설치
echo -e "\n${YELLOW}[4/8] npm 패키지 설치...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ 패키지 설치 완료${NC}"
else
    echo -e "${YELLOW}⚠️  package.json이 없습니다${NC}"
fi

# 5. Firebase CLI 설치
echo -e "\n${YELLOW}[5/8] Firebase CLI 설치...${NC}"
if ! command -v firebase &> /dev/null; then
    npm install -g firebase-tools
    echo -e "${GREEN}✅ Firebase CLI 설치 완료${NC}"
else
    FIREBASE_VERSION=$(firebase --version)
    echo -e "${GREEN}✅ Firebase CLI ${FIREBASE_VERSION} 이미 설치됨${NC}"
fi

# 6. Firebase 로그인 확인
echo -e "\n${YELLOW}[6/8] Firebase 로그인 확인...${NC}"
if firebase projects:list &> /dev/null; then
    echo -e "${GREEN}✅ Firebase 로그인됨${NC}"
else
    echo -e "${YELLOW}⚠️  Firebase 로그인이 필요합니다${NC}"
    echo "다음 명령을 실행하세요: firebase login"
fi

# 7. 디렉토리 구조 확인
echo -e "\n${YELLOW}[7/8] 디렉토리 구조 확인...${NC}"
REQUIRED_DIRS=("public" "public/css" "public/js" "public/admin" "scripts")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ ${dir}${NC}"
    else
        echo -e "${RED}❌ ${dir} 없음${NC}"
    fi
done

# 8. 환경 정보 출력
echo -e "\n${YELLOW}[8/8] 환경 정보${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Node.js: ${NODE_VERSION}"
echo "npm: $(npm -v)"
echo "Git: ${GIT_VERSION}"
echo "Firebase CLI: $(firebase --version 2>/dev/null || echo '미설치')"
echo "작업 디렉토리: $(pwd)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 완료 메시지
echo -e "\n${GREEN}🎉 개발 환경 설정 완료!${NC}\n"
echo "다음 단계:"
echo "1. Firebase 로그인: firebase login"
echo "2. 로컬 서버 시작: npm run serve"
echo "3. Firebase 배포: npm run deploy"
echo "4. 자동화 스크립트: ./scripts/2-auto-deploy-firebase.sh"
echo ""
echo "📖 자세한 내용은 README.md를 참조하세요"
