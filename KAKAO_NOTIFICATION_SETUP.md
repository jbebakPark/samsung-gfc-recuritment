# 📱 카카오톡 실시간 알림 설정 가이드

> **삼성생명 GFC 채용 시스템 - 지원자 실시간 알림**
> 
> 지원서가 제출되면 즉시 카카오톡 ID: **2jbark**로 알림이 전송됩니다.

---

## ✅ 현재 구현 상태

### 🟢 완료된 기능
- ✅ 지원서 제출 시 자동 알림 트리거
- ✅ 지원 구분별 맞춤 메시지 생성
  - 📅 채용설명회 참가
  - 👥 추천인 경로  
  - 🌐 직접 지원
- ✅ 상세 지원자 정보 포함
  - 기본 정보 (성명, 생년월일, 성별, 결혼 여부)
  - 연락처 (휴대전화, 자택전화, 이메일)
  - 지점 정보 (지점명, 유치자)
  - 학력 정보
  - 경력 정보 (보험사 경력 포함)
  - 금융불량 여부
  - 지원 동기 (100자 요약)
  - 제출 시간
- ✅ 조건부 정보 표시
  - 채용설명회: 희망 날짜 및 지역
  - 추천인 경로: 추천인 정보
- ✅ 콘솔 로그로 알림 내용 확인 가능

---

## 🔧 카카오톡 알림 설정 방법

현재 시스템은 **알림 메시지 생성**까지 완료되었으며, 실제 카카오톡 전송을 위해서는 아래 3가지 방법 중 하나를 선택하여 구성해야 합니다.

---

### **방법 1: 카카오톡 오픈채팅 웹훅** ⭐ 추천

#### 장점
- 무료
- 설정 간단
- 실시간 알림

#### 설정 방법

1. **카카오톡 오픈채팅방 생성**
   - 카카오톡 앱 실행
   - "채팅" → 우측 상단 "+" → "오픈채팅"
   - "오픈채팅 시작하기"
   - 채팅방 이름: "GFC 지원자 알림"
   - 참여자: 본인만 (또는 담당자 추가)

2. **Webhook 봇 연동**
   - 카카오톡 오픈채팅방에서 웹훅 URL 생성
   - [카카오톡 오픈채팅 봇 설정](https://open.kakao.com/)에서 봇 생성
   - Webhook URL을 복사

3. **코드 수정**
   
   `js/kakao-notification.js` 파일의 72번째 줄을 수정:

   ```javascript
   // 기존 코드
   const kakaoWebhookUrl = 'YOUR_KAKAO_WEBHOOK_URL';
   
   // 수정 후
   const kakaoWebhookUrl = '여기에_복사한_Webhook_URL_입력';
   ```

4. **알림 전송 활성화**
   
   `js/kakao-notification.js` 파일의 85-89번째 줄 주석 해제:

   ```javascript
   // 주석 제거 전
   // await fetch(kakaoWebhookUrl, {
   //     method: 'POST',
   //     headers: { 'Content-Type': 'application/json' },
   //     body: JSON.stringify({ text: message })
   // });
   
   // 주석 제거 후
   await fetch(kakaoWebhookUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ text: message })
   });
   ```

---

### **방법 2: 카카오톡 비즈메시지 API**

#### 장점
- 공식 API
- 안정적
- 1:1 개인 메시지 전송 가능

#### 단점
- 유료 (건당 과금)
- 비즈니스 인증 필요
- 설정 복잡

#### 설정 방법

1. **카카오 비즈니스 계정 생성**
   - [Kakao Business](https://business.kakao.com/) 접속
   - 비즈니스 계정 등록
   - 알림톡 채널 생성

2. **REST API 키 발급**
   - [Kakao Developers](https://developers.kakao.com/) 접속
   - 앱 생성
   - REST API 키 발급
   - 플랫폼 설정 (Web)

3. **메시지 템플릿 등록**
   - 카카오 비즈니스 관리자 센터
   - 메시지 템플릿 등록 (심사 필요)
   - 템플릿 코드 발급

4. **코드 수정**

   `js/kakao-notification.js` 파일 수정:

   ```javascript
   const kakaoApiUrl = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
   const REST_API_KEY = '여기에_REST_API_키_입력';
   
   await fetch(kakaoApiUrl, {
       method: 'POST',
       headers: { 
           'Authorization': `Bearer ${REST_API_KEY}`,
           'Content-Type': 'application/x-www-form-urlencoded'
       },
       body: new URLSearchParams({
           template_object: JSON.stringify({
               object_type: 'text',
               text: message,
               link: {
                   web_url: 'https://your-site.com/admin/applications.html'
               }
           })
       })
   });
   ```

---

### **방법 3: 이메일 알림 (대체 방법)**

#### 장점
- 무료
- 설정 간단
- 별도 서비스 불필요

#### 설정 방법

1. **이메일 전송 API 사용** (예: EmailJS)
   - [EmailJS](https://www.emailjs.com/) 가입
   - 무료 플랜: 월 200건
   - 템플릿 생성

2. **코드 수정**

   `js/kakao-notification.js` 파일에 EmailJS 추가:

   ```javascript
   // EmailJS SDK 추가 (apply.html의 <head>에 추가)
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   
   // 초기화
   emailjs.init('YOUR_PUBLIC_KEY');
   
   // 이메일 전송
   await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
       to_email: 'jb2park@naver.com', // 또는 2jbark@kakao.com
       subject: '[GFC 지원서] ' + applicationData.name + ' 님 지원',
       message: message
   });
   ```

---

## 📊 알림 메시지 예시

### 📅 채용설명회 참가 지원자

```
🔔 [신규 GFC 지원서 접수]

📋 지원 구분: 📅 채용설명회 참가
━━━━━━━━━━━━━━━━━━

👤 기본 정보
• 성명: 홍길동
• 생년월일: 1985-03-15
• 성별: 남
• 결혼: 기혼

📞 연락처
• 휴대전화: 010-1234-5678
• 자택전화: 02-1234-5678
• 이메일: hong@email.com

🏢 지점 정보
• 지점명: 안산법인지점
• 유치자: 박재박

🎓 학력
• 대학교 졸업 (졸업)
• 한양대학교
• 전공: 경영학과

💼 경력
• 총 경력: 5년
• 보험사 경력: ✅ 있음
  - 삼성생명 (3년 6개월, 월 400만원)
• 자격증: CFP, 투자자산운용사

⚠️ 금융불량: ✅ NO (정상)

📅 채용설명회 정보
• 희망 날짜: 2026-02-01
• 희망 지역: 서울/경기

📝 지원 동기
정년 없이 일할 수 있는 전문직에 매력을 느꼈고, 삼성생명의 체계적인 교육 시스템이 저의 성장에 큰 도움이 될 것이라 확신합니다...

⏰ 제출 시간: 2026. 1. 2. 오후 2:30:45

━━━━━━━━━━━━━━━━━━
🔗 관리자 페이지에서 상세 확인
```

### 👥 추천인 경로 지원자

```
🔔 [신규 GFC 지원서 접수]

📋 지원 구분: 👥 추천인 경로
━━━━━━━━━━━━━━━━━━

👤 기본 정보
• 성명: 김철수
• 생년월일: 1980-06-20
• 성별: 남
• 결혼: 기혼

📞 연락처
• 휴대전화: 010-9876-5432
• 이메일: kim@email.com

🏢 지점 정보
• 지점명: 안산법인지점
• 유치자: 박재박

🎓 학력
• 대졸 (졸업)
• 성균관대학교
• 전공: 금융학과

💼 경력
• 총 경력: 10년
• 보험사 경력: ❌ 없음
• 자격증: CFA, FRM

⚠️ 금융불량: ✅ NO (정상)

👥 추천인 정보
• 추천인: 이영희
• 연락처: 010-1111-2222
• 소속: 서초지점

📝 지원 동기
현직 GFC인 이영희 부장님의 추천으로 지원하게 되었습니다. 금융권 10년 경력을 바탕으로 기업고객에게 최상의 서비스를 제공하고 싶습니다...

⏰ 제출 시간: 2026. 1. 2. 오후 3:15:20

━━━━━━━━━━━━━━━━━━
🔗 관리자 페이지에서 상세 확인
```

---

## 🧪 테스트 방법

### 1. 브라우저 콘솔에서 확인

1. 지원서 제출 페이지 접속: `http://localhost:8000/apply.html`
2. F12 키 → Console 탭 열기
3. 지원서 작성 및 제출
4. 콘솔에서 알림 메시지 확인:

```
📱 카카오톡 알림 전송 시작...
=== 카카오톡 알림 내용 ===
[위의 메시지 내용이 여기 표시됨]
========================
✅ 카카오톡 알림 전송 성공
```

### 2. 실제 전송 테스트

- Webhook URL 설정 완료 후
- 실제 지원서 제출
- 카카오톡 오픈채팅방에서 메시지 확인

---

## 🔒 보안 고려사항

### 주의사항

1. **API 키 보안**
   - REST API 키는 `.env` 파일에 저장
   - GitHub에 업로드하지 않기 (`.gitignore` 추가)
   
   ```
   # .env 파일
   KAKAO_REST_API_KEY=your_api_key_here
   KAKAO_WEBHOOK_URL=your_webhook_url_here
   ```

2. **개인정보 보호**
   - 알림 메시지에는 필수 정보만 포함
   - 상세 정보는 관리자 페이지에서 확인
   - 카카오톡 오픈채팅방은 비공개로 설정

3. **CORS 이슈**
   - 정적 사이트에서는 서버 측 프록시 필요
   - Netlify Functions 또는 Vercel Functions 사용 권장

---

## 📝 구현 파일 목록

```
프로젝트/
├── apply.html                    # 지원서 페이지 (스크립트 로드)
├── js/
│   ├── application.js            # 폼 제출 로직 (알림 트리거)
│   └── kakao-notification.js     # 카카오톡 알림 함수
└── KAKAO_NOTIFICATION_SETUP.md   # 이 문서
```

---

## 🎯 다음 단계

### Phase 2-A: 실제 알림 연동 (1-2시간)

1. ✅ 카카오톡 오픈채팅방 생성
2. ✅ Webhook URL 발급
3. ✅ `js/kakao-notification.js` 수정
4. ✅ 테스트 및 검증

### Phase 2-B: 관리자 페이지 연동 (진행 중)

1. ⏳ `admin/applications.html` 완성
2. ⏳ 지원서 상태 변경 시 알림
3. ⏳ 관리자 댓글/메모 기능

---

## 🆘 문제 해결

### Q1: 알림이 전송되지 않아요

**A:** 브라우저 콘솔에서 에러 메시지 확인
- CORS 에러 → 서버 측 프록시 필요
- 401 Unauthorized → API 키 확인
- 네트워크 에러 → URL 확인

### Q2: 메시지 형식이 깨져요

**A:** 카카오톡은 Markdown 미지원
- 이모지는 정상 표시
- 줄바꿈은 `\n` 사용
- 긴 메시지는 분할 전송

### Q3: 비용이 발생하나요?

**A:** 방법에 따라 다름
- 오픈채팅 Webhook: 무료
- 비즈메시지 API: 유료 (건당 과금)
- 이메일: 무료 (제한 있음)

---

## 📞 지원 및 문의

- **개발 담당**: 박재박
- **카카오톡 ID**: 2jbark
- **이메일**: jb2park@naver.com
- **전화**: 010-5137-2327

---

> **마지막 업데이트**: 2026-01-02
> 
> **버전**: 1.0.0
> 
> **상태**: ✅ 준비 완료 (Webhook URL 설정만 필요)
