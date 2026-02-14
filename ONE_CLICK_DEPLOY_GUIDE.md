# 🚀 원클릭 자동 배포 가이드

**작성일**: 2026-02-14  
**버전**: v1.0  
**난이도**: ⭐ (매우 쉬움)

---

## 📋 목차

1. [개요](#개요)
2. [시스템 요구사항](#시스템-요구사항)
3. [사용 방법](#사용-방법)
4. [문제 해결](#문제-해결)
5. [FAQ](#faq)

---

## 개요

**원클릭 자동 배포 스크립트**는 삼성생명 GFC 채용 사이트를 Firebase에 자동으로 배포하는 도구입니다.

### ✨ 주요 기능

- ✅ **완전 자동화**: 클릭 한 번으로 모든 과정 자동 처리
- ✅ **사전 검증**: 배포 전 자동으로 시스템 및 파일 확인
- ✅ **오류 처리**: 문제 발생 시 명확한 안내 메시지
- ✅ **크로스 플랫폼**: Windows, Mac, Linux 모두 지원
- ✅ **시간 절약**: 수동 배포 60분 → 자동 배포 3-5분

---

## 시스템 요구사항

### 필수 프로그램

| 프로그램 | 설치 여부 확인 | 다운로드 링크 |
|----------|---------------|---------------|
| **Git** | `git --version` | [다운로드](https://git-scm.com/downloads) |
| **Node.js** | `node --version` | [다운로드](https://nodejs.org/) |
| **npm** | `npm --version` | (Node.js 설치 시 포함) |

### 권장 사양

- **운영체제**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **메모리**: 4GB 이상
- **디스크 공간**: 1GB 이상
- **인터넷**: 안정적인 연결 필요

---

## 사용 방법

### 🪟 Windows 사용자

#### 방법 1: 배치 파일 실행 (가장 쉬움)

1. **파일 다운로드**
   ```
   https://github.com/jbebakPark/samsung-gfc-recuritment/blob/main/scripts/6-one-click-deploy.bat
   ```
   - "Raw" 버튼 클릭 → 우클릭 → "다른 이름으로 저장"

2. **실행**
   - `6-one-click-deploy.bat` 파일을 **더블클릭**

3. **안내 따라가기**
   - 스크립트가 자동으로 진행
   - 중간에 Firebase 로그인 창이 뜨면 Google 계정으로 로그인
   - 배포 확인 메시지에서 `Y` 입력

4. **완료!**
   - https://samsung-gfc.web.app 에서 확인

#### 방법 2: PowerShell 사용

```powershell
# 1. PowerShell 실행 (관리자 권한)

# 2. 스크립트 다운로드 및 실행
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment\scripts
.\6-one-click-deploy.bat
```

---

### 🍎 Mac 사용자

#### 터미널 사용

1. **터미널 열기**
   - `Cmd + Space` → "터미널" 입력

2. **스크립트 다운로드**
   ```bash
   # 홈 디렉토리에서 실행
   cd ~
   
   # 스크립트 다운로드
   curl -O https://raw.githubusercontent.com/jbebakPark/samsung-gfc-recuritment/main/scripts/6-one-click-deploy.sh
   
   # 실행 권한 부여
   chmod +x 6-one-click-deploy.sh
   ```

3. **스크립트 실행**
   ```bash
   ./6-one-click-deploy.sh
   ```

4. **안내 따라가기**
   - 스크립트가 자동으로 진행
   - Firebase 로그인 시 브라우저가 자동으로 열림
   - 배포 확인 메시지에서 `y` 입력

5. **완료!**
   - https://samsung-gfc.web.app 에서 확인

---

### 🐧 Linux 사용자

```bash
# 1. 터미널 열기

# 2. 스크립트 다운로드
cd ~
wget https://raw.githubusercontent.com/jbebakPark/samsung-gfc-recuritment/main/scripts/6-one-click-deploy.sh

# 3. 실행 권한 부여
chmod +x 6-one-click-deploy.sh

# 4. 스크립트 실행
./6-one-click-deploy.sh
```

---

## 📊 배포 과정 (자동 진행)

스크립트가 자동으로 수행하는 단계:

```
┌─────────────────────────────────────────┐
│ Step 1: 시스템 요구사항 확인            │
│         - Git, Node.js, npm 설치 확인   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 2: Firebase CLI 설치               │
│         - firebase-tools 자동 설치      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 3: 프로젝트 준비                   │
│         - 저장소 클론 또는 업데이트     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 4: Firebase 인증                   │
│         - Google 계정 로그인 (1회만)    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 5: Firebase 프로젝트 확인          │
│         - samsung-gfc 프로젝트 연결     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 6: 배포 전 검증                    │
│         - 파일 및 설정 확인             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 7: Firebase 배포                   │
│         - 실제 배포 실행 (1-2분)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 8: 배포 확인                       │
│         - HTTP 응답 확인                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Step 9: 최종 안내                       │
│         - 배포 URL 및 캐시 정리 안내    │
└─────────────────────────────────────────┘
```

**예상 소요 시간**: 
- 최초 실행: 5-7분
- 재실행: 2-3분

---

## 문제 해결

### ❌ "Git이 설치되어 있지 않습니다"

**해결 방법:**
1. Git 다운로드: https://git-scm.com/downloads
2. 설치 후 터미널/명령 프롬프트 **재시작**
3. `git --version` 명령어로 확인

---

### ❌ "Node.js가 설치되어 있지 않습니다"

**해결 방법:**
1. Node.js LTS 버전 다운로드: https://nodejs.org/
2. 설치 후 터미널/명령 프롬프트 **재시작**
3. `node --version` 명령어로 확인

---

### ❌ "Firebase 로그인 실패"

**해결 방법:**

**증상 1: 브라우저가 열리지 않음**
```bash
# 수동 로그인 시도
firebase login --no-localhost
```

**증상 2: "Permission denied" 오류**
```bash
# 관리자 권한으로 재실행
# Windows: PowerShell을 관리자 권한으로 실행
# Mac/Linux: sudo 사용하지 말고, 일반 사용자로 실행
```

**증상 3: "Already logged in" 후 배포 실패**
```bash
# 로그아웃 후 재로그인
firebase logout
firebase login
```

---

### ❌ "배포 실패"

**해결 방법:**

**원인 1: 네트워크 문제**
- 안정적인 인터넷 연결 확인
- 방화벽/VPN 일시 중지 후 재시도

**원인 2: 프로젝트 권한 문제**
```bash
# 프로젝트 목록 확인
firebase projects:list

# 올바른 프로젝트 선택
firebase use samsung-gfc
```

**원인 3: 파일 누락**
```bash
# 프로젝트 완전히 다시 클론
rm -rf samsung-gfc-recuritment
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
```

---

### ❌ Windows에서 "스크립트 실행이 사용 안 함으로 설정됨" 오류

**해결 방법:**

**PowerShell에서 실행 정책 변경:**
```powershell
# 관리자 권한으로 PowerShell 실행
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Y 입력하여 확인
```

**또는 .bat 파일 사용:**
- `6-one-click-deploy.bat` 파일 사용 (실행 정책 제약 없음)

---

## FAQ

### Q1: 스크립트를 몇 번이나 실행할 수 있나요?

**A:** 무제한 실행 가능합니다. Firebase 로그인은 최초 1회만 필요하며, 이후에는 자동으로 인증됩니다.

---

### Q2: 배포 후 사이트가 업데이트되지 않았어요

**A:** 브라우저 캐시 때문입니다. 다음 방법으로 해결:
- **Chrome/Edge**: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- **Safari**: `Cmd+Option+R` (Mac)

또는:
- **시크릿 모드/InPrivate 창**으로 열기
- **모바일 기기**에서 확인

---

### Q3: 배포를 취소할 수 있나요?

**A:** 네, 가능합니다.
- 스크립트 실행 중 `Ctrl+C` (Windows) / `Cmd+C` (Mac)
- 배포 확인 메시지에서 `N` 입력

---

### Q4: 특정 버전으로 롤백하고 싶어요

**A:** Firebase Console에서 가능:
1. https://console.firebase.google.com/project/samsung-gfc/hosting
2. "Hosting" → "Releases" 탭
3. 이전 버전 선택 → "Rollback" 클릭

또는 명령어:
```bash
firebase hosting:rollback
```

---

### Q5: 자동 배포를 설정하고 싶어요 (Git push 시 자동 배포)

**A:** GitHub Actions 설정 필요:
1. `firebase login:ci` 실행하여 토큰 생성
2. GitHub Secrets에 `FIREBASE_TOKEN` 추가
3. 자세한 방법: `workflows-templates/README.md` 참조

---

### Q6: 스크립트가 너무 느려요

**A:** 다음을 확인하세요:
- 인터넷 속도 (특히 프로젝트 클론 시)
- npm 캐시 정리: `npm cache clean --force`
- Firebase CLI 최신 버전 확인: `npm update -g firebase-tools`

---

### Q7: 회사 프록시 환경에서 실행이 안 돼요

**A:** 프록시 설정 필요:
```bash
# npm 프록시 설정
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Git 프록시 설정
git config --global http.proxy http://proxy.company.com:8080
```

---

## 📞 추가 지원

### 문의처
- **이메일**: jb2park@naver.com
- **전화**: 010-5137-2327
- **카카오톡**: https://open.kakao.com/o/svmDyNUg

### 참고 문서
- **GitHub 저장소**: https://github.com/jbebakPark/samsung-gfc-recuritment
- **Firebase Console**: https://console.firebase.google.com/project/samsung-gfc
- **프로젝트 문서**: README.md, DEPLOYMENT_GUIDE.md

---

## 🎉 성공 사례

```
배포 완료!

🎯 배포된 사이트: https://samsung-gfc.web.app
⏱️  소요 시간: 147초
📊 파일 개수: 235개
💾 총 용량: 2.3 MB
```

---

**작성일**: 2026-02-14  
**최종 업데이트**: 2026-02-14  
**버전**: v1.0
