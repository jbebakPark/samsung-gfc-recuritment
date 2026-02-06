// ============================================
// SAMSUNG MOBILE NAVIGATION - COMPLETE REBUILD
// 모바일 전용 JavaScript (완전 재작성)
// ============================================

(function() {
    'use strict';
    
    console.log('Samsung Mobile Navigation - Loading...');
    
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    // Select all links EXCEPT dropdown toggles
    const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        body.classList.add('menu-open');
        mobileMenuToggle.querySelector('i').classList.remove('fa-bars');
        mobileMenuToggle.querySelector('i').classList.add('fa-times');
        console.log('Menu opened');
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        
        // Close all dropdowns
        document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        console.log('Menu closed');
    }
    
    // ============================================
    // CLOSE MENU ON BACKDROP CLICK - DISABLED
    // ============================================
    // DISABLED: This was causing the menu to close when clicking dropdowns
    /*
    document.addEventListener('click', function(e) {
        if (body.classList.contains('menu-open')) {
            // Check if click is outside menu and toggle button
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });
    */
    console.log('✅ Outside click handler DISABLED (to prevent dropdown issues)');
    
    // ============================================
    // DROPDOWN TOGGLES - 각 카테고리 독립 작동
    // ============================================
    console.log('🔧 드롭다운 토글 개수:', dropdownToggles.length);
    
    dropdownToggles.forEach((toggle, index) => {
        console.log(`🔧 드롭다운 토글 ${index} 등록:`, toggle.textContent.trim());
        
        toggle.addEventListener('click', function(e) {
            console.log('🎯 드롭다운 클릭 이벤트 발생!', this.textContent.trim());
            e.preventDefault();
            e.stopPropagation();
            
            // Only work on mobile
            if (window.innerWidth <= 1024) {
                console.log('✅ 모바일 모드 확인');
                const dropdown = this.closest('.nav-dropdown');
                console.log('✅ dropdown 요소:', dropdown);
                const isActive = dropdown.classList.contains('active');
                const categoryName = this.textContent.trim();
                
                console.log('📌 드롭다운 클릭:', {
                    카테고리: categoryName,
                    인덱스: index,
                    현재상태: isActive ? '열림' : '닫힘',
                    화면너비: window.innerWidth
                });
                
                // 다른 모든 드롭다운 닫기 (중요: 현재 것만 남김)
                let closedCount = 0;
                document.querySelectorAll('.nav-dropdown').forEach((item, i) => {
                    if (item !== dropdown && item.classList.contains('active')) {
                        item.classList.remove('active');
                        const menu = item.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.style.display = 'none';
                            menu.style.opacity = '0';
                        }
                        closedCount++;
                        console.log('✖️ 다른 드롭다운 닫음:', i);
                    }
                });
                
                if (closedCount > 0) {
                    console.log(`✅ ${closedCount}개의 다른 드롭다운을 닫았습니다`);
                }
                
                // 현재 드롭다운 토글
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                console.log('✅ dropdownMenu 요소:', dropdownMenu);
                
                if (isActive) {
                    // 닫기
                    console.log('🔽 드롭다운 닫기 시작');
                    dropdown.classList.remove('active');
                    if (dropdownMenu) {
                        dropdownMenu.style.display = 'none';
                        dropdownMenu.style.opacity = '0';
                    }
                    console.log('✖️ 드롭다운 닫음:', categoryName);
                } else {
                    // 열기
                    console.log('🔼 드롭다운 열기 시작');
                    dropdown.classList.add('active');
                    if (dropdownMenu) {
                        dropdownMenu.style.display = 'block';
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.maxHeight = '1000px';
                        console.log('✅ 스타일 적용 완료:', {
                            display: dropdownMenu.style.display,
                            opacity: dropdownMenu.style.opacity,
                            maxHeight: dropdownMenu.style.maxHeight
                        });
                    }
                    console.log('✅ 드롭다운 열음:', categoryName);
                    console.log('   서브메뉴 개수:', dropdownMenu ? dropdownMenu.querySelectorAll('li').length : 0);
                }
            } else {
                console.log('❌ 데스크톱 모드라 실행 안 함');
            }
        });
    });
    
    // ============================================
    // CLOSE MENU ON LINK CLICK
    // ============================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                const href = this.getAttribute('href');
                
                // If internal link (starts with #)
                if (href && href.startsWith('#')) {
                    // Dropdown toggles are already excluded in navLinks selection
                    e.preventDefault();
                    closeMenu();
                    
                    // Smooth scroll to target
                    const target = document.querySelector(href);
                    if (target) {
                        setTimeout(() => {
                            const headerHeight = 70;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }, 300);
                    }
                }
            }
        });
    });
    
    // ============================================
    // HANDLE DROPDOWN SUBMENU LINKS
    // ============================================
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                const href = this.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close menu immediately
                    closeMenu();
                    
                    // Navigate to section
                    const target = document.querySelector(href);
                    if (target) {
                        setTimeout(() => {
                            const headerHeight = 70;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            
                            console.log('Navigated to:', href);
                        }, 300);
                    }
                }
            }
        });
    });
    
    // ============================================
    // CLOSE MENU ON RESIZE TO DESKTOP
    // ============================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024 && body.classList.contains('menu-open')) {
                closeMenu();
            }
        }, 250);
    });
    
    // ============================================
    // PREVENT SCROLL WHEN MENU OPEN
    // ============================================
    let scrollPosition = 0;
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (body.classList.contains('menu-open')) {
                    scrollPosition = window.pageYOffset;
                    body.style.top = `-${scrollPosition}px`;
                } else {
                    body.style.top = '';
                    window.scrollTo(0, scrollPosition);
                }
            }
        });
    });
    
    observer.observe(body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#top') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = 70;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header
        if (currentScroll > lastScroll && currentScroll > 200 && !body.classList.contains('menu-open')) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // ACTIVE SECTION HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active from all
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active to current
                const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(highlightActiveSection, 100);
    });
    
    // ============================================
    // INITIALIZE
    // ============================================
    console.log('Samsung Mobile Navigation - Loaded Successfully');
    console.log('- Mobile menu toggle:', !!mobileMenuToggle);
    console.log('- Nav menu:', !!navMenu);
    console.log('- Dropdown toggles:', dropdownToggles.length);
    console.log('- Nav links:', navLinks.length);
    
})();
