// ============================================
// SAMSUNG MOBILE NAVIGATION - COMPLETE REBUILD V2
// 더 강력한 이벤트 처리
// ============================================

(function() {
    'use strict';
    
    console.log('🚀 Samsung Mobile Navigation V2 - Loading...');
    
    // DOM이 완전히 로드된 후 실행
    function init() {
        console.log('📱 Initializing mobile navigation...');
        
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (!mobileMenuToggle || !navMenu) {
            console.error('❌ Required elements not found');
            return;
        }
        
        console.log('✅ Elements found:', {
            toggle: !!mobileMenuToggle,
            menu: !!navMenu
        });
        
        // ============================================
        // 메뉴 토글
        // ============================================
        function openMenu() {
            navMenu.classList.add('active');
            body.classList.add('menu-open');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
            console.log('✅ Menu opened');
        }
        
        function closeMenu() {
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Close all dropdowns
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            });
            
            console.log('✅ Menu closed');
        }
        
        // 메뉴 토글 버튼
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
        
        // ============================================
        // 드롭다운 토글 - 이벤트 위임 방식
        // ============================================
        navMenu.addEventListener('click', function(e) {
            // dropdown-toggle 클릭 확인
            const toggle = e.target.closest('.dropdown-toggle');
            
            if (toggle && window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = toggle.closest('.nav-dropdown');
                if (!dropdown) {
                    console.error('❌ dropdown not found');
                    return;
                }
                
                const isActive = dropdown.classList.contains('active');
                const categoryName = toggle.textContent.trim().replace(/\s+/g, ' ');
                
                console.log('📌 드롭다운 클릭:', {
                    카테고리: categoryName,
                    현재상태: isActive ? '열림' : '닫힘',
                    화면너비: window.innerWidth
                });
                
                // 다른 모든 드롭다운 닫기
                const allDropdowns = navMenu.querySelectorAll('.nav-dropdown');
                allDropdowns.forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                        const menu = item.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.style.display = 'none';
                            menu.style.opacity = '0';
                            menu.style.maxHeight = '0';
                        }
                    }
                });
                
                // 현재 드롭다운 토글
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                if (!dropdownMenu) {
                    console.error('❌ dropdown-menu not found');
                    return;
                }
                
                if (isActive) {
                    // 닫기
                    dropdown.classList.remove('active');
                    dropdownMenu.style.display = 'none';
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.maxHeight = '0';
                    console.log('✖️ 닫음:', categoryName);
                } else {
                    // 열기
                    dropdown.classList.add('active');
                    dropdownMenu.style.display = 'block';
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.maxHeight = '1000px';
                    
                    const itemCount = dropdownMenu.querySelectorAll('li').length;
                    console.log('✅ 열음:', categoryName, '| 서브메뉴:', itemCount + '개');
                }
                
                return; // 이벤트 전파 중지
            }
            
            // 서브메뉴 링크 클릭
            const submenuLink = e.target.closest('.dropdown-menu a');
            if (submenuLink && window.innerWidth <= 1024) {
                const href = submenuLink.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    console.log('🔗 서브메뉴 클릭:', submenuLink.textContent.trim(), '→', href);
                    
                    // 메뉴 닫기
                    closeMenu();
                    
                    // 스크롤 이동
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            const headerHeight = 70;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            
                            console.log('✅ 이동 완료:', href);
                        }
                    }, 300);
                }
            }
        });
        
        // ============================================
        // 터치 이벤트 추가 지원
        // ============================================
        let touchStartY = 0;
        
        navMenu.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        navMenu.addEventListener('touchend', function(e) {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = Math.abs(touchEndY - touchStartY);
            
            // 스크롤이 아닌 탭으로 판단 (10px 이하 이동)
            if (diff < 10) {
                // 클릭 이벤트가 이미 처리됨
                console.log('👆 터치 감지 (탭)');
            }
        }, { passive: true });
        
        // ============================================
        // 백드롭 클릭으로 메뉴 닫기
        // ============================================
        document.addEventListener('click', function(e) {
            if (body.classList.contains('menu-open')) {
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    closeMenu();
                }
            }
        });
        
        // ============================================
        // 화면 크기 변경 시
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
        // 초기화 완료
        // ============================================
        const dropdownCount = navMenu.querySelectorAll('.nav-dropdown').length;
        console.log('✅ Samsung Mobile Navigation V2 - 초기화 완료');
        console.log('📊 드롭다운 개수:', dropdownCount);
        console.log('📱 화면 너비:', window.innerWidth + 'px');
        console.log('👆 터치 지원:', 'ontouchstart' in window ? 'YES' : 'NO');
    }
    
    // DOM이 준비되면 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
