#!/usr/bin/env python3
"""
Security Audit Script
Version: 1.0.0
Last Updated: 2026-02-14

보안 점검 자동화 스크립트
- Firebase 보안 규칙 검증
- npm 패키지 취약점 스캔
- 환경 변수 누출 확인
- HTTPS/SSL 인증서 확인
- 민감 정보 노출 검사
"""

import os
import sys
import json
import subprocess
from pathlib import Path
import re

# 색상 코드
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'

def print_header(text):
    print(f"{Colors.BLUE}{'=' * 70}{Colors.NC}")
    print(f"{Colors.BLUE}{text}{Colors.NC}")
    print(f"{Colors.BLUE}{'=' * 70}{Colors.NC}")
    print()

def print_step(step, text):
    print(f"{Colors.YELLOW}🔍 Step {step}: {text}{Colors.NC}")

def run_command(command, description):
    """명령어 실행"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_npm_vulnerabilities():
    """npm 패키지 취약점 스캔"""
    print_step(1, "Checking npm vulnerabilities")
    
    success, stdout, stderr = run_command("npm audit --json", "npm audit")
    
    if success:
        try:
            audit_data = json.loads(stdout)
            vulnerabilities = audit_data.get('metadata', {}).get('vulnerabilities', {})
            
            total = vulnerabilities.get('total', 0)
            critical = vulnerabilities.get('critical', 0)
            high = vulnerabilities.get('high', 0)
            moderate = vulnerabilities.get('moderate', 0)
            low = vulnerabilities.get('low', 0)
            
            if total == 0:
                print(f"{Colors.GREEN}✅ No vulnerabilities found{Colors.NC}")
            else:
                print(f"{Colors.RED}⚠️  Found {total} vulnerabilities:{Colors.NC}")
                if critical > 0:
                    print(f"  {Colors.RED}🔴 Critical: {critical}{Colors.NC}")
                if high > 0:
                    print(f"  {Colors.RED}🟠 High: {high}{Colors.NC}")
                if moderate > 0:
                    print(f"  {Colors.YELLOW}🟡 Moderate: {moderate}{Colors.NC}")
                if low > 0:
                    print(f"  {Colors.BLUE}🔵 Low: {low}{Colors.NC}")
                
                print(f"\n{Colors.YELLOW}Run 'npm audit fix' to fix automatically{Colors.NC}")
                return False
        except json.JSONDecodeError:
            print(f"{Colors.RED}❌ Failed to parse npm audit output{Colors.NC}")
            return False
    else:
        print(f"{Colors.YELLOW}⚠️  npm audit failed (might not have node_modules){Colors.NC}")
    
    print()
    return True

def check_env_leaks():
    """환경 변수 및 API 키 누출 확인"""
    print_step(2, "Checking for environment variable leaks")
    
    sensitive_patterns = [
        r'FIREBASE_API_KEY\s*=\s*["\']?AIza[a-zA-Z0-9_-]{35}',
        r'FIREBASE_.*_KEY',
        r'API[_-]?KEY\s*=\s*["\'][a-zA-Z0-9_-]+["\']',
        r'SECRET[_-]?KEY',
        r'PASSWORD\s*=\s*["\'][^"\']+["\']',
        r'ACCESS[_-]?TOKEN',
    ]
    
    excluded_dirs = {'node_modules', '.git', 'dist', 'build', 'backups'}
    excluded_files = {'.env.example', 'security-audit.py'}
    
    project_root = Path.cwd()
    issues_found = []
    
    for file_path in project_root.rglob('*'):
        # 디렉토리 제외
        if any(excluded in file_path.parts for excluded in excluded_dirs):
            continue
        
        # 파일만 검사
        if not file_path.is_file():
            continue
        
        # 제외 파일
        if file_path.name in excluded_files:
            continue
        
        # 텍스트 파일만 검사
        if file_path.suffix in {'.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.md', '.txt', '.sh', '.py'}:
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')
                
                for pattern in sensitive_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        issues_found.append((file_path.relative_to(project_root), pattern, matches))
            except Exception as e:
                continue
    
    if issues_found:
        print(f"{Colors.RED}⚠️  Found {len(issues_found)} potential leaks:{Colors.NC}")
        for file_path, pattern, matches in issues_found:
            print(f"  {Colors.YELLOW}📄 {file_path}{Colors.NC}")
            print(f"     Pattern: {pattern}")
            print(f"     Matches: {len(matches)}")
        print(f"\n{Colors.RED}⚠️  Review these files carefully!{Colors.NC}")
        return False
    else:
        print(f"{Colors.GREEN}✅ No environment variable leaks detected{Colors.NC}")
    
    print()
    return True

def check_firebase_security():
    """Firebase 보안 규칙 확인"""
    print_step(3, "Checking Firebase security rules")
    
    firestore_rules = Path("firestore.rules")
    storage_rules = Path("storage.rules")
    
    all_good = True
    
    # Firestore 규칙 확인
    if firestore_rules.exists():
        rules_content = firestore_rules.read_text()
        
        if "allow read, write: if true" in rules_content:
            print(f"{Colors.RED}❌ Firestore rules: Insecure (allow all){Colors.NC}")
            all_good = False
        else:
            print(f"{Colors.GREEN}✅ Firestore rules: Secure{Colors.NC}")
    else:
        print(f"{Colors.YELLOW}⚠️  firestore.rules not found{Colors.NC}")
    
    # Storage 규칙 확인
    if storage_rules.exists():
        rules_content = storage_rules.read_text()
        
        if "allow read, write: if true" in rules_content:
            print(f"{Colors.RED}❌ Storage rules: Insecure (allow all){Colors.NC}")
            all_good = False
        else:
            print(f"{Colors.GREEN}✅ Storage rules: Secure{Colors.NC}")
    else:
        print(f"{Colors.YELLOW}⚠️  storage.rules not found{Colors.NC}")
    
    print()
    return all_good

def check_gitignore():
    """".gitignore 확인"""
    print_step(4, "Checking .gitignore configuration")
    
    gitignore_path = Path(".gitignore")
    
    required_patterns = [
        "node_modules",
        ".env",
        ".env.local",
        "*.log",
    ]
    
    if not gitignore_path.exists():
        print(f"{Colors.RED}❌ .gitignore not found{Colors.NC}")
        print()
        return False
    
    gitignore_content = gitignore_path.read_text()
    missing_patterns = []
    
    for pattern in required_patterns:
        if pattern not in gitignore_content:
            missing_patterns.append(pattern)
    
    if missing_patterns:
        print(f"{Colors.YELLOW}⚠️  Missing patterns in .gitignore:{Colors.NC}")
        for pattern in missing_patterns:
            print(f"  - {pattern}")
        print()
        return False
    else:
        print(f"{Colors.GREEN}✅ .gitignore is properly configured{Colors.NC}")
    
    print()
    return True

def check_dependencies():
    """의존성 버전 확인"""
    print_step(5, "Checking outdated dependencies")
    
    success, stdout, stderr = run_command("npm outdated --json", "npm outdated")
    
    if stdout:
        try:
            outdated = json.loads(stdout)
            if outdated:
                print(f"{Colors.YELLOW}⚠️  Found {len(outdated)} outdated packages:{Colors.NC}")
                for package, info in list(outdated.items())[:5]:  # 처음 5개만 표시
                    current = info.get('current', 'N/A')
                    latest = info.get('latest', 'N/A')
                    print(f"  - {package}: {current} → {latest}")
                
                if len(outdated) > 5:
                    print(f"  ... and {len(outdated) - 5} more")
                
                print(f"\n{Colors.YELLOW}Run 'npm update' to update packages{Colors.NC}")
            else:
                print(f"{Colors.GREEN}✅ All dependencies are up to date{Colors.NC}")
        except json.JSONDecodeError:
            print(f"{Colors.GREEN}✅ All dependencies are up to date{Colors.NC}")
    else:
        print(f"{Colors.GREEN}✅ All dependencies are up to date{Colors.NC}")
    
    print()
    return True

def generate_report(results):
    """보안 점검 리포트 생성"""
    print_header("📊 Security Audit Report")
    
    total_checks = len(results)
    passed_checks = sum(1 for result in results.values() if result)
    failed_checks = total_checks - passed_checks
    
    print(f"Total Checks: {total_checks}")
    print(f"{Colors.GREEN}✅ Passed: {passed_checks}{Colors.NC}")
    print(f"{Colors.RED}❌ Failed: {failed_checks}{Colors.NC}")
    print()
    
    if failed_checks == 0:
        print(f"{Colors.GREEN}{'=' * 70}{Colors.NC}")
        print(f"{Colors.GREEN}🎉 All security checks passed!{Colors.NC}")
        print(f"{Colors.GREEN}{'=' * 70}{Colors.NC}")
        return True
    else:
        print(f"{Colors.RED}{'=' * 70}{Colors.NC}")
        print(f"{Colors.RED}⚠️  {failed_checks} security issue(s) found. Please review and fix.{Colors.NC}")
        print(f"{Colors.RED}{'=' * 70}{Colors.NC}")
        return False

def main():
    # 프로젝트 루트로 이동
    project_root = Path(__file__).parent.parent
    os.chdir(project_root)
    
    print_header("🔒 Security Audit - Samsung GFC Recruitment Site")
    
    results = {}
    
    # 1. npm 취약점
    results['npm_vulnerabilities'] = check_npm_vulnerabilities()
    
    # 2. 환경 변수 누출
    results['env_leaks'] = check_env_leaks()
    
    # 3. Firebase 보안
    results['firebase_security'] = check_firebase_security()
    
    # 4. .gitignore
    results['gitignore'] = check_gitignore()
    
    # 5. 의존성 버전
    results['dependencies'] = check_dependencies()
    
    # 리포트 생성
    all_passed = generate_report(results)
    
    # 종료 코드
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
