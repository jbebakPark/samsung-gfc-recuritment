// ============================================
// SAMSUNG MOBILE INTERACTIVE FEATURES
// FAQ, Buttons, Modals, Checkboxes
// 2026-02-05
// ============================================

(function() {
    'use strict';
    
    console.log('Samsung Mobile Interactive - Loading...');
    
    // ============================================
    // FAQ TOGGLE FUNCTIONALITY
    // ============================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) {
            console.log('No FAQ items found');
            return;
        }
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question, .faq-toggle');
            
            if (question) {
                question.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Toggle active class
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQs (optional - for accordion behavior)
                    // faqItems.forEach(otherItem => {
                    //     if (otherItem !== item) {
                    //         otherItem.classList.remove('active');
                    //     }
                    // });
                    
                    // Toggle current FAQ
                    if (isActive) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                    
                    console.log('FAQ toggled:', item);
                });
            }
        });
        
        console.log('FAQ initialized:', faqItems.length, 'items');
    }
    
    // ============================================
    // APPLY BUTTON FUNCTIONALITY
    // ============================================
    function initApplyButtons() {
        const applyButtons = document.querySelectorAll('.btn-register, .btn-apply, .register-btn, .apply-btn');
        
        if (applyButtons.length === 0) {
            console.log('No apply buttons found');
            return;
        }
        
        applyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // If button has a link, let it navigate
                if (this.hasAttribute('href')) {
                    return;
                }
                
                e.preventDefault();
                
                // Show confirmation or modal
                const buttonText = this.textContent.trim();
                console.log('Apply button clicked:', buttonText);
                
                // You can add custom logic here
                // For example, open a modal or redirect
                alert(`신청 기능을 준비 중입니다.\n\n연락처:\n📞 010-5137-2327\n💬 카카오톡: https://open.kakao.com/o/sHw2Wgci`);
            });
        });
        
        console.log('Apply buttons initialized:', applyButtons.length);
    }
    
    // ============================================
    // CHECKBOX FUNCTIONALITY
    // ============================================
    function initCheckboxes() {
        const checkboxItems = document.querySelectorAll('.checklist-item, .requirement-item');
        
        if (checkboxItems.length === 0) {
            console.log('No checkbox items found');
            return;
        }
        
        checkboxItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label');
            
            if (checkbox) {
                // Update item class based on checkbox state
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        item.classList.add('checked');
                    } else {
                        item.classList.remove('checked');
                    }
                });
                
                // Initialize state
                if (checkbox.checked) {
                    item.classList.add('checked');
                }
                
                // Make entire item clickable
                if (label) {
                    item.addEventListener('click', function(e) {
                        // Don't trigger if clicking the checkbox itself
                        if (e.target !== checkbox) {
                            checkbox.checked = !checkbox.checked;
                            checkbox.dispatchEvent(new Event('change'));
                        }
                    });
                }
            }
        });
        
        console.log('Checkboxes initialized:', checkboxItems.length);
    }
    
    // ============================================
    // MODAL FUNCTIONALITY
    // ============================================
    function initModals() {
        // Close modal buttons
        const modalCloseButtons = document.querySelectorAll('.modal-close, .popup-close');
        const modalOverlays = document.querySelectorAll('.modal-overlay, .popup-overlay');
        
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = this.closest('.modal-overlay, .popup-overlay');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Close on overlay click
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });
        
        console.log('Modals initialized');
    }
    
    // ============================================
    // CARD ANIMATIONS
    // ============================================
    function initCardAnimations() {
        const cards = document.querySelectorAll('.card, .job-fair-card, .event-card, .fair-card');
        
        if (cards.length === 0) {
            console.log('No cards found for animation');
            return;
        }
        
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
        
        console.log('Card animations initialized:', cards.length);
    }
    
    // ============================================
    // SMOOTH SCROLL TO TOP
    // ============================================
    function initScrollToTop() {
        const scrollTopButtons = document.querySelectorAll('.scroll-to-top, .back-to-top');
        
        scrollTopButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
        
        console.log('Scroll to top initialized');
    }
    
    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    function initPhoneFormatting() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            // Add touch feedback
            link.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            
            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 150);
            });
        });
        
        console.log('Phone formatting initialized');
    }
    
    // ============================================
    // EXTERNAL LINK WARNING
    // ============================================
    function initExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        
        externalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add visual feedback
                this.style.opacity = '0.7';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 150);
                
                // You can add a confirmation dialog here if needed
                // e.preventDefault();
                // if (confirm('외부 사이트로 이동합니다. 계속하시겠습니까?')) {
                //     window.open(this.href, '_blank');
                // }
            });
        });
        
        console.log('External links initialized');
    }
    
    // ============================================
    // COPY TEXT FUNCTIONALITY
    // ============================================
    function initCopyToClipboard() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const textToCopy = this.getAttribute('data-copy');
                
                if (navigator.clipboard && textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        // Show feedback
                        const originalText = this.textContent;
                        this.textContent = '복사됨!';
                        this.style.background = '#48BB78';
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.background = '';
                        }, 2000);
                    });
                }
            });
        });
        
        console.log('Copy to clipboard initialized');
    }
    
    // ============================================
    // LOADING ANIMATIONS
    // ============================================
    function initLoadingAnimations() {
        // Fade in body when loaded
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
        
        console.log('Loading animations initialized');
    }
    
    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) {
            return;
        }
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        console.log('Lazy loading initialized:', images.length, 'images');
    }
    
    // ============================================
    // TOUCH RIPPLE EFFECT
    // ============================================
    function initTouchRipple() {
        const rippleElements = document.querySelectorAll('.btn, .card, .faq-question');
        
        rippleElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        console.log('Touch ripple initialized');
    }
    
    // ============================================
    // PERFORMANCE MONITORING
    // ============================================
    function initPerformanceMonitoring() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', function() {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                console.log('Page load time:', (loadTime / 1000).toFixed(2) + 's');
            });
        }
    }
    
    // ============================================
    // INITIALIZE ALL FEATURES
    // ============================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFeatures);
        } else {
            initializeFeatures();
        }
    }
    
    function initializeFeatures() {
        try {
            initFAQ();
            initApplyButtons();
            initCheckboxes();
            initModals();
            initCardAnimations();
            initScrollToTop();
            initPhoneFormatting();
            initExternalLinks();
            initCopyToClipboard();
            initLoadingAnimations();
            initLazyLoading();
            initTouchRipple();
            initPerformanceMonitoring();
            
            console.log('Samsung Mobile Interactive - All features loaded successfully! ✅');
        } catch (error) {
            console.error('Error initializing features:', error);
        }
    }
    
    // Start initialization
    init();
    
})();
