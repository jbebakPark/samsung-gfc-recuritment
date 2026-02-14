#!/bin/bash

# ============================================
# 🔧 안전한 파일 압축 시스템
# ============================================
# 작성일: 2026-02-14
# 작성자: GenSpark AI Developer
# 목적: Terser와 cssnano를 사용한 안전한 압축
# ============================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 작업 디렉터리
WEBAPP_DIR="/home/user/webapp"
PUBLIC_DIR="$WEBAPP_DIR/public"
MINIFIED_DIR="$PUBLIC_DIR/minified"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 안전한 파일 압축 시스템${NC}"
echo -e "${BLUE}============================================${NC}"

# ============================================
# Phase 1: 필수 도구 설치 확인
# ============================================
echo -e "\n${CYAN}[Phase 1] 필수 도구 설치 확인${NC}"

# Node.js 확인
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

# npm 확인
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm이 설치되어 있지 않습니다${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"

# ============================================
# Phase 2: 압축 도구 설치
# ============================================
echo -e "\n${CYAN}[Phase 2] 압축 도구 설치${NC}"

cd "$WEBAPP_DIR"

# package.json이 없으면 생성
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}📦 package.json 생성 중...${NC}"
    npm init -y
fi

# Terser 설치 (JavaScript 압축)
echo -e "${YELLOW}📦 Terser 설치 중...${NC}"
npm install --save-dev terser

# cssnano 및 postcss 설치 (CSS 압축)
echo -e "${YELLOW}📦 cssnano 설치 중...${NC}"
npm install --save-dev postcss postcss-cli cssnano

echo -e "${GREEN}✅ 압축 도구 설치 완료${NC}"

# ============================================
# Phase 3: 디렉터리 생성
# ============================================
echo -e "\n${CYAN}[Phase 3] 디렉터리 준비${NC}"

mkdir -p "$MINIFIED_DIR/css"
mkdir -p "$MINIFIED_DIR/js"

echo -e "${GREEN}✅ 디렉터리 생성 완료${NC}"

# ============================================
# Phase 4: JavaScript 압축 (Terser)
# ============================================
echo -e "\n${CYAN}[Phase 4] JavaScript 압축 (Terser)${NC}"

# 압축할 JS 파일 목록
JS_FILES=(
    "main.js"
    "mobile-interactive.js"
    "form-enhancements.js"
    "official-form-v31.0.js"
    "env-loader.js"
    "firebase-config.js"
    "error-handler.js"
    "performance-optimization.js"
    "image-optimization.js"
)

JS_TOTAL_ORIGINAL=0
JS_TOTAL_MINIFIED=0

for js_file in "${JS_FILES[@]}"; do
    INPUT_FILE="$PUBLIC_DIR/js/$js_file"
    OUTPUT_FILE="$MINIFIED_DIR/js/${js_file%.js}.min.js"
    
    if [ -f "$INPUT_FILE" ]; then
        echo -e "${YELLOW}  ⚙️  압축 중: $js_file${NC}"
        
        # 원본 크기
        ORIGINAL_SIZE=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE")
        JS_TOTAL_ORIGINAL=$((JS_TOTAL_ORIGINAL + ORIGINAL_SIZE))
        
        # Terser로 압축
        npx terser "$INPUT_FILE" \
            --compress \
            --mangle \
            --output "$OUTPUT_FILE" \
            --source-map "filename='${js_file%.js}.min.js.map',url='${js_file%.js}.min.js.map'"
        
        # 압축 후 크기
        MINIFIED_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE")
        JS_TOTAL_MINIFIED=$((JS_TOTAL_MINIFIED + MINIFIED_SIZE))
        
        # 감소율 계산
        REDUCTION=$(( (ORIGINAL_SIZE - MINIFIED_SIZE) * 100 / ORIGINAL_SIZE ))
        
        echo -e "${GREEN}    ✅ 완료: $(numfmt --to=iec $ORIGINAL_SIZE) → $(numfmt --to=iec $MINIFIED_SIZE) (${REDUCTION}% ↓)${NC}"
    else
        echo -e "${YELLOW}    ⚠️  파일 없음: $js_file${NC}"
    fi
done

JS_REDUCTION=$(( (JS_TOTAL_ORIGINAL - JS_TOTAL_MINIFIED) * 100 / JS_TOTAL_ORIGINAL ))
echo -e "${GREEN}✅ JavaScript 총 압축률: ${JS_REDUCTION}%${NC}"
echo -e "${GREEN}   원본: $(numfmt --to=iec $JS_TOTAL_ORIGINAL) → 압축: $(numfmt --to=iec $JS_TOTAL_MINIFIED)${NC}"

# ============================================
# Phase 5: CSS 압축 (cssnano)
# ============================================
echo -e "\n${CYAN}[Phase 5] CSS 압축 (cssnano)${NC}"

# postcss 설정 파일 생성
cat > "$WEBAPP_DIR/postcss.config.js" << 'EOF'
module.exports = {
  plugins: {
    cssnano: {
      preset: ['default', {
        discardComments: {
          removeAll: true
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifyGradients: true
      }]
    }
  }
}
EOF

# 압축할 CSS 파일 목록
CSS_FILES=(
    "style.css"
    "mobile-final-fix.css"
    "mobile-menu-fix.css"
    "official-form-v31.0.css"
    "performance.css"
    "error-handler.css"
    "image-optimization.css"
)

CSS_TOTAL_ORIGINAL=0
CSS_TOTAL_MINIFIED=0

for css_file in "${CSS_FILES[@]}"; do
    INPUT_FILE="$PUBLIC_DIR/css/$css_file"
    OUTPUT_FILE="$MINIFIED_DIR/css/${css_file%.css}.min.css"
    
    if [ -f "$INPUT_FILE" ]; then
        echo -e "${YELLOW}  ⚙️  압축 중: $css_file${NC}"
        
        # 원본 크기
        ORIGINAL_SIZE=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE")
        CSS_TOTAL_ORIGINAL=$((CSS_TOTAL_ORIGINAL + ORIGINAL_SIZE))
        
        # cssnano로 압축
        npx postcss "$INPUT_FILE" --config "$WEBAPP_DIR/postcss.config.js" --output "$OUTPUT_FILE"
        
        # 압축 후 크기
        MINIFIED_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE")
        CSS_TOTAL_MINIFIED=$((CSS_TOTAL_MINIFIED + MINIFIED_SIZE))
        
        # 감소율 계산
        REDUCTION=$(( (ORIGINAL_SIZE - MINIFIED_SIZE) * 100 / ORIGINAL_SIZE ))
        
        echo -e "${GREEN}    ✅ 완료: $(numfmt --to=iec $ORIGINAL_SIZE) → $(numfmt --to=iec $MINIFIED_SIZE) (${REDUCTION}% ↓)${NC}"
    else
        echo -e "${YELLOW}    ⚠️  파일 없음: $css_file${NC}"
    fi
done

CSS_REDUCTION=$(( (CSS_TOTAL_ORIGINAL - CSS_TOTAL_MINIFIED) * 100 / CSS_TOTAL_ORIGINAL ))
echo -e "${GREEN}✅ CSS 총 압축률: ${CSS_REDUCTION}%${NC}"
echo -e "${GREEN}   원본: $(numfmt --to=iec $CSS_TOTAL_ORIGINAL) → 압축: $(numfmt --to=iec $CSS_TOTAL_MINIFIED)${NC}"

# ============================================
# Phase 6: 검증
# ============================================
echo -e "\n${CYAN}[Phase 6] 압축 파일 검증${NC}"

# JavaScript 문법 검증 (Node.js로 로드 시도)
echo -e "${YELLOW}JavaScript 문법 검증 중...${NC}"
for js_file in "$MINIFIED_DIR/js"/*.min.js; do
    if node --check "$js_file" 2>/dev/null; then
        echo -e "${GREEN}  ✅ $(basename $js_file)${NC}"
    else
        echo -e "${RED}  ❌ $(basename $js_file) - 문법 오류!${NC}"
    fi
done

# CSS 파일 존재 검증
echo -e "${YELLOW}CSS 파일 검증 중...${NC}"
for css_file in "$MINIFIED_DIR/css"/*.min.css; do
    if [ -f "$css_file" ]; then
        echo -e "${GREEN}  ✅ $(basename $css_file)${NC}"
    fi
done

# ============================================
# 최종 보고서
# ============================================
echo -e "\n${BLUE}============================================${NC}"
echo -e "${GREEN}✅ 안전한 파일 압축 완료!${NC}"
echo -e "${BLUE}============================================${NC}"

TOTAL_ORIGINAL=$((CSS_TOTAL_ORIGINAL + JS_TOTAL_ORIGINAL))
TOTAL_MINIFIED=$((CSS_TOTAL_MINIFIED + JS_TOTAL_MINIFIED))
TOTAL_REDUCTION=$(( (TOTAL_ORIGINAL - TOTAL_MINIFIED) * 100 / TOTAL_ORIGINAL ))

echo -e "\n📊 최종 압축 결과:"
echo -e "  CSS: $(numfmt --to=iec $CSS_TOTAL_ORIGINAL) → $(numfmt --to=iec $CSS_TOTAL_MINIFIED) (${CSS_REDUCTION}% ↓)"
echo -e "  JS:  $(numfmt --to=iec $JS_TOTAL_ORIGINAL) → $(numfmt --to=iec $JS_TOTAL_MINIFIED) (${JS_REDUCTION}% ↓)"
echo -e "  ${GREEN}총합: $(numfmt --to=iec $TOTAL_ORIGINAL) → $(numfmt --to=iec $TOTAL_MINIFIED) (${TOTAL_REDUCTION}% ↓)${NC}"

echo -e "\n📁 압축 파일 위치: $MINIFIED_DIR"
echo -e "\n${YELLOW}⚠️  다음 단계:${NC}"
echo -e "  1. index.html에서 파일 경로를 minified/ 디렉터리로 변경"
echo -e "  2. 캐시 버스팅을 위한 버전 번호 업데이트"
echo -e "  3. 변경사항 커밋 및 배포"

echo -e "\n${BLUE}============================================${NC}"
