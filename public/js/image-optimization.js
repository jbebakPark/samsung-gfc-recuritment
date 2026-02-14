/**
 * 🖼️ 이미지 레이지 로딩 및 최적화 스크립트
 * 생성일: 2026-02-14
 * 목적: 이미지 로딩 최적화 및 성능 향상
 */

(function() {
    'use strict';
    
    console.log('🖼️ 이미지 최적화 시스템 초기화');
    
    // ============================================
    // 1. Intersection Observer 설정
    // ============================================
    const imageObserverOptions = {
        root: null,
        rootMargin: '50px', // 뷰포트 50px 전에 로딩 시작
        threshold: 0.01
    };
    
    // ============================================
    // 2. 이미지 로딩 함수
    // ============================================
    function loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (!src && !srcset) return;
        
        // 로딩 시작
        img.classList.add('loading');
        
        // 실제 이미지 로드
        if (src) {
            img.src = src;
        }
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        // 로딩 완료 처리
        img.onload = function() {
            img.classList.remove('loading');
            img.classList.add('loaded');
            console.log('✅ 이미지 로드 완료:', src || srcset);
        };
        
        // 에러 처리
        img.onerror = function() {
            img.classList.remove('loading');
            img.classList.add('error');
            console.error('❌ 이미지 로드 실패:', src || srcset);
        };
    }
    
    // ============================================
    // 3. Intersection Observer 생성
    // ============================================
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    // ============================================
    // 4. 레이지 로딩 대상 이미지 관찰
    // ============================================
    function observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        
        console.log(`📸 레이지 로딩 대상: ${lazyImages.length}개`);
        
        lazyImages.forEach(img => {
            // 이미 로드된 이미지는 제외
            if (!img.classList.contains('loaded')) {
                imageObserver.observe(img);
            }
        });
    }
    
    // ============================================
    // 5. 반응형 이미지 생성 헬퍼
    // ============================================
    window.createResponsiveImage = function(options) {
        const {
            src,
            alt = '',
            sizes = '100vw',
            widths = [320, 640, 960, 1280, 1920],
            className = '',
            loading = 'lazy'
        } = options;
        
        // srcset 생성
        const srcset = widths
            .map(width => `${src}?w=${width} ${width}w`)
            .join(', ');
        
        // picture 요소 생성
        const picture = document.createElement('picture');
        
        // WebP source 추가 (지원하는 브라우저용)
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = widths
            .map(width => `${src}?w=${width}&format=webp ${width}w`)
            .join(', ');
        webpSource.sizes = sizes;
        picture.appendChild(webpSource);
        
        // 일반 이미지
        const img = document.createElement('img');
        
        if (loading === 'lazy') {
            img.dataset.src = src;
            img.dataset.srcset = srcset;
            img.sizes = sizes;
        } else {
            img.src = src;
            img.srcset = srcset;
            img.sizes = sizes;
        }
        
        img.alt = alt;
        img.className = className;
        img.loading = loading;
        
        picture.appendChild(img);
        
        return picture;
    };
    
    // ============================================
    // 6. 배경 이미지 레이지 로딩
    // ============================================
    function observeLazyBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        
        console.log(`🎨 레이지 배경 이미지: ${lazyBackgrounds.length}개`);
        
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bgUrl = element.dataset.bg;
                    
                    element.style.backgroundImage = `url(${bgUrl})`;
                    element.classList.add('bg-loaded');
                    
                    bgObserver.unobserve(element);
                    console.log('✅ 배경 이미지 로드:', bgUrl);
                }
            });
        }, imageObserverOptions);
        
        lazyBackgrounds.forEach(el => bgObserver.observe(el));
    }
    
    // ============================================
    // 7. 이미지 압축 품질 감지
    // ============================================
    function detectImageQuality() {
        // 연결 속도에 따라 이미지 품질 조정
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (connection) {
                const effectiveType = connection.effectiveType;
                
                // 느린 연결에서는 낮은 품질
                if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                    document.documentElement.classList.add('low-quality-images');
                    console.log('⚠️ 느린 연결 감지: 낮은 품질 이미지 사용');
                }
                // 빠른 연결에서는 높은 품질
                else if (effectiveType === '4g') {
                    document.documentElement.classList.add('high-quality-images');
                    console.log('⚡ 빠른 연결 감지: 높은 품질 이미지 사용');
                }
            }
        }
    }
    
    // ============================================
    // 8. 이미지 사전 로딩 (중요 이미지)
    // ============================================
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        
        console.log(`⚡ 중요 이미지 사전 로딩: ${criticalImages.length}개`);
        
        criticalImages.forEach(img => {
            const src = img.dataset.src || img.src;
            if (src) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
                
                // 즉시 로드
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
            }
        });
    }
    
    // ============================================
    // 9. 초기화
    // ============================================
    function init() {
        // DOM 로드 완료 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🚀 이미지 최적화 시스템 시작');
        
        // 네트워크 품질 감지
        detectImageQuality();
        
        // 중요 이미지 사전 로딩
        preloadCriticalImages();
        
        // 레이지 로딩 시작
        observeLazyImages();
        observeLazyBackgrounds();
        
        console.log('✅ 이미지 최적화 시스템 준비 완료');
    }
    
    // ============================================
    // 10. MutationObserver로 동적 이미지 감지
    // ============================================
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                observeLazyImages();
                observeLazyBackgrounds();
            }
        });
    });
    
    // body 요소 관찰
    if (document.body) {
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 즉시 초기화
    init();
    
    // 전역 함수 노출
    window.ImageOptimization = {
        observe: observeLazyImages,
        loadImage: loadImage,
        createResponsiveImage: window.createResponsiveImage
    };
    
})();
