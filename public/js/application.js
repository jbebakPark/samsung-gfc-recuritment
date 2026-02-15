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
// Use event delegation for robustness
document.body.addEventListener('click', function (e) {
    const card = e.target.closest('.type-card');
    if (!card) return;

    // Debug
    // console.log('Card clicked (delegation)');


    // Remove active class from all cards
    typeCards.forEach(c => c.classList.remove('active'));

    // Add active class to clicked card
    card.classList.add('active');

    // Get selected type
    const radio = card.querySelector('input[type="radio"]');
    // Prevent double checking if browser handles label click
    if (!radio.checked) {
        radio.checked = true;
    }
    const type = radio.value;

    // Debug
    // alert('선택된 유형: ' + type); // Uncomment to debug with user
    console.log('Selected type:', type);

    // Show/hide conditional sections
    if (type === 'jobfair') {
        if (jobfairSection) jobfairSection.style.display = 'block';
        if (referralSection) referralSection.style.display = 'none';

        // Set required fields
        const dateParams = document.getElementById('job_fair_date');
        if (dateParams) dateParams.required = true;
        const locParams = document.getElementById('job_fair_location');
        if (locParams) locParams.required = true;

        ['referrer_name', 'referrer_branch', 'referrer_phone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = false;
        });

    } else if (type === 'referral') {
        if (jobfairSection) jobfairSection.style.display = 'none';
        if (referralSection) referralSection.style.display = 'block';

        // Set required fields
        const dateParams = document.getElementById('job_fair_date');
        if (dateParams) dateParams.required = false;
        const locParams = document.getElementById('job_fair_location');
        if (locParams) locParams.required = false;

        ['referrer_name', 'referrer_branch', 'referrer_phone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = true;
        });

    } else { // direct
        if (jobfairSection) jobfairSection.style.display = 'none';
        if (referralSection) referralSection.style.display = 'none';

        // Set required fields
        const dateParams = document.getElementById('job_fair_date');
        if (dateParams) dateParams.required = false;
        const locParams = document.getElementById('job_fair_location');
        if (locParams) locParams.required = false;

        ['referrer_name', 'referrer_branch', 'referrer_phone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = false;
        });
    }

    console.log('Application type changed:', type);
});


// ========================================
// 3. 전체 동의 체크박스 처리
// ========================================
consentAll.addEventListener('change', function () {
    const isChecked = this.checked;

    // Check/uncheck all consent checkboxes
    document.querySelectorAll('.consent-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });

    console.log('Consent all:', isChecked);
});

// 개별 동의 체크박스 변경 시 전체 동의 업데이트
document.querySelectorAll('.consent-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
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
    input.addEventListener('input', function () {
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
    field.addEventListener('blur', function () {
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
form.addEventListener('submit', async function (e) {
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
        const currentDateTime = new Date();
        const applicationData = {
            // 자동 기록 정보
            applied_at: currentDateTime.toISOString(),          // 지원 일시 (ISO 형식)
            submitted_at: currentDateTime.toISOString(),        // 제출 일시
            status: 'pending',                                  // 초기 상태: 접수 완료
            updated_at: currentDateTime.toISOString(),          // 최근 업데이트

            // 지원 경로 및 지점 정보
            application_type: formData.get('application_type'),
            branch: formData.get('branch'),
            recruiter: formData.get('recruiter'),

            // 기본 정보
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

            // 학력 정보
            education_level: formData.get('education_level'),
            education_school: formData.get('education_school'),
            education_major: formData.get('education_major') || '',
            education_status: formData.get('education_status'),

            // 경력 정보
            insurance_experience: formData.get('insurance_experience'),
            insurance_company: formData.get('insurance_company') || '',
            insurance_period: formData.get('insurance_period') || '',
            insurance_salary: formData.get('insurance_salary') || '',
            career_summary: formData.get('career_summary') || '',
            career_years: parseInt(formData.get('career_years')) || 0,
            certificates: formData.get('certificates') || '',

            // 지원 동기 및 강점
            motivation: formData.get('motivation'),
            strengths: formData.get('strengths') || '',

            // 조건부 정보 (지원 경로별)
            job_fair_date: formData.get('job_fair_date') || '',
            job_fair_location: formData.get('job_fair_location') || '',
            referrer_name: formData.get('referrer_name') || '',
            referrer_branch: formData.get('referrer_branch') || '',
            referrer_phone: formData.get('referrer_phone') || '',

            // 동의 정보
            consent_collection: formData.get('consent_collection') === 'on',
            consent_third_party: formData.get('consent_third_party') === 'on',
            consent_credit_inquiry: formData.get('consent_credit_inquiry') === 'on',
            consent_marketing: formData.get('consent_marketing') === 'on',

            // 관리 정보
            notes: '온라인 지원서 접수',

            // 상태 이력 초기화
            status_history: [{
                date: currentDateTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                status: 'pending',
                note: '온라인 지원서 접수 완료',
                updatedBy: '시스템 자동'
            }]
        };

        console.log('✅ 지원 일시 자동 기록:', currentDateTime.toLocaleString('ko-KR'));
        console.log('✅ 초기 상태 설정: 접수 완료 (pending)');
        console.log('Application data prepared:', applicationData);

        // 4. Firestore에 데이터 저장
        console.log('📤 Firestore에 지원서 저장 중...');
        
        // Firebase가 초기화되었는지 확인
        if (!window.db) {
            console.warn('⚠️  Firebase가 초기화되지 않았습니다. 로컬 스토리지에 임시 저장합니다.');
            
            // 로컬 스토리지에 임시 저장
            const savedApplications = JSON.parse(localStorage.getItem('gfc_applications') || '[]');
            savedApplications.push({
                ...applicationData,
                id: 'local_' + Date.now()
            });
            localStorage.setItem('gfc_applications', JSON.stringify(savedApplications));
            
            console.log('✅ 로컬 스토리지에 임시 저장 완료');
            console.log('💡 Firebase 설정 후 관리자 페이지에서 동기화 가능');
        } else {
            // Firestore에 저장
            const docRef = await window.db.collection('applications').add(applicationData);
            console.log('✅ Firestore 저장 완료, Document ID:', docRef.id);
        }
        
        const result = { success: true, data: applicationData };
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

        // 5. 성공 메시지 표시
        const submittedTime = currentDateTime.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        alert(`✅ 지원서가 성공적으로 접수되었습니다!\n\n━━━━━━━━━━━━━━━━━━\n📋 접수 정보\n━━━━━━━━━━━━━━━━━━\n\n📅 접수 일시: ${submittedTime}\n👤 지원자: ${applicationData.name}\n📞 연락처: ${applicationData.phone}\n✅ 상태: 접수 완료\n\n━━━━━━━━━━━━━━━━━━\n\n담당자가 영업일 기준 3일 이내에\n연락드리겠습니다.\n\n감사합니다!`);

        // 6. 성공 모달 표시 (있는 경우)
        if (successModal) {
            successModal.classList.add('active');
        }

        // 7. 폼 초기화
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
document.addEventListener('DOMContentLoaded', function () {
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
window.toggleInsuranceDetail = function (show) {
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
window.closeModal = function () {
    successModal.classList.remove('active');
    window.location.href = 'index.html';
};

// 페이지 이탈 경고 (폼 작성 중)
let formModified = false;

form.addEventListener('input', function () {
    formModified = true;
});

form.addEventListener('submit', function () {
    formModified = false;
});

window.addEventListener('beforeunload', function (e) {
    if (formModified) {
        e.preventDefault();
        e.returnValue = '';
        return '작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?';
    }
});
