// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Dropdown menu click handler
const navDropdown = document.querySelector('.nav-dropdown');
if (navDropdown) {
    const dropdownToggle = navDropdown.querySelector('a');
    const dropdownMenu = navDropdown.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        // Click to toggle dropdown
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = dropdownMenu.classList.contains('show');
            dropdownMenu.classList.toggle('show', !isVisible);
            
            console.log('Dropdown toggled:', !isVisible);
        });
        
        // Prevent dropdown menu clicks from closing it
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!navDropdown.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Close dropdown after clicking a link inside
        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    dropdownMenu.classList.remove('show');
                }, 100);
            });
        });
        
        console.log('Dropdown menu initialized');
    }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        console.log('Scrolling to:', targetId, 'Element found:', !!target);
        
        if (target) {
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
                    mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                    mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        } else {
            console.error('Target element not found:', targetId);
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll to Apply Section
function scrollToApply() {
    const applySection = document.getElementById('apply');
    if (applySection) {
        const headerOffset = 80;
        const elementPosition = applySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Form Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const formContents = document.querySelectorAll('.form-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const track = btn.getAttribute('data-track');
        
        // Update active tab
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding form
        formContents.forEach(content => {
            if (content.id === `${track}-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    });
});

// Show specific form track
function showJobFairForm() {
    const jobFairTab = document.querySelector('[data-track="jobfair"]');
    if (jobFairTab) {
        jobFairTab.click();
    }
    scrollToApply();
}

function showReferralForm() {
    const referralTab = document.querySelector('[data-track="referral"]');
    if (referralTab) {
        referralTab.click();
    }
    scrollToApply();
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Form Submission (Placeholder - will be connected to Supabase later)
const applicationForm = document.getElementById('applicationForm');

if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get active form content
        const activeForm = document.querySelector('.form-content:not(.hidden)');
        const formData = new FormData(activeForm.closest('form'));
        
        // Convert FormData to object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Add track type
        const activeTab = document.querySelector('.tab-btn.active');
        data.track = activeTab ? activeTab.getAttribute('data-track') : 'jobfair';
        data.submittedAt = new Date().toISOString();
        
        console.log('Form submission data:', data);
        
        // Show success message (temporary)
        alert('지원서가 성공적으로 접수되었습니다!\n\n담당자가 영업일 기준 3일 이내에 연락드리겠습니다.\n감사합니다.');
        
        // Reset form
        applicationForm.reset();
        
        // Note: In Phase 2, this will be replaced with:
        // - Supabase database insertion
        // - Email notification to admin
        // - Confirmation email to applicant
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return re.test(phone);
}

// Add real-time validation
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#dc3545';
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#dc3545';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '0.25rem';
                error.textContent = '올바른 이메일 주소를 입력해주세요.';
                this.parentNode.appendChild(error);
            }
        } else {
            this.style.borderColor = '#E0E0E0';
            const error = this.nextElementSibling;
            if (error && error.classList.contains('error-message')) {
                error.remove();
            }
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#dc3545';
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#dc3545';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '0.25rem';
                error.textContent = '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)';
                this.parentNode.appendChild(error);
            }
        } else {
            this.style.borderColor = '#E0E0E0';
            const error = this.nextElementSibling;
            if (error && error.classList.contains('error-message')) {
                error.remove();
            }
        }
    });
});

// Auto-format phone number
document.querySelectorAll('input[type="tel"]').forEach(input => {
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
});

// Console log for debugging
console.log('Samsung Life GFC Recruitment Site - Loaded Successfully');
console.log('Version: 1.0.0');
console.log('Date:', new Date().toISOString());

// Export functions for global access
window.scrollToTop = scrollToTop;
window.scrollToApply = scrollToApply;
window.showJobFairForm = showJobFairForm;
window.showReferralForm = showReferralForm;

// Press Archive Filter
const pressFilterButtons = document.querySelectorAll('.press-filter .filter-btn');
const pressCards = document.querySelectorAll('.press-card[data-category]');

if (pressFilterButtons.length > 0) {
    // Initialize - show all cards on page load
    pressCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
    });
    
    pressFilterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            pressFilterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
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
                    card.style.display = 'none';
                }
            });
        });
    });
    
    console.log('Press archive filter initialized with', pressCards.length, 'cards');
}