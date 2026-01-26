# GFC 지원자 관리 시스템 구현 완료

## 📋 구현 내용 요약

### ✅ 완료된 기능

#### 1. 관리자 대시보드 (`admin.html`)
- **통계 대시보드**: 전체/접수대기/검토중/합격 지원자 수 실시간 표시
- **필터링 기능**: 상태/지원구분/기간/검색어로 필터링
- **지원자 목록**: 테이블 형태로 전체 지원자 조회
- **상세 정보 조회**: 모달로 지원자 상세 정보 확인
- **상태 변경**: 접수대기 → 검토중 → 합격/불합격 상태 관리
- **Excel 다운로드**: 필터링된 지원자 목록 CSV 다운로드

#### 2. 당사 양식 기반 PDF 출력 (`pdf-generator.js`)
- **관리번호 자동 생성**: `GFC-2026-0001` 형식
- **당사 양식 레이아웃**: 업로드된 GFC 지원서 양식에 맞춰 PDF 생성
- **섹션별 출력**:
  - 개인 정보 (성명, 성별, 연령, 주소, 연락처, 이메일)
  - 학력 (학교명, 전공, 졸업구분, 졸업년월)
  - 경력 (회사명, 재직기간, 직위, 업종, 담당업무)
  - 자격증 (자격증명, 발급기관, 취득일)
- **다운로드/인쇄**: PDF 파일 다운로드 및 직접 인쇄 기능

#### 3. 실시간 알림 시스템 (`functions/index.js`)
- **지원서 제출 시 자동 알림**:
  - 관리자에게 이메일 + 카카오톡 알림
  - 지원자에게 접수 확인 이메일 + 카카오톡 알림
- **상태 변경 시 알림**:
  - 지원자에게 상태 변경 안내 이메일 + 카카오톡
- **관리번호 자동 부여**: Firestore Trigger로 자동 생성

#### 4. 데이터베이스 구조 (Firestore)
```
applications/{applicationId}
├── managementNumber: "GFC-2026-0001"
├── personalInfo: { name, gender, birthdate, phone, email, address }
├── education: [{ level, schoolName, major, graduationStatus, graduationDate }]
├── experience: [{ companyName, period, position, department, salary }]
├── certifications: [{ name, issuer, date }]
├── applicationInfo: { type, preferredLocation, jobFairDate, referrer }
├── status: "pending/review/approved/rejected"
├── statusHistory: [{ status, memo, updatedBy, updatedAt }]
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

## 🚀 배포 및 설정 가이드

### 1단계: Firebase 프로젝트 설정

```bash
# Firebase CLI 설치 (이미 설치되어 있음)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (이미 완료)
firebase init
```

### 2단계: Functions 배포

```bash
# Functions 디렉토리로 이동
cd functions

# 의존성 설치
npm install

# Functions 배포
firebase deploy --only functions
```

### 3단계: 환경 변수 설정

```bash
# 이메일 설정
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# 관리자 설정
firebase functions:config:set admin.email="admin@example.com"
firebase functions:config:set admin.phone="010-1234-5678"

# 카카오톡 API 설정
firebase functions:config:set kakao.api_key="YOUR_KAKAO_API_KEY"
firebase functions:config:set kakao.sender_key="YOUR_SENDER_KEY"

# 설정 확인
firebase functions:config:get
```

### 4단계: Firestore 보안 규칙 배포

```bash
firebase deploy --only firestore:rules
```

### 5단계: 관리자 계정 생성

Firebase Console에서 Authentication → Users → Add User
- 이메일: admin@example.com
- 비밀번호: (안전한 비밀번호 설정)
- Custom Claims 설정:
  ```json
  { "admin": true }
  ```

---

## 📱 카카오톡 알림톡 설정

### 1. 카카오 비즈니스 채널 생성
1. https://business.kakao.com 접속
2. 비즈니스 채널 생성
3. 채널 검수 신청

### 2. 알림톡 템플릿 등록

#### 템플릿 1: 관리자 신규 지원 알림 (`ADMIN_NEW_APPLICATION`)
```
[GFC 신규 지원]
관리번호: #{managementNumber}
이름: #{name}
연락처: #{phone}
구분: #{type}

관리자 페이지에서 확인하세요.
```

#### 템플릿 2: 지원자 접수 확인 (`APPLICANT_CONFIRMATION`)
```
[삼성생명 GFC]
#{name}님, 지원서가 접수되었습니다.

관리번호: #{managementNumber}
접수일: #{date}

빠른 시일 내에 연락드리겠습니다.
감사합니다.
```

#### 템플릿 3: 상태 변경 알림 (`STATUS_CHANGE`)
```
[삼성생명 GFC]
#{name}님의 지원 상태가 변경되었습니다.

변경 상태: #{status}
안내사항: #{memo}

문의: 02-1234-5678
```

### 3. API 키 발급
1. Kakao Developers (https://developers.kakao.com) 접속
2. 앱 생성
3. REST API 키 복사
4. Firebase Functions 환경 변수에 설정

---

## 🔧 사용 방법

### 관리자 대시보드 접속
1. `https://your-domain.com/admin.html` 접속
2. 관리자 계정으로 로그인
3. 지원자 목록 조회 및 관리

### 지원서 제출 (지원자)
1. `https://your-domain.com/apply.html` 접속
2. 지원서 작성 및 제출
3. 자동으로 관리번호 부여
4. 이메일 + 카카오톡 접수 확인 알림 수신

### PDF 출력
1. 관리자 대시보드에서 지원자 선택
2. "PDF 출력" 버튼 클릭
3. 당사 양식 형태로 PDF 다운로드 또는 인쇄

---

## 📊 주요 기능 흐름도

```
지원자 웹 페이지 제출
        ↓
Firestore에 저장
        ↓
Firebase Functions Trigger 발동
        ↓
┌───────────────────────┐
│ 1. 관리번호 자동 생성  │
│ 2. 관리자 알림 전송    │
│ 3. 지원자 확인 알림    │
└───────────────────────┘
        ↓
관리자 대시보드에 실시간 반영
        ↓
관리자가 상태 변경
        ↓
지원자에게 상태 변경 알림
```

---

## ⚠️ 주의사항

1. **Gmail 앱 비밀번호**: 2단계 인증 활성화 후 앱 비밀번호 생성 필요
2. **카카오톡 알림톡**: 비즈니스 채널 검수 완료 후 사용 가능
3. **관리자 권한**: Custom Claims 설정 필수
4. **PDF 한글 폰트**: jsPDF에 NanumGothic 폰트 추가 필요

---

## 📦 필요한 라이브러리

### HTML에 추가
```html
<!-- jsPDF (PDF 생성) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- jsPDF 한글 폰트 -->
<script src="https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js"></script>
```

---

## 🎯 다음 단계

1. ✅ Firebase 프로젝트 생성 및 설정
2. ✅ Functions 배포
3. ✅ 환경 변수 설정
4. ⏳ 카카오톡 비즈니스 채널 생성 및 템플릿 등록
5. ⏳ 관리자 계정 생성
6. ⏳ 실제 운영 환경 테스트

---

## 📞 문의

구현 관련 문의사항이 있으시면 언제든지 알려주세요!
