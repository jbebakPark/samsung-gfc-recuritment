# 🤖 GitHub Actions 자동 배포 설정 완료!

## ✅ 완료된 작업

1. **GitHub Actions 워크플로우 생성** ✅
   - 파일: `.github/workflows/firebase-deploy.yml`
   - 트리거: `main` 브랜치에 push 시 자동 배포
   - 수동 실행: GitHub Actions 탭에서 "Run workflow" 클릭 가능

---

## 🔑 필수 작업: Firebase 토큰 설정

### ⚠️ 중요: 아래 단계를 완료해야 자동 배포가 작동합니다!

---

## 📋 설정 단계 (5분 소요)

### **1단계: Firebase CLI 토큰 생성** (로컬 컴퓨터에서)

```bash
# Firebase CLI 설치 (설치 안 되어 있다면)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# CI 토큰 생성
firebase login:ci
```

실행하면 다음과 같은 토큰이 출력됩니다:
```
✔ Success! Use this token to login on a CI server:

1//0abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG...

Example: firebase deploy --token "$FIREBASE_TOKEN"
```

**이 토큰을 복사하세요!** 📋

---

### **2단계: GitHub Secrets에 토큰 등록**

1. **GitHub 저장소 접속**
   ```
   https://github.com/jbebakPark/samsung-gfc-recuritment/settings/secrets/actions
   ```

2. **New repository secret 클릭**

3. **Secret 정보 입력**
   - **Name**: `FIREBASE_TOKEN` (정확히 이 이름으로!)
   - **Value**: 위에서 복사한 토큰 붙여넣기

4. **Add secret 클릭**

---

### **3단계: 워크플로우 파일 Push**

```bash
# 로컬 컴퓨터에서 저장소 클론 (아직 안 했다면)
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment

# 최신 변경사항 pull
git pull origin main

# GitHub Actions 파일이 있는지 확인
ls .github/workflows/

# 있으면 OK! 없으면 다시 pull 또는 파일 생성
```

---

### **4단계: 자동 배포 테스트**

#### 방법 1: 코드 변경 후 Push (자동 트리거)
```bash
# 아무 파일이나 수정 (예: README.md)
echo "# Test Auto Deploy" >> README.md

# 커밋 & Push
git add .
git commit -m "test: GitHub Actions auto-deploy test"
git push origin main
```

#### 방법 2: GitHub에서 수동 실행
1. https://github.com/jbebakPark/samsung-gfc-recuritment/actions
2. 왼쪽 메뉴에서 **"Deploy to Firebase Hosting"** 클릭
3. 오른쪽 상단 **"Run workflow"** 버튼 클릭
4. **"Run workflow"** 확인

---

### **5단계: 배포 확인**

1. **Actions 탭에서 진행 상황 확인**
   ```
   https://github.com/jbebakPark/samsung-gfc-recuritment/actions
   ```
   - ✅ 초록색 체크: 배포 성공
   - ❌ 빨간 X: 배포 실패 (로그 확인)

2. **배포된 사이트 접속**
   ```
   https://samsung-gfc.web.app
   ```

3. **Firestore 테스트**
   - 지원서 작성 → 제출
   - Firebase Console에서 데이터 확인:
     ```
     https://console.firebase.google.com/project/samsung-gfc/firestore
     ```

---

## 🎯 자동 배포 흐름

```
코드 수정
   ↓
Git Commit
   ↓
Git Push (main 브랜치)
   ↓
GitHub Actions 자동 실행
   ↓
npm ci (의존성 설치)
   ↓
firebase deploy (배포)
   ↓
✅ https://samsung-gfc.web.app 업데이트 완료!
```

**소요 시간**: 약 2-3분

---

## 🔧 문제 해결

### 에러 1: "Error: HTTP Error: 401, Unauthorized"
**원인**: FIREBASE_TOKEN이 잘못되었거나 만료됨
**해결**:
```bash
firebase login:ci  # 새 토큰 생성
# GitHub Secrets에서 FIREBASE_TOKEN 업데이트
```

### 에러 2: "Error: Specified project does not exist"
**원인**: Firebase 프로젝트 ID가 잘못됨
**해결**: `.firebaserc` 파일 확인
```json
{
  "projects": {
    "default": "samsung-gfc"
  }
}
```

### 에러 3: "npm ci" 실패
**원인**: package-lock.json이 최신이 아님
**해결**:
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push origin main
```

---

## 📊 현재 설정 상태

```
✅ GitHub Actions 워크플로우 생성됨
✅ .github/workflows/firebase-deploy.yml
✅ main 브랜치 push 시 자동 배포
✅ 수동 실행 가능 (workflow_dispatch)
⏳ FIREBASE_TOKEN 설정 필요 ← 👈 이것만 하면 끝!
```

---

## 🎉 완료 후 혜택

### 앞으로는:
1. 코드 수정
2. `git push origin main`
3. **자동 배포 완료!** 🚀

**더 이상 수동 배포 필요 없음!**

---

## 📞 도움이 필요하신가요?

### Firebase CLI 설치 오류
**Mac/Linux**:
```bash
curl -sL https://firebase.tools | bash
```

**Windows**:
```bash
npm install -g firebase-tools
```

### 토큰 생성 오류
```bash
# 기존 로그인 정보 삭제
firebase logout

# 다시 로그인
firebase login

# 토큰 생성
firebase login:ci
```

---

## 🔗 유용한 링크

- **GitHub Actions**: https://github.com/jbebakPark/samsung-gfc-recuritment/actions
- **Firebase Console**: https://console.firebase.google.com/project/samsung-gfc
- **배포 URL**: https://samsung-gfc.web.app
- **GitHub Secrets**: https://github.com/jbebakPark/samsung-gfc-recuritment/settings/secrets/actions

---

## ✅ 체크리스트

배포 전 확인:
- [ ] Firebase CLI 설치됨 (`firebase --version`)
- [ ] Firebase 로그인 완료 (`firebase login`)
- [ ] CI 토큰 생성 완료 (`firebase login:ci`)
- [ ] GitHub Secrets에 `FIREBASE_TOKEN` 등록 완료
- [ ] `.github/workflows/firebase-deploy.yml` 파일 존재
- [ ] main 브랜치에 push 또는 수동 실행

배포 후 확인:
- [ ] GitHub Actions 실행 성공 (초록색 체크)
- [ ] https://samsung-gfc.web.app 접속 가능
- [ ] 지원서 제출 테스트 완료
- [ ] Firestore에 데이터 저장 확인

---

**설정 완료 후 알려주시면, 바로 테스트 배포를 도와드리겠습니다!** 🚀

---

**작성일**: 2026-02-11  
**상태**: GitHub Actions 워크플로우 준비 완료  
**다음 단계**: Firebase 토큰 생성 및 GitHub Secrets 등록
