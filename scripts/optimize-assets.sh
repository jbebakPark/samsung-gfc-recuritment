#!/bin/bash

# ============================================
# 🚀 PC 및 모바일 최적화 자동화 스크립트
# ============================================
# 작성일: 2026-02-14
# 작성자: GenSpark AI Developer
# 목적: CSS/JS 압축, 레이지 로딩, 성능 최적화
# ============================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 작업 디렉터리 설정
WEBAPP_DIR="/home/user/webapp"
PUBLIC_DIR="$WEBAPP_DIR/public"
OPTIMIZED_DIR="$PUBLIC_DIR/optimized"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 PC 및 모바일 최적화 작업 시작${NC}"
echo -e "${BLUE}============================================${NC}"

# 최적화 디렉터리 생성
echo -e "${YELLOW}📁 최적화 디렉터리 생성 중...${NC}"
mkdir -p "$OPTIMIZED_DIR/css"
mkdir -p "$OPTIMIZED_DIR/js"

# ============================================
# Phase 1: CSS 압축 및 최적화
# ============================================
echo -e "\n${BLUE}[Phase 1] CSS 압축 및 최적화${NC}"

# 메인 CSS 파일들만 압축 (중복 제거)
MAIN_CSS_FILES=(
    "style.css"
    "mobile-final-fix.css"
    "mobile-menu-fix.css"
    "official-form-v31.0.css"
    "performance.css"
    "error-handler.css"
)

CSS_TOTAL_ORIGINAL=0
CSS_TOTAL_OPTIMIZED=0

for css_file in "${MAIN_CSS_FILES[@]}"; do
    if [ -f "$PUBLIC_DIR/css/$css_file" ]; then
        echo -e "${YELLOW}  ⚙️  압축 중: $css_file${NC}"
        
        # 원본 파일 크기
        ORIGINAL_SIZE=$(stat -f%z "$PUBLIC_DIR/css/$css_file" 2>/dev/null || stat -c%s "$PUBLIC_DIR/css/$css_file")
        CSS_TOTAL_ORIGINAL=$((CSS_TOTAL_ORIGINAL + ORIGINAL_SIZE))
        
        # CSS 압축 (주석 제거, 공백 제거, 줄바꿈 제거)
        sed 's/\/\*[^*]*\*\///g' "$PUBLIC_DIR/css/$css_file" | \
        tr -d '\n' | \
        sed 's/  */ /g' | \
        sed 's/ *{ */{/g' | \
        sed 's/ *} */}/g' | \
        sed 's/ *: */:/g' | \
        sed 's/ *; */;/g' | \
        sed 's/ *, */,/g' > "$OPTIMIZED_DIR/css/$css_file"
        
        # 압축 후 크기
        OPTIMIZED_SIZE=$(stat -f%z "$OPTIMIZED_DIR/css/$css_file" 2>/dev/null || stat -c%s "$OPTIMIZED_DIR/css/$css_file")
        CSS_TOTAL_OPTIMIZED=$((CSS_TOTAL_OPTIMIZED + OPTIMIZED_SIZE))
        
        REDUCTION=$(( (ORIGINAL_SIZE - OPTIMIZED_SIZE) * 100 / ORIGINAL_SIZE ))
        echo -e "${GREEN}    ✅ 완료: $(numfmt --to=iec $ORIGINAL_SIZE) → $(numfmt --to=iec $OPTIMIZED_SIZE) (${REDUCTION}% 감소)${NC}"
    fi
done

CSS_REDUCTION=$(( (CSS_TOTAL_ORIGINAL - CSS_TOTAL_OPTIMIZED) * 100 / CSS_TOTAL_ORIGINAL ))
echo -e "${GREEN}✅ CSS 총 압축률: ${CSS_REDUCTION}%${NC}"
echo -e "${GREEN}   원본: $(numfmt --to=iec $CSS_TOTAL_ORIGINAL) → 압축: $(numfmt --to=iec $CSS_TOTAL_OPTIMIZED)${NC}"

# ============================================
# Phase 2: JavaScript 압축 및 최적화
# ============================================
echo -e "\n${BLUE}[Phase 2] JavaScript 압축 및 최적화${NC}"

# 메인 JS 파일들만 압축
MAIN_JS_FILES=(
    "main.js"
    "mobile-interactive.js"
    "form-enhancements.js"
    "official-form-v31.0.js"
    "env-loader.js"
    "firebase-config.js"
    "error-handler.js"
    "performance-optimization.js"
)

JS_TOTAL_ORIGINAL=0
JS_TOTAL_OPTIMIZED=0

for js_file in "${MAIN_JS_FILES[@]}"; do
    if [ -f "$PUBLIC_DIR/js/$js_file" ]; then
        echo -e "${YELLOW}  ⚙️  압축 중: $js_file${NC}"
        
        # 원본 파일 크기
        ORIGINAL_SIZE=$(stat -f%z "$PUBLIC_DIR/js/$js_file" 2>/dev/null || stat -c%s "$PUBLIC_DIR/js/$js_file")
        JS_TOTAL_ORIGINAL=$((JS_TOTAL_ORIGINAL + ORIGINAL_SIZE))
        
        # JS 압축 (주석 제거, 공백 최소화)
        sed 's|//.*$||g' "$PUBLIC_DIR/js/$js_file" | \
        sed 's|/\*[^*]*\*/||g' | \
        sed 's/^[[:space:]]*//g' | \
        sed '/^$/d' | \
        tr '\n' ' ' | \
        sed 's/  */ /g' > "$OPTIMIZED_DIR/js/$js_file"
        
        # 압축 후 크기
        OPTIMIZED_SIZE=$(stat -f%z "$OPTIMIZED_DIR/js/$js_file" 2>/dev/null || stat -c%s "$OPTIMIZED_DIR/js/$js_file")
        JS_TOTAL_OPTIMIZED=$((JS_TOTAL_OPTIMIZED + OPTIMIZED_SIZE))
        
        REDUCTION=$(( (ORIGINAL_SIZE - OPTIMIZED_SIZE) * 100 / ORIGINAL_SIZE ))
        echo -e "${GREEN}    ✅ 완료: $(numfmt --to=iec $ORIGINAL_SIZE) → $(numfmt --to=iec $OPTIMIZED_SIZE) (${REDUCTION}% 감소)${NC}"
    fi
done

JS_REDUCTION=$(( (JS_TOTAL_ORIGINAL - JS_TOTAL_OPTIMIZED) * 100 / JS_TOTAL_ORIGINAL ))
echo -e "${GREEN}✅ JavaScript 총 압축률: ${JS_REDUCTION}%${NC}"
echo -e "${GREEN}   원본: $(numfmt --to=iec $JS_TOTAL_ORIGINAL) → 압축: $(numfmt --to=iec $JS_TOTAL_OPTIMIZED)${NC}"

# ============================================
# Phase 3: 레이지 로딩 스크립트 생성
# ============================================
echo -e "\n${BLUE}[Phase 3] 레이지 로딩 스크립트 생성${NC}"

cat > "$OPTIMIZED_DIR/js/lazy-loading.min.js" << 'EOF'
(function(){const lazyImages=document.querySelectorAll('img[data-src]');const imageObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){const img=entry.target;img.src=img.dataset.src;img.classList.add('loaded');observer.unobserve(img);}});},{rootMargin:'50px'});lazyImages.forEach(img=>imageObserver.observe(img));})();
EOF

echo -e "${GREEN}✅ 레이지 로딩 스크립트 생성 완료${NC}"

# ============================================
# Phase 4: Critical CSS 추출
# ============================================
echo -e "\n${BLUE}[Phase 4] Critical CSS 추출${NC}"

cat > "$OPTIMIZED_DIR/css/critical.min.css" << 'EOF'
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans KR',sans-serif;line-height:1.6;color:#333;background:#fff}.header{position:fixed;top:0;width:100%;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:1000}.navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#034EA2 0%,#0066CC 100%);color:#fff}@media(max-width:768px){.navbar{padding:0.5rem 1rem}.hero{min-height:80vh}}
EOF

echo -e "${GREEN}✅ Critical CSS 추출 완료${NC}"

# ============================================
# 최종 보고서
# ============================================
echo -e "\n${BLUE}============================================${NC}"
echo -e "${GREEN}✅ 최적화 작업 완료!${NC}"
echo -e "${BLUE}============================================${NC}"

TOTAL_ORIGINAL=$((CSS_TOTAL_ORIGINAL + JS_TOTAL_ORIGINAL))
TOTAL_OPTIMIZED=$((CSS_TOTAL_OPTIMIZED + JS_TOTAL_OPTIMIZED))
TOTAL_REDUCTION=$(( (TOTAL_ORIGINAL - TOTAL_OPTIMIZED) * 100 / TOTAL_ORIGINAL ))

echo -e "\n📊 최적화 결과 요약:"
echo -e "  CSS: $(numfmt --to=iec $CSS_TOTAL_ORIGINAL) → $(numfmt --to=iec $CSS_TOTAL_OPTIMIZED) (${CSS_REDUCTION}% ↓)"
echo -e "  JS:  $(numfmt --to=iec $JS_TOTAL_ORIGINAL) → $(numfmt --to=iec $JS_TOTAL_OPTIMIZED) (${JS_REDUCTION}% ↓)"
echo -e "  ${GREEN}총합: $(numfmt --to=iec $TOTAL_ORIGINAL) → $(numfmt --to=iec $TOTAL_OPTIMIZED) (${TOTAL_REDUCTION}% ↓)${NC}"

echo -e "\n📁 최적화 파일 위치: $OPTIMIZED_DIR"
echo -e "\n${YELLOW}⚠️  다음 단계:${NC}"
echo -e "  1. index.html에서 CSS/JS 파일 경로를 optimized/ 디렉터리로 변경"
echo -e "  2. Critical CSS를 <head>에 인라인 삽입"
echo -e "  3. 레이지 로딩 스크립트 추가"
echo -e "  4. 변경사항 커밋 및 배포"

echo -e "\n${BLUE}============================================${NC}"
