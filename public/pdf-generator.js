// PDF 생성 및 출력 기능
// jsPDF 라이브러리 사용

class GFCApplicationPDF {
    constructor(applicationData) {
        this.data = applicationData;
        this.doc = null;
    }

    // PDF 생성
    async generate() {
        // jsPDF 및 한글 폰트 로드 필요
        const { jsPDF } = window.jspdf;
        this.doc = new jsPDF('p', 'mm', 'a4');

        // 한글 폰트 설정 (NanumGothic)
        this.doc.setFont('NanumGothic');

        // 페이지 1: 기본 정보
        this.drawHeader();
        this.drawPersonalInfo();
        this.drawEducation();

        // 페이지 2: 경력 및 자격증
        this.doc.addPage();
        this.drawExperience();
        this.drawCertifications();

        return this.doc;
    }

    // 헤더 그리기
    drawHeader() {
        const doc = this.doc;

        // 제목 배경
        doc.setFillColor(3, 78, 162);
        doc.rect(0, 0, 210, 30, 'F');

        // 제목
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('GFC 지원서', 105, 20, { align: 'center' });

        // 관리번호
        doc.setFontSize(12);
        doc.text(`지원: ${this.data.managementNumber}`, 20, 40);
        doc.text(`유치자: ___________`, 150, 40);

        doc.setTextColor(0, 0, 0);
    }

    // 개인 정보 그리기
    drawPersonalInfo() {
        const doc = this.doc;
        let y = 50;

        // 섹션 제목
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y, 170, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('NanumGothic', 'bold');
        doc.text('인적사항', 25, y + 7);

        y += 15;
        doc.setFont('NanumGothic', 'normal');
        doc.setFontSize(11);

        // 테이블 그리기
        const rows = [
            ['성명', this.data.personalInfo.name, '성별', this.data.personalInfo.gender, '연령', this.calculateAge(this.data.personalInfo.birthdate)],
            ['주소', this.data.personalInfo.address, '', '', '', ''],
            ['연락처', `(지택) ${this.data.personalInfo.phone}`, '', `(휴대폰) ${this.data.personalInfo.phone}`, '', ''],
            ['E-mail', this.data.personalInfo.email, '', '', '', ''],
            ['금융투자 여부', this.data.personalInfo.insuranceStatus === 'YES' ? '1.YES' : '2.NO', '결혼 여부', this.data.personalInfo.maritalStatus || '', '가족 / 미혼', '']
        ];

        this.drawTable(20, y, 170, rows, [30, 50, 30, 30, 30]);
    }

    // 학력 그리기
    drawEducation() {
        const doc = this.doc;
        let y = 120;

        // 섹션 제목
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y, 170, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('NanumGothic', 'bold');
        doc.text('학력', 25, y + 7);

        y += 15;
        doc.setFont('NanumGothic', 'normal');
        doc.setFontSize(10);

        // 학력 테이블
        const educationRows = this.data.education.map(edu => [
            edu.level,
            edu.schoolName,
            edu.major || '',
            edu.graduationStatus,
            edu.graduationDate || ''
        ]);

        this.drawTable(20, y, 170, [
            ['학교명', '전공', '소재지', '졸업구분', '졸업년월'],
            ...educationRows
        ], [40, 40, 30, 30, 30]);
    }

    // 경력 그리기
    drawExperience() {
        const doc = this.doc;
        let y = 30;

        // 섹션 제목
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y, 170, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('NanumGothic', 'bold');
        doc.text('경력사항', 25, y + 7);

        y += 15;
        doc.setFont('NanumGothic', 'normal');
        doc.setFontSize(10);

        // 경력 테이블
        const experienceRows = this.data.experience.map(exp => [
            exp.companyName,
            `${exp.period.from} ~ ${exp.period.to}`,
            exp.position,
            exp.department,
            exp.salary || ''
        ]);

        this.drawTable(20, y, 170, [
            ['회사명', '재직기간', '직위', '업종', '담당업무(간략)'],
            ...experienceRows
        ], [40, 40, 25, 30, 35]);
    }

    // 자격증 그리기
    drawCertifications() {
        const doc = this.doc;
        let y = 120;

        // 섹션 제목
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y, 170, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('NanumGothic', 'bold');
        doc.text('자격사항', 25, y + 7);

        y += 15;
        doc.setFont('NanumGothic', 'normal');
        doc.setFontSize(10);

        // 자격증 리스트
        this.data.certifications.forEach((cert, index) => {
            doc.text(`${index + 1}. ${cert.name} (${cert.issuer}, ${cert.date})`, 25, y);
            y += 7;
        });
    }

    // 테이블 그리기 헬퍼
    drawTable(x, y, width, rows, columnWidths) {
        const doc = this.doc;
        const rowHeight = 8;

        rows.forEach((row, rowIndex) => {
            let currentX = x;

            row.forEach((cell, colIndex) => {
                const colWidth = columnWidths[colIndex] || (width / row.length);

                // 셀 테두리
                doc.rect(currentX, y, colWidth, rowHeight);

                // 헤더 배경
                if (rowIndex === 0) {
                    doc.setFillColor(240, 240, 240);
                    doc.rect(currentX, y, colWidth, rowHeight, 'F');
                }

                // 텍스트
                doc.text(cell || '', currentX + 2, y + 6);
                currentX += colWidth;
            });

            y += rowHeight;
        });
    }

    // 나이 계산
    calculateAge(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age + '세';
    }

    // PDF 다운로드
    download() {
        const filename = `GFC_지원서_${this.data.managementNumber}_${this.data.personalInfo.name}.pdf`;
        this.doc.save(filename);
    }

    // PDF 인쇄
    print() {
        this.doc.autoPrint();
        window.open(this.doc.output('bloburl'), '_blank');
    }
}

// 사용 예시
async function generateApplicationPDF(applicationData) {
    const pdfGenerator = new GFCApplicationPDF(applicationData);
    await pdfGenerator.generate();
    return pdfGenerator;
}

// 관리번호 생성 함수
function generateManagementNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GFC-${year}-${randomNum}`;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GFCApplicationPDF, generateManagementNumber };
}
