# 📱 카카오톡 실시간 알림 시스템 구축 가이드

**대상**: 카카오톡 ID: 2jbark  
**작성일**: 2026-01-02  
**버전**: 1.0.0

---

## 🎯 목표

GFC 지원서 제출 시 **지원 구분별로** 실시간으로 카카오톡 알림을 전송합니다.

---

## 📋 구현 방법 (3가지 옵션)

### ✅ **Option 1: 카카오톡 오픈채팅 웹훅** (추천 ⭐)

#### 장점
- ✅ 무료
- ✅ 설정 간단
- ✅ 즉시 적용 가능

#### 설정 방법

1. **오픈채팅방 생성**
   ```
   카카오톡 앱 → 오픈채팅 → + 버튼 → 오픈채팅방 만들기
   이름: "GFC 지원서 알림"
   ```

2. **웹훅 URL 생성**
   - 오픈채팅방 설정 → 봇 → 웹훅 추가
   - 웹훅 URL 복사 (예: `https://open.kakao.com/webhook/...`)

3. **코드에 적용**
   ```javascript
   // js/kakao-notification.js 파일에서
   const KAKAO_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';
   ```

4. **테스트**
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"text": "테스트 메시지"}'
   ```

---

### 🔐 **Option 2: 카카오 비즈메시지 API** (공식)

#### 장점
- ✅ 공식 API
- ✅ 안정적
- ✅ 개인 카카오톡으로 직접 전송

#### 단점
- ❌ 비즈니스 계정 필요
- ❌ 인증 절차 복잡
- ❌ 유료 (메시지당 과금)

#### 설정 방법

1. **카카오 디벨로퍼스 가입**
   - https://developers.kakao.com

2. **애플리케이션 생성**
   - 내 애플리케이션 → 애플리케이션 추가하기
   - 앱 이름: "GFC 지원서 알림"

3. **REST API 키 발급**
   - 앱 설정 → 일반 → REST API 키 복사

4. **카카오톡 채널 생성**
   - https://business.kakao.com/
   - 채널 개설 신청

5. **메시지 템플릿 등록**
   - 비즈메시지 → 템플릿 관리
   - 템플릿 등록 (사전 승인 필요)

6. **코드 구현**
   ```javascript
   const KAKAO_REST_API_KEY = 'YOUR_REST_API_KEY';
   const KAKAO_USER_ID = '2jbark';
   
   await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
       method: 'POST',
       headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/x-www-form-urlencoded'
       },
       body: new URLSearchParams({
           'template_object': JSON.stringify(templateObject)
       })
   });
   ```

---

### 📧 **Option 3: 이메일 알림 (대체 방법)**

#### 장점
- ✅ 구현 간단
- ✅ 무료 (일정 한도까지)
- ✅ 즉시 적용 가능

#### 설정 방법

1. **EmailJS 사용** (추천)
   - https://www.emailjs.com/ 가입
   - 무료 플랜: 월 200건

2. **서비스 생성**
   ```
   EmailJS 대시보드 → Add New Service → Gmail 선택
   ```

3. **템플릿 생성**
   ```
   Template Name: GFC Application Notification
   Subject: [GFC 지원서] {{application_type}} - {{name}}
   Content: 지원서 상세 정보...
   ```

4. **코드 적용**
   ```javascript
   emailjs.send(
       'YOUR_SERVICE_ID',
       'YOUR_TEMPLATE_ID',
       {
           to_email: 'jb2park@naver.com',
           application_type: applicationData.application_type,
           name: applicationData.name,
           // ... 기타 데이터
       }
   );
   ```

---

## 🔧 현재 구현 상태

### ✅ **완료된 작업**

1. ✅ **js/kakao-notification.js 파일 생성**
   - `sendKakaoNotification()` 함수 구현
   - 지원 구분별 메시지 포맷팅
   - 상세 정보 포함

2. ✅ **apply.html 업데이트**
   - 스크립트 추가: `<script src="js/kakao-notification.js"></script>`

3. ✅ **js/application.js 업데이트**
   - 지원서 제출 후 자동 알림 전송
   - 에러 처리 (알림 실패해도 지원서는 정상 제출)

---

## 📱 알림 메시지 형식

### **예시: 채용설명회 참가 지원자**

```
🔔 [신규 GFC 지원서 접수]

📋 지원 구분: 📅 채용설명회 참가
━━━━━━━━━━━━━━━━━━

👤 기본 정보
• 성명: 홍길동
• 생년월일: 1980-01-01
• 성별: 남
• 결혼: 기혼

📞 연락처
• 휴대전화: 010-1234-5678
• 자택전화: 02-1234-5678
• 이메일: hong@example.com

🏢 지점 정보
• 지점명: 안산법인지점
• 유치자: 박재박

🎓 학력
• 대학교 졸업 (졸업)
• 서울대학교
• 전공: 경영학

💼 경력
• 총 경력: 5년
• 보험사 경력: ✅ 있음
  - 삼성생명 (2년 6개월, 월 300만원)
• 자격증: CFP, AFPK

⚠️ 금융불량: ✅ NO (정상)

📅 채용설명회 정보
• 희망 날짜: 2026-02-15
• 희망 지역: 서울/경기

📝 지원 동기
기업 재무 컨설팅 분야에서 전문성을 키우고 싶어...

⏰ 제출 시간: 2026-01-02 14:30:25

━━━━━━━━━━━━━━━━━━
🔗 관리자 페이지에서 상세 확인
```

---

## 🚀 즉시 적용 방법 (빠른 시작)

### **Step 1: 오픈채팅방 웹훅 사용**

1. **카카오톡 오픈채팅방 생성**
   ```
   카카오톡 앱 → 오픈채팅 → + 버튼
   채팅방 이름: "GFC 지원서 알림"
   ```

2. **웹훅 URL 설정**
   - 채팅방 설정 → 봇 추가 → 웹훅
   - URL 복사

3. **코드 수정**
   ```javascript
   // js/kakao-notification.js 파일 열기
   // 18번째 줄 수정:
   
   const kakaoWebhookUrl = 'YOUR_WEBHOOK_URL'; // 여기에 복사한 URL 입력
   ```

4. **주석 해제**
   ```javascript
   // 40-44번째 줄 주석 제거:
   
   await fetch(kakaoWebhookUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ text: message })
   });
   ```

5. **테스트**
   - 지원서 제출
   - 오픈채팅방에서 알림 확인

---

### **Step 2: EmailJS 사용 (대체)**

1. **EmailJS 가입**
   - https://www.emailjs.com/
   - 무료 계정 생성

2. **서비스 연결**
   - Gmail 계정 연결
   - Service ID 복사

3. **템플릿 생성**
   ```
   Template ID: gfc_notification
   Subject: [GFC 지원서] {{name}} - {{application_type}}
   ```

4. **HTML에 스크립트 추가**
   ```html
   <!-- apply.html에 추가 -->
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script>
       emailjs.init('YOUR_PUBLIC_KEY');
   </script>
   ```

5. **알림 함수 수정**
   ```javascript
   // js/kakao-notification.js에서
   
   emailjs.send(
       'YOUR_SERVICE_ID',
       'YOUR_TEMPLATE_ID',
       {
           to_email: 'jb2park@naver.com',
           name: applicationData.name,
           phone: applicationData.phone,
           type: typeText[applicationData.application_type],
           message: message
       }
   );
   ```

---

## 🧪 테스트 방법

### **로컬 테스트**

```bash
# 1. 서버 실행
python -m http.server 8000

# 2. 브라우저에서 접속
http://localhost:8000/apply.html

# 3. 지원서 작성 및 제출

# 4. 개발자 도구 콘솔 확인
F12 → Console 탭
```

### **콘솔 로그 예시**
```
Application data prepared: {...}
📱 카카오톡 알림 전송 시작...
=== 카카오톡 알림 내용 ===
🔔 [신규 GFC 지원서 접수]
...
========================
✅ 카카오톡 알림 전송 성공
Application submitted successfully: {...}
```

---

## 📊 알림 발송 통계

### **지원 구분별 알림**

| 지원 구분 | 이모지 | 알림 내용 |
|----------|--------|----------|
| 채용설명회 참가 | 📅 | 희망 날짜/지역 포함 |
| 추천인 경로 | 👥 | 추천인 정보 포함 |
| 직접 지원 | 🌐 | 기본 정보만 |

### **알림 포함 정보**

✅ 기본 정보 (10개 항목)  
✅ 학력 정보 (4개 항목)  
✅ 경력 정보 (보험사 경력 포함)  
✅ 금융불량 여부  
✅ 조건부 정보 (설명회/추천인)  
✅ 지원 동기 (100자 요약)  
✅ 제출 시간  

---

## 🔒 보안 및 개인정보

### **주의사항**
1. ⚠️ 웹훅 URL은 외부에 노출하지 마세요
2. ⚠️ API 키는 환경 변수로 관리
3. ⚠️ 개인정보는 암호화 권장

### **환경 변수 설정 (권장)**
```javascript
// .env 파일
KAKAO_WEBHOOK_URL=https://...
EMAILJS_SERVICE_ID=service_...
EMAILJS_TEMPLATE_ID=template_...
```

---

## 🐛 문제 해결

### **Q1: 알림이 전송되지 않아요**
```
A: 개발자 도구 콘솔에서 에러 메시지 확인
   - 웹훅 URL이 정확한지 확인
   - CORS 에러 → 서버 사이드 프록시 사용
```

### **Q2: 메시지가 잘려서 보여요**
```
A: 카카오톡 메시지 길이 제한 (2000자)
   - 필요시 여러 메시지로 분할
   - 또는 요약 버전 사용
```

### **Q3: 알림은 오는데 지원서가 제출 안 돼요**
```
A: 알림 실패 시에도 지원서는 정상 제출됨
   - 알림은 부가 기능
   - 지원서 제출이 우선
```

---

## 📝 다음 단계

### **즉시 실행**
1. ✅ 오픈채팅방 생성
2. ✅ 웹훅 URL 설정
3. ✅ 코드 수정 (주석 해제)
4. ✅ 테스트 실행

### **향후 개선**
- 🔄 카카오 비즈메시지 전환 (개인 카카오톡 직접 전송)
- 🔄 알림 템플릿 다양화
- 🔄 알림 발송 이력 저장
- 🔄 관리자 페이지에서 알림 재전송

---

## 📞 문의

**기술 지원**
- 이메일: jb2park@naver.com
- 전화: 010-5137-2327
- 카카오톡 ID: 2jbark

---

**작성일**: 2026-01-02  
**버전**: 1.0.0  
**상태**: ✅ 구현 완료 (웹훅 URL 설정만 하면 즉시 작동)
