# GFC 지원자 정보 관리 시스템 - 구현 가이드

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [구현된 기능](#구현된-기능)
3. [Firebase 설정](#firebase-설정)
4. [알림 시스템 구현](#알림-시스템-구현)
5. [관리자 사용 가이드](#관리자-사용-가이드)
6. [다음 단계](#다음-단계)

---

## 시스템 개요

삼성생명 GFC 지원자 정보를 체계적으로 관리하고, 실시간 알림을 통해 지원자와 소통하는 통합 관리 시스템입니다.

### 핵심 기능
- ✅ 지원자 정보 자동 저장 및 관리
- ✅ 지원 구분별 분류 (Job Fair/추천인/직접지원)
- ✅ 서류 접수 방법별 관리
- ✅ 진행 상태 관리 및 추적
- ✅ 카카오톡/SMS/이메일 다중 알림
- ✅ 활동 로그 자동 기록
- ✅ 관리자 대시보드
- ✅ 데이터 엑셀 다운로드

---

## 구현된 기능

### 1. 데이터베이스 구조 (Firestore)

#### 📦 applicants (지원자 정보)
```javascript
{
  personalInfo: {
    name: "홍길동",
    birthDate: "1990-01-01",
    gender: "남",
    phone: "010-1234-5678",
    email: "example@email.com"
  },
  applicationType: "jobfair" | "referral" | "direct",
  submissionMethod: "online" | "visit" | "fax" | "email",
  status: "submitted" | "reviewing" | "interview_scheduled" | "accepted" | "rejected",
  statusHistory: [...],
  notifications: [...],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 📝 activity_logs (활동 로그)
```javascript
{
  type: "application_submit" | "status_change" | "notification_sent",
  applicantId: "APPLICANT_ID",
  action: "지원서 제출",
  description: "상세 설명",
  timestamp: Timestamp,
  ipAddress: "123.456.789.012"
}
```

#### 📨 notification_queue (알림 대기열)
```javascript
{
  type: "kakao" | "sms" | "email",
  recipient: {
    name: "홍길동",
    phone: "010-1234-5678",
    email: "example@email.com"
  },
  message: { ... },
  status: "pending" | "sent" | "failed",
  sentAt: Timestamp
}
```

### 2. 지원자 정보 저장 프로세스

```
지원서 제출
    ↓
Firestore 저장 (saveApplicantData)
    ↓
활동 로그 기록 (logActivity)
    ↓
알림 대기열 추가 (sendNotification)
    ↓
성공 모달 표시
```

### 3. 진행 상태 관리

```
접수완료 (submitted)
    ↓
심사중 (reviewing)
    ↓
면접통보 (interview_scheduled)
    ↓
면접완료 (interview_completed)
    ↓
합격 (accepted) / 불합격 (rejected)
```

각 상태 변경 시:
- statusHistory에 이력 추가
- 자동 알림 발송
- 활동 로그 기록

---

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `samsung-gfc-recruitment`
4. Google Analytics: 활성화 (권장)

### 2. Firestore Database 설정

1. Firebase Console > 빌드 > Firestore Database
2. "데이터베이스 만들기" 클릭
3. 위치: `asia-northeast3 (서울)` 선택
4. 보안 규칙: "프로덕션 모드에서 시작" 선택

### 3. Firebase 구성 파일 생성

`public/js/firebase-config.js` 파일 생성:

```javascript
// Firebase 설정
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

console.log('✅ Firebase 초기화 완료');
```

### 4. Firestore 보안 규칙 설정

Firebase Console > Firestore Database > 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 지원자 정보
    match /applicants/{applicantId} {
      allow read: if request.auth != null;
      allow create: if true; // 누구나 지원 가능
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // 활동 로그
    match /activity_logs/{logId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if false; // 로그는 수정/삭제 불가
    }
    
    // 알림 대기열
    match /notification_queue/{notificationId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
  }
}
```

### 5. Firestore 인덱스 생성

Firebase Console > Firestore Database > 색인:

```
컬렉션: applicants
필드: applicationType (ASC), createdAt (DESC)

컬렉션: applicants
필드: status (ASC), createdAt (DESC)

컬렉션: activity_logs
필드: applicantId (ASC), timestamp (DESC)

컬렉션: notification_queue
필드: status (ASC), scheduledAt (ASC)
```

---

## 알림 시스템 구현

### 1. 카카오톡 알림 (Kakao Alimtalk)

#### 준비사항
1. 카카오 비즈니스 계정 생성
2. 카카오톡 채널 개설
3. 알림톡 서비스 신청
4. 템플릿 등록 및 승인

#### 템플릿 예시

**접수완료 템플릿**
```
[삼성생명 GFC] 지원서 접수 완료

#{이름}님,

GFC 지원서가 성공적으로 접수되었습니다.

심사 후 연락드리겠습니다.
감사합니다.

문의: 010-5137-2327
```

**면접통보 템플릿**
```
[삼성생명 GFC] 면접 일정 안내

#{이름}님,

면접이 예정되었습니다.

일시: #{일시}
장소: #{장소}

자세한 내용은 이메일을 확인해주세요.
```

#### Firebase Functions 구현

`functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// 알림 대기열 모니터링
exports.processNotificationQueue = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    // pending 상태인 알림 조회
    const snapshot = await db.collection('notification_queue')
      .where('status', '==', 'pending')
      .where('scheduledAt', '<=', now)
      .limit(10)
      .get();
    
    const promises = [];
    snapshot.forEach(doc => {
      promises.push(sendNotification(doc.id, doc.data()));
    });
    
    await Promise.all(promises);
    return null;
  });

// 알림 발송 함수
async function sendNotification(notificationId, data) {
  const db = admin.firestore();
  
  try {
    if (data.type === 'kakao') {
      await sendKakaoNotification(data);
    } else if (data.type === 'sms') {
      await sendSMSNotification(data);
    } else if (data.type === 'email') {
      await sendEmailNotification(data);
    }
    
    // 상태 업데이트
    await db.collection('notification_queue').doc(notificationId).update({
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // 지원자 문서에 알림 기록
    await db.collection('applicants').doc(data.applicantId).update({
      notifications: admin.firestore.FieldValue.arrayUnion({
        type: data.type,
        status: 'sent',
        message: data.message.title || data.message.body,
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      })
    });
    
  } catch (error) {
    console.error('알림 발송 실패:', error);
    
    await db.collection('notification_queue').doc(notificationId).update({
      status: 'failed',
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
}

// 카카오톡 발송
async function sendKakaoNotification(data) {
  const response = await axios.post('https://api.kakao.com/v2/alimtalk/send', {
    template_id: data.message.templateId,
    receiver_phone: data.recipient.phone,
    variables: data.message.variables
  }, {
    headers: {
      'Authorization': `Bearer ${functions.config().kakao.api_key}`
    }
  });
  
  return response.data;
}

// SMS 발송 (알리고)
async function sendSMSNotification(data) {
  const response = await axios.post('https://apis.aligo.in/send/', {
    key: functions.config().aligo.api_key,
    user_id: functions.config().aligo.user_id,
    sender: '01051372327',
    receiver: data.recipient.phone,
    msg: data.message.body
  });
  
  return response.data;
}

// 이메일 발송
async function sendEmailNotification(data) {
  // SendGrid, AWS SES, 또는 Nodemailer 사용
  // 구현 예시는 생략
}
```

### 2. SMS 알림 (알리고)

#### API 설정
```bash
npm install axios

firebase functions:config:set aligo.api_key="YOUR_API_KEY"
firebase functions:config:set aligo.user_id="YOUR_USER_ID"
```

### 3. 이메일 알림

#### SendGrid 사용
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(functions.config().sendgrid.api_key);

async function sendEmailNotification(data) {
  const msg = {
    to: data.recipient.email,
    from: 'gfc@samsung.com',
    subject: data.message.subject,
    text: data.message.body,
    html: `<p>${data.message.body.replace(/\n/g, '<br>')}</p>`
  };
  
  await sgMail.send(msg);
}
```

---

## 관리자 사용 가이드

### 1. 관리자 대시보드 접속

URL: `https://your-domain.com/admin/dashboard.html`

### 2. 주요 기능

#### 📊 실시간 통계
- **전체 지원자**: 누적 지원자 수
- **심사 대기**: 접수완료 + 심사중 상태
- **면접 예정**: 면접통보 상태
- **합격자**: 최종 합격 상태

#### 🔍 필터링 및 검색
- 지원 구분 필터
- 접수 방법 필터
- 진행 상태 필터
- 이름/이메일/전화번호 검색

#### 📋 지원자 목록 관리
- 페이지당 20개 항목 표시
- 정렬: 최신순
- 체크박스 선택 기능

#### ⚙️ 개별 작업
- **상세보기** (👁): 지원자 전체 정보 조회
- **수정** (✏️): 지원자 정보 수정
- **알림발송** (✉️): 개별 알림 발송
- **상태변경** (⇄): 진행 상태 업데이트

#### 📤 일괄 작업
- **엑셀 다운로드**: CSV 형식으로 전체 데이터 다운로드
- **일괄 알림**: 선택된 지원자에게 동일 메시지 발송

### 3. 상태 변경 프로세스

```
1. 지원자 선택
2. 상태변경 버튼 클릭
3. 새로운 상태 선택:
   1: 접수완료
   2: 심사중
   3: 면접통보
   4: 면접완료
   5: 합격
   6: 불합격
4. 메모 입력 (선택사항)
5. 확인
```

상태 변경 시 자동으로:
- statusHistory에 이력 추가
- 지원자에게 알림 발송
- 활동 로그 기록

---

## 다음 단계

### 1. 양식 다운로드 실명 인증 시스템

#### 구현 계획
- PASS 인증 연동
- 휴대폰 본인인증 연동
- 다운로드 로그 기록
- 개인정보 암호화 저장

### 2. 문서 스캔 자동 입력 (OCR)

#### 구현 계획
- Google Cloud Vision API 연동
- 지원서 양식 자동 인식
- 데이터 추출 및 검증
- Firestore 자동 저장

### 3. Firebase Functions 배포

```bash
# Functions 설치
cd functions
npm install

# 환경 변수 설정
firebase functions:config:set kakao.api_key="YOUR_KEY"
firebase functions:config:set aligo.api_key="YOUR_KEY"
firebase functions:config:set sendgrid.api_key="YOUR_KEY"

# 배포
firebase deploy --only functions
```

### 4. 관리자 인증 시스템

#### Firebase Authentication 설정
```javascript
// 관리자 계정 생성
const auth = firebase.auth();
auth.createUserWithEmailAndPassword('admin@samsung.com', 'password')
  .then(userCredential => {
    // 관리자 권한 부여
    db.collection('admin_users').doc(userCredential.user.uid).set({
      email: 'admin@samsung.com',
      name: '관리자',
      role: 'super_admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
```

---

## 📞 문의

시스템 관련 문의사항이 있으시면 연락 주세요.

- 📧 이메일: jb2park@naver.com
- 📱 전화: 010-5137-2327
- 💬 카카오톡: [오픈채팅](https://open.kakao.com/o/sHw2Wgci)

---

**© 2026 삼성생명보험주식회사. All rights reserved.**
