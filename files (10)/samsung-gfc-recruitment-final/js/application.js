// 삼성생명 GFC 지원서 제출 시스템
// Version: 1.0.0
// Last Updated: 2026-01-02

console.log('GFC Application Form - Loaded Successfully');

// ========================================
// 1. DOM 요소 및 전역 변수
// ========================================
const form = document.getElementById('applicationForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const typeCards = document.querySelectorAll('.type-card');
const jobfairSection = document.getElementById('jobfair-section');
const referralSection = document.getElementById('referral-section');
const consentAll = document.getElementById('consent-all');
const requiredConsents = document.querySelectorAll('.required-consent');

// ========================================
// 2. 지원 구분 전환 (Job Fair / Referral / Direct)
// ========================================
typeCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        typeCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
        
        // Get selected type
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        const type = radio.value;
        
        // Show/hide conditional sections
        if (type === 'jobfair') {
            jobfairSection.style.display = 'block';
            referralSection.style.display = 'none';
            
            // Set required fields
            document.getElementById('job_fair_date').required = true;
            document.getElementById('job_fair_location').required = true;
            document.getElementById('referrer_name').required = false;
            document.getElementById('referrer_branch').required = false;
            document.getElementById('referrer_phone').required = false;
            
        } else if (type === 'referral') {
            jobfairSection.style.display = 'none';
            referralSection.style.display = 'block';
            
            // Set required fields
            document.getElementById('job_fair_date').required = false;
            document.getElementById('job_fair_location').required = false;
            document.getElementById('referrer_name').required = true;
            document.getElementById('referrer_branch').required = true;
            document.getElementById('referrer_phone').required = true;
            
        } else { // direct
            jobfairSection.style.display = 'none';
            referralSection.style.display = 'none';
            
            // Set required fields
            document.getElementById('job_fair_date').required = false;
            document.getElementById('job_fair_location').required = false;
            document.getElementById('referrer_name').required = false;
            document.getElementById('referrer_branch').required = false;
            document.getElementById('referrer_phone').required = false;
        }
        
        console.log('Application type changed:', type);
    });
});

// ========================================
// 3. 전체 동의 체크박스 처리
// ========================================
consentAll.addEventListener('change', function() {
    const isChecked = this.checked;
    
    // Check/uncheck all consent checkboxes
    document.querySelectorAll('.consent-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    console.log('Consent all:', isChecked);
});

// 개별 동의 체크박스 변경 시 전체 동의 업데이트
document.querySelectorAll('.consent-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const allCheckboxes = document.querySelectorAll('.consent-checkbox');
        const checkedCount = document.querySelectorAll('.consent-checkbox:checked').length;
        
        // 모두 체크되면 전체 동의도 체크
        consentAll.checked = (checkedCount === allCheckboxes.length);
    });
});

// ========================================
// 4. 전화번호 자동 포맷팅
// ========================================
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // Format: 010-1234-5678
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 7) {
        input.value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
        input.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }
}

// 전화번호 필드에 자동 포맷팅 적용
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
});

// ========================================
// 5. 폼 검증 함수
// ========================================
function validateField(field) {
    const formGroup = field.closest('.form-group');
    
    // Remove previous error
    if (formGroup) {
        formGroup.classList.remove('error');
    }
    
    // Check if required field is empty
    if (field.required && !field.value.trim()) {
        if (formGroup) {
            formGroup.classList.add('error');
        }
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            if (formGroup) {
                formGroup.classList.add('error');
            }
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(field.value)) {
            if (formGroup) {
                formGroup.classList.add('error');
            }
            return false;
        }
    }
    
    return true;
}

// 실시간 검증 (blur 이벤트)
form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function() {
        validateField(this);
    });
});

// ========================================
// 6. 필수 동의 검증
// ========================================
function validateConsents() {
    let allChecked = true;
    
    requiredConsents.forEach(consent => {
        if (!consent.checked) {
            allChecked = false;
            consent.closest('.consent-item').style.border = '2px solid #e74c3c';
        } else {
            consent.closest('.consent-item').style.border = 'none';
            consent.closest('.consent-item').style.borderLeft = '4px solid var(--primary-color)';
        }
    });
    
    return allChecked;
}

// ========================================
// 7. 폼 제출 처리
// ========================================
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('Form submission started');
    
    // 1. 폼 검증
    let isValid = true;
    const formData = new FormData(form);
    
    // 모든 필드 검증
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // 필수 동의 검증
    if (!validateConsents()) {
        isValid = false;
        alert('필수 동의 항목을 모두 체크해주세요.');
        return;
    }
    
    if (!isValid) {
        alert('필수 입력 항목을 모두 작성해주세요.');
        return;
    }
    
    // 2. 버튼 비활성화 (중복 제출 방지)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    
    try {
        // 3. 데이터 준비
        const applicationData = {
            application_type: formData.get('application_type'),
            branch: formData.get('branch'),
            recruiter: formData.get('recruiter'),
            name: formData.get('name'),
            birth_date: formData.get('birth_date'),
            gender: formData.get('gender'),
            marital_status: formData.get('marital_status'),
            phone: formData.get('phone'),
            home_phone: formData.get('home_phone') || '',
            email: formData.get('email'),
            address: formData.get('address'),
            address_detail: formData.get('address_detail') || '',
            financial_delinquency: formData.get('financial_delinquency'),
            education_level: formData.get('education_level'),
            education_school: formData.get('education_school'),
            education_major: formData.get('education_major') || '',
            education_status: formData.get('education_status'),
            insurance_experience: formData.get('insurance_experience'),
            insurance_company: formData.get('insurance_company') || '',
            insurance_period: formData.get('insurance_period') || '',
            insurance_salary: formData.get('insurance_salary') || '',
            career_summary: formData.get('career_summary') || '',
            career_years: parseInt(formData.get('career_years')) || 0,
            certificates: formData.get('certificates') || '',
            motivation: formData.get('motivation'),
            strengths: formData.get('strengths') || '',
            job_fair_date: formData.get('job_fair_date') || '',
            job_fair_location: formData.get('job_fair_location') || '',
            referrer_name: formData.get('referrer_name') || '',
            referrer_branch: formData.get('referrer_branch') || '',
            referrer_phone: formData.get('referrer_phone') || '',
            consent_collection: formData.get('consent_collection') === 'on',
            consent_third_party: formData.get('consent_third_party') === 'on',
            consent_credit_inquiry: formData.get('consent_credit_inquiry') === 'on',
            consent_marketing: formData.get('consent_marketing') === 'on',
            status: 'pending',
            notes: '',
            submitted_at: new Date().toISOString()
        };
        
        console.log('Application data prepared:', applicationData);
        
        // 4. API 호출 (RESTful Table API)
        const response = await fetch('/tables/gfc_applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });
        
        if (!response.ok) {
            throw new Error('서버 응답 오류: ' + response.status);
        }
        
        const result = await response.json();
        console.log('Application submitted successfully:', result);
        
        // 4.5. 카카오톡 알림 전송 (2jbark)
        try {
            console.log('📱 카카오톡 알림 전송 시작...');
            const notificationResult = await sendKakaoNotification(applicationData);
            if (notificationResult.success) {
                console.log('✅ 카카오톡 알림 전송 성공');
            } else {
                console.warn('⚠️ 카카오톡 알림 전송 실패 (지원서는 정상 제출됨)');
            }
        } catch (notifyError) {
            console.error('카카오톡 알림 오류 (지원서는 정상 제출됨):', notifyError);
        }
        
        // 5. 성공 모달 표시
        successModal.classList.add('active');
        
        // 6. 폼 초기화
        form.reset();
        typeCards[0].click(); // 첫 번째 타입 선택
        
    } catch (error) {
        console.error('Application submission error:', error);
        alert('지원서 제출 중 오류가 발생했습니다.\n다시 시도해주세요.\n\n오류: ' + error.message);
        
        // 버튼 재활성화
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 지원서 제출하기';
    }
});

// ========================================
// 8. 초기화
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('GFC Application Form initialized');
    console.log('Version: 1.0.0');
    console.log('Date:', new Date().toISOString());
    
    // 기본 채용설명회 섹션 표시
    jobfairSection.style.display = 'block';
    referralSection.style.display = 'none';
});

// ========================================
// 9. 유틸리티 함수
// ========================================

// 보험사 경력 상세 표시/숨김
window.toggleInsuranceDetail = function(show) {
    const detailSection = document.getElementById('insurance-detail');
    if (detailSection) {
        detailSection.style.display = show ? 'block' : 'none';
        
        // 필수/선택 설정
        const fields = ['insurance_company', 'insurance_period', 'insurance_salary'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = show;
            }
        });
    }
};

// 모달 닫기
window.closeModal = function() {
    successModal.classList.remove('active');
    window.location.href = 'index.html';
};

// 페이지 이탈 경고 (폼 작성 중)
let formModified = false;

form.addEventListener('input', function() {
    formModified = true;
});

form.addEventListener('submit', function() {
    formModified = false;
});

window.addEventListener('beforeunload', function(e) {
    if (formModified) {
        e.preventDefault();
        e.returnValue = '';
        return '작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?';
    }
});
