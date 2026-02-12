# 🚀 실행 방법 (Quick Start Guide)

## 📋 현재 상태
✅ GitHub 저장소 푸시 완료  
✅ 자동화 스크립트 5개 준비 완료  
✅ 문서 5개 작성 완료  
⏳ **Firebase 배포 대기 중**

---

## 🎯 지금 바로 실행하기 (2분 완료)

### 방법 1: 빠른 배포 스크립트 실행 ⚡ (추천)

```bash
cd /home/user/webapp
./scripts/5-deploy-now.sh
```

**실행 과정:**
1. 스크립트 실행
2. "배포를 시작하시겠습니까? (y/N)" → **y** 입력
3. 1-2분 대기
4. 배포 완료 메시지 확인
5. 브라우저에서 https://samsung-gfc.web.app 접속 (Ctrl+Shift+R로 새로고침)

---

### 방법 2: 통합 메뉴 사용 🎛️

```bash
cd /home/user/webapp
./scripts/4-master-automation.sh
```

**메뉴에서 선택:**
- **5번** 선택: Firebase 수동 배포
- 엔터 → 배포 시작
- 완료 후 0번 선택하여 종료

---

### 방법 3: Firebase CLI 직접 사용 💻

```bash
cd /home/user/webapp
firebase login
firebase deploy --only hosting
```

---

## 📊 배포 후 확인사항

### 1. 라이브 사이트 확인
- 🌐 **메인 페이지**: https://samsung-gfc.web.app
- 🔧 **관리자 페이지**: https://samsung-gfc.web.app/admin/

### 2. 브라우저 캐시 초기화
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### 3. 배포 상태 확인
```bash
firebase hosting:sites:list
```

---

## 🔄 다음 단계 (선택 사항)

### 오늘 중 (약 10분)
**GitHub Actions 자동 배포 설정**
```bash
./scripts/2-auto-deploy-firebase.sh
```
- Firebase CI 토큰 자동 생성
- GitHub Secrets에 FIREBASE_TOKEN 등록 (자동 안내)
- 이후 `git push`만으로 자동 배포

### 이번 주 (1-2시간)
**Phase 3-A 기능 개선 작업**

1. **카카오톡 알림 활성화** (5분)
   - 파일: `public/js/official-form-v31.0.js`
   - 178행 주석 해제: `await sendKakaoNotification(formData);`

2. **Firebase 환경변수 보안** (30분)
   - `.env` 파일 생성
   - API 키 이동 및 `.gitignore` 추가

3. **에러 핸들링 개선** (1시간)
   - 전역 에러 리스너 추가
   - 네트워크 오류 코드별 메시지
   - 로딩 스피너 구현

**상세 내용**: `NEXT_STEPS_DETAILED.md` 참조

---

## 📚 관련 문서

| 문서 | 내용 |
|------|------|
| `DEPLOYMENT_COMPARISON_AND_GUIDE.md` | 배포 전/후 비교 및 상세 가이드 |
| `AUTOMATION_SETUP_GUIDE.md` | 자동화 설치 및 설정 가이드 |
| `NEXT_STEPS_DETAILED.md` | Phase 3-A/B/C 작업 상세 설명 |
| `AUTOMATION_COMPLETE_REPORT.md` | 자동화 완료 보고서 |
| `FINAL_SUMMARY_REPORT.md` | 최종 작업 요약 |

---

## 🆘 문제 해결

### 스크립트 실행 권한 오류
```bash
chmod +x scripts/*.sh
```

### Firebase 로그인 필요 시
```bash
firebase login
```

### 배포 실패 시
```bash
# 1. Firebase 프로젝트 확인
firebase projects:list

# 2. 프로젝트 선택
firebase use samsung-gfc

# 3. 재배포
firebase deploy --only hosting
```

### Node.js/npm 설치 필요 시
```bash
./scripts/1-setup-dev-environment.sh
```

---

## 📞 문의

- **이메일**: jb2park@naver.com
- **전화**: 010-5137-2327
- **카카오톡**: https://open.kakao.com/o/svmDyNUg

---

## 🎉 배포 완료 후

1. ✅ https://samsung-gfc.web.app 접속 확인
2. ✅ 관리자 페이지 (/admin/) 동작 확인
3. ✅ 모바일 반응형 확인
4. ✅ 지원서 제출 테스트
5. ✅ Firebase Console에서 데이터 확인

**Firebase Console**: https://console.firebase.google.com/project/samsung-gfc

---

## 💡 TIP

### 빠른 테스트 (로컬 서버)
```bash
# Python 사용
cd /home/user/webapp/public
python3 -m http.server 8000
# 접속: http://localhost:8000

# Node.js 사용
cd /home/user/webapp
npx http-server public -p 8000
```

### Git 워크플로우
```bash
# 코드 수정 후
./scripts/3-dev-workflow.sh
# 자동으로: 변경사항 확인 → 커밋 → 푸시 → (Actions 설정 시) 자동 배포
```

---

**🚀 지금 바로 시작하세요!**

```bash
cd /home/user/webapp && ./scripts/5-deploy-now.sh
```
