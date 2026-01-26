# 카카오톡 알림톡 템플릿 - 최종 확정본

## 📱 템플릿 1: 지원자 접수 확인 (`APPLICANT_CONFIRMATION`) ✅ 확정

```
[삼성생명 GFC]
#{name}님, 지원서가 정상적으로 접수되었습니다.

📋 관리번호: #{managementNumber}
📅 접수일시: #{date}
📍 지원구분: #{type}

빠른 시일 내에 검토 후 개별 연락드리겠습니다.

▶ 지원 내용 확인
https://gfc-recruit.com/status/#{id}

문의: 02-1234-5678
삼성생명 GFC 채용팀
```

**변수 (Variables)**:
- `#{name}`: 지원자 성명
- `#{managementNumber}`: 관리번호 (예: GFC-2026-0001)
- `#{date}`: 접수일시 (예: 2026. 1. 26. 오후 8:39:54)
- `#{type}`: 지원구분 (Job Fair 참가 / 추천인 경로)
- `#{id}`: 지원서 ID (상태 확인용)

**특징**:
- ✅ 공식적이고 전문적인 톤
- ✅ 핵심 정보 명확히 전달
- ✅ 상태 확인 링크 제공
- ✅ 문의 연락처 명시

---

## 📱 템플릿 2: 관리자 신규 지원 알림 (`ADMIN_NEW_APPLICATION`)

```
[GFC 신규 지원]
관리번호: #{managementNumber}
이름: #{name}
연락처: #{phone}
구분: #{type}

관리자 페이지에서 확인하세요.
```

**변수 (Variables)**:
- `#{managementNumber}`: 관리번호
- `#{name}`: 지원자 성명
- `#{phone}`: 연락처
- `#{type}`: 지원구분 (Job Fair / 추천인)

---

## 📱 템플릿 3: 상태 변경 알림 (`STATUS_CHANGE`)

```
[삼성생명 GFC]
#{name}님의 지원 상태가 변경되었습니다.

변경 상태: #{status}
안내사항: #{memo}

문의: 02-1234-5678
삼성생명 GFC 채용팀
```

**변수 (Variables)**:
- `#{name}`: 지원자 성명
- `#{status}`: 변경된 상태 (접수 대기 / 검토 중 / 합격 / 불합격)
- `#{memo}`: 안내사항 (선택)

---

## 📱 템플릿 4: JOB 설명회 참석 확인 (`JOB_FAIR_CONFIRMATION`)

```
[삼성생명 GFC] JOB 설명회 참석 신청 완료 🎉

#{name}님, 환영합니다!
GFC JOB 설명회 참석 신청이 완료되었습니다.

━━━━━━━━━━━━━━━━━━
📋 신청 정보
━━━━━━━━━━━━━━━━━━
관리번호: #{managementNumber}
일시: #{eventDate}
시간: #{eventTime}
장소: #{eventLocation}

━━━━━━━━━━━━━━━━━━
💡 안내 사항
━━━━━━━━━━━━━━━━━━
• 행사 1일 전 다시 안내드립니다
• 무료 주차 지원
• 참석자 전원 기념품 증정

문의: 02-1234-5678
삼성생명 GFC 채용팀

함께 성장할 그날을 기대합니다! 💪
```

**변수 (Variables)**:
- `#{name}`: 참석자 성명
- `#{managementNumber}`: 관리번호 (예: JOB-202601-0001)
- `#{eventDate}`: 행사 날짜
- `#{eventTime}`: 행사 시간
- `#{eventLocation}`: 행사 장소

---

## 📱 템플릿 5: JOB 설명회 관리자 알림 (`ADMIN_JOB_FAIR_REGISTRATION`)

```
[GFC JOB 설명회] 신규 참석 신청

신청자: #{name}
연락처: #{phone}
관리번호: #{managementNumber}
행사일: #{eventDate}

▶ 관리자 페이지에서 확인하기
https://gfc-admin.com/job-fair
```

**변수 (Variables)**:
- `#{name}`: 참석자 성명
- `#{phone}`: 연락처
- `#{managementNumber}`: 관리번호
- `#{eventDate}`: 행사 날짜

---

## 🔧 카카오톡 알림톡 템플릿 등록 방법

### 1단계: 카카오 비즈니스 채널 생성
1. https://business.kakao.com 접속
2. 로그인 후 "채널 만들기"
3. 채널명: "삼성생명 GFC 채용"
4. 검색용 아이디 설정
5. 채널 검수 신청

### 2단계: 알림톡 템플릿 등록
1. 메시지 → 알림톡 → 템플릿 관리
2. "템플릿 등록" 클릭
3. 위 템플릿 내용 복사 & 붙여넣기
4. 템플릿 코드 입력 (예: `APPLICANT_CONFIRMATION`)
5. 변수 설정 (#{name}, #{managementNumber} 등)
6. 검수 신청

### 3단계: API 키 발급
1. Kakao Developers (https://developers.kakao.com) 접속
2. 내 애플리케이션 → 앱 만들기
3. 플랫폼 설정 → Web 플랫폼 등록
4. 제품 설정 → 카카오 로그인 활성화
5. REST API 키 복사

### 4단계: Firebase Functions 환경 변수 설정
```bash
# 카카오 API 설정
firebase functions:config:set kakao.api_key="YOUR_REST_API_KEY"
firebase functions:config:set kakao.sender_key="YOUR_SENDER_KEY"

# 이메일 설정
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# 관리자 설정
firebase functions:config:set admin.email="admin@example.com"
firebase functions:config:set admin.phone="010-1234-5678"

# 설정 확인
firebase functions:config:get
```

### 5단계: Functions 배포
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 📊 템플릿 사용 현황

| 템플릿 코드 | 용도 | 발송 시점 | 상태 |
|------------|------|----------|------|
| `APPLICANT_CONFIRMATION` | 지원자 접수 확인 | 지원서 제출 즉시 | ✅ 확정 (안 1) |
| `ADMIN_NEW_APPLICATION` | 관리자 신규 지원 알림 | 지원서 제출 즉시 | ✅ 활성 |
| `STATUS_CHANGE` | 상태 변경 알림 | 상태 변경 시 | ✅ 활성 |
| `JOB_FAIR_CONFIRMATION` | JOB 설명회 참석 확인 | 설명회 신청 즉시 | ✅ 활성 |
| `ADMIN_JOB_FAIR_REGISTRATION` | JOB 설명회 관리자 알림 | 설명회 신청 즉시 | ✅ 활성 |

---

## ⚠️ 주의사항

1. **템플릿 검수**: 카카오 비즈니스 채널 검수 완료 후 사용 가능 (보통 1~3일 소요)
2. **변수 형식**: 변수는 반드시 `#{변수명}` 형식으로 작성
3. **메시지 길이**: 1,000자 이내 권장
4. **이모지 사용**: 과도한 이모지는 검수 반려 가능성 있음
5. **광고성 문구**: "무료", "할인" 등 광고성 문구 자제

---

## 📞 문의

- 카카오 비즈니스 고객센터: 1544-4293
- Firebase 지원: https://firebase.google.com/support

---

**모든 템플릿이 검수 승인되면 자동으로 발송됩니다!** 🚀
