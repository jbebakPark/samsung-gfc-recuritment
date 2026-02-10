# GFC 지원자 관리 시스템 - 데이터베이스 구조

## 1. Firestore 컬렉션 구조

### 1.1 applicants (지원자 정보)
```javascript
{
  id: "AUTO_GENERATED_ID",
  
  // 기본 정보
  personalInfo: {
    name: "홍길동",
    birthDate: "1990-01-01",
    gender: "남",
    maritalStatus: "기혼",
    phone: "010-1234-5678",
    homePhone: "02-1234-5678",
    email: "example@email.com",
    address: "서울특별시 서초구...",
    addressDetail: "101동 101호"
  },
  
  // 지원 구분
  applicationType: "jobfair" | "referral" | "direct",
  applicationTypeLabel: "채용설명회 참가" | "추천인 경로" | "직접 지원",
  
  // 서류 접수 방법
  submissionMethod: "online" | "visit" | "fax" | "email",
  submissionMethodLabel: "전자접수" | "직접방문" | "팩스" | "이메일",
  
  // 지점 정보
  branch: "안산법인지점",
  recruiter: "박재박",
  
  // 학력 정보
  education: {
    level: "대졸",
    status: "졸업",
    school: "○○대학교",
    major: "경영학과"
  },
  
  // 경력 정보
  career: {
    hasInsuranceExperience: true,
    insuranceCompany: "△△생명",
    insurancePeriod: "3년",
    insuranceSalary: "500",
    hasOtherExperience: true,
    otherCompany: "□□기업",
    otherPosition: "영업팀장",
    otherPeriod: "5년"
  },
  
  // 금융 정보
  financial: {
    hasDelinquency: false
  },
  
  // 지원 동기
  motivation: {
    reason: "...",
    introduction: "..."
  },
  
  // Job Fair 정보 (applicationType === "jobfair"인 경우)
  jobFairInfo: {
    date: "2026-01-08",
    time: "10:30",
    attendanceConfirmed: false
  },
  
  // 추천인 정보 (applicationType === "referral"인 경우)
  referralInfo: {
    name: "김추천",
    phone: "010-9876-5432",
    branch: "서초지점"
  },
  
  // 동의 정보
  consents: {
    collection: true,
    thirdParty: true,
    creditInquiry: true,
    marketing: false
  },
  
  // 진행 상태
  status: "submitted" | "reviewing" | "interview_scheduled" | "interview_completed" | "accepted" | "rejected",
  statusLabel: "접수완료" | "심사중" | "면접통보" | "면접완료" | "합격" | "불합격",
  statusHistory: [
    {
      status: "submitted",
      timestamp: "2026-02-10T10:00:00Z",
      note: "지원서 접수 완료"
    }
  ],
  
  // 알림 이력
  notifications: [
    {
      type: "kakao" | "sms" | "email",
      status: "sent" | "failed",
      message: "접수 완료 알림",
      sentAt: "2026-02-10T10:01:00Z",
      result: "success"
    }
  ],
  
  // 문서 정보
  documents: [
    {
      type: "application_form",
      url: "https://...",
      uploadedAt: "2026-02-10T10:00:00Z",
      scanned: false
    }
  ],
  
  // 메타 정보
  createdAt: Timestamp,
  updatedAt: Timestamp,
  submittedAt: Timestamp,
  ipAddress: "123.456.789.012",
  userAgent: "Mozilla/5.0...",
  
  // 관리자 메모
  adminNotes: [
    {
      author: "관리자명",
      note: "면접 일정 조율 필요",
      createdAt: Timestamp
    }
  ]
}
```

### 1.2 activity_logs (활동 로그)
```javascript
{
  id: "AUTO_GENERATED_ID",
  
  // 로그 유형
  type: "application_submit" | "status_change" | "notification_sent" | "document_download" | "document_upload" | "admin_action",
  
  // 관련 지원자 ID
  applicantId: "APPLICANT_ID",
  
  // 활동 상세
  action: "지원서 제출" | "상태 변경" | "알림 발송" | "문서 다운로드" | "문서 업로드" | "관리자 조치",
  description: "상세 설명",
  
  // 변경 전/후 데이터 (상태 변경 시)
  before: { ... },
  after: { ... },
  
  // 사용자 정보
  userId: "USER_ID",
  userName: "홍길동",
  userEmail: "example@email.com",
  
  // 관리자 정보 (관리자 액션인 경우)
  adminId: "ADMIN_ID",
  adminName: "관리자명",
  
  // 메타 정보
  timestamp: Timestamp,
  ipAddress: "123.456.789.012",
  userAgent: "Mozilla/5.0...",
  
  // 추가 데이터
  metadata: {
    notificationType: "kakao",
    documentType: "application_form",
    ...
  }
}
```

### 1.3 document_downloads (문서 다운로드 로그)
```javascript
{
  id: "AUTO_GENERATED_ID",
  
  // 문서 정보
  documentType: "application_form" | "consent_form" | "personal_info_form",
  documentName: "GFC 지원서 양식",
  
  // 다운로드한 사용자 정보
  userName: "홍길동",
  userPhone: "010-1234-5678",
  userEmail: "example@email.com",
  
  // 실명 인증 정보
  verified: true,
  verificationMethod: "phone" | "ipin" | "pass",
  verificationData: {
    name: "홍길동",
    birthDate: "1990-01-01",
    phone: "010-1234-5678",
    ci: "ENCRYPTED_CI",
    di: "ENCRYPTED_DI"
  },
  
  // 다운로드 정보
  downloadedAt: Timestamp,
  ipAddress: "123.456.789.012",
  userAgent: "Mozilla/5.0...",
  
  // 사용 목적
  purpose: "지원서 작성",
  
  // 관련 지원서 ID (제출된 경우)
  relatedApplicationId: "APPLICANT_ID"
}
```

### 1.4 notification_queue (알림 대기열)
```javascript
{
  id: "AUTO_GENERATED_ID",
  
  // 알림 유형
  type: "kakao" | "sms" | "email",
  
  // 수신자 정보
  recipient: {
    name: "홍길동",
    phone: "010-1234-5678",
    email: "example@email.com",
    kakaoId: "KAKAO_USER_ID"
  },
  
  // 메시지 내용
  message: {
    title: "GFC 지원서 접수 완료",
    body: "지원서가 성공적으로 접수되었습니다...",
    templateId: "KAKAO_TEMPLATE_ID",
    variables: { ... }
  },
  
  // 관련 정보
  applicantId: "APPLICANT_ID",
  statusChange: {
    from: "submitted",
    to: "reviewing"
  },
  
  // 처리 상태
  status: "pending" | "sent" | "failed" | "cancelled",
  
  // 발송 정보
  scheduledAt: Timestamp,
  sentAt: Timestamp,
  
  // 실패 정보 (실패한 경우)
  error: {
    code: "ERROR_CODE",
    message: "Error message",
    retryCount: 0,
    lastRetryAt: Timestamp
  },
  
  // 메타 정보
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.5 admin_users (관리자 계정)
```javascript
{
  id: "AUTO_GENERATED_ID",
  
  // 계정 정보
  email: "admin@samsung.com",
  name: "관리자명",
  role: "super_admin" | "admin" | "viewer",
  
  // 권한
  permissions: {
    viewApplications: true,
    editApplications: true,
    deleteApplications: false,
    sendNotifications: true,
    manageUsers: false,
    viewLogs: true,
    exportData: true
  },
  
  // 소속
  branch: "본사",
  department: "인사팀",
  
  // 활동 정보
  lastLoginAt: Timestamp,
  lastActivityAt: Timestamp,
  
  // 계정 상태
  active: true,
  
  // 메타 정보
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.6 system_settings (시스템 설정)
```javascript
{
  id: "settings",
  
  // 알림 설정
  notifications: {
    kakao: {
      enabled: true,
      apiKey: "KAKAO_API_KEY",
      templates: {
        application_received: "TEMPLATE_ID_1",
        status_changed: "TEMPLATE_ID_2",
        interview_scheduled: "TEMPLATE_ID_3"
      }
    },
    sms: {
      enabled: true,
      provider: "aligo",
      apiKey: "SMS_API_KEY"
    },
    email: {
      enabled: true,
      smtpHost: "smtp.gmail.com",
      smtpPort: 587
    }
  },
  
  // 지원 설정
  application: {
    acceptingApplications: true,
    maintenanceMode: false,
    requireVerification: true
  },
  
  // 문서 설정
  documents: {
    applicationFormUrl: "https://...",
    consentFormUrl: "https://...",
    requireVerificationForDownload: true
  }
}
```

## 2. Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 지원자 정보 - 본인과 관리자만 접근
    match /applicants/{applicantId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin']);
      
      allow create: if request.auth != null;
      
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // 활동 로그 - 관리자만 읽기
    match /activity_logs/{logId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin', 'viewer'];
      
      allow create: if request.auth != null;
      
      allow update, delete: if false; // 로그는 수정/삭제 불가
    }
    
    // 문서 다운로드 로그
    match /document_downloads/{downloadId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin', 'viewer'];
      
      allow create: if request.auth != null;
      
      allow update, delete: if false;
    }
    
    // 알림 대기열 - 관리자만 접근
    match /notification_queue/{notificationId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // 관리자 계정 - 슈퍼 관리자만 수정
    match /admin_users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // 시스템 설정 - 슈퍼 관리자만 수정
    match /system_settings/{settingId} {
      allow read: if request.auth != null;
      
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

## 3. 인덱스 설정

Firestore 인덱스 필요 항목:
- `applicants`: `applicationType` (ASC), `createdAt` (DESC)
- `applicants`: `status` (ASC), `createdAt` (DESC)
- `applicants`: `submissionMethod` (ASC), `createdAt` (DESC)
- `activity_logs`: `applicantId` (ASC), `timestamp` (DESC)
- `activity_logs`: `type` (ASC), `timestamp` (DESC)
- `document_downloads`: `userName` (ASC), `downloadedAt` (DESC)
- `notification_queue`: `status` (ASC), `scheduledAt` (ASC)

## 4. 백업 전략

1. **자동 백업**: Firebase 프로젝트 설정에서 일일 자동 백업 활성화
2. **수동 백업**: 주요 마일스톤마다 Firestore 익스포트 실행
3. **로그 아카이브**: 90일 이상 된 로그는 Cloud Storage로 아카이브
4. **개인정보 보호**: 백업 데이터 암호화 및 접근 제한

## 5. 데이터 보존 정책

1. **지원자 정보**: 채용 종료 후 3년 보관 후 삭제
2. **활동 로그**: 1년 보관 후 아카이브
3. **알림 기록**: 6개월 보관
4. **다운로드 로그**: 2년 보관 (개인정보보호법 준수)
