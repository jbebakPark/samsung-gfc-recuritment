// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();

// Global Variables
let allApplications = [];
let currentApplicationId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadApplications();
    setupRealtimeListener();
});

// Authentication Check
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'admin-login.html';
        } else {
            document.getElementById('adminName').textContent = user.email;
        }
    });
}

// Logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'admin-login.html';
    });
}

// Load Applications
async function loadApplications() {
    try {
        const snapshot = await db.collection('applications')
            .orderBy('createdAt', 'desc')
            .get();

        allApplications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        updateStatistics();
        applyFilters();
    } catch (error) {
        console.error('지원자 로드 오류:', error);
        alert('지원자 정보를 불러오는데 실패했습니다.');
    }
}

// Setup Realtime Listener
function setupRealtimeListener() {
    db.collection('applications').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added' || change.type === 'modified') {
                // 실시간 업데이트
                loadApplications();

                // 새로운 지원자 알림
                if (change.type === 'added') {
                    showNotification('새로운 지원자가 접수되었습니다!');
                }
            }
        });
    });
}

// Update Statistics
function updateStatistics() {
    const total = allApplications.length;
    const pending = allApplications.filter(app => app.status === 'pending').length;
    const review = allApplications.filter(app => app.status === 'review').length;
    const approved = allApplications.filter(app => app.status === 'approved').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('reviewCount').textContent = review;
    document.getElementById('approvedCount').textContent = approved;
}

// Apply Filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const periodFilter = document.getElementById('periodFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allApplications;

    // Status Filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Type Filter
    if (typeFilter !== 'all') {
        filtered = filtered.filter(app => app.applicationType === typeFilter);
    }

    // Period Filter
    if (periodFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();

        if (periodFilter === 'today') {
            filterDate.setHours(0, 0, 0, 0);
        } else if (periodFilter === 'week') {
            filterDate.setDate(now.getDate() - 7);
        } else if (periodFilter === 'month') {
            filterDate.setDate(now.getDate() - 30);
        }

        filtered = filtered.filter(app => {
            const appDate = app.createdAt.toDate();
            return appDate >= filterDate;
        });
    }

    // Search Filter
    if (searchInput) {
        filtered = filtered.filter(app =>
            app.name.toLowerCase().includes(searchInput) ||
            app.phone.includes(searchInput) ||
            app.email.toLowerCase().includes(searchInput)
        );
    }

    renderTable(filtered);
}

// Render Table
function renderTable(applications) {
    const tbody = document.getElementById('applicationsTableBody');

    if (applications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>조건에 맞는 지원자가 없습니다</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = applications.map(app => {
        const createdAt = app.createdAt.toDate();
        const daysElapsed = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));

        return `
            <tr>
                <td>${formatDate(createdAt)}</td>
                <td><strong>${app.name}</strong></td>
                <td>${app.phone}</td>
                <td>${app.email}</td>
                <td>${app.applicationType === 'jobfair' ? 'Job Fair' : '추천인 경로'}</td>
                <td><span class="status-badge ${app.status}">${getStatusText(app.status)}</span></td>
                <td>${daysElapsed}일</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewDetail('${app.id}')">
                            <i class="fas fa-eye"></i> 상세
                        </button>
                        <button class="btn-action btn-edit" onclick="openStatusModal('${app.id}')">
                            <i class="fas fa-edit"></i> 상태변경
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// View Detail
function viewDetail(applicationId) {
    const app = allApplications.find(a => a.id === applicationId);
    if (!app) return;

    const modalBody = document.getElementById('detailModalBody');
    modalBody.innerHTML = `
        <div class="detail-section">
            <h3>기본 정보</h3>
            <p><strong>이름:</strong> ${app.name}</p>
            <p><strong>연락처:</strong> ${app.phone}</p>
            <p><strong>이메일:</strong> ${app.email}</p>
            <p><strong>생년월일:</strong> ${app.birthdate || '-'}</p>
            <p><strong>주소:</strong> ${app.address || '-'}</p>
        </div>
        
        <div class="detail-section">
            <h3>지원 정보</h3>
            <p><strong>지원 구분:</strong> ${app.applicationType === 'jobfair' ? 'Job Fair 참가' : '추천인 경로'}</p>
            <p><strong>희망 근무지:</strong> ${app.preferredLocation || '-'}</p>
            ${app.applicationType === 'jobfair' ? `<p><strong>Job Fair 일정:</strong> ${app.jobFairDate || '-'}</p>` : ''}
            ${app.applicationType === 'referral' ? `<p><strong>추천인:</strong> ${app.referrerName || '-'} (${app.referrerPhone || '-'})</p>` : ''}
        </div>
        
        <div class="detail-section">
            <h3>경력 정보</h3>
            <p><strong>최종 학력:</strong> ${app.education || '-'}</p>
            <p><strong>경력:</strong> ${app.experience || '-'}</p>
            <p><strong>자격증:</strong> ${app.certifications || '-'}</p>
        </div>
        
        <div class="detail-section">
            <h3>상태 정보</h3>
            <p><strong>현재 상태:</strong> <span class="status-badge ${app.status}">${getStatusText(app.status)}</span></p>
            <p><strong>접수일시:</strong> ${formatDateTime(app.createdAt.toDate())}</p>
            ${app.statusHistory ? `<p><strong>상태 이력:</strong> ${app.statusHistory.length}건</p>` : ''}
        </div>
    `;

    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Open Status Modal
function openStatusModal(applicationId) {
    currentApplicationId = applicationId;
    const app = allApplications.find(a => a.id === applicationId);

    if (app) {
        document.getElementById('newStatus').value = app.status;
        document.getElementById('statusMemo').value = '';
        document.getElementById('sendNotification').checked = true;
    }

    document.getElementById('statusModal').classList.add('active');
}

function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('active');
    currentApplicationId = null;
}

// Update Status
async function updateStatus() {
    if (!currentApplicationId) return;

    const newStatus = document.getElementById('newStatus').value;
    const memo = document.getElementById('statusMemo').value;
    const sendNotification = document.getElementById('sendNotification').checked;

    try {
        // Update Firestore
        await db.collection('applications').doc(currentApplicationId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            statusHistory: firebase.firestore.FieldValue.arrayUnion({
                status: newStatus,
                memo: memo,
                updatedBy: auth.currentUser.email,
                updatedAt: new Date()
            })
        });

        // Send Notification
        if (sendNotification) {
            const app = allApplications.find(a => a.id === currentApplicationId);
            await sendStatusChangeNotification(app, newStatus, memo);
        }

        alert('상태가 변경되었습니다.');
        closeStatusModal();
        loadApplications();
    } catch (error) {
        console.error('상태 변경 오류:', error);
        alert('상태 변경에 실패했습니다.');
    }
}

// Send Status Change Notification
async function sendStatusChangeNotification(application, newStatus, memo) {
    try {
        const sendNotification = functions.httpsCallable('sendStatusChangeNotification');
        await sendNotification({
            applicationId: application.id,
            name: application.name,
            email: application.email,
            phone: application.phone,
            newStatus: newStatus,
            memo: memo
        });
    } catch (error) {
        console.error('알림 전송 오류:', error);
    }
}

// Export to Excel
function exportToExcel() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;

    let filtered = allApplications;

    if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (typeFilter !== 'all') {
        filtered = filtered.filter(app => app.applicationType === typeFilter);
    }

    // CSV 생성
    const headers = ['접수일시', '이름', '연락처', '이메일', '지원구분', '상태', '경과일수'];
    const rows = filtered.map(app => {
        const createdAt = app.createdAt.toDate();
        const daysElapsed = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));

        return [
            formatDateTime(createdAt),
            app.name,
            app.phone,
            app.email,
            app.applicationType === 'jobfair' ? 'Job Fair' : '추천인 경로',
            getStatusText(app.status),
            daysElapsed + '일'
        ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GFC_지원자_${formatDate(new Date())}.csv`;
    link.click();
}

// Utility Functions
function formatDate(date) {
    return date.toLocaleDateString('ko-KR');
}

function formatDateTime(date) {
    return date.toLocaleString('ko-KR');
}

function getStatusText(status) {
    const statusMap = {
        'pending': '접수 대기',
        'review': '검토 중',
        'approved': '합격',
        'rejected': '불합격'
    };
    return statusMap[status] || status;
}

function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('GFC 지원자 관리', {
            body: message,
            icon: '/favicon.ico'
        });
    }
}

// Request Notification Permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
