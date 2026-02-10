// ============================================
// GFC 관리자 대시보드
// ============================================

const db = firebase.firestore();
let currentPage = 1;
const itemsPerPage = 20;
let filters = {};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadApplicants();
    
    // 필터 이벤트 리스너
    document.getElementById('filterApplicationType').addEventListener('change', applyFilters);
    document.getElementById('filterSubmissionMethod').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    
    // 검색 엔터키 이벤트
    document.getElementById('searchQuery').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    
    // 전체 선택 체크박스
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
});

/**
 * 통계 데이터 로드
 */
async function loadStatistics() {
    try {
        const applicantsRef = db.collection('applicants');
        
        // 전체 지원자 수
        const totalSnapshot = await applicantsRef.get();
        document.getElementById('totalApplications').textContent = totalSnapshot.size;
        
        // 심사 대기 (접수완료, 심사중)
        const pendingSnapshot = await applicantsRef
            .where('status', 'in', ['submitted', 'reviewing'])
            .get();
        document.getElementById('pendingReview').textContent = pendingSnapshot.size;
        
        // 면접 예정
        const interviewSnapshot = await applicantsRef
            .where('status', '==', 'interview_scheduled')
            .get();
        document.getElementById('interviewScheduled').textContent = interviewSnapshot.size;
        
        // 합격자
        const acceptedSnapshot = await applicantsRef
            .where('status', '==', 'accepted')
            .get();
        document.getElementById('accepted').textContent = acceptedSnapshot.size;
        
    } catch (error) {
        console.error('통계 로드 실패:', error);
    }
}

/**
 * 지원자 목록 로드
 */
async function loadApplicants() {
    try {
        let query = db.collection('applicants')
            .orderBy('createdAt', 'desc');
        
        // 필터 적용
        if (filters.applicationType) {
            query = query.where('applicationType', '==', filters.applicationType);
        }
        if (filters.submissionMethod) {
            query = query.where('submissionMethod', '==', filters.submissionMethod);
        }
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        
        const snapshot = await query.get();
        let applicants = [];
        
        snapshot.forEach(doc => {
            applicants.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // 검색어 필터 (클라이언트 사이드)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            applicants = applicants.filter(app => 
                app.personalInfo.name.toLowerCase().includes(searchLower) ||
                app.personalInfo.email.toLowerCase().includes(searchLower) ||
                app.personalInfo.phone.includes(filters.search)
            );
        }
        
        displayApplicants(applicants);
        displayPagination(applicants.length);
        
    } catch (error) {
        console.error('지원자 목록 로드 실패:', error);
        showError('지원자 목록을 불러오는데 실패했습니다.');
    }
}

/**
 * 지원자 목록 표시
 */
function displayApplicants(applicants) {
    const tbody = document.getElementById('applicantsTableBody');
    tbody.innerHTML = '';
    
    if (applicants.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="color: #999;">검색 결과가 없습니다.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // 페이지네이션 적용
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageApplicants = applicants.slice(start, end);
    
    pageApplicants.forEach(applicant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${applicant.id}"></td>
            <td>${formatDate(applicant.createdAt)}</td>
            <td>${applicant.personalInfo.name}</td>
            <td>${applicant.personalInfo.phone}</td>
            <td><span class="status-badge status-${applicant.applicationType}">${applicant.applicationTypeLabel}</span></td>
            <td>${applicant.submissionMethodLabel}</td>
            <td><span class="status-badge status-${applicant.status}">${applicant.statusLabel}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action" onclick="viewApplicant('${applicant.id}')" title="상세보기">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="editApplicant('${applicant.id}')" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action" onclick="sendNotificationToApplicant('${applicant.id}')" title="알림발송">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn-action" onclick="changeStatus('${applicant.id}')" title="상태변경">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * 페이지네이션 표시
 */
function displayPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    pagination.innerHTML = '';
    
    // 이전 버튼
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadApplicants();
        }
    });
    pagination.appendChild(prevBtn);
    
    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadApplicants();
            });
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pagination.appendChild(dots);
        }
    }
    
    // 다음 버튼
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadApplicants();
        }
    });
    pagination.appendChild(nextBtn);
}

/**
 * 필터 적용
 */
function applyFilters() {
    filters = {
        applicationType: document.getElementById('filterApplicationType').value,
        submissionMethod: document.getElementById('filterSubmissionMethod').value,
        status: document.getElementById('filterStatus').value,
        search: document.getElementById('searchQuery').value
    };
    
    currentPage = 1;
    loadApplicants();
}

/**
 * 필터 초기화
 */
function resetFilters() {
    document.getElementById('filterApplicationType').value = '';
    document.getElementById('filterSubmissionMethod').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('searchQuery').value = '';
    
    filters = {};
    currentPage = 1;
    loadApplicants();
}

/**
 * 지원자 상세 보기
 */
function viewApplicant(id) {
    window.location.href = `applicant-detail.html?id=${id}`;
}

/**
 * 지원자 정보 수정
 */
function editApplicant(id) {
    window.location.href = `applicant-edit.html?id=${id}`;
}

/**
 * 상태 변경
 */
async function changeStatus(id) {
    const newStatus = prompt('새로운 상태를 선택하세요:\n\n' +
        '1: 접수완료\n' +
        '2: 심사중\n' +
        '3: 면접통보\n' +
        '4: 면접완료\n' +
        '5: 합격\n' +
        '6: 불합격'
    );
    
    const statusMap = {
        '1': 'submitted',
        '2': 'reviewing',
        '3': 'interview_scheduled',
        '4': 'interview_completed',
        '5': 'accepted',
        '6': 'rejected'
    };
    
    if (statusMap[newStatus]) {
        try {
            const note = prompt('메모 (선택사항):');
            await updateApplicantStatus(id, statusMap[newStatus], note || '');
            alert('상태가 변경되었습니다.');
            loadApplicants();
            loadStatistics();
        } catch (error) {
            alert('상태 변경에 실패했습니다: ' + error.message);
        }
    }
}

/**
 * 개별 알림 발송
 */
async function sendNotificationToApplicant(id) {
    const type = prompt('알림 유형:\n\n1: 접수완료\n2: 심사중\n3: 면접통보\n4: 합격\n5: 불합격');
    
    if (type >= '1' && type <= '5') {
        try {
            const applicantDoc = await db.collection('applicants').doc(id).get();
            const applicantData = applicantDoc.data();
            
            // TODO: 알림 발송 구현
            alert('알림이 발송되었습니다.');
        } catch (error) {
            alert('알림 발송에 실패했습니다: ' + error.message);
        }
    }
}

/**
 * 일괄 알림 발송
 */
function sendBulkNotifications() {
    const checked = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    if (checked.length === 0) {
        alert('알림을 발송할 지원자를 선택해주세요.');
        return;
    }
    
    const message = prompt(`${checked.length}명에게 발송할 메시지:`);
    if (message) {
        // TODO: 일괄 알림 발송 구현
        alert('일괄 알림이 발송되었습니다.');
    }
}

/**
 * 데이터 엑셀 다운로드
 */
async function exportData() {
    try {
        const snapshot = await db.collection('applicants')
            .orderBy('createdAt', 'desc')
            .get();
        
        let csv = '\uFEFF'; // UTF-8 BOM
        csv += '접수일,이름,생년월일,성별,연락처,이메일,지원구분,접수방법,상태,학력,경력\n';
        
        snapshot.forEach(doc => {
            const data = doc.data();
            csv += `${formatDate(data.createdAt)},`;
            csv += `${data.personalInfo.name},`;
            csv += `${data.personalInfo.birthDate},`;
            csv += `${data.personalInfo.gender},`;
            csv += `${data.personalInfo.phone},`;
            csv += `${data.personalInfo.email},`;
            csv += `${data.applicationTypeLabel},`;
            csv += `${data.submissionMethodLabel},`;
            csv += `${data.statusLabel},`;
            csv += `${data.education.level},`;
            csv += `${data.career.hasInsuranceExperience ? '보험사' : '일반'}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `GFC_지원자_${formatDate(new Date())}.csv`;
        link.click();
        
    } catch (error) {
        alert('다운로드에 실패했습니다: ' + error.message);
    }
}

/**
 * 날짜 포맷
 */
function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 에러 표시
 */
function showError(message) {
    const tbody = document.getElementById('applicantsTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff5722; margin-bottom: 1rem;"></i>
                <p style="color: #ff5722;">${message}</p>
            </td>
        </tr>
    `;
}

// updateApplicantStatus 함수 (applicant-manager.js에서 가져옴)
async function updateApplicantStatus(applicantId, newStatus, note = '') {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const statusLabel = getStatusLabel(newStatus);
    
    await db.collection('applicants').doc(applicantId).update({
        status: newStatus,
        statusLabel: statusLabel,
        statusHistory: firebase.firestore.FieldValue.arrayUnion({
            status: newStatus,
            statusLabel: statusLabel,
            timestamp: timestamp,
            note: note
        }),
        updatedAt: timestamp
    });
}

function getStatusLabel(status) {
    const labels = {
        'submitted': '접수완료',
        'reviewing': '심사중',
        'interview_scheduled': '면접통보',
        'interview_completed': '면접완료',
        'accepted': '합격',
        'rejected': '불합격'
    };
    return labels[status] || status;
}
