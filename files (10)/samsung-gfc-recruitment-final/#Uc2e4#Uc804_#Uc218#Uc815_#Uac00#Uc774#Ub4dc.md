# 📝 실전 수정 가이드 - 자주 변경하는 항목

## 🎯 가장 자주 수정하는 5가지

### 1. 전화번호 변경 (3곳)

#### 위치 1: Hero 섹션 (약 54번 줄)
```html
<a href="tel:010-5137-2327" class="btn btn-primary">
    <i class="fas fa-phone"></i> 전화 상담
</a>
```
**변경:**
- `tel:010-5137-2327` → `tel:새번호`
- 텍스트도 함께 변경 가능

#### 위치 2: Job Fair 섹션 (약 267번 줄)
```html
<p><i class="fas fa-phone"></i> <strong>문의:</strong> 010-5137-2327 (박재박)</p>
```
**변경:**
- `010-5137-2327` → `새번호`
- `(박재박)` → `(새담당자)`

#### 위치 3: Contact 섹션 (약 2100번 줄)
```html
<div class="contact-item">
    <i class="fas fa-phone"></i>
    <h4>전화 문의</h4>
    <p>010-5137-2327</p>
</div>
```

---

### 2. 채용설명회 일정 변경

#### 1차 설명회 (약 235-250번 줄)
```html
<div class="schedule-item">
    <div class="schedule-date">
        <span class="month">1월</span>
        <span class="day">8일</span>
        <span class="weekday">(목)</span>
    </div>
    <div class="schedule-details">
        <h4>1차 채용설명회</h4>
        <p class="schedule-time">
            <i class="fas fa-clock"></i> 10:30~13:00
        </p>
        <p class="schedule-location">
            <i class="fas fa-map-marker-alt"></i> 휴먼센터 219호
        </p>
        <div class="schedule-program">
            <h5>프로그램</h5>
            <ul>
                <li>10:30~11:00 | 등록 및 오리엔테이션</li>
                <li>11:00~11:40 | GFC 제도 소개 (남기석 지점장)</li>
                <li>11:40~12:20 | 실무 경험담 (임우천 팀장)</li>
                <li>12:20~13:00 | 점심 식사 및 Q&A</li>
            </ul>
        </div>
    </div>
</div>
```

**변경 예시:**
```html
<div class="schedule-item">
    <div class="schedule-date">
        <span class="month">2월</span>  <!-- 월 변경 -->
        <span class="day">15일</span>    <!-- 일 변경 -->
        <span class="weekday">(토)</span> <!-- 요일 변경 -->
    </div>
    <div class="schedule-details">
        <h4>1차 채용설명회</h4>
        <p class="schedule-time">
            <i class="fas fa-clock"></i> 14:00~17:00  <!-- 시간 변경 -->
        </p>
        <p class="schedule-location">
            <i class="fas fa-map-marker-alt"></i> 본사 대강당  <!-- 장소 변경 -->
        </p>
        <div class="schedule-program">
            <h5>프로그램</h5>
            <ul>
                <li>14:00~14:30 | 등록 및 환영사</li>  <!-- 프로그램 변경 -->
                <li>14:30~15:10 | GFC 소개</li>
                <li>15:10~15:50 | 성공 사례</li>
                <li>15:50~16:30 | 질의응답</li>
                <li>16:30~17:00 | 개별 상담</li>
            </ul>
        </div>
    </div>
</div>
```

#### 2차 설명회 (약 252-265번 줄)
동일한 방식으로 변경

---

### 3. GTC 교육 일정 변경

#### GTC 0 입문과정 (약 284-300번 줄)
```html
<div class="training-card">
    <div class="training-header">
        <h3>GTC 0 (입문과정)</h3>
        <span class="training-badge">필수</span>
    </div>
    <div class="training-body">
        <p class="training-date">
            <i class="fas fa-calendar-alt"></i> 1/2(금), 1/5(월)~1/12(월)
        </p>
        <p class="training-location">
            <i class="fas fa-map-marker-alt"></i> 지역단 14층 연수실, 휴먼센터 217호
        </p>
        <p class="training-time">
            <i class="fas fa-clock"></i> 09:00~17:30
        </p>
    </div>
</div>
```

**변경:**
- 날짜, 장소, 시간 모두 수정 가능

---

### 4. 통계 숫자 업데이트

#### Hero 섹션 통계 (약 60-77번 줄)
```html
<div class="hero-stats">
    <div class="stat-item">
        <span class="stat-number">315.7조</span>
        <span class="stat-label">총 자산 (국내 1위)</span>
    </div>
    <div class="stat-item">
        <span class="stat-number">5,000+</span>
        <span class="stat-label">현직 GFC</span>
    </div>
    <div class="stat-item">
        <span class="stat-number">212.8%</span>
        <span class="stat-label">K-ICS 비율</span>
    </div>
    <div class="stat-item">
        <span class="stat-number">816만</span>
        <span class="stat-label">보유 고객</span>
    </div>
</div>
```

**변경 예시:**
```html
<div class="stat-item">
    <span class="stat-number">320.5조</span>  <!-- 새 숫자 -->
    <span class="stat-label">총 자산 (국내 1위)</span>
</div>
```

---

### 5. 이메일 주소 변경

**검색:** `jb2park@naver.com`

#### 위치들:
```html
<!-- Hero 섹션 또는 Contact 섹션 -->
<a href="mailto:jb2park@naver.com">jb2park@naver.com</a>
```

**변경:**
```html
<a href="mailto:newemail@samsung.com">newemail@samsung.com</a>
```

---

## 🔍 빠른 검색 팁

### GitHub 편집기에서 검색:
1. 파일 편집 모드에서 **Ctrl + F**
2. 검색어 입력
3. 결과 사이 이동: **Enter** 또는 화살표

### 자주 검색하는 키워드:
- `010-5137-2327` - 전화번호
- `jb2park@naver.com` - 이메일
- `1월 8일` - 첫 번째 설명회
- `1월 27일` - 두 번째 설명회
- `315.7조` - 총자산
- `5,000+` - GFC 수
- `박재박` - 담당자명
- `휴먼센터` - 장소

---

## 📋 수정 체크리스트

### 연락처 업데이트
- [ ] Hero 섹션 전화번호
- [ ] Job Fair 섹션 전화번호
- [ ] Contact 섹션 전화번호
- [ ] Contact 섹션 이메일
- [ ] 카카오톡 링크 (필요시)

### 일정 업데이트
- [ ] 1차 채용설명회 날짜
- [ ] 1차 채용설명회 시간
- [ ] 1차 채용설명회 장소
- [ ] 2차 채용설명회 날짜
- [ ] 2차 채용설명회 시간
- [ ] 2차 채용설명회 장소
- [ ] GTC 교육 일정

### 통계 업데이트
- [ ] 총 자산
- [ ] 현직 GFC 수
- [ ] K-ICS 비율
- [ ] 보유 고객 수

---

## 🎨 고급 수정 항목

### 메인 타이틀 변경
**위치:** 약 44-47번 줄
```html
<h1 class="hero-title">
    정년 없는 전문직,<br>
    <span class="highlight">삼성생명 GFC</span>와 함께<br>
    새로운 인생 2막을 시작하세요
</h1>
```

### 서브타이틀 변경
**위치:** 약 49-51번 줄
```html
<p class="hero-subtitle">
    기업재무컨설팅 전문가로 성장할 수 있는 특별한 기회
</p>
```

---

## 💡 수정 후 확인사항

### 변경 직후 (1-2분)
- [ ] GitHub Actions 확인 (초록색 체크)
- [ ] 배포 완료 대기

### 사이트 확인
- [ ] 변경 내용 반영 확인
- [ ] 링크 작동 확인
- [ ] 모바일에서 확인
- [ ] 오타 확인

---

## 🚨 주의사항

### 절대 삭제하면 안 되는 것:
- ❌ HTML 태그 (`<div>`, `</div>` 등)
- ❌ class 속성
- ❌ 아이콘 코드 (`<i class="fas fa-...">`)
- ❌ 파일 구조

### 안전하게 수정 가능한 것:
- ✅ 텍스트 내용
- ✅ 숫자
- ✅ 날짜
- ✅ 전화번호
- ✅ 이메일
- ✅ URL

---

## 🔄 실수했을 때 되돌리기

### Git History 활용:
1. 파일 페이지에서 **"History"** 클릭
2. 이전 버전 찾기
3. **"..."** 메뉴 → **"View file"**
4. 내용 복사
5. 현재 파일에 붙여넣기

---

**작성일:** 2026년 1월 20일  
**버전:** 1.0  
**담당자:** 박재박 팀장
