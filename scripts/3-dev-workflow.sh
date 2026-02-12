#!/bin/bash
# 3-dev-workflow.sh
# 설명: 일상 개발 워크플로우 자동화 (코드 수정 → 테스트 → 커밋 → Push → 배포)
# 사용법: chmod +x 3-dev-workflow.sh && ./3-dev-workflow.sh

set -e

echo "⚡ 삼성생명 GFC 개발 워크플로우"
echo "================================"

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Git 저장소 확인
echo -e "\n${YELLOW}[1/7] Git 상태 확인...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git 저장소가 아닙니다${NC}"
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo "현재 브랜치: ${CURRENT_BRANCH}"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}⚠️  main 브랜치가 아닙니다${NC}"
    read -p "main 브랜치로 전환하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
        echo -e "${GREEN}✅ main 브랜치로 전환됨${NC}"
    fi
fi

# 2. 변경 파일 확인
echo -e "\n${YELLOW}[2/7] 변경 파일 확인...${NC}"
CHANGED_FILES=$(git status --short)
if [ -z "$CHANGED_FILES" ]; then
    echo -e "${GREEN}✅ 변경 사항 없음${NC}"
    echo "코드를 수정한 후 다시 실행하세요"
    exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "변경된 파일:"
echo "$CHANGED_FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 3. 로컬 테스트 서버 (선택)
echo -e "\n${YELLOW}[3/7] 로컬 테스트 (선택)...${NC}"
read -p "로컬 서버를 실행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "http://localhost:8000 에서 테스트 중..."
    echo "테스트가 끝나면 Ctrl+C로 종료하세요"
    
    # 기존 서버 종료
    pkill -f "http.server" 2>/dev/null || true
    pkill -f "http-server" 2>/dev/null || true
    
    # 서버 시작
    if command -v python3 &> /dev/null; then
        cd public
        python3 -m http.server 8000
        cd ..
    else
        npx http-server public -p 8000
    fi
fi

# 4. 코드 검사 (선택)
echo -e "\n${YELLOW}[4/7] 코드 검사 (선택)...${NC}"
read -p "코드 검사를 실행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "package.json" ] && grep -q "\"lint\"" package.json; then
        npm run lint || echo "lint 통과하지 못했지만 계속 진행합니다"
    else
        echo "ESLint 설정 없음"
    fi
fi

# 5. Git 스테이징
echo -e "\n${YELLOW}[5/7] 변경 사항 스테이징...${NC}"
git add .
echo -e "${GREEN}✅ 스테이징 완료${NC}"

# 6. 커밋 메시지 입력
echo -e "\n${YELLOW}[6/7] 커밋 메시지 입력...${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "커밋 유형 선택:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1) feat      - 새로운 기능 추가"
echo "  2) fix       - 버그 수정"
echo "  3) docs      - 문서 수정"
echo "  4) style     - 스타일 변경 (코드 포맷, 세미콜론 등)"
echo "  5) refactor  - 코드 리팩토링"
echo "  6) perf      - 성능 개선"
echo "  7) test      - 테스트 추가/수정"
echo "  8) build     - 빌드 시스템 수정"
echo "  9) ci        - CI 설정 수정"
echo "  10) chore    - 기타 변경사항"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "유형 선택 (1-10): " COMMIT_TYPE

case $COMMIT_TYPE in
    1) TYPE="feat" ;;
    2) TYPE="fix" ;;
    3) TYPE="docs" ;;
    4) TYPE="style" ;;
    5) TYPE="refactor" ;;
    6) TYPE="perf" ;;
    7) TYPE="test" ;;
    8) TYPE="build" ;;
    9) TYPE="ci" ;;
    10) TYPE="chore" ;;
    *) TYPE="chore"; echo "기본값 'chore' 사용" ;;
esac

echo ""
read -p "커밋 메시지 (간단명료하게): " COMMIT_MSG
FULL_COMMIT_MSG="${TYPE}: ${COMMIT_MSG}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "커밋 메시지: ${FULL_COMMIT_MSG}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "이대로 커밋하시겠습니까? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "취소되었습니다"
    exit 0
fi

git commit -m "$FULL_COMMIT_MSG"
echo -e "${GREEN}✅ 커밋 완료: ${FULL_COMMIT_MSG}${NC}"

# 7. Push 및 자동 배포
echo -e "\n${YELLOW}[7/7] GitHub Push...${NC}"
read -p "Push하시겠습니까? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "🚀 Push 시작..."
    git push origin main
    echo -e "${GREEN}✅ Push 완료${NC}"
    
    # GitHub Actions URL
    REPO_URL="https://github.com/jbebakPark/samsung-gfc-recuritment"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 워크플로우 완료!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ 로컬 작업: 완료"
    echo "✅ Git 커밋: ${FULL_COMMIT_MSG}"
    echo "✅ GitHub Push: 완료"
    echo "🚀 자동 배포: 시작됨 (2-3분 소요)"
    echo ""
    echo "확인 링크:"
    echo "  - 배포 상태: ${REPO_URL}/actions"
    echo "  - 프로덕션: https://samsung-gfc.web.app"
    echo "  - 관리자: https://samsung-gfc.web.app/admin/"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    read -p "GitHub Actions 페이지를 여시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # OS별 브라우저 열기
        if command -v open &> /dev/null; then
            # macOS
            open "${REPO_URL}/actions"
        elif command -v xdg-open &> /dev/null; then
            # Linux
            xdg-open "${REPO_URL}/actions"
        elif command -v start &> /dev/null; then
            # Windows Git Bash
            start "${REPO_URL}/actions"
        else
            echo "브라우저를 수동으로 열어주세요:"
            echo "${REPO_URL}/actions"
        fi
    fi
else
    echo -e "${YELLOW}⏭️  Push 건너뛰기${NC}"
    echo "나중에 수동으로 Push하려면: git push origin main"
fi

echo ""
echo -e "${GREEN}🎉 개발 워크플로우 완료!${NC}"
