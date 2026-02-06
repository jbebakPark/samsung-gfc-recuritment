# 💾 지원자 정보 DB 저장 현황 및 구현 가이드

## 📋 현재 상황 (Phase 1)

### ❌ 현재는 DB에 저장되지 않습니다

**Phase 1 (현재)**:
- 프론트엔드만 구현
- 폼 제출 시 → 검증만 수행
- 실제 데이터 저장 **안 됨**
- `supabase-config.example.js` - 준비만 됨

**Phase 2 (예정)**:
- Supabase DB 연동
- 실제 데이터 저장
- 관리자 대시보드
- 자료 다운로드 권한 관리

---

## 🎯 구현 방법 3가지

### 방법 1: Supabase (권장) ⭐

**장점**:
- ✅ 무료 (월 500MB DB, 1GB Storage)
- ✅ PostgreSQL 기반
- ✅ 실시간 기능
- ✅ Row Level Security (보안)
- ✅ 자동 API 생성
- ✅ 쉬운 설정

**단점**:
- 외부 서비스 의존

**구현 단계**:

#### 1단계: Supabase 프로젝트 생성
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. URL과 API Key 복사

#### 2단계: DB 테이블 생성
```sql
-- applications 테이블
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  track VARCHAR(50) NOT NULL, -- 'jobfair', 'referral', 'direct'
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birth DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  region VARCHAR(50),
  fair_date VARCHAR(50),
  career TEXT,
  motivation TEXT,
  referrer_name VARCHAR(100),
  referrer_branch VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 승인된 사용자 테이블
CREATE TABLE approved_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  approved_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
```

#### 3단계: JavaScript 연동
```javascript
// supabase-config.js 생성
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxxxx.supabase.co'
const supabaseKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// 지원서 제출 함수
async function submitApplication(formData) {
  const { data, error } = await supabase
    .from('applications')
    .insert([{
      track: formData.track,
      name: formData.name,
      gender: formData.gender,
      birth: formData.birth,
      phone: formData.phone,
      email: formData.email,
      region: formData.region,
      fair_date: formData.fairDate,
      career: formData.career,
      motivation: formData.motivation,
      referrer_name: formData.referrerName,
      referrer_branch: formData.referrerBranch,
      status: 'pending'
    }])
    .select()
  
  if (error) {
    console.error('Error:', error)
    return { success: false, error: error.message }
  }
  
  console.log('Submitted:', data)
  return { success: true, data }
}

// 폼 제출 이벤트 수정
form.addEventListener('submit', async function(e) {
  e.preventDefault()
  
  // 폼 데이터 수집
  const formData = {
    track: 'jobfair',
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    birth: document.getElementById('birth').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    region: document.getElementById('region').value,
    // ... 기타 필드
  }
  
  // DB 저장
  const result = await submitApplication(formData)
  
  if (result.success) {
    alert('지원서가 성공적으로 제출되었습니다!')
    form.reset()
  } else {
    alert('제출 중 오류가 발생했습니다: ' + result.error)
  }
})
```

---

### 방법 2: Google Sheets (간단) 🚀

**장점**:
- ✅ 무료
- ✅ 설정 초간단
- ✅ 엑셀처럼 관리
- ✅ DB 지식 불필요

**단점**:
- 보안 취약
- 대용량 부적합
- 복잡한 쿼리 불가

**구현 단계**:

#### 1단계: Google Apps Script 작성
1. Google Sheets 생성
2. 확장 프로그램 → Apps Script
3. 다음 코드 작성:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('지원서');
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.track,
    data.name,
    data.gender,
    data.birth,
    data.phone,
    data.email,
    data.region,
    data.fairDate,
    data.career,
    data.motivation,
    data.referrerName,
    data.referrerBranch,
    'pending'
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### 2단계: 웹 앱으로 배포
1. 배포 → 새 배포
2. 액세스 권한: "모든 사용자"
3. 웹 앱 URL 복사

#### 3단계: JavaScript에서 호출
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/xxxxx/exec';

async function submitToGoogleSheets(formData) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}
```

---

### 방법 3: 이메일 전송 (최간단) 📧

**장점**:
- ✅ 즉시 구현 가능
- ✅ DB 불필요
- ✅ 이메일로 바로 확인

**단점**:
- 검색 불편
- 관리 불편
- 자동화 어려움

**구현 방법**:

#### EmailJS 사용
```html
<!-- EmailJS 라이브러리 추가 -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<script>
// EmailJS 초기화
emailjs.init('YOUR_PUBLIC_KEY');

// 폼 제출
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const templateParams = {
    track: '지원 유형',
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    birth: document.getElementById('birth').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    // ... 기타 필드
  };
  
  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
    .then(function(response) {
      alert('지원서가 제출되었습니다!');
      console.log('SUCCESS!', response.status, response.text);
      form.reset();
    }, function(error) {
      alert('제출 중 오류가 발생했습니다.');
      console.error('FAILED...', error);
    });
});
</script>
```

---

## 🎯 권장 구현 순서

### 즉시 구현 (1시간)
**방법 3: 이메일 전송**
1. EmailJS 가입
2. 템플릿 생성
3. JavaScript 추가
4. 테스트

**결과**: 지원서가 이메일로 바로 전송됨

---

### 단기 구현 (1일)
**방법 2: Google Sheets**
1. Google Sheets 생성
2. Apps Script 작성
3. 웹 앱 배포
4. JavaScript 연동
5. 테스트

**결과**: 지원서가 Google Sheets에 자동 저장됨

---

### 장기 구현 (3일)
**방법 1: Supabase**
1. Supabase 프로젝트 생성
2. DB 테이블 설계
3. JavaScript 연동
4. 관리자 대시보드 개발
5. 자료 다운로드 권한 관리
6. 테스트

**결과**: 완전한 DB 시스템 구축

---

## 📝 즉시 적용 가능한 코드

### index.html에 추가할 코드

```html
<!-- EmailJS 라이브러리 (</body> 직전에 추가) -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
// EmailJS 초기화
(function(){
    emailjs.init('YOUR_PUBLIC_KEY'); // EmailJS에서 받은 Public Key
})();

// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 활성화된 탭 확인
        const activeTab = document.querySelector('.tab-btn.active');
        const track = activeTab.getAttribute('data-track');
        
        // 폼 데이터 수집
        let formData = {
            track: track,
            submitted_at: new Date().toLocaleString('ko-KR')
        };
        
        // Job Fair 참가
        if (track === 'jobfair') {
            formData.name = document.getElementById('name').value;
            formData.gender = document.getElementById('gender').value;
            formData.birth = document.getElementById('birth').value;
            formData.phone = document.getElementById('phone').value;
            formData.email = document.getElementById('email').value || '없음';
            formData.region = document.getElementById('region').value || '없음';
            formData.fair_date = document.getElementById('fair-date').value || '없음';
        }
        // 추천인 지원
        else if (track === 'referral') {
            formData.name = document.getElementById('ref-name').value;
            formData.gender = document.getElementById('ref-gender').value;
            formData.birth = document.getElementById('ref-birth').value;
            formData.phone = document.getElementById('ref-phone').value;
            formData.email = document.getElementById('ref-email').value || '없음';
            formData.region = document.getElementById('ref-region').value || '없음';
            formData.referrer_name = document.getElementById('referrer-name').value;
            formData.referrer_branch = document.getElementById('referrer-branch').value || '없음';
            formData.career = document.getElementById('ref-career').value || '없음';
            formData.motivation = document.getElementById('ref-motivation').value || '없음';
        }
        // 직접 지원
        else if (track === 'direct') {
            formData.name = document.getElementById('dir-name').value;
            formData.gender = document.getElementById('dir-gender').value;
            formData.birth = document.getElementById('dir-birth').value;
            formData.phone = document.getElementById('dir-phone').value;
            // ... 기타 필드
        }
        
        // 로딩 표시
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
        
        // EmailJS로 전송
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('✅ 지원서가 성공적으로 제출되었습니다!\\n\\n영업일 기준 3일 이내에 담당자가 연락드립니다.');
                form.reset();
                
                // 나이 체크 메시지 제거
                document.querySelectorAll('.age-validation-message').forEach(msg => msg.remove());
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                alert('❌ 제출 중 오류가 발생했습니다.\\n\\n잠시 후 다시 시도해주시거나\\n담당자에게 직접 연락해주세요.\\n\\n📞 010-5137-2327');
            })
            .finally(function() {
                // 버튼 복구
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
});
</script>
```

---

## 🔐 보안 고려사항

### Supabase 사용 시
```javascript
// Row Level Security (RLS) 설정
-- applications 테이블
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 INSERT 가능
CREATE POLICY "Anyone can insert applications" 
ON applications FOR INSERT 
TO anon 
WITH CHECK (true);

-- 본인 데이터만 SELECT 가능
CREATE POLICY "Users can view own applications" 
ON applications FOR SELECT 
USING (email = auth.jwt() ->> 'email');

-- approved_users는 관리자만 접근
ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access approved_users" 
ON approved_users 
USING (auth.role() = 'service_role');
```

---

## 📊 권장 사항

| 상황 | 권장 방법 | 이유 |
|------|-----------|------|
| 빠른 테스트 | 이메일 전송 | 1시간 내 구현 |
| 중소규모 | Google Sheets | 간단 + 무료 |
| 본격 서비스 | Supabase | 확장성 + 보안 |
| 대규모 기업 | 자체 서버 | 완전한 통제 |

---

## 🎯 다음 단계

### 1. EmailJS 즉시 적용 (권장)
```bash
# 1. EmailJS 가입 (https://www.emailjs.com/)
# 2. Service 추가 (Gmail 또는 Outlook)
# 3. Template 생성
# 4. Public Key 복사
# 5. 위의 코드를 index.html에 추가
# 6. YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID 교체
# 7. 테스트
```

### 2. Supabase 장기 구현
```bash
# 1. Supabase 프로젝트 생성
# 2. DB 테이블 생성 (위의 SQL 실행)
# 3. supabase-config.js 작성
# 4. 기존 코드 연동
# 5. 관리자 대시보드 개발
```

---

## 📞 구현 지원

**즉시 적용을 원하시면**:
1. EmailJS 방법 선택 (1시간)
2. 위의 코드 복사
3. EmailJS 가입 및 설정
4. 테스트

**완전한 시스템을 원하시면**:
1. Supabase 방법 선택 (3일)
2. DB 설계
3. JavaScript 연동
4. 관리자 대시보드

---

**작성자**: Claude (AI Assistant)  
**날짜**: 2026-02-06  
**상태**: 구현 가이드 완료
