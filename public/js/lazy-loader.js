/**
 * Lazy Loading System
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * 이미지 및 콘텐츠 레이지 로딩 시스템
 * - Intersection Observer API 사용
 * - 이미지 지연 로딩
 * - 섹션 지연 로딩
 * - 부드러운 페이드인 효과
 * - 성능 최적화
 */

class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.01,
            imageSelector: options.imageSelector || 'img[data-src], img[loading="lazy"]',
            sectionSelector: options.sectionSelector || '[data-lazy-section]',
            fadeInClass: options.fadeInClass || 'lazy-loaded',
            ...options
        };
        
        this.imageObserver = null;
        this.sectionObserver = null;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('🚀 Lazy Loader initialized');
        
        // Intersection Observer 지원 확인
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ Intersection Observer not supported, loading all content');
            this.loadAllContent();
            return;
        }
        
        // Observer 생성
        this.createObservers();
        
        // 이미지 관찰 시작
        this.observeImages();
        
        // 섹션 관찰 시작
        this.observeSections();
        
        // 동적 콘텐츠 감지
        this.watchDynamicContent();
    }
    
    /**
     * Observer 생성
     */
    createObservers() {
        // 이미지 Observer
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
        
        // 섹션 Observer
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadSection(entry.target);
                    this.sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
    }
    
    /**
     * 이미지 관찰 시작
     */
    observeImages() {
        const images = document.querySelectorAll(this.options.imageSelector);
        console.log(`📸 Found ${images.length} images to lazy load`);
        
        images.forEach(img => {
            // data-src 속성이 있으면 관찰
            if (img.dataset.src || img.getAttribute('loading') === 'lazy') {
                this.imageObserver.observe(img);
            }
        });
    }
    
    /**
     * 섹션 관찰 시작
     */
    observeSections() {
        const sections = document.querySelectorAll(this.options.sectionSelector);
        console.log(`📦 Found ${sections.length} sections to lazy load`);
        
        sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }
    
    /**
     * 이미지 로드
     */
    loadImage(img) {
        // data-src에서 src로 전환
        if (img.dataset.src) {
            const src = img.dataset.src;
            
            // 이미지 로드 시작
            img.src = src;
            
            // srcset 처리
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            
            // 로드 완료 후 처리
            img.onload = () => {
                img.classList.add(this.options.fadeInClass);
                delete img.dataset.src;
                delete img.dataset.srcset;
                console.log(`✅ Loaded: ${src}`);
            };
            
            // 에러 처리
            img.onerror = () => {
                console.error(`❌ Failed to load: ${src}`);
                img.classList.add('lazy-error');
            };
        } else {
            // 네이티브 lazy loading 사용
            img.classList.add(this.options.fadeInClass);
        }
    }
    
    /**
     * 섹션 로드
     */
    loadSection(section) {
        // 섹션 로딩 시작
        section.classList.add('lazy-loading');
        
        // 섹션 내부 이미지 로드
        const images = section.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
        
        // 페이드인 효과
        setTimeout(() => {
            section.classList.remove('lazy-loading');
            section.classList.add(this.options.fadeInClass);
            console.log(`✅ Section loaded: ${section.id || 'unnamed'}`);
        }, 100);
    }
    
    /**
     * 모든 콘텐츠 즉시 로드 (폴백)
     */
    loadAllContent() {
        // 모든 이미지 로드
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            }
        });
        
        // 모든 섹션 표시
        const sections = document.querySelectorAll(this.options.sectionSelector);
        sections.forEach(section => {
            section.classList.add(this.options.fadeInClass);
        });
    }
    
    /**
     * 동적 콘텐츠 감지
     */
    watchDynamicContent() {
        // MutationObserver로 새로 추가된 이미지 감지
        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // 새로운 이미지 감지
                            if (node.matches && node.matches(this.options.imageSelector)) {
                                this.imageObserver.observe(node);
                            }
                            
                            // 자식 이미지 감지
                            const images = node.querySelectorAll && node.querySelectorAll(this.options.imageSelector);
                            if (images) {
                                images.forEach(img => this.imageObserver.observe(img));
                            }
                        }
                    });
                });
            });
            
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    /**
     * 특정 요소 즉시 로드
     */
    loadNow(element) {
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        } else if (element.dataset.lazySection !== undefined) {
            this.loadSection(element);
        }
    }
    
    /**
     * 모든 관찰 중지
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        console.log('🛑 Lazy Loader destroyed');
    }
}

// ============================================
// Global Instance
// ============================================
let lazyLoader;

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoader = new LazyLoader();
        window.lazyLoader = lazyLoader;
    });
} else {
    // 이미 로드된 경우 즉시 초기화
    lazyLoader = new LazyLoader();
    window.lazyLoader = lazyLoader;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
