// ========================================
// 모바일 UX 개선 JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileUX();
});

function initMobileUX() {
    // 1. 스크롤 진행 바
    initScrollProgress();
    
    // 2. 플로팅 퀵 메뉴
    initQuickMenu();
    
    // 3. 하단 네비게이션
    initBottomNav();
    
    // 4. 스크롤 투 탑
    initScrollToTop();
    
    // 5. 섹션 접기/펼치기
    initSectionCollapse();
    
    // 6. 스티키 CTA
    initStickyCTA();
    
    // 7. 터치 피드백
    initTouchFeedback();
}

// 1. 스크롤 진행 바
function initScrollProgress() {
    // 진행 바 요소 생성
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);
    
    // 스크롤 이벤트
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function updateScrollProgress() {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }
}

// 2. 플로팅 퀵 메뉴
function initQuickMenu() {
    const quickMenuHTML = `
        <div class="mobile-quick-menu">
            <button class="quick-menu-toggle" aria-label="빠른 메뉴">
                <i class="fas fa-bars"></i>
            </button>
            <div class="quick-menu-items">
                <a href="#job-fair" class="quick-menu-item">
                    <i class="fas fa-calendar-check"></i>
                    <span>채용설명회</span>
                </a>
                <a href="#age-criteria" class="quick-menu-item">
                    <i class="fas fa-user-check"></i>
                    <span>연령 기준</span>
                </a>
                <a href="#process" class="quick-menu-item">
                    <i class="fas fa-list-ol"></i>
                    <span>채용 프로세스</span>
                </a>
                <a href="#gfc-video" class="quick-menu-item">
                    <i class="fas fa-play-circle"></i>
                    <span>소개 영상</span>
                </a>
                <a href="#faq" class="quick-menu-item">
                    <i class="fas fa-question-circle"></i>
                    <span>FAQ</span>
                </a>
                <a href="tel:010-5137-2327" class="quick-menu-item">
                    <i class="fas fa-phone"></i>
                    <span>전화 상담</span>
                </a>
                <a href="#apply" class="quick-menu-item" style="background: var(--primary-color); color: white;">
                    <i class="fas fa-edit"></i>
                    <span>지원하기</span>
                </a>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quickMenuHTML);
    
    // 토글 기능
    const toggle = document.querySelector('.quick-menu-toggle');
    const items = document.querySelector('.quick-menu-items');
    const icon = toggle.querySelector('i');
    
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-quick-menu')) {
            items.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // 메뉴 아이템 클릭 시 닫기
    items.querySelectorAll('.quick-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            items.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// 3. 하단 네비게이션
function initBottomNav() {
    const bottomNavHTML = `
        <nav class="bottom-nav">
            <div class="bottom-nav-items">
                <a href="#about" class="bottom-nav-item">
                    <i class="fas fa-home"></i>
                    <span>홈</span>
                </a>
                <a href="#job-fair" class="bottom-nav-item">
                    <i class="fas fa-calendar"></i>
                    <span>설명회</span>
                </a>
                <a href="#process" class="bottom-nav-item">
                    <i class="fas fa-clipboard-list"></i>
                    <span>프로세스</span>
                </a>
                <a href="#gfc-video" class="bottom-nav-item">
                    <i class="fas fa-video"></i>
                    <span>영상</span>
                </a>
                <a href="#apply" class="bottom-nav-item">
                    <i class="fas fa-edit"></i>
                    <span>지원</span>
                </a>
            </div>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('beforeend', bottomNavHTML);
    
    // 현재 섹션 하이라이트
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavItem() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavItem);
}

// 4. 스크롤 투 탑
function initScrollToTop() {
    const scrollTopHTML = `
        <button class="scroll-to-top" aria-label="맨 위로">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', scrollTopHTML);
    
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 5. 섹션 접기/펼치기 (긴 섹션에 적용)
function initSectionCollapse() {
    // 긴 섹션 목록
    const longSections = [
        '#main-duties',
        '#wealth-management',
        '#core-competencies',
        '#support-system',
        '#gfc-insights'
    ];
    
    longSections.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (!section) return;
        
        // 섹션의 주요 콘텐츠 찾기
        const content = section.querySelector('.container > *:not(.section-header)');
        if (!content) return;
        
        // 콘텐츠를 래핑
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-collapsible collapsed';
        
        // 콘텐츠를 래퍼로 이동
        const contentNodes = Array.from(section.querySelector('.container').children).slice(1);
        contentNodes.forEach(node => {
            wrapper.appendChild(node);
        });
        
        section.querySelector('.container').appendChild(wrapper);
        
        // 토글 버튼 추가
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'section-toggle';
        toggleBtn.innerHTML = `
            <span>더보기</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        section.querySelector('.container').appendChild(toggleBtn);
        
        // 토글 기능
        toggleBtn.addEventListener('click', function() {
            wrapper.classList.toggle('collapsed');
            const isCollapsed = wrapper.classList.contains('collapsed');
            toggleBtn.querySelector('span').textContent = isCollapsed ? '더보기' : '접기';
            toggleBtn.querySelector('i').className = isCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        });
    });
}

// 6. 스티키 CTA
function initStickyCTA() {
    const stickyCTAHTML = `
        <div class="sticky-cta">
            <a href="#apply" class="sticky-cta-btn">
                <i class="fas fa-edit"></i>
                <span>지금 지원하기</span>
            </a>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', stickyCTAHTML);
    
    const stickyCTA = document.querySelector('.sticky-cta');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 스크롤이 일정 이상일 때만 표시
        if (currentScroll > 500 && currentScroll < document.documentElement.scrollHeight - 1000) {
            stickyCTA.style.display = 'block';
        } else {
            stickyCTA.style.display = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// 7. 터치 피드백
function initTouchFeedback() {
    // 모든 클릭 가능한 요소에 터치 피드백 추가
    const touchElements = document.querySelectorAll('a, button, .card, .press-card, .faq-question');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transition = 'transform 0.1s ease';
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// 유틸리티: 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80; // 헤더 높이
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 로딩 완료 로그
console.log('Mobile UX enhancements loaded successfully');
