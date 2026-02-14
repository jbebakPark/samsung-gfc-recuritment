#!/bin/bash

###############################################################################
# Image WebP Conversion Script
# Version: 1.0.0
# Last Updated: 2026-02-14
#
# 이미지 WebP 자동 변환 시스템
# - PNG/JPG/JPEG 이미지를 WebP로 변환
# - 원본 파일 보존
# - 파일 크기 비교 및 통계
# - HTML에서 <picture> 태그로 자동 전환 지원
###############################################################################

set -e  # 에러 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 루트 디렉토리
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 설정
IMAGE_DIR="public/images"
QUALITY=85  # WebP 품질 (0-100, 기본: 85)
BACKUP_DIR="backups/images-original"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Image WebP Conversion System${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

###############################################################################
# 1. 환경 체크
###############################################################################
echo -e "${YELLOW}🔍 Step 1: Checking dependencies...${NC}"

# cwebp 설치 확인 (WebP 변환 도구)
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}❌ cwebp not found. Installing...${NC}"
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y webp
    # macOS
    elif command -v brew &> /dev/null; then
        brew install webp
    else
        echo -e "${RED}❌ Cannot install webp. Please install manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ cwebp is available${NC}"
echo ""

###############################################################################
# 2. 백업 디렉토리 생성
###############################################################################
echo -e "${YELLOW}🔍 Step 2: Creating backup directory...${NC}"

if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo -e "${GREEN}✅ Created: $BACKUP_DIR${NC}"
else
    echo -e "${GREEN}✅ Backup directory exists${NC}"
fi
echo ""

###############################################################################
# 3. 이미지 파일 검색
###############################################################################
echo -e "${YELLOW}🔍 Step 3: Finding images to convert...${NC}"

# PNG, JPG, JPEG 파일 찾기
IMAGE_FILES=$(find "$IMAGE_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) 2>/dev/null)
IMAGE_COUNT=$(echo "$IMAGE_FILES" | grep -c "." || echo "0")

if [ "$IMAGE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No images found to convert${NC}"
    exit 0
fi

echo -e "${GREEN}✅ Found $IMAGE_COUNT images${NC}"
echo ""

###############################################################################
# 4. WebP 변환
###############################################################################
echo -e "${YELLOW}🔍 Step 4: Converting images to WebP...${NC}"

CONVERTED=0
SKIPPED=0
FAILED=0
TOTAL_ORIGINAL_SIZE=0
TOTAL_WEBP_SIZE=0

while IFS= read -r image_file; do
    if [ -z "$image_file" ]; then
        continue
    fi
    
    # 파일 정보
    filename=$(basename "$image_file")
    dirname=$(dirname "$image_file")
    name="${filename%.*}"
    ext="${filename##*.}"
    
    # WebP 출력 경로
    webp_file="$dirname/$name.webp"
    
    # 이미 WebP가 존재하면 건너뛰기
    if [ -f "$webp_file" ]; then
        echo -e "  ${YELLOW}⏭️  Skipped: $filename (already exists)${NC}"
        ((SKIPPED++))
        continue
    fi
    
    # 원본 파일 크기
    original_size=$(stat -f%z "$image_file" 2>/dev/null || stat -c%s "$image_file" 2>/dev/null)
    TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + original_size))
    
    # WebP 변환
    echo -e "  🔄 Converting: $filename"
    if cwebp -q $QUALITY "$image_file" -o "$webp_file" > /dev/null 2>&1; then
        webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
        TOTAL_WEBP_SIZE=$((TOTAL_WEBP_SIZE + webp_size))
        
        # 크기 비교
        saved=$((original_size - webp_size))
        saved_percent=$(awk "BEGIN {printf \"%.1f\", ($saved * 100.0 / $original_size)}")
        
        echo -e "  ${GREEN}✅ $filename → $name.webp${NC}"
        echo -e "     Original: $(numfmt --to=iec-i --suffix=B $original_size) → WebP: $(numfmt --to=iec-i --suffix=B $webp_size) (${saved_percent}% smaller)"
        
        ((CONVERTED++))
    else
        echo -e "  ${RED}❌ Failed: $filename${NC}"
        ((FAILED++))
    fi
    
done <<< "$IMAGE_FILES"

echo ""

###############################################################################
# 5. 통계 출력
###############################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Conversion Statistics${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Converted: $CONVERTED${NC}"
echo -e "${YELLOW}⏭️  Skipped: $SKIPPED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ "$CONVERTED" -gt 0 ]; then
    total_saved=$((TOTAL_ORIGINAL_SIZE - TOTAL_WEBP_SIZE))
    total_saved_percent=$(awk "BEGIN {printf \"%.1f\", ($total_saved * 100.0 / $TOTAL_ORIGINAL_SIZE)}")
    
    echo -e "${GREEN}💾 Total Original Size: $(numfmt --to=iec-i --suffix=B $TOTAL_ORIGINAL_SIZE)${NC}"
    echo -e "${GREEN}💾 Total WebP Size: $(numfmt --to=iec-i --suffix=B $TOTAL_WEBP_SIZE)${NC}"
    echo -e "${GREEN}🎉 Total Saved: $(numfmt --to=iec-i --suffix=B $total_saved) (${total_saved_percent}%)${NC}"
fi

echo ""

###############################################################################
# 6. HTML 사용 가이드
###############################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📝 How to Use WebP Images in HTML${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Replace this:${NC}"
echo -e '  <img src="images/example.png" alt="Example">'
echo ""
echo -e "${GREEN}With this (WebP with fallback):${NC}"
echo -e '  <picture>'
echo -e '    <source srcset="images/example.webp" type="image/webp">'
echo -e '    <img src="images/example.png" alt="Example">'
echo -e '  </picture>'
echo ""

###############################################################################
# 7. 완료
###############################################################################
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Image WebP conversion completed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
