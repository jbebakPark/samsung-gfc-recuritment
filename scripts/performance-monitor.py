#!/usr/bin/env python3
"""
Performance Monitoring Script
Version: 1.0.0
Last Updated: 2026-02-14

성능 모니터링 자동화 스크립트
- 페이지 로드 시간 측정
- 파일 크기 분석
- Core Web Vitals 추정
- Lighthouse 점수 (선택적)
"""

import os
import sys
from pathlib import Path
import time
import json

# 색상 코드
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'

def print_header(text):
    print(f"{Colors.BLUE}{'=' * 70}{Colors.NC}")
    print(f"{Colors.BLUE}{text}{Colors.NC}")
    print(f"{Colors.BLUE}{'=' * 70}{Colors.NC}")
    print()

def print_step(step, text):
    print(f"{Colors.YELLOW}📊 Step {step}: {text}{Colors.NC}")

def format_size(size_bytes):
    """파일 크기를 읽기 쉬운 형태로 변환"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def analyze_file_sizes():
    """파일 크기 분석"""
    print_step(1, "Analyzing file sizes")
    
    public_dir = Path("public")
    
    if not public_dir.exists():
        print(f"{Colors.RED}❌ Public directory not found{Colors.NC}")
        return {}
    
    file_sizes = {
        'html': [],
        'css': [],
        'js': [],
        'images': [],
        'total': 0
    }
    
    for file_path in public_dir.rglob('*'):
        if file_path.is_file():
            size = file_path.stat().st_size
            file_sizes['total'] += size
            
            ext = file_path.suffix.lower()
            
            if ext in ['.html']:
                file_sizes['html'].append((file_path.name, size))
            elif ext in ['.css']:
                file_sizes['css'].append((file_path.name, size))
            elif ext in ['.js']:
                file_sizes['js'].append((file_path.name, size))
            elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']:
                file_sizes['images'].append((file_path.name, size))
    
    # 통계 출력
    print(f"\n{Colors.CYAN}HTML Files:{Colors.NC}")
    html_total = sum(size for _, size in file_sizes['html'])
    print(f"  Total: {format_size(html_total)} ({len(file_sizes['html'])} files)")
    for name, size in sorted(file_sizes['html'], key=lambda x: x[1], reverse=True)[:3]:
        print(f"  - {name}: {format_size(size)}")
    
    print(f"\n{Colors.CYAN}CSS Files:{Colors.NC}")
    css_total = sum(size for _, size in file_sizes['css'])
    print(f"  Total: {format_size(css_total)} ({len(file_sizes['css'])} files)")
    for name, size in sorted(file_sizes['css'], key=lambda x: x[1], reverse=True)[:3]:
        print(f"  - {name}: {format_size(size)}")
    
    print(f"\n{Colors.CYAN}JavaScript Files:{Colors.NC}")
    js_total = sum(size for _, size in file_sizes['js'])
    print(f"  Total: {format_size(js_total)} ({len(file_sizes['js'])} files)")
    for name, size in sorted(file_sizes['js'], key=lambda x: x[1], reverse=True)[:3]:
        print(f"  - {name}: {format_size(size)}")
    
    print(f"\n{Colors.CYAN}Image Files:{Colors.NC}")
    images_total = sum(size for _, size in file_sizes['images'])
    print(f"  Total: {format_size(images_total)} ({len(file_sizes['images'])} files)")
    for name, size in sorted(file_sizes['images'], key=lambda x: x[1], reverse=True)[:3]:
        print(f"  - {name}: {format_size(size)}")
    
    print(f"\n{Colors.GREEN}Total Size: {format_size(file_sizes['total'])}{Colors.NC}")
    print()
    
    return file_sizes

def estimate_core_web_vitals(file_sizes):
    """Core Web Vitals 추정"""
    print_step(2, "Estimating Core Web Vitals")
    
    html_total = sum(size for _, size in file_sizes.get('html', []))
    css_total = sum(size for _, size in file_sizes.get('css', []))
    js_total = sum(size for _, size in file_sizes.get('js', []))
    images_total = sum(size for _, size in file_sizes.get('images', []))
    
    # 간단한 추정 로직 (실제 측정보다 덜 정확)
    # LCP (Largest Contentful Paint) 추정
    # 큰 이미지가 있으면 LCP가 느려질 수 있음
    largest_image = max((size for _, size in file_sizes.get('images', [])), default=0)
    lcp_score = "Good" if largest_image < 100000 else "Needs Improvement" if largest_image < 500000 else "Poor"
    
    # FID (First Input Delay) 추정
    # JavaScript 파일이 많으면 FID가 느려질 수 있음
    fid_score = "Good" if js_total < 300000 else "Needs Improvement" if js_total < 600000 else "Poor"
    
    # CLS (Cumulative Layout Shift) - 정적 분석 불가, 추정만
    cls_score = "Unknown (requires real testing)"
    
    print(f"\n{Colors.CYAN}LCP (Largest Contentful Paint):{Colors.NC}")
    print(f"  Largest Image: {format_size(largest_image)}")
    color = Colors.GREEN if lcp_score == "Good" else Colors.YELLOW if lcp_score == "Needs Improvement" else Colors.RED
    print(f"  {color}Score: {lcp_score}{Colors.NC}")
    print(f"  Target: < 2.5s (Good), < 4.0s (Needs Improvement)")
    
    print(f"\n{Colors.CYAN}FID (First Input Delay):{Colors.NC}")
    print(f"  Total JavaScript: {format_size(js_total)}")
    color = Colors.GREEN if fid_score == "Good" else Colors.YELLOW if fid_score == "Needs Improvement" else Colors.RED
    print(f"  {color}Score: {fid_score}{Colors.NC}")
    print(f"  Target: < 100ms (Good), < 300ms (Needs Improvement)")
    
    print(f"\n{Colors.CYAN}CLS (Cumulative Layout Shift):{Colors.NC}")
    print(f"  {Colors.YELLOW}Score: {cls_score}{Colors.NC}")
    print(f"  Target: < 0.1 (Good), < 0.25 (Needs Improvement)")
    
    print()

def check_optimization_opportunities(file_sizes):
    """최적화 기회 분석"""
    print_step(3, "Checking optimization opportunities")
    
    opportunities = []
    
    # 큰 이미지 확인
    large_images = [(name, size) for name, size in file_sizes.get('images', []) if size > 100000]
    if large_images:
        opportunities.append({
            'type': 'Images',
            'issue': f'{len(large_images)} large images (> 100KB)',
            'solution': 'Convert to WebP or compress',
            'impact': 'High'
        })
    
    # 큰 JavaScript 파일 확인
    large_js = [(name, size) for name, size in file_sizes.get('js', []) if size > 50000]
    if large_js:
        opportunities.append({
            'type': 'JavaScript',
            'issue': f'{len(large_js)} large JS files (> 50KB)',
            'solution': 'Minify and split into chunks',
            'impact': 'Medium'
        })
    
    # 큰 CSS 파일 확인
    large_css = [(name, size) for name, size in file_sizes.get('css', []) if size > 30000]
    if large_css:
        opportunities.append({
            'type': 'CSS',
            'issue': f'{len(large_css)} large CSS files (> 30KB)',
            'solution': 'Minify and remove unused CSS',
            'impact': 'Low'
        })
    
    if opportunities:
        print(f"\n{Colors.YELLOW}⚠️  Found {len(opportunities)} optimization opportunities:{Colors.NC}\n")
        for i, opp in enumerate(opportunities, 1):
            impact_color = Colors.RED if opp['impact'] == 'High' else Colors.YELLOW if opp['impact'] == 'Medium' else Colors.GREEN
            print(f"{i}. {Colors.CYAN}{opp['type']}{Colors.NC}")
            print(f"   Issue: {opp['issue']}")
            print(f"   Solution: {opp['solution']}")
            print(f"   Impact: {impact_color}{opp['impact']}{Colors.NC}\n")
    else:
        print(f"\n{Colors.GREEN}✅ No major optimization opportunities found{Colors.NC}\n")

def generate_recommendations():
    """개선 권장 사항"""
    print_step(4, "Generating recommendations")
    
    recommendations = [
        "🎯 Run WebP conversion: python3 scripts/optimize-images-webp.py",
        "🎯 Enable lazy loading for images",
        "🎯 Minify CSS and JavaScript files",
        "🎯 Use CDN for static assets",
        "🎯 Enable gzip/brotli compression",
        "🎯 Add cache headers for static files",
        "🎯 Implement service worker for offline support",
        "🎯 Use modern image formats (WebP, AVIF)",
    ]
    
    print(f"\n{Colors.GREEN}Recommended Actions:{Colors.NC}\n")
    for rec in recommendations:
        print(f"  {rec}")
    
    print()

def main():
    # 프로젝트 루트로 이동
    project_root = Path(__file__).parent.parent
    os.chdir(project_root)
    
    print_header("⚡ Performance Monitoring - Samsung GFC Recruitment Site")
    
    # 1. 파일 크기 분석
    file_sizes = analyze_file_sizes()
    
    # 2. Core Web Vitals 추정
    estimate_core_web_vitals(file_sizes)
    
    # 3. 최적화 기회
    check_optimization_opportunities(file_sizes)
    
    # 4. 권장 사항
    generate_recommendations()
    
    # 완료
    print_header("✅ Performance monitoring completed!")
    print(f"{Colors.CYAN}For detailed Lighthouse audit, run:{Colors.NC}")
    print(f"  npx lighthouse https://samsung-gfc.web.app --view")
    print()

if __name__ == "__main__":
    main()
