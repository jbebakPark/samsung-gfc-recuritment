#!/usr/bin/env python3
"""
Image WebP Conversion Script
Version: 1.0.0
Last Updated: 2026-02-14

이미지 WebP 자동 변환 시스템
- PNG/JPG/JPEG 이미지를 WebP로 변환
- Pillow 라이브러리 사용
- 파일 크기 비교 및 통계
- HTML에서 <picture> 태그로 자동 전환 지원
"""

import os
import sys
from pathlib import Path
from PIL import Image
import subprocess

# 색상 코드
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'

def print_header(text):
    print(f"{Colors.BLUE}{'=' * 60}{Colors.NC}")
    print(f"{Colors.BLUE}{text}{Colors.NC}")
    print(f"{Colors.BLUE}{'=' * 60}{Colors.NC}")
    print()

def print_step(step, text):
    print(f"{Colors.YELLOW}🔍 Step {step}: {text}...{Colors.NC}")

def format_size(size_bytes):
    """파일 크기를 읽기 쉬운 형태로 변환"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def check_pillow():
    """Pillow 설치 확인"""
    try:
        import PIL
        print(f"{Colors.GREEN}✅ Pillow is installed (version {PIL.__version__}){Colors.NC}")
        return True
    except ImportError:
        print(f"{Colors.RED}❌ Pillow not found. Installing...{Colors.NC}")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            print(f"{Colors.GREEN}✅ Pillow installed successfully{Colors.NC}")
            return True
        except Exception as e:
            print(f"{Colors.RED}❌ Failed to install Pillow: {e}{Colors.NC}")
            return False

def convert_to_webp(input_path, output_path, quality=85):
    """이미지를 WebP로 변환"""
    try:
        with Image.open(input_path) as img:
            # RGBA 이미지는 RGB로 변환 (WebP 호환성)
            if img.mode in ('RGBA', 'LA', 'P'):
                # 투명 배경이 있으면 흰색으로 채움
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # WebP로 저장
            img.save(output_path, 'WebP', quality=quality, method=6)
        
        return True
    except Exception as e:
        print(f"  {Colors.RED}Error: {e}{Colors.NC}")
        return False

def main():
    # 프로젝트 루트로 이동
    project_root = Path(__file__).parent.parent
    os.chdir(project_root)
    
    print_header("📦 Image WebP Conversion System")
    
    # Step 1: Pillow 확인
    print_step(1, "Checking dependencies")
    if not check_pillow():
        sys.exit(1)
    print()
    
    # Step 2: 이미지 디렉토리 확인
    print_step(2, "Checking image directory")
    image_dir = Path("public/images")
    
    if not image_dir.exists():
        print(f"{Colors.RED}❌ Image directory not found: {image_dir}{Colors.NC}")
        sys.exit(1)
    
    print(f"{Colors.GREEN}✅ Image directory: {image_dir}{Colors.NC}")
    print()
    
    # Step 3: 이미지 파일 검색
    print_step(3, "Finding images to convert")
    
    image_extensions = ['.png', '.jpg', '.jpeg']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(image_dir.rglob(f'*{ext}'))
        image_files.extend(image_dir.rglob(f'*{ext.upper()}'))
    
    if not image_files:
        print(f"{Colors.YELLOW}⚠️  No images found to convert{Colors.NC}")
        sys.exit(0)
    
    print(f"{Colors.GREEN}✅ Found {len(image_files)} images{Colors.NC}")
    print()
    
    # Step 4: WebP 변환
    print_step(4, "Converting images to WebP")
    
    converted = 0
    skipped = 0
    failed = 0
    total_original_size = 0
    total_webp_size = 0
    
    for image_file in image_files:
        filename = image_file.name
        webp_file = image_file.with_suffix('.webp')
        
        # 이미 WebP가 존재하면 건너뛰기
        if webp_file.exists():
            print(f"  {Colors.YELLOW}⏭️  Skipped: {filename} (already exists){Colors.NC}")
            skipped += 1
            continue
        
        # 원본 파일 크기
        original_size = image_file.stat().st_size
        total_original_size += original_size
        
        # WebP 변환
        print(f"  🔄 Converting: {filename}")
        
        if convert_to_webp(image_file, webp_file, quality=85):
            webp_size = webp_file.stat().st_size
            total_webp_size += webp_size
            
            # 크기 비교
            saved = original_size - webp_size
            saved_percent = (saved * 100.0 / original_size) if original_size > 0 else 0
            
            print(f"  {Colors.GREEN}✅ {filename} → {webp_file.name}{Colors.NC}")
            print(f"     Original: {format_size(original_size)} → WebP: {format_size(webp_size)} ({saved_percent:.1f}% smaller)")
            
            converted += 1
        else:
            print(f"  {Colors.RED}❌ Failed: {filename}{Colors.NC}")
            failed += 1
    
    print()
    
    # Step 5: 통계 출력
    print_header("📊 Conversion Statistics")
    print(f"{Colors.GREEN}✅ Converted: {converted}{Colors.NC}")
    print(f"{Colors.YELLOW}⏭️  Skipped: {skipped}{Colors.NC}")
    print(f"{Colors.RED}❌ Failed: {failed}{Colors.NC}")
    print()
    
    if converted > 0:
        total_saved = total_original_size - total_webp_size
        total_saved_percent = (total_saved * 100.0 / total_original_size) if total_original_size > 0 else 0
        
        print(f"{Colors.GREEN}💾 Total Original Size: {format_size(total_original_size)}{Colors.NC}")
        print(f"{Colors.GREEN}💾 Total WebP Size: {format_size(total_webp_size)}{Colors.NC}")
        print(f"{Colors.GREEN}🎉 Total Saved: {format_size(total_saved)} ({total_saved_percent:.1f}%){Colors.NC}")
    
    print()
    
    # Step 6: HTML 사용 가이드
    print_header("📝 How to Use WebP Images in HTML")
    print(f"{Colors.YELLOW}Replace this:{Colors.NC}")
    print('  <img src="images/example.png" alt="Example">')
    print()
    print(f"{Colors.GREEN}With this (WebP with fallback):{Colors.NC}")
    print('  <picture>')
    print('    <source srcset="images/example.webp" type="image/webp">')
    print('    <img src="images/example.png" alt="Example">')
    print('  </picture>')
    print()
    
    # 완료
    print(f"{Colors.GREEN}{'=' * 60}{Colors.NC}")
    print(f"{Colors.GREEN}✅ Image WebP conversion completed!{Colors.NC}")
    print(f"{Colors.GREEN}{'=' * 60}{Colors.NC}")

if __name__ == "__main__":
    main()
