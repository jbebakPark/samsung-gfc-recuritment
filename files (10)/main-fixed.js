// ============================================
// 삼성생명 GFC 채용 사이트 - JavaScript
// 버전: 2.0.0 (완전 수정)
// 날짜: 2026-01-20
// ============================================

console.log('🚀 GFC 사이트 JavaScript 로딩 시작...');

// ============================================
// 1. 모바일 메뉴 토글
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM 로드 완료');
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            console.log('📱 모바일 메뉴 토글:', navMenu.classList.contains('active'));
        });
    }

    // ============================================
    // 2. 스무스 스크롤
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // # 만 있는 경우 무시
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // 모바일 메뉴 닫기
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle?.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
                
                console.log('📍 스크롤:', href);
            }
        });
    });

    // ============================================
    // 3. FAQ 아코디언 (수정된 버전)
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('❓ FAQ 항목 개수:', faqItems.length);

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            // 기존 이벤트 리스너 제거 (중복 방지)
            question.replaceWith(question.cloneNode(true));
            const newQuestion = item.querySelector('.faq-question');
            
            newQuestion.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const wasActive = item.classList.contains('active');
                
                // 모든 FAQ 닫기
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // 클릭한 항목만 열기 (이미 열려있었다면 닫힌 상태 유지)
                if (!wasActive) {
                    item.classList.add('active');
                    console.log('✅ FAQ 열림:', index + 1);
                } else {
                    console.log('❌ FAQ 닫힘:', index + 1);
                }
            });
            
            console.log(`✅ FAQ #${index + 1} 이벤트 등록 완료`);
        }
    });

    // ============================================
    // 4. GFC 인사이트 아코디언 (새로 추가)
    // ============================================
    const insightItems = document.querySelectorAll('.insight-item');
    console.log('💡 인사이트 항목 개수:', insightItems.length);

    insightItems.forEach((item, index) => {
        const title = item.querySelector('.insight-title');
        
        if (title) {
            // 기존 이벤트 리스너 제거
            title.replaceWith(title.cloneNode(true));
            const newTitle = item.querySelector('.insight-title');
            
            newTitle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const wasActive = item.classList.contains('active');
                
                // 모든 인사이트 닫기
                insightItems.forEach(insightItem => {
                    insightItem.classList.remove('active');
                });
                
                // 클릭한 항목만 열기
                if (!wasActive) {
                    item.classList.add('active');
                    console.log('✅ 인사이트 열림:', index + 1);
                } else {
                    console.log('❌ 인사이트 닫힘:', index + 1);
                }
            });
            
            console.log(`✅ 인사이트 #${index + 1} 이벤트 등록 완료`);
        }
    });

    // ============================================
    // 5. 지원서 탭 전환 (완전 수정)
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');

    console.log('📝 탭 버튼 개수:', tabButtons.length);
    console.log('📝 폼 콘텐츠 개수:', formContents.length);

    tabButtons.forEach((btn, index) => {
        // 기존 이벤트 제거
        btn.replaceWith(btn.cloneNode(true));
    });

    // 새로 이벤트 등록
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const track = this.getAttribute('data-track');
            
            console.log('🔄 탭 클릭:', track);
            
            // 모든 탭 비활성화
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // 클릭한 탭 활성화
            this.classList.add('active');
            
            // 모든 폼 숨기기
            formContents.forEach(content => {
                content.classList.add('hidden');
                content.style.display = 'none';
            });
            
            // 해당 폼만 보이기
            const targetForm = document.getElementById(`${track}-content`);
            if (targetForm) {
                targetForm.classList.remove('hidden');
                targetForm.style.display = 'block';
                console.log('✅ 폼 표시:', track);
            }
        });
        
        console.log(`✅ 탭 #${index + 1} 이벤트 등록 완료`);
    });

    // ============================================
    // 6. 스크롤 투 탑 버튼
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }

    // ============================================
    // 7. 전화번호 포맷팅
    // ============================================
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
            }
            
            this.value = value;
        });
    });

    // ============================================
    // 8. 보도자료 필터
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pressCards = document.querySelectorAll('.press-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 버튼 활성화
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 카드 필터링
            pressCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
            
            console.log('🔍 필터:', filter);
        });
    });

    console.log('✅ 모든 초기화 완료!');
});

// ============================================
// 전역 함수들 (버튼 onclick에서 호출)
// ============================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    console.log('⬆️ 상단으로 스크롤');
}

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
        console.log('📝 지원서로 스크롤');
    }
}

function showJobFairForm() {
    console.log('🎯 Job Fair 폼 표시');
    
    // 지원서 섹션으로 스크롤
    scrollToApply();
    
    // 약간의 지연 후 탭 클릭
    setTimeout(() => {
        const jobFairTab = document.querySelector('[data-track="jobfair"]');
        if (jobFairTab) {
            jobFairTab.click();
            console.log('✅ Job Fair 탭 활성화');
        } else {
            console.error('❌ Job Fair 탭을 찾을 수 없음');
        }
    }, 500);
}

function showReferralForm() {
    console.log('🎯 추천인 경로 폼 표시');
    
    // 지원서 섹션으로 스크롤
    scrollToApply();
    
    // 약간의 지연 후 탭 클릭
    setTimeout(() => {
        const referralTab = document.querySelector('[data-track="referral"]');
        if (referralTab) {
            referralTab.click();
            console.log('✅ 추천인 경로 탭 활성화');
        } else {
            console.error('❌ 추천인 경로 탭을 찾을 수 없음');
        }
    }, 500);
}

// 전역으로 등록
window.scrollToTop = scrollToTop;
window.scrollToApply = scrollToApply;
window.showJobFairForm = showJobFairForm;
window.showReferralForm = showReferralForm;

console.log('🎉 GFC 사이트 JavaScript 로딩 완료!');
console.log('📌 사용 가능한 함수:', {
    scrollToTop: typeof scrollToTop,
    scrollToApply: typeof scrollToApply,
    showJobFairForm: typeof showJobFairForm,
    showReferralForm: typeof showReferralForm
});
