# 삼성생명 GFC 채용 사이트 개선 계획

## 현재 상태 (2026-02-13 기준)
- 버전: v31.0 (참조 버전 복원 완료)
- 상태: ✅ 정상 작동 검증됨
- 라인 수: 4,115 줄
- 기준 URL: https://8001-ig1hw6ruruwvm4u22c8u7-0e616f0a.sandbox.novita.ai/

---

## 📋 단기 개선 사항 (우선순위: 높음)

### 1. 모바일 UX 개선
**문제점:**
- 모바일 메뉴가 열린 상태에서 스크롤하면 메뉴가 계속 열려있음
- 드롭다운 서브메뉴 클릭 후 섹션 이동 시 헤더에 가려질 수 있음

**개선 방안:**
```javascript
// 스크롤 시 메뉴 자동 닫기 (간단한 버전)
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 100) {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        lastScrollY = window.scrollY;
    }
});
```

**테스트 필요:**
- [ ] 모바일에서 메뉴 열고 스크롤 시 자동 닫힘
- [ ] 메뉴 닫힘 후 body overflow 복원
- [ ] 햄버거 아이콘 상태 복원

---

### 2. 스크롤 정확도 개선
**문제점:**
- 섹션 이동 시 헤더 높이만큼 오프셋 필요
- 모바일과 데스크톱에서 헤더 높이 차이
- 일부 섹션이 헤더에 가려질 수 있음

**개선 방안:**
```javascript
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 70;
    const offset = window.innerWidth <= 768 ? 30 : 20; // 모바일 추가 여백
    
    const position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
    
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}
```

**테스트 필요:**
- [ ] 모든 내부 링크 클릭 시 정확한 위치로 스크롤
- [ ] 헤더에 가려지지 않음
- [ ] 모바일/데스크톱 모두 확인

---

### 3. 데스크톱 네비게이션 개선
**문제점:**
- 데스크톱에서 드롭다운 토글(예: "GFC 소개") 클릭 시 아무 반응 없음
- Hover로만 서브메뉴 볼 수 있어 불편할 수 있음

**개선 방안:**
```javascript
// 데스크톱에서 토글 클릭 시 첫 번째 서브메뉴로 이동
if (toggle && window.innerWidth > 1024) {
    e.preventDefault();
    const firstLink = dropdown.querySelector('.dropdown-menu a');
    if (firstLink) {
        const href = firstLink.getAttribute('href');
        if (href && href.startsWith('#')) {
            scrollToSection(href.substring(1));
        }
    }
}
```

**테스트 필요:**
- [ ] "GFC 소개" 클릭 → #about 이동
- [ ] "채용 정보" 클릭 → #job-fair 이동
- [ ] Hover 동작은 유지

---

## 📋 중기 개선 사항 (우선순위: 중간)

### 4. 접근성(Accessibility) 개선
**문제점:**
- 키보드 네비게이션 미지원
- 스크린 리더 지원 부족
- ARIA 속성 부족

**개선 방안:**
```html
<!-- ARIA 속성 추가 -->
<button class="mobile-menu-toggle" 
        aria-label="메뉴 열기/닫기" 
        aria-expanded="false"
        aria-controls="nav-menu">
    <i class="fas fa-bars"></i>
</button>

<ul class="nav-menu" id="nav-menu" role="navigation">
    <li class="nav-dropdown">
        <a href="#" 
           class="dropdown-toggle" 
           aria-haspopup="true" 
           aria-expanded="false">
            GFC 소개
        </a>
        <ul class="dropdown-menu" role="menu">
            <li role="menuitem"><a href="#about">GFC란?</a></li>
        </ul>
    </li>
</ul>
```

**키보드 지원:**
```javascript
// Tab, Enter, Space, Esc 키 지원
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const toggle = e.target.closest('.dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            toggle.click();
        }
    }
});
```

**테스트 필요:**
- [ ] Tab 키로 메뉴 이동
- [ ] Enter/Space로 드롭다운 열기
- [ ] Esc로 메뉴 닫기
- [ ] 스크린 리더 테스트

---

### 5. 성능 최적화
**문제점:**
- CSS 파일 여러 개 로드 (9개)
- JavaScript 인라인 코드가 많음
- 이미지 최적화 필요

**개선 방안:**

#### CSS 번들링
```html
<!-- 현재 (9개 파일) -->
<link rel="stylesheet" href="css/style.css?v=13.0">
<link rel="stylesheet" href="css/samsung-premium.css?v=11.0">
<link rel="stylesheet" href="css/mobile-complete.css?v=11.0">
<!-- ... 6개 더 -->

<!-- 개선 후 (1-2개) -->
<link rel="stylesheet" href="css/bundle.min.css?v=31.0">
<link rel="stylesheet" href="css/mobile.min.css?v=31.0">
```

#### JavaScript 외부 파일화
```javascript
// 현재: 3000+ 줄의 인라인 스크립트
// 개선: 외부 파일로 분리
<script src="js/navigation.js?v=31.0"></script>
<script src="js/forms.js?v=31.0"></script>
<script src="js/main.js?v=31.0"></script>
```

**테스트 필요:**
- [ ] 페이지 로드 속도 측정 (Lighthouse)
- [ ] 번들링 후 동작 확인
- [ ] 캐싱 전략 테스트

---

### 6. 반응형 디자인 개선
**문제점:**
- 일부 섹션이 태블릿(768px-1024px)에서 레이아웃 깨짐
- 큰 화면(>1920px)에서 컨텐츠 너무 넓게 퍼짐

**개선 방안:**
```css
/* 태블릿 중간 크기 추가 */
@media (min-width: 768px) and (max-width: 1024px) {
    .income-cards-container {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .navbar .container {
        max-width: 900px;
    }
}

/* 큰 화면 제한 */
@media (min-width: 1920px) {
    .container {
        max-width: 1600px;
        margin: 0 auto;
    }
}
```

**테스트 필요:**
- [ ] 768px-1024px 레이아웃 확인
- [ ] 1920px 이상 화면 확인
- [ ] 모든 섹션 확인

---

## 📋 장기 개선 사항 (우선순위: 낮음)

### 7. 다크 모드 지원
**개선 방안:**
```css
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #4A90E2;
        --bg-light: #1a1a1a;
        --white: #2d2d2d;
        --text-dark: #e0e0e0;
    }
}
```

---

### 8. Progressive Web App (PWA) 지원
**개선 방안:**
- manifest.json 추가
- Service Worker 등록
- 오프라인 지원

---

### 9. 애니메이션 개선
**현재 문제:**
- 일부 전환 효과가 부드럽지 않음
- 모바일에서 애니메이션 성능 저하

**개선 방안:**
```css
/* GPU 가속 사용 */
.nav-menu {
    transform: translateZ(0);
    will-change: transform, opacity;
}

/* 모바일에서 애니메이션 최소화 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

### 10. SEO 최적화
**개선 방안:**
```html
<!-- Open Graph 태그 -->
<meta property="og:title" content="삼성생명 GFC 채용">
<meta property="og:description" content="정년 없는 전문직, 새로운 인생 2막">
<meta property="og:image" content="/images/og-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "기업재무컨설턴트 (GFC)",
  "description": "삼성생명 GFC 채용",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "삼성생명"
  }
}
</script>
```

---

## 🐛 알려진 버그 및 이슈

### 1. 모바일 메뉴 관련
- [ ] **이슈**: 메뉴가 열린 상태에서 화면 회전 시 레이아웃 깨짐
- [ ] **이슈**: iOS Safari에서 body overflow hidden이 제대로 작동하지 않을 수 있음

### 2. 드롭다운 관련
- [ ] **이슈**: 빠르게 여러 드롭다운 클릭 시 display: none/block 충돌 가능
- [ ] **이슈**: 데스크톱에서 hover 후 클릭 시 의도와 다른 동작

### 3. 스크롤 관련
- [ ] **이슈**: 일부 브라우저에서 smooth scroll 미지원 (폴리필 필요)
- [ ] **이슈**: 앵커 링크로 직접 접근 시 헤더에 가려짐

---

## 📝 테스트 체크리스트

### 브라우저 호환성
- [ ] Chrome (최신)
- [ ] Safari (최신)
- [ ] Firefox (최신)
- [ ] Edge (최신)
- [ ] Samsung Internet
- [ ] iOS Safari
- [ ] Android Chrome

### 디바이스 테스트
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)
- [ ] Large Desktop (2560px)

### 기능 테스트
- [ ] 모바일 메뉴 열기/닫기
- [ ] 드롭다운 토글
- [ ] 내부 링크 스크롤
- [ ] 외부 링크 열기
- [ ] 폼 제출
- [ ] 필터 버튼

---

## 🚀 구현 우선순위

### Phase 1 (1-2주) - 필수
1. ✅ 모바일 스크롤 시 메뉴 자동 닫기
2. ✅ 스크롤 정확도 개선
3. ✅ 데스크톱 토글 클릭 동작

### Phase 2 (2-4주) - 중요
4. 접근성 개선 (ARIA, 키보드)
5. 성능 최적화 (CSS/JS 번들링)
6. 반응형 디자인 개선

### Phase 3 (1-2개월) - 선택
7. 다크 모드
8. PWA 지원
9. 애니메이션 개선
10. SEO 최적화

---

## 📊 성능 목표

### 현재 추정치
- First Contentful Paint: ~2.5s
- Largest Contentful Paint: ~3.5s
- Time to Interactive: ~4.0s
- Total Blocking Time: ~500ms

### 목표치
- First Contentful Paint: <1.5s ⬇️ 40% 개선
- Largest Contentful Paint: <2.5s ⬇️ 30% 개선
- Time to Interactive: <3.0s ⬇️ 25% 개선
- Total Blocking Time: <300ms ⬇️ 40% 개선

---

## 💡 개발 가이드라인

### 코드 작성 원칙
1. **단순성 우선**: 복잡한 로직보다 단순하고 명확한 코드
2. **테스트 가능**: 각 기능을 독립적으로 테스트 가능하게
3. **점진적 개선**: 한 번에 하나씩 기능 추가
4. **롤백 가능**: 문제 발생 시 즉시 이전 버전으로 복원 가능

### Git 워크플로우
```bash
# 1. 새 기능 브랜치 생성
git checkout -b feature/mobile-menu-auto-close

# 2. 기능 구현 및 테스트
# ... 코드 작성 ...

# 3. 커밋
git add .
git commit -m "feat: 모바일 메뉴 스크롤 시 자동 닫기

- 스크롤 100px 이상 시 메뉴 자동 닫힘
- body overflow 복원
- 햄버거 아이콘 상태 복원"

# 4. PR 생성
git push origin feature/mobile-menu-auto-close
gh pr create --title "feat: 모바일 메뉴 스크롤 시 자동 닫기"

# 5. 테스트 후 머지
# 6. 문제 발생 시 revert
git revert HEAD
```

---

## 📚 참고 자료

### 접근성
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### 성능
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 모바일 UX
- [Mobile UX Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/principles)

---

## 📞 문의 및 지원

문제 발생 시:
1. GitHub Issues에 버그 리포트 작성
2. 스크린샷 및 브라우저 정보 포함
3. 재현 단계 상세히 기술

