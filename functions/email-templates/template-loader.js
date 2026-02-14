/**
 * 이메일 템플릿 로더
 */
const fs = require('fs');
const path = require('path');

/**
 * HTML 템플릿 로드 및 변수 치환
 * @param {string} templateName - 템플릿 파일명 (확장자 제외)
 * @param {object} variables - 치환할 변수 객체
 * @returns {string} - 치환된 HTML 문자열
 */
function loadTemplate(templateName, variables = {}) {
    try {
        const templatePath = path.join(__dirname, `${templateName}.html`);
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // 변수 치환 ({{variableName}} 형식)
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, variables[key] || '');
        });
        
        return template;
    } catch (error) {
        console.error(`템플릿 로드 실패: ${templateName}`, error);
        return null;
    }
}

/**
 * 지원자 확인 이메일 템플릿
 */
function getApplicantConfirmationEmail(data) {
    return loadTemplate('applicant-confirmation', {
        name: data.name,
        managementNumber: data.managementNumber,
        timestamp: data.timestamp,
        applicationType: data.applicationType
    });
}

/**
 * 관리자 알림 이메일 템플릿
 */
function getAdminNotificationEmail(data) {
    return loadTemplate('admin-notification', {
        managementNumber: data.managementNumber,
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthDate: data.birthDate || '미입력',
        applicationType: data.applicationType,
        address: data.address || '미입력',
        career: data.career || '미입력',
        motivation: data.motivation || '미입력',
        timestamp: data.timestamp
    });
}

module.exports = {
    loadTemplate,
    getApplicantConfirmationEmail,
    getAdminNotificationEmail
};
