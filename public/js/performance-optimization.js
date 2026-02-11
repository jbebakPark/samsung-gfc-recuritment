/**
 * Samsung GFC - 성능 최적화 스크립트
 * PC 및 모바일 최적화
 * v1.0.0 - 2026-02-11
 */

console.log('🚀 성능 최적화 스크립트 로드 시작');

// =========================
// 1. Lazy Loading (이미지)
// =========================
function initLazyLoading() {
    console.log('📸 Lazy Loading 초기화');
    
    // IntersectionObserver 지원 확인
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                    console.log('✅ 이미지 로드:', img.src);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        console.log(`📊 Lazy Loading 설정 완료: ${lazyImages.length}개 이미지`);
    } else {
        // Fallback: 모든 이미지 즉시 로드
        console.warn('⚠️  IntersectionObserver 미지원, 모든 이미지 즉시 로드');
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// =========================
// 2. 터치 이벤트 최적화
// =========================
function optimizeTouchEvents() {
    console.log('👆 터치 이벤트 최적화 시작');
    
    // 터치 디바이스 감지
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) ||
                         (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        console.log('📱 터치 디바이스 감지됨');
        
        // 터치 피드백 추가
        const interactiveElements = document.querySelectorAll(
            'button, .btn, a[href], .nav-link, .card, .interview-card'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, { passive: true });
            
            el.addEventListener('touchcancel', function() {
                this.style.opacity = '1';
            }, { passive: true });
        });
        
        console.log(`✅ 터치 피드백 적용: ${interactiveElements.length}개 요소`);
    }
}

// =========================
// 3. Debounce 유틸리티
// =========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =========================
// 4. 스크롤 성능 최적화
// =========================
function optimizeScrollPerformance() {
    console.log('📜 스크롤 성능 최적화 시작');
    
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollState();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    const updateScrollState = () => {
        const currentScrollY = window.scrollY;
        
        // 헤더 표시/숨김
        const header = document.querySelector('header');
        if (header) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        // 스크롤 진행 표시
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
        
        lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log('✅ 스크롤 최적화 적용 완료');
}

// =========================
// 5. 리사이즈 최적화
// =========================
function optimizeResize() {
    console.log('📐 리사이즈 최적화 시작');
    
    const handleResize = debounce(() => {
        const width = window.innerWidth;
        console.log('📱 화면 크기 변경:', width);
        
        // 모바일/데스크톱 클래스 적용
        if (width <= 768) {
            document.body.classList.add('mobile');
            document.body.classList.remove('desktop');
        } else {
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile');
        }
        
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('viewportchange', {
            detail: { width, isMobile: width <= 768 }
        }));
    }, 250);
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 실행
    console.log('✅ 리사이즈 최적화 적용 완료');
}

// =========================
// 6. 폰트 로딩 최적화
// =========================
function optimizeFontLoading() {
    console.log('🔤 폰트 로딩 최적화 시작');
    
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('400 1em "Noto Sans KR"'),
            document.fonts.load('700 1em "Noto Sans KR"')
        ]).then(() => {
            document.body.classList.add('fonts-loaded');
            console.log('✅ 폰트 로딩 완료');
        }).catch(err => {
            console.warn('⚠️  폰트 로딩 실패:', err);
        });
    }
}

// =========================
// 7. 네트워크 상태 감지
// =========================
function detectNetworkStatus() {
    console.log('🌐 네트워크 상태 감지 시작');
    
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const updateConnectionStatus = () => {
                const effectiveType = connection.effectiveType;
                console.log('📶 네트워크 타입:', effectiveType);
                
                // 느린 연결 감지
                if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                    document.body.classList.add('slow-connection');
                    console.warn('⚠️  느린 네트워크 감지');
                } else {
                    document.body.classList.remove('slow-connection');
                }
            };
            
            connection.addEventListener('change', updateConnectionStatus);
            updateConnectionStatus();
            console.log('✅ 네트워크 감지 완료');
        }
    }
}

// =========================
// 8. 접근성 개선
// =========================
function improveAccessibility() {
    console.log('♿ 접근성 개선 시작');
    
    // Skip to content 링크
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = '메인 컨텐츠로 건너뛰기';
    skipLink.style.cssText = `
        position: absolute;
        left: -9999px;
        z-index: 999;
        padding: 1rem;
        background: var(--primary-color, #034EA2);
        color: white;
        text-decoration: none;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.left = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.left = '-9999px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // 메인 컨텐츠 마크업
    const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }
    
    console.log('✅ 접근성 개선 완료');
}

// =========================
// 9. 페이지 가시성 API
// =========================
function handlePageVisibility() {
    console.log('👁️  페이지 가시성 API 초기화');
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('😴 페이지 숨김');
            // 애니메이션 일시 중지 등
        } else {
            console.log('👀 페이지 표시');
            // 애니메이션 재개 등
        }
    });
}

// =========================
// 10. 초기화
// =========================
function init() {
    console.log('🎯 성능 최적화 초기화 시작');
    
    // DOM Ready 대기
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
        runOptimizations();
    }
}

function runOptimizations() {
    console.log('⚡ 최적화 실행');
    
    try {
        initLazyLoading();
        optimizeTouchEvents();
        optimizeScrollPerformance();
        optimizeResize();
        optimizeFontLoading();
        detectNetworkStatus();
        improveAccessibility();
        handlePageVisibility();
        
        console.log('✅ 모든 최적화 완료');
        
        // 성능 측정
        if ('performance' in window && 'getEntriesByType' in window.performance) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('📊 페이지 로드 시간:', (pageLoadTime / 1000).toFixed(2) + 's');
            });
        }
        
    } catch (error) {
        console.error('❌ 최적화 중 오류 발생:', error);
    }
}

// 스크립트 실행
init();

console.log('✅ 성능 최적화 스크립트 로드 완료');
