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
    // DROPDOWN TOGGLES - 완전히 새로운 방식 v22.0
    // ============================================
    console.log('🔧 드롭다운 토글 개수:', dropdownToggles.length);
    console.log('🔧 현재 화면 너비:', window.innerWidth);
    
    // document 전체에 이벤트 리스너 등록 (최상위 레벨)
    document.addEventListener('click', function(e) {
        // .dropdown-toggle 클릭 감지
        const toggle = e.target.closest('.dropdown-toggle');
        
        if (!toggle) return; // 드롭다운 토글이 아니면 무시
        
        console.log('====================================');
        console.log('🎯 드롭다운 토글 클릭 감지!');
        console.log('   클릭된 요소:', toggle.textContent.trim());
        console.log('   현재 화면 너비:', window.innerWidth);
        console.log('====================================');
        
        e.preventDefault();
        e.stopPropagation();
        
        // 모바일 모드에서만 작동
        if (window.innerWidth > 1024) {
            console.log('❌ 데스크톱 모드라 실행 안 함');
            return;
        }
        
        console.log('✅ 모바일 모드 확인');
        
        const dropdown = toggle.closest('.nav-dropdown');
        if (!dropdown) {
            console.error('❌ .nav-dropdown을 찾을 수 없습니다!');
            return;
        }
        
        const isActive = dropdown.classList.contains('active');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        console.log('📌 현재 상태:', isActive ? '열림' : '닫힘');
        
        // 다른 드롭다운 모두 닫기
        document.querySelectorAll('.nav-dropdown.active').forEach(item => {
            if (item !== dropdown) {
                item.classList.remove('active');
                const menu = item.querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.remove('show');
                    menu.style.display = 'none';
                    menu.style.opacity = '0';
                    menu.style.maxHeight = '0';
                }
            }
        });
        
        // 현재 드롭다운 토글
        if (isActive) {
            // 닫기
            console.log('🔽 드롭다운 닫기');
            dropdown.classList.remove('active');
            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.maxHeight = '0';
            }
        } else {
            // 열기
            console.log('🔼 드롭다운 열기');
            dropdown.classList.add('active');
            if (dropdownMenu) {
                dropdownMenu.classList.add('show');
                dropdownMenu.style.display = 'block';
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.maxHeight = '1000px';
                
                const itemCount = dropdownMenu.querySelectorAll('li').length;
                console.log('✅ 드롭다운 열림! 서브메뉴:', itemCount + '개');
            }
        }
        
        console.log('====================================');
    }, true); // 캡처 단계에서 실행
    
    console.log('✅ document에 드롭다운 리스너 등록 완료');
    
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
