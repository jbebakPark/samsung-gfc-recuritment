/**
 * Samsung Life GFC Recruitment Site - Main JavaScript
 * Version: 2.0.0
 * Last Updated: 2026-02-06
 * 
 * Bug Fixes & Improvements:
 * - Enhanced mobile UX with improved dropdown handling
 * - Strengthened form validation with sanitization
 * - Better accessibility with keyboard navigation
 * - Cross-browser compatibility improvements
 * - Security enhancements (XSS prevention)
 * - Performance optimizations
 */

// ==================== Utility Functions ====================

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 250) {
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

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
}

// ==================== Mobile Menu ====================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        
        if (icon) {
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        }
        
        // Update ARIA attributes for accessibility
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        mobileMenuToggle.setAttribute('aria-label', isActive ? '메뉴 닫기' : '메뉴 열기');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus(); // Return focus to toggle button
            document.body.style.overflow = '';
        }
    });
}

// ==================== Dropdown Menu ====================

const navDropdowns = document.querySelectorAll('.nav-dropdown');

navDropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (!dropdownToggle || !dropdownMenu) return;
    
    // Toggle dropdown on click
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = dropdownMenu.classList.contains('show');
        const isMobileMenuOpen = navMenu && navMenu.classList.contains('active');
        
        // In mobile menu: only close other dropdowns in same menu
        // In desktop: close all dropdowns
        if (isMobileMenuOpen) {
            // Mobile: allow multiple dropdowns open, or close others
            const otherDropdowns = dropdown.parentElement.querySelectorAll('.dropdown-menu.show');
            otherDropdowns.forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                    const otherToggle = menu.previousElementSibling;
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                        // Rotate chevron back
                        const chevron = otherToggle.querySelector('.fa-chevron-down');
                        if (chevron) {
                            chevron.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });
        } else {
            // Desktop: close all other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                    const otherToggle = menu.previousElementSibling;
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
        
        // Toggle current dropdown
        dropdownMenu.classList.toggle('show', !isVisible);
        
        // Update ARIA attributes
        dropdownToggle.setAttribute('aria-expanded', !isVisible);
        
        // Rotate chevron icon for visual feedback
        const chevron = dropdownToggle.querySelector('.fa-chevron-down');
        if (chevron) {
            chevron.style.transition = 'transform 0.3s ease';
            chevron.style.transform = !isVisible ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });
    
    // Prevent dropdown menu clicks from closing it
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Close dropdown after clicking a link
    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                dropdownMenu.classList.remove('show');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }, 100);
        });
    });
    
    // Keyboard navigation for dropdown
    dropdownToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Close all dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
            const toggle = menu.closest('.nav-dropdown')?.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ==================== Smooth Scrolling ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (targetId === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(targetId);
        
        if (target) {
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            }
            
            // Set focus to target for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
});

// ==================== Scroll to Top Button ====================

const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    // Show/hide scroll to top button
    const handleScroll = debounce(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Scroll to top function
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Keyboard support for scroll to top button
    scrollTopBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollToTop();
        }
    });
}

// ==================== Scroll Helper Functions ====================

window.scrollToApply = function() {
    const applySection = document.getElementById('apply');
    if (applySection) {
        const headerOffset = 80;
        const elementPosition = applySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Focus on first form input for accessibility
        setTimeout(() => {
            const firstInput = applySection.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
};

// ==================== Form Tabs ====================

const tabButtons = document.querySelectorAll('.tab-btn');
const formContents = document.querySelectorAll('.form-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const track = btn.getAttribute('data-track');
        
        // Update active tab
        tabButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        // Show corresponding form
        formContents.forEach(content => {
            if (content.id === `${track}-content`) {
                content.classList.remove('hidden');
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.classList.add('hidden');
                content.setAttribute('aria-hidden', 'true');
            }
        });
    });
    
    // Keyboard navigation for tabs
    btn.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentIndex = Array.from(tabButtons).indexOf(this);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabButtons.length;
            } else {
                nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
            }
            
            tabButtons[nextIndex].click();
            tabButtons[nextIndex].focus();
        }
    });
});

// Show specific form track
window.showJobFairForm = function() {
    const jobFairTab = document.querySelector('[data-track="jobfair"]');
    if (jobFairTab) {
        jobFairTab.click();
    }
    scrollToApply();
};

window.showReferralForm = function() {
    const referralTab = document.querySelector('[data-track="referral"]');
    if (referralTab) {
        referralTab.click();
    }
    scrollToApply();
};

// ==================== FAQ Accordion ====================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (!question) return;
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => {
            i.classList.remove('active');
            const btn = i.querySelector('.faq-question');
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Keyboard support
    question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// ==================== Form Validation ====================

/**
 * Enhanced email validation
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Enhanced phone validation (Korean format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
    const re = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return re.test(phone);
}

/**
 * Validate name (Korean or English)
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
function validateName(name) {
    // Allow Korean (가-힣), English (a-zA-Z), and spaces
    const re = /^[가-힣a-zA-Z\s]{2,50}$/;
    return re.test(name);
}

/**
 * Show error message
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showError(input, message) {
    // Remove existing error
    removeError(input);
    
    input.style.borderColor = '#dc3545';
    input.setAttribute('aria-invalid', 'true');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#dc3545';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '0.25rem';
    error.setAttribute('role', 'alert');
    error.textContent = message;
    
    // Insert after input or after parent if input is in a wrapper
    const parent = input.parentNode;
    if (parent.lastChild === input) {
        parent.appendChild(error);
    } else {
        parent.insertBefore(error, input.nextSibling);
    }
}

/**
 * Remove error message
 * @param {HTMLElement} input - Input element
 */
function removeError(input) {
    input.style.borderColor = '#E0E0E0';
    input.removeAttribute('aria-invalid');
    
    const parent = input.parentNode;
    const error = parent.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Real-time email validation
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            const sanitized = sanitizeInput(this.value);
            if (!validateEmail(sanitized)) {
                showError(this, '올바른 이메일 주소를 입력해주세요.');
            } else {
                removeError(this);
            }
        } else if (this.hasAttribute('required')) {
            showError(this, '이메일 주소를 입력해주세요.');
        } else {
            removeError(this);
        }
    });
    
    // Remove error on input
    input.addEventListener('input', function() {
        if (this.value && validateEmail(this.value)) {
            removeError(this);
        }
    });
});

// Real-time phone validation with auto-formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    // Auto-format phone number as user types
    input.addEventListener('input', function() {
        let value = this.value.replace(/[^0-9]/g, '');
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        if (value.length > 7) {
            this.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        } else if (value.length > 3) {
            this.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            this.value = value;
        }
    });
    
    // Validate on blur
    input.addEventListener('blur', function() {
        if (this.value) {
            if (!validatePhone(this.value)) {
                showError(this, '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)');
            } else {
                removeError(this);
            }
        } else if (this.hasAttribute('required')) {
            showError(this, '전화번호를 입력해주세요.');
        } else {
            removeError(this);
        }
    });
    
    // Remove error on input
    input.addEventListener('input', function() {
        if (this.value && validatePhone(this.value)) {
            removeError(this);
        }
    });
});

// Name validation
document.querySelectorAll('input[name="name"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            const sanitized = sanitizeInput(this.value);
            if (!validateName(sanitized)) {
                showError(this, '올바른 이름을 입력해주세요. (2-50자, 한글 또는 영문)');
            } else {
                removeError(this);
            }
        } else if (this.hasAttribute('required')) {
            showError(this, '이름을 입력해주세요.');
        } else {
            removeError(this);
        }
    });
});

// ==================== Form Submission ====================

const applicationForm = document.getElementById('applicationForm');

if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        const requiredInputs = applicationForm.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, '필수 입력 항목입니다.');
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('필수 입력 항목을 모두 입력해주세요.');
            return;
        }
        
        // Get active form content
        const activeForm = document.querySelector('.form-content:not(.hidden)');
        if (!activeForm) {
            console.error('No active form found');
            return;
        }
        
        const formData = new FormData(applicationForm);
        
        // Convert FormData to object with sanitization
        const data = {};
        formData.forEach((value, key) => {
            data[key] = sanitizeInput(value);
        });
        
        // Add track type
        const activeTab = document.querySelector('.tab-btn.active');
        data.track = activeTab ? activeTab.getAttribute('data-track') : 'jobfair';
        data.submittedAt = new Date().toISOString();
        
        console.log('Form submission data:', data);
        
        // Show success message
        alert('지원서가 성공적으로 접수되었습니다!\n\n담당자가 영업일 기준 3일 이내에 연락드리겠습니다.\n감사합니다.');
        
        // Reset form
        applicationForm.reset();
        
        // Remove all error messages
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('[aria-invalid]').forEach(input => {
            input.removeAttribute('aria-invalid');
            input.style.borderColor = '#E0E0E0';
        });
        
        // Scroll to top of form
        scrollToApply();
    });
}

// ==================== Intersection Observer for Animations ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Unobserve after animation to improve performance
            intersectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    intersectionObserver.observe(section);
});

// ==================== Header Scroll Effect ====================

let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    const handleHeaderScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    }, 50);
    
    window.addEventListener('scroll', handleHeaderScroll);
}

// ==================== Press Archive Filter ====================

const pressFilterButtons = document.querySelectorAll('.press-filter .filter-btn');
const pressCards = document.querySelectorAll('.press-card[data-category]');

if (pressFilterButtons.length > 0 && pressCards.length > 0) {
    // Initialize - show all cards on page load
    pressCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
    });
    
    pressFilterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            pressFilterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter cards with animation
            pressCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // Fade in animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.3s ease';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
        
        // Keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ==================== Performance Monitoring ====================

// Log page load time
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// ==================== Initialization Log ====================

console.log('%c삼성생명 GFC 채용 사이트', 'color: #034EA2; font-size: 20px; font-weight: bold;');
console.log('%cVersion 2.0.0 - Enhanced with bug fixes and improvements', 'color: #666; font-size: 12px;');
console.log('✓ Mobile UX improvements');
console.log('✓ Enhanced form validation');
console.log('✓ Accessibility improvements');
console.log('✓ Security enhancements');
console.log('✓ Performance optimizations');
console.log('Date:', new Date().toLocaleString('ko-KR'));

// ==================== Browser Compatibility Check ====================

// Check for required features
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported. Some animations may not work.');
}

if (!window.scrollTo) {
    console.warn('Smooth scrolling not supported.');
}

// Safari specific fixes
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
    // Add Safari-specific class for CSS targeting
    document.documentElement.classList.add('safari');
}

// ==================== Export Functions ====================

// Make functions available globally
window.scrollToTop = window.scrollToTop || scrollToTop;
window.scrollToApply = scrollToApply;
window.showJobFairForm = showJobFairForm;
window.showReferralForm = showReferralForm;
window.sanitizeInput = sanitizeInput;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateName = validateName;
