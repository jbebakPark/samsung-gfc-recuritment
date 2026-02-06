# 삼성생명 GFC 채용 사이트 - 배포 가이드

## 📋 개요

삼성생명 GFC 채용 사이트는 **GitHub Pages**와 **Firebase Hosting** 두 가지 방법으로 배포할 수 있습니다.

---

## 🚀 방법 1: GitHub Pages 배포 (권장)

### 장점
- ✅ 무료
- ✅ 자동 배포 (push 시 자동 반영)
- ✅ HTTPS 기본 제공
- ✅ 설정 간단

### 배포 상태
- **Repository:** https://github.com/jbebakPark/samsung-gfc-recuritment
- **Branch:** main
- **최신 Commit:** `9a0b194` (v2.0.0)
- **배포 URL:** https://jbebakpark.github.io/samsung-gfc-recuritment/

### 설정 방법

#### 1. GitHub Pages 활성화

1. GitHub 저장소 접속: https://github.com/jbebakPark/samsung-gfc-recuritment
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
   - **Save** 클릭

#### 2. 배포 확인

약 1-2분 후 다음 URL에서 사이트 확인 가능:
```
https://jbebakpark.github.io/samsung-gfc-recuritment/
```

#### 3. 배포 상태 확인

GitHub 저장소의 **Actions** 탭에서 배포 진행 상황 확인 가능

### 자동 배포

이후 변경사항은 다음 명령어로 자동 배포됩니다:

```bash
cd /home/user/webapp
git add .
git commit -m "commit message"
git push origin main
```

push 후 1-2분 이내에 자동으로 사이트가 업데이트됩니다.

---

## 🔥 방법 2: Firebase Hosting 배포

### 장점
- ✅ 빠른 CDN
- ✅ 커스텀 도메인 쉬운 설정
- ✅ SSL 인증서 자동 관리
- ✅ 실시간 분석 도구

### 전제 조건

1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

2. Firebase 로그인
```bash
firebase login
```

### 배포 방법

#### 1. Firebase 프로젝트 확인

현재 설정된 프로젝트: `samsung-gfc`

```bash
cd /home/user/webapp
firebase projects:list
```

#### 2. 배포 실행

```bash
cd /home/user/webapp
firebase deploy --only hosting
```

#### 3. 배포 완료

배포가 완료되면 Firebase가 제공하는 URL에서 사이트 접속 가능:
```
https://samsung-gfc.web.app
또는
https://samsung-gfc.firebaseapp.com
```

### Firebase 설정 정보

**firebase.json:**
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 📊 배포 비교

| 항목 | GitHub Pages | Firebase Hosting |
|------|-------------|------------------|
| 비용 | 무료 | 무료 (제한적) |
| 배포 속도 | 1-2분 | 즉시 |
| CDN | 기본 제공 | 글로벌 CDN |
| 커스텀 도메인 | 지원 | 쉬운 설정 |
| SSL | 자동 | 자동 |
| 분석 | 제한적 | 상세 분석 |
| 설정 난이도 | 쉬움 | 중간 |

---

## 🎯 권장 배포 전략

### 개발/테스트 환경
- **GitHub Pages** 사용 (main 브랜치)
- 자동 배포로 빠른 업데이트

### 프로덕션 환경
- **Firebase Hosting** 사용
- 커스텀 도메인 연결
- 실시간 분석 활용

---

## 🔧 배포 후 확인사항

### 1. 기능 테스트
- [ ] 페이지 로딩 확인
- [ ] 드롭다운 메뉴 동작
- [ ] 모바일 메뉴 동작
- [ ] 폼 제출 테스트
- [ ] 스크롤 애니메이션
- [ ] FAQ 아코디언

### 2. 브라우저 테스트
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (macOS/iOS)
- [ ] Edge (최신)

### 3. 모바일 테스트
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 다양한 화면 크기

### 4. 성능 체크
- [ ] Lighthouse 점수 확인
- [ ] 페이지 로드 시간
- [ ] 이미지 최적화
- [ ] CSS/JS 압축

---

## 🛠️ 배포 트러블슈팅

### GitHub Pages 배포 안됨
1. GitHub 저장소 Settings > Pages 확인
2. Branch가 `main`으로 설정되어 있는지 확인
3. Actions 탭에서 배포 로그 확인

### Firebase 배포 오류
```bash
# 로그인 상태 확인
firebase login:list

# 프로젝트 재설정
firebase use --add

# 다시 배포
firebase deploy --only hosting
```

### 캐시 문제
브라우저 하드 리프레시:
- **Windows/Linux:** Ctrl + F5
- **Mac:** Cmd + Shift + R

---

## 📱 커스텀 도메인 설정 (선택사항)

### GitHub Pages
1. 도메인 구매 (예: samsung-gfc.com)
2. DNS 설정:
   ```
   Type: CNAME
   Name: www
   Value: jbebakpark.github.io
   ```
3. GitHub Settings > Pages > Custom domain 입력

### Firebase Hosting
```bash
firebase hosting:channel:deploy production
```

---

## 📈 배포 모니터링

### GitHub Pages
- **Status:** https://www.githubstatus.com/
- **Actions:** Repository > Actions 탭

### Firebase
```bash
# 배포 히스토리
firebase hosting:sites:list

# 사이트 정보
firebase hosting:sites:get samsung-gfc
```

---

## 🔄 CI/CD 자동화 (선택사항)

### GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

---

## ✅ 현재 배포 상태

### GitHub Pages
- ✅ **활성화:** 대기 중 (Settings에서 활성화 필요)
- ✅ **소스:** main 브랜치
- ✅ **최신 커밋:** 9a0b194 (v2.0.0)
- 📍 **URL:** https://jbebakpark.github.io/samsung-gfc-recuritment/

### Firebase Hosting
- ⏳ **상태:** 설정됨 (배포 대기)
- ⏳ **프로젝트:** samsung-gfc
- 📍 **URL:** https://samsung-gfc.web.app (배포 후 활성화)

---

## 📞 지원

배포 관련 문의:
- **GitHub Issues:** https://github.com/jbebakPark/samsung-gfc-recuritment/issues
- **Email:** jb2park@naver.com

---

**마지막 업데이트:** 2026-02-06  
**버전:** v2.0.0  
**상태:** 배포 준비 완료 ✅
