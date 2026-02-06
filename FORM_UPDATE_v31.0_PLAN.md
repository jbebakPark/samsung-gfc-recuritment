# 🎯 v31.0 삼성생명 공식 지원서 양식 적용

## 📋 개요
**버전**: v31.0  
**날짜**: 2026-02-06  
**목표**: 삼성생명 공식 GFC 지원서 양식에 맞춰 웹사이트 폼 수정

---

## 📄 제공된 양식 분석

### 1. GFC 지원서 양식
**파일**: `GFC_application_form_page1.png`

#### 필수 항목:
1. **기본 정보**
   - 성명
   - 성별 (선택)
   - 연령 (생년월일 대신)
   - 주소
   - 연락처 (지택/휴대폰)
   - E-mail

2. **금융투자 여부**
   - 1.YES / 2.NO
   - 결혼여부: 기혼 / 미혼

3. **보험사 경력**
   - 1.있음 (회사: ___, 경력: ___, 월급여: ___ 万)
   - 2.없음

4. **학력**
   - 학교명
   - 전공
   - 소재지
   - 졸업구분 (예: 졸업, 재학 등)
   - 졸업년월 (예: 20XX. XX)

5. **경력사항** (최대 4개)
   - 회사명
   - 재직기간 (년 월 ~ 년 월)
   - 직위
   - 업종
   - 담당업무(간략)

6. **참고사항** (자유 서술)

---

### 2. 개인정보 수집 동의서
**파일**: `privacy_consent_page1~3.png`

#### 수집·이용 목적
- 주민등록번호, 외국인등록번호 (암호화 저장)
- 고유식별정보 (2개)
- 개인(신용)정보
- 일반개인정보
- 신용거래정보
- 신용도판단정보
- 공공정보

#### 제공 목적
- 생명/손해보험협회
- 은행연합회
- 나이스신용평가정보㈜
- 서울보증보험
- 보험연수원
- 모집종사자 교육협의회

#### 조회 목적
- 생명/손해보험협회, 은행연합회, 나이스신용평가정보㈜ 등
- 보험설계사 지위 적부 판단
- 신용상태 조회

---

## 🎯 구현 계획

### Phase 1: 폼 구조 변경 ✅
1. **기본 정보**
   - [ ] 주소 필드 추가 (상세 주소)
   - [ ] 지택 연락처 추가
   - [ ] 연령 계산 (생년월일 기반)

2. **추가 정보**
   - [ ] 금융투자 여부 (YES/NO)
   - [ ] 결혼 여부 (기혼/미혼)
   - [ ] 보험사 경력 (있음/없음)
     - 있음 선택 시: 회사명, 경력(월), 월급여 입력

3. **학력**
   - [ ] 학교명 (고등학교, 대학교, 대학원)
   - [ ] 전공
   - [ ] 소재지
   - [ ] 졸업구분 (졸업, 재학, 중퇴, 수료 등)
   - [ ] 졸업년월

4. **경력사항** (동적 추가/삭제)
   - [ ] 회사명
   - [ ] 재직기간 (시작/종료)
   - [ ] 직위
   - [ ] 업종
   - [ ] 담당업무

5. **참고사항**
   - [ ] 자유 서술 텍스트 영역

### Phase 2: 개인정보 동의서 ✅
1. **동의서 모달 또는 펼침/접힘**
   - [ ] "개인정보 수집 및 이용 동의" 상세 내용
   - [ ] "개인정보 제공 동의" 상세 내용
   - [ ] "개인정보 조회 동의" 상세 내용

2. **필수 동의 체크박스**
   - [ ] 수집·이용 동의 (필수)
   - [ ] 제공 동의 (필수)
   - [ ] 조회 동의 (필수)

### Phase 3: DB 스키마 업데이트 ✅
```sql
ALTER TABLE applications ADD COLUMN address VARCHAR(200);
ALTER TABLE applications ADD COLUMN home_phone VARCHAR(20);
ALTER TABLE applications ADD COLUMN age INTEGER;
ALTER TABLE applications ADD COLUMN has_financial_investment BOOLEAN;
ALTER TABLE applications ADD COLUMN is_married BOOLEAN;
ALTER TABLE applications ADD COLUMN has_insurance_experience BOOLEAN;
ALTER TABLE applications ADD COLUMN insurance_company VARCHAR(100);
ALTER TABLE applications ADD COLUMN insurance_career_months INTEGER;
ALTER TABLE applications ADD COLUMN insurance_salary INTEGER;

-- 학력 (JSON 또는 별도 테이블)
ALTER TABLE applications ADD COLUMN education JSONB;
-- 예: [
--   { school: "서울대학교", major: "경영학", location: "서울", status: "졸업", graduation: "2015.02" },
--   { school: "서울고등학교", major: "-", location: "서울", status: "졸업", graduation: "2011.02" }
-- ]

-- 경력사항 (JSON 또는 별도 테이블)
ALTER TABLE applications ADD COLUMN work_experience JSONB;
-- 예: [
--   { company: "삼성전자", period_start: "2015.03", period_end: "2020.12", position: "부장", industry: "제조업", duties: "영업관리" },
--   { company: "LG전자", period_start: "2010.01", period_end: "2015.02", position: "과장", industry: "제조업", duties: "마케팅" }
-- ]

-- 참고사항
ALTER TABLE applications ADD COLUMN notes TEXT;

-- 개인정보 동의
ALTER TABLE applications ADD COLUMN consent_collection BOOLEAN DEFAULT FALSE;
ALTER TABLE applications ADD COLUMN consent_provision BOOLEAN DEFAULT FALSE;
ALTER TABLE applications ADD COLUMN consent_inquiry BOOLEAN DEFAULT FALSE;
```

---

## 📝 작업 순서

### 1단계: HTML 폼 수정 (index.html)
- 기존 3개 탭 → 1개 통합 폼으로 변경
- 양식에 맞춰 필드 재구성
- 학력/경력 동적 추가 기능

### 2단계: 개인정보 동의서 추가
- 모달 또는 아코디언 형식
- 필수 동의 체크박스 3개

### 3단계: JavaScript 수정
- 폼 검증 로직 업데이트
- 동적 필드 추가/삭제 기능
- 데이터 수집 및 전송 로직

### 4단계: DB 연동 (Phase 2)
- Supabase 스키마 업데이트
- API 함수 수정

---

## 🚀 즉시 시작

**우선 순위**:
1. ✅ 양식 다운로드 및 분석 (완료)
2. ⏳ HTML 폼 수정 (진행 중)
3. ⏳ 개인정보 동의서 추가
4. ⏳ JavaScript 로직 업데이트
5. ⏳ 테스트 및 배포

---

**작성자**: Claude (AI Assistant)  
**날짜**: 2026-02-06  
**상태**: 분석 완료, 구현 대기
