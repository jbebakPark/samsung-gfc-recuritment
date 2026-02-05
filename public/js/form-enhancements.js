// ============================================
// SAMSUNG GFC APPLICATION FORM ENHANCEMENTS
// 지원서 폼 개선 (추천인 경로, 생년월일)
// 2026-02-05
// ============================================

(function() {
    'use strict';
    
    console.log('Application Form Enhancements - Loading...');
    
    // ============================================
    // TAB SWITCHING FUNCTIONALITY
    // ============================================
    function initTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const formContents = document.querySelectorAll('.form-content');
        
        if (tabButtons.length === 0) {
            console.log('No tab buttons found');
            return;
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const track = this.getAttribute('data-track');
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all form contents
                formContents.forEach(content => {
                    content.classList.add('hidden');
                    content.classList.remove('active');
                });
                
                // Show selected form content
                const targetContent = document.getElementById(`${track}-content`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    targetContent.classList.add('active');
                    console.log('Switched to track:', track);
                }
            });
        });
        
        console.log('Tab switching initialized:', tabButtons.length, 'tabs');
    }
    
    // ============================================
    // BIRTH DATE SELECT BOXES
    // ============================================
    function initBirthDateSelects() {
        // Find all date input fields
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        if (dateInputs.length === 0) {
            console.log('No date inputs found');
            return;
        }
        
        dateInputs.forEach(input => {
            // Skip if already converted
            if (input.dataset.converted) return;
            
            const inputId = input.id;
            const inputName = input.name;
            const required = input.hasAttribute('required');
            const formGroup = input.closest('.form-group');
            
            if (!formGroup) return;
            
            // Create container for select boxes
            const selectContainer = document.createElement('div');
            selectContainer.className = 'birth-date-selects';
            selectContainer.style.display = 'flex';
            selectContainer.style.gap = '0.5rem';
            
            // Year select (1940 - 2010)
            const yearSelect = createSelect(
                `${inputId}-year`,
                `${inputName}-year`,
                '년도',
                generateYears(),
                required
            );
            
            // Month select (1 - 12)
            const monthSelect = createSelect(
                `${inputId}-month`,
                `${inputName}-month`,
                '월',
                generateMonths(),
                required
            );
            
            // Day select (1 - 31)
            const daySelect = createSelect(
                `${inputId}-day`,
                `${inputName}-day`,
                '일',
                generateDays(),
                required
            );
            
            // Add selects to container
            selectContainer.appendChild(yearSelect);
            selectContainer.appendChild(monthSelect);
            selectContainer.appendChild(daySelect);
            
            // Create hidden input to store the combined date
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = inputId;
            hiddenInput.name = inputName;
            if (required) hiddenInput.required = true;
            
            // Replace date input with select boxes
            input.parentNode.insertBefore(selectContainer, input);
            input.parentNode.insertBefore(hiddenInput, input);
            input.remove();
            
            // Mark as converted
            hiddenInput.dataset.converted = 'true';
            
            // Update hidden input when selects change
            function updateHiddenInput() {
                const year = yearSelect.value;
                const month = monthSelect.value;
                const day = daySelect.value;
                
                if (year && month && day) {
                    hiddenInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } else {
                    hiddenInput.value = '';
                }
            }
            
            yearSelect.addEventListener('change', updateHiddenInput);
            monthSelect.addEventListener('change', updateHiddenInput);
            daySelect.addEventListener('change', updateHiddenInput);
            
            console.log('Birth date selects created for:', inputId);
        });
        
        console.log('Birth date selects initialized');
    }
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    function createSelect(id, name, placeholder, options, required) {
        const select = document.createElement('select');
        select.id = id;
        select.name = name;
        select.className = 'form-select';
        if (required) select.required = true;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = placeholder;
        select.appendChild(defaultOption);
        
        // Add options
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });
        
        return select;
    }
    
    function generateYears() {
        const years = [];
        const currentYear = new Date().getFullYear();
        const startYear = 1940;
        const endYear = currentYear - 14; // 최소 14세 이상
        
        for (let year = endYear; year >= startYear; year--) {
            years.push({
                value: year.toString(),
                text: year + '년'
            });
        }
        
        return years;
    }
    
    function generateMonths() {
        const months = [];
        for (let month = 1; month <= 12; month++) {
            months.push({
                value: month.toString(),
                text: month + '월'
            });
        }
        return months;
    }
    
    function generateDays() {
        const days = [];
        for (let day = 1; day <= 31; day++) {
            days.push({
                value: day.toString(),
                text: day + '일'
            });
        }
        return days;
    }
    
    // ============================================
    // FORM VALIDATION ENHANCEMENT
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('.application-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Check if birth date is filled
                const hiddenDateInputs = form.querySelectorAll('input[type="hidden"][data-converted="true"]');
                
                hiddenDateInputs.forEach(input => {
                    if (!input.value && input.hasAttribute('required')) {
                        e.preventDefault();
                        alert('생년월일을 모두 선택해주세요.');
                        return false;
                    }
                });
            });
        });
        
        console.log('Form validation enhanced');
    }
    
    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9]/g, '');
                
                if (value.length <= 3) {
                    e.target.value = value;
                } else if (value.length <= 7) {
                    e.target.value = value.slice(0, 3) + '-' + value.slice(3);
                } else if (value.length <= 11) {
                    e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
                } else {
                    e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
            });
        });
        
        console.log('Phone formatting initialized:', phoneInputs.length, 'inputs');
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
            initTabSwitching();
            initBirthDateSelects();
            initFormValidation();
            initPhoneFormatting();
            
            console.log('Application Form Enhancements - All features loaded successfully! ✅');
        } catch (error) {
            console.error('Error initializing application form features:', error);
        }
    }
    
    // Start initialization
    init();
    
})();
