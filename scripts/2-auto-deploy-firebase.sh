#!/bin/bash
# 2-auto-deploy-firebase.sh
# 설명: Firebase 자동 배포 설정 스크립트 (GitHub Actions 워크플로우 생성)
# 사용법: chmod +x 2-auto-deploy-firebase.sh && ./2-auto-deploy-firebase.sh

set -e

echo "🔥 Firebase 자동 배포 설정"
echo "================================"

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 프로젝트 정보
PROJECT_NAME="samsung-gfc"

# 1. Git 저장소 확인
echo -e "\n${YELLOW}[1/6] Git 저장소 확인...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git 저장소가 아닙니다${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git 저장소 확인됨${NC}"

# 2. Firebase CLI 확인
echo -e "\n${YELLOW}[2/6] Firebase CLI 확인...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI가 설치되지 않았습니다${NC}"
    echo "먼저 1-setup-dev-environment.sh를 실행하세요"
    exit 1
fi
echo -e "${GREEN}✅ Firebase CLI 준비됨${NC}"

# 3. Firebase 로그인 확인
echo -e "\n${YELLOW}[3/6] Firebase 로그인 확인...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${BLUE}🔐 Firebase 로그인이 필요합니다${NC}"
    firebase login
fi
echo -e "${GREEN}✅ 로그인 완료${NC}"

# 4. CI 토큰 생성
echo -e "\n${YELLOW}[4/6] CI 토큰 생성...${NC}"
echo -e "${BLUE}이 토큰은 GitHub Actions에서 Firebase 배포에 사용됩니다${NC}"
echo ""
read -p "CI 토큰을 생성하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔑 CI 토큰 생성 중...${NC}"
    echo "브라우저가 열립니다. 로그인 후 토큰을 복사하세요."
    firebase login:ci
    echo ""
    echo -e "${GREEN}✅ 토큰이 생성되었습니다${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔔 GitHub Secrets 등록 필요!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. GitHub 저장소로 이동:"
    echo "   https://github.com/jbebakPark/samsung-gfc-recuritment"
    echo ""
    echo "2. Settings → Secrets and variables → Actions 클릭"
    echo ""
    echo "3. 'New repository secret' 클릭"
    echo ""
    echo "4. 다음 정보 입력:"
    echo "   Name: FIREBASE_TOKEN"
    echo "   Value: (위에서 생성된 토큰)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "토큰을 등록했으면 Enter를 누르세요..."
else
    echo -e "${YELLOW}⏭️  토큰 생성 건너뛰기${NC}"
fi

# 5. 워크플로우 파일 생성
echo -e "\n${YELLOW}[5/6] GitHub Actions 워크플로우 파일 생성...${NC}"
mkdir -p .github/workflows

cat > .github/workflows/firebase-deploy.yml << 'WORKFLOW_EOF'
name: Firebase Auto Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Firebase Hosting
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci || npm install
      
      - name: Install Firebase Tools
        run: npm install -g firebase-tools
      
      - name: Deploy to Firebase
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
        run: |
          if [ -z "$FIREBASE_TOKEN" ]; then
            echo "❌ FIREBASE_TOKEN이 설정되지 않았습니다."
            echo "GitHub Secrets에 FIREBASE_TOKEN을 등록하세요."
            exit 1
          fi
          
          echo "🚀 Firebase 배포 시작..."
          firebase deploy --only hosting --token "$FIREBASE_TOKEN"
          
          echo "✅ 배포 완료!"
          echo "🌐 https://samsung-gfc.web.app"
      
      - name: Deployment Summary
        if: success()
        run: |
          echo "## 🎉 배포 성공!" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Production URL**: https://samsung-gfc.web.app" >> $GITHUB_STEP_SUMMARY
          echo "- **Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Branch**: ${{ github.ref }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Timestamp**: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" >> $GITHUB_STEP_SUMMARY
WORKFLOW_EOF

echo -e "${GREEN}✅ 워크플로우 파일 생성 완료${NC}"
echo "파일 위치: .github/workflows/firebase-deploy.yml"

# 6. Git 커밋 및 Push
echo -e "\n${YELLOW}[6/6] Git 커밋 및 Push...${NC}"
git add .github/workflows/firebase-deploy.yml
if git commit -m "ci: Firebase 자동 배포 워크플로우 추가" 2>/dev/null; then
    echo -e "${GREEN}✅ 커밋 완료${NC}"
    
    read -p "지금 Push하시겠습니까? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        git push origin main
        echo -e "${GREEN}✅ Push 완료${NC}"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🚀 자동 배포가 시작됩니다!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "배포 상태 확인:"
        echo "https://github.com/jbebakPark/samsung-gfc-recuritment/actions"
        echo ""
        echo "약 2-3분 후 https://samsung-gfc.web.app 에 반영됩니다"
    fi
else
    echo -e "${YELLOW}⚠️  이미 커밋되었거나 변경사항이 없습니다${NC}"
fi

# 완료 메시지
echo -e "\n${GREEN}🎉 Firebase 자동 배포 설정 완료!${NC}\n"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "다음 단계:"
echo ""
echo "1. 이제부터 main 브랜치에 push하면 자동으로 배포됩니다"
echo "   git add . && git commit -m 'update' && git push"
echo ""
echo "2. 배포 확인:"
echo "   - 배포 상태: https://github.com/jbebakPark/samsung-gfc-recuritment/actions"
echo "   - 프로덕션: https://samsung-gfc.web.app"
echo ""
echo "3. 일상 개발 워크플로우:"
echo "   ./scripts/3-dev-workflow.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
