/**
 * 🚀 v31.0 삼성생명 공식 GFC 지원서 JavaScript
 * 
 * 기능:
 * 1. 학력 동적 추가/삭제 (최대 3개)
 * 2. 경력 동적 추가/삭제 (최대 4개)
 * 3. 보험사 경력 조건부 표시
 * 4. 개인정보 동의서 토글
 * 5. 나이 자동 계산 및 검증
 * 6. 폼 검증
 */

(function() {
    'use strict';

    console.log('🚀 v31.0 공식 폼 JavaScript 로드 시작');

    // ========================================
    // 1. 학력 동적 추가/삭제 (최대 3개)
    // ========================================
    let educationCount = 1;
    const MAX_EDUCATION = 3;

    const addEducationBtn = document.getElementById('addEducation');
    const educationContainer = document.getElementById('educationContainer');

    if (addEducationBtn && educationContainer) {
        addEducationBtn.addEventListener('click', function() {
            if (educationCount >= MAX_EDUCATION) {
                alert('학력은 최대 3개까지 추가할 수 있습니다.');
                return;
            }

            educationCount++;

            const newEducation = document.createElement('div');
            newEducation.className = 'education-item';
            newEducation.innerHTML = `
                <div class="education-header">
                    <h4>학력 ${educationCount}</h4>
                    <button type="button" class="btn-remove-education" data-index="${educationCount}">
                        <i class="fas fa-times"></i> 삭제
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>학교명 *</label>
                        <input type="text" name="education_school_${educationCount}" required 
                               placeholder="예: 서울대학교">
                    </div>
                    <div class="form-group">
                        <label>전공</label>
                        <input type="text" name="education_major_${educationCount}" 
                               placeholder="예: 경영학과">
                    </div>
                    <div class="form-group">
                        <label>소재지</label>
                        <input type="text" name="education_location_${educationCount}" 
                               placeholder="예: 서울">
                    </div>
                    <div class="form-group">
                        <label>졸업구분 *</label>
                        <select name="education_status_${educationCount}" required>
                            <option value="">선택</option>
                            <option value="졸업">졸업</option>
                            <option value="졸업예정">졸업예정</option>
                            <option value="재학">재학</option>
                            <option value="중퇴">중퇴</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>졸업년월 *</label>
                        <input type="month" name="education_graduation_${educationCount}" required>
                    </div>
                </div>
            `;

            educationContainer.appendChild(newEducation);

            // 삭제 버튼 이벤트 리스너
            const removeBtn = newEducation.querySelector('.btn-remove-education');
            removeBtn.addEventListener('click', function() {
                newEducation.remove();
                educationCount--;
                updateEducationNumbers();
                checkEducationLimit();
            });

            checkEducationLimit();
            console.log(`✅ 학력 ${educationCount} 추가됨`);
        });
    }

    function checkEducationLimit() {
        if (addEducationBtn) {
            if (educationCount >= MAX_EDUCATION) {
                addEducationBtn.disabled = true;
                addEducationBtn.textContent = '학력 추가 (최대 3개)';
                addEducationBtn.style.opacity = '0.5';
                addEducationBtn.style.cursor = 'not-allowed';
            } else {
                addEducationBtn.disabled = false;
                addEducationBtn.textContent = `학력 추가 (${educationCount}/${MAX_EDUCATION})`;
                addEducationBtn.style.opacity = '1';
                addEducationBtn.style.cursor = 'pointer';
            }
        }
    }

    function updateEducationNumbers() {
        const items = educationContainer.querySelectorAll('.education-item');
        items.forEach((item, index) => {
            const header = item.querySelector('.education-header h4');
            if (header) {
                header.textContent = `학력 ${index + 1}`;
            }
        });
    }

    // ========================================
    // 2. 경력 동적 추가/삭제 (최대 4개)
    // ========================================
    let careerCount = 1;
    const MAX_CAREER = 4;

    const addCareerBtn = document.getElementById('addCareer');
    const careerContainer = document.getElementById('careerContainer');

    if (addCareerBtn && careerContainer) {
        addCareerBtn.addEventListener('click', function() {
            if (careerCount >= MAX_CAREER) {
                alert('경력은 최대 4개까지 추가할 수 있습니다.');
                return;
            }

            careerCount++;

            const newCareer = document.createElement('div');
            newCareer.className = 'career-item';
            newCareer.innerHTML = `
                <div class="career-header">
                    <h4>경력 ${careerCount}</h4>
                    <button type="button" class="btn-remove-career" data-index="${careerCount}">
                        <i class="fas fa-times"></i> 삭제
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>회사명 *</label>
                        <input type="text" name="career_company_${careerCount}" required 
                               placeholder="예: 삼성전자">
                    </div>
                    <div class="form-group">
                        <label>재직기간 *</label>
                        <div class="date-range">
                            <input type="month" name="career_start_${careerCount}" required>
                            <span>~</span>
                            <input type="month" name="career_end_${careerCount}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>직위</label>
                        <input type="text" name="career_position_${careerCount}" 
                               placeholder="예: 부장">
                    </div>
                    <div class="form-group">
                        <label>업종</label>
                        <input type="text" name="career_industry_${careerCount}" 
                               placeholder="예: IT/전자">
                    </div>
                    <div class="form-group full-width">
                        <label>담당업무</label>
                        <textarea name="career_description_${careerCount}" rows="2" 
                                  placeholder="예: 신규 고객 개척 및 관리, 제품 영업, 팀 관리"></textarea>
                    </div>
                </div>
            `;

            careerContainer.appendChild(newCareer);

            // 삭제 버튼 이벤트 리스너
            const removeBtn = newCareer.querySelector('.btn-remove-career');
            removeBtn.addEventListener('click', function() {
                newCareer.remove();
                careerCount--;
                updateCareerNumbers();
                checkCareerLimit();
            });

            checkCareerLimit();
            console.log(`✅ 경력 ${careerCount} 추가됨`);
        });
    }

    function checkCareerLimit() {
        if (addCareerBtn) {
            if (careerCount >= MAX_CAREER) {
                addCareerBtn.disabled = true;
                addCareerBtn.textContent = '경력 추가 (최대 4개)';
                addCareerBtn.style.opacity = '0.5';
                addCareerBtn.style.cursor = 'not-allowed';
            } else {
                addCareerBtn.disabled = false;
                addCareerBtn.textContent = `경력 추가 (${careerCount}/${MAX_CAREER})`;
                addCareerBtn.style.opacity = '1';
                addCareerBtn.style.cursor = 'pointer';
            }
        }
    }

    function updateCareerNumbers() {
        const items = careerContainer.querySelectorAll('.career-item');
        items.forEach((item, index) => {
            const header = item.querySelector('.career-header h4');
            if (header) {
                header.textContent = `경력 ${index + 1}`;
            }
        });
    }

    // ========================================
    // 3. 보험사 경력 조건부 표시
    // ========================================
    const insuranceExperienceYes = document.getElementById('insuranceExperienceYes');
    const insuranceExperienceNo = document.getElementById('insuranceExperienceNo');
    const insuranceDetails = document.getElementById('insuranceDetails');

    if (insuranceExperienceYes && insuranceExperienceNo && insuranceDetails) {
        insuranceExperienceYes.addEventListener('change', function() {
            if (this.checked) {
                insuranceDetails.style.display = 'grid';
                // 필수 항목으로 설정
                insuranceDetails.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
                console.log('✅ 보험사 경력 상세 입력 활성화');
            }
        });

        insuranceExperienceNo.addEventListener('change', function() {
            if (this.checked) {
                insuranceDetails.style.display = 'none';
                // 필수 해제
                insuranceDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                    input.value = '';
                });
                console.log('✅ 보험사 경력 상세 입력 비활성화');
            }
        });
    }

    // ========================================
    // 4. 개인정보 동의서 토글
    // ========================================
    const toggleButtons = document.querySelectorAll('.privacy-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon i');

            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
                this.setAttribute('aria-expanded', 'true');
            } else {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ========================================
    // 5. 나이 자동 계산 및 검증
    // ========================================
    const birthInput = document.getElementById('birth');
    const genderSelect = document.getElementById('gender');
    const ageCheckResult = document.getElementById('ageCheckResult');

    function calculateAge(birthDateStr) {
        const today = new Date();
        const birthDate = new Date(birthDateStr);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    function checkAgeEligibility() {
        if (!birthInput || !genderSelect || !ageCheckResult) return;

        const birthDate = birthInput.value;
        const gender = genderSelect.value;

        if (!birthDate || !gender) {
            ageCheckResult.innerHTML = '';
            return;
        }

        const age = calculateAge(birthDate);
        const birthYear = new Date(birthDate).getFullYear();

        let status = '';
        let message = '';
        let className = '';

        if (gender === '남성') {
            if (age >= 35 && age <= 60) {
                status = '✅ 적격';
                message = `만 ${age}세 (${birthYear}년생) - 남성 적격 연령입니다.`;
                className = 'eligible';
            } else if ((age >= 30 && age <= 34) || (age >= 61 && age <= 65)) {
                status = '⚠️ 비적격';
                message = `만 ${age}세 (${birthYear}년생) - 별도 심사가 필요합니다.`;
                className = 'review-needed';
            } else {
                status = '❌ 위촉불가';
                message = `만 ${age}세 (${birthYear}년생) - 남성 연령 제한에 해당합니다.`;
                className = 'ineligible';
            }
        } else if (gender === '여성') {
            if (age >= 30 && age <= 55) {
                status = '✅ 적격';
                message = `만 ${age}세 (${birthYear}년생) - 여성 적격 연령입니다.`;
                className = 'eligible';
            } else if ((age >= 25 && age <= 29) || (age >= 56 && age <= 65)) {
                status = '⚠️ 비적격';
                message = `만 ${age}세 (${birthYear}년생) - 별도 심사가 필요합니다.`;
                className = 'review-needed';
            } else {
                status = '❌ 위촉불가';
                message = `만 ${age}세 (${birthYear}년생) - 여성 연령 제한에 해당합니다.`;
                className = 'ineligible';
            }
        }

        ageCheckResult.className = `age-check-result ${className}`;
        ageCheckResult.innerHTML = `<strong>${status}</strong> ${message}`;

        console.log(`🔍 나이 체크: ${message}`);
    }

    if (birthInput && genderSelect) {
        birthInput.addEventListener('change', checkAgeEligibility);
        genderSelect.addEventListener('change', checkAgeEligibility);
    }

    // ========================================
    // 6. 폼 검증
    // ========================================
    const applicationForm = document.getElementById('applicationForm');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            console.log('📝 폼 제출 시도');

            // 개인정보 동의 체크
            const consent1 = document.getElementById('privacyConsent1');
            const consent2 = document.getElementById('privacyConsent2');
            const consent3 = document.getElementById('privacyConsent3');

            if (!consent1 || !consent1.checked) {
                alert('개인정보 수집 및 이용에 동의해주세요.');
                consent1?.focus();
                return;
            }

            if (!consent2 || !consent2.checked) {
                alert('개인정보 제공에 동의해주세요.');
                consent2?.focus();
                return;
            }

            if (!consent3 || !consent3.checked) {
                alert('개인정보 조회에 동의해주세요.');
                consent3?.focus();
                return;
            }

            // 나이 체크
            if (ageCheckResult && ageCheckResult.classList.contains('ineligible')) {
                alert('죄송합니다. 연령 제한으로 지원이 불가능합니다.');
                return;
            }

            // 모든 검증 통과
            console.log('✅ 폼 검증 통과');

            // TODO: 실제 제출 로직 (Supabase, EmailJS, Google Sheets 등)
            alert('지원서가 성공적으로 제출되었습니다!\n\n영업일 기준 3일 이내에 담당자가 연락드리겠습니다.');

            // 폼 초기화 (옵션)
            // applicationForm.reset();
            // ageCheckResult.innerHTML = '';
        });
    }

    // ========================================
    // 7. 초기화 완료
    // ========================================
    console.log('✅ v31.0 공식 폼 JavaScript 초기화 완료');
    console.log(`   - 학력: ${educationCount}/${MAX_EDUCATION}`);
    console.log(`   - 경력: ${careerCount}/${MAX_CAREER}`);
    console.log(`   - 나이 체크: ${birthInput && genderSelect ? '활성화' : '비활성화'}`);
    console.log(`   - 개인정보 동의: ${toggleButtons.length}개 토글`);

})();
