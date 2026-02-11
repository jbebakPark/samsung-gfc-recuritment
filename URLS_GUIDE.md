# 🌐 사용자 및 관리자 URL 가이드

## 📊 URL 구조

### 프로덕션 (Firebase Hosting)
**배포 후 접속 가능**

---

## 👥 사용자 URL

### 메인 채용 페이지
```
🌐 https://samsung-gfc.web.app
또는
🌐 https://samsung-gfc.firebaseapp.com
```

**기능**:
- ✅ GFC 소개 및 채용 정보
- ✅ 채용설명회 일정 (2026년 1월)
- ✅ 지원서 접수 (v31.0 공식 양식)
- ✅ 나이 자동 계산 및 연령 검증
- ✅ 개인정보 동의 3종
- ✅ Firebase Firestore 자동 저장
- ✅ 모바일/태블릿/데스크톱 반응형
- ✅ FAQ, 보도자료, 성공스토리

---

## 👨‍💼 관리자 URL

### 1. 관리자 대시보드
```
🔐 https://samsung-gfc.web.app/admin/
또는
🔐 https://samsung-gfc.web.app/admin/index.html
```

**기능**:
- 📊 전체 통계 대시보드
- 📈 지원 현황 요약
- 🔔 최근 활동 모니터링

---

### 2. 지원자 관리 페이지
```
🔐 https://samsung-gfc.web.app/admin/applications.html
```

**기능**:
- 📝 지원서 목록 조회
- 🔍 지원자 검색 및 필터링
- 📊 상태별 분류 (대기/검토/승인/거부)
- 👁️ 상세 정보 보기
- ✏️ 지원서 수정
- 🗑️ 지원서 삭제
- 📥 데이터 내보내기 (CSV/Excel)
- 📧 실시간 카카오톡 알림 (설정 시)

**지원서 데이터 구조**:
```javascript
{
  // 기본 정보
  name: "홍길동",
  gender: "male",
  birth: "1985-01-01",
  age: 41,
  address: "서울특별시 강남구...",
  mobilePhone: "010-1234-5678",
  email: "example@email.com",
  
  // 추가 정보
  financialInvestment: "yes",
  marriageStatus: "married",
  insuranceExperience: "yes",
  insuranceCompany: "삼성생명",
  insuranceCareerMonths: 36,
  insuranceSalary: 500,
  
  // 학력 (배열)
  education: [...],
  
  // 경력 (배열)
  career: [...],
  
  // 참고사항
  notes: "...",
  
  // 개인정보 동의
  consentCollection: true,
  consentProvision: true,
  consentInquiry: true,
  
  // 메타 정보
  submittedAt: "2026-02-11T10:30:00.000Z",
  status: "pending"
}
```

---

### 3. 인터뷰 관리 페이지
```
🔐 https://samsung-gfc.web.app/admin/interviews.html
```

**기능**:
- 📰 보도자료/인터뷰 관리
- 🏷️ 카테고리별 필터 (언론사/포털웹/유튜브/블로그)
- 🔍 실시간 검색
- 📊 정렬 (최신순/오래된순/제목순)
- ➕ 인터뷰 추가
- ✏️ 인터뷰 수정
- 🗑️ 인터뷰 삭제
- 👁️ 상세 보기

---

### 4. 대시보드 (통합)
```
🔐 https://samsung-gfc.web.app/admin/dashboard.html
```

**기능**:
- 📊 실시간 통계
- 📈 지원 추이 그래프
- 🔔 최근 지원자 목록
- ⚡ 빠른 작업 링크

---

## 🔐 관리자 인증

### 현재 상태
- ⚠️ **인증 시스템 미구현**
- 📂 관리자 페이지는 URL 직접 접근 가능
- 🔒 프로덕션 배포 시 인증 필요

### 인증 구현 방법 (권장)

#### 방법 1: Firebase Authentication (권장)
```javascript
// Firebase Auth로 로그인 체크
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // 로그인 페이지로 리다이렉트
    window.location.href = '/admin/login.html';
  } else {
    // 관리자 권한 확인
    checkAdminRole(user.uid);
  }
});
```

#### 방법 2: 비밀번호 간단 인증
```javascript
// 간단한 비밀번호 체크
const password = prompt('관리자 비밀번호를 입력하세요:');
if (password !== 'your-secret-password') {
  alert('권한이 없습니다.');
  window.location.href = '/';
}
```

#### 방법 3: IP 제한 (Firebase Hosting)
```json
// firebase.json
{
  "hosting": {
    "headers": [{
      "source": "/admin/**",
      "headers": [{
        "key": "X-Frame-Options",
        "value": "DENY"
      }]
    }]
  }
}
```

---

## 📱 테스트 URL (현재 활성)

### 사용자 페이지
```
🧪 https://8001-iegb2ffd4gmay31dxhqvd-b9b802c4.sandbox.novita.ai
```

### 관리자 페이지 (테스트 환경)
```
🧪 http://localhost:8001/admin/applications.html
🧪 http://localhost:8001/admin/interviews.html
🧪 http://localhost:8001/admin/dashboard.html
```

**주의**: 샌드박스 URL은 임시이며, 세션 만료 시 변경됩니다.

---

## 🗂️ 파일 구조

```
프로젝트 루트
├── public/
│   ├── index.html              # 🌐 메인 사용자 페이지
│   ├── css/
│   │   ├── style.css           # 메인 스타일
│   │   └── official-form-v31.0.css
│   └── js/
│       ├── main.js
│       └── official-form-v31.0.js
│
└── admin/                      # 🔐 관리자 페이지
    ├── index.html              # 관리자 대시보드 (메인)
    ├── applications.html       # 지원자 관리
    ├── applications.js         # 지원자 관리 로직
    ├── interviews.html         # 인터뷰 관리
    ├── dashboard.html          # 통합 대시보드
    └── README.md               # 관리자 페이지 문서
```

---

## 🚀 Firebase Hosting 배포 후 URL

### 배포 명령어
```bash
firebase deploy --only hosting
```

### 배포 완료 후
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/samsung-gfc/overview
Hosting URL: https://samsung-gfc.web.app
```

### 접속 가능한 모든 URL
```
✅ https://samsung-gfc.web.app/                        (메인)
✅ https://samsung-gfc.web.app/admin/                  (관리자 대시보드)
✅ https://samsung-gfc.web.app/admin/applications.html (지원자 관리)
✅ https://samsung-gfc.web.app/admin/interviews.html   (인터뷰 관리)
✅ https://samsung-gfc.web.app/admin/dashboard.html    (통합 대시보드)
```

---

## 📊 Firestore Database

### Firestore Console
```
🔥 https://console.firebase.google.com/project/samsung-gfc/firestore
```

### Collections
```
📦 applications/        # 지원서 데이터
   ├── {documentId}
   ├── {documentId}
   └── ...

📦 interviews/          # 인터뷰/보도자료
   ├── {documentId}
   └── ...

📦 statistics/          # 통계 데이터
   └── ...
```

---

## 🔗 관련 링크

### GitHub
- **저장소**: https://github.com/jbebakPark/samsung-gfc-recuritment
- **Actions**: https://github.com/jbebakPark/samsung-gfc-recuritment/actions

### Firebase
- **Console**: https://console.firebase.google.com/project/samsung-gfc
- **Hosting**: https://console.firebase.google.com/project/samsung-gfc/hosting
- **Firestore**: https://console.firebase.google.com/project/samsung-gfc/firestore
- **Authentication**: https://console.firebase.google.com/project/samsung-gfc/authentication

---

## 🛡️ 보안 권장사항

### 프로덕션 배포 전 체크리스트
- [ ] Firebase Authentication 구현
- [ ] 관리자 권한 확인 로직 추가
- [ ] Firestore 보안 규칙 검토
- [ ] HTTPS 강제 적용
- [ ] 관리자 페이지 접근 로그 기록
- [ ] 비밀번호 복잡도 요구사항 설정
- [ ] 세션 타임아웃 설정

### Firestore 보안 규칙 (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 지원서: 생성은 누구나, 읽기/수정/삭제는 관리자만
    match /applications/{applicationId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
                                     request.auth.token.admin == true;
    }
    
    // 관리자 전용 컬렉션
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
                            request.auth.token.admin == true;
    }
  }
}
```

---

## 📞 문의

**프로젝트 관련**:
- 📧 이메일: jb2park@naver.com
- 📞 전화: 010-5137-2327

**GitHub Issues**:
- 🐛 버그 리포트: https://github.com/jbebakPark/samsung-gfc-recuritment/issues

---

## 📝 요약

| 대상 | URL | 상태 |
|------|-----|------|
| **사용자** | https://samsung-gfc.web.app | ✅ 준비 완료 |
| **관리자** | https://samsung-gfc.web.app/admin/ | ⚠️ 인증 필요 |
| **Firestore** | Firebase Console | ✅ 준비 완료 |

---

**작성일**: 2026-02-11  
**상태**: URL 구조 정의 완료  
**다음 단계**: Firebase 배포 → URL 활성화
