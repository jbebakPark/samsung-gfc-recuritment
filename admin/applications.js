// 삼성생명 GFC 지원자 관리 시스템
// Version: 1.0.0
// Last Updated: 2026-01-02

console.log('GFC Applications Management - Loaded Successfully');

// ========================================
// 1. 전역 변수
// ========================================
let allApplications = [];
let filteredApplications = [];
let currentApplication = null;

// ========================================
// 2. 초기 로드
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing applications management system');
    loadApplications();
});

// ========================================
// 3. 지원자 데이터 로드
// ========================================
async function loadApplications() {
    console.log('Loading applications...');
    
    const container = document.getElementById('applications-container');
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>지원자 정보를 불러오는 중...</p>
        </div>
    `;
    
    try {
        // RESTful Table API 호출
        const response = await fetch('/tables/gfc_applications?limit=1000&sort=-submitted_at');
        
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        
        const result = await response.json();
        allApplications = result.data || [];
        filteredApplications = [...allApplications];
        
        console.log(`Loaded ${allApplications.length} applications`);
        
        // 통계 업데이트
        updateStatistics();
        
        // 테이블 렌더링
        renderApplicationsTable();
        
    } catch (error) {
        console.error('Error loading applications:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>지원자 데이터를 불러오는데 실패했습니다.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadApplications()">
                    <i class="fas fa-sync-alt"></i> 다시 시도
                </button>
            </div>
        `;
    }
}

// ========================================
// 4. 통계 업데이트
// ========================================
function updateStatistics() {
    const total = allApplications.length;
    const pending = allApplications.filter(app => app.status === 'pending').length;
    const approved = allApplications.filter(app => app.status === 'approved').length;
    
    // 이번 달 신규 지원자
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthCount = allApplications.filter(app => {
        const submitDate = new Date(app.submitted_at);
        return submitDate >= thisMonth;
    }).length;
    
    // 통계 업데이트
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-approved').textContent = approved;
    document.getElementById('stat-month').textContent = monthCount;
}

// ========================================
// 5. 테이블 렌더링
// ========================================
function renderApplicationsTable() {
    const container = document.getElementById('applications-container');
    
    if (filteredApplications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>지원자가 없습니다.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">필터를 초기화하거나 새로운 지원을 기다려주세요.</p>
            </div>
        `;
        return;
    }
    
    const tableHTML = `
        <div style="overflow-x: auto;">
            <table class="applications-table">
                <thead>
                    <tr>
                        <th>지원일</th>
                        <th>유형</th>
                        <th>이름</th>
                        <th>연락처</th>
                        <th>이메일</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredApplications.map(app => `
                        <tr>
                            <td>${formatDate(app.submitted_at)}</td>
                            <td>${getTypeBadge(app.application_type)}</td>
                            <td><strong>${app.name}</strong></td>
                            <td>${app.phone}</td>
                            <td>${app.email}</td>
                            <td>${getStatusBadge(app.status)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary" onclick="viewDetails('${app.id}')">
                                        <i class="fas fa-eye"></i> 상세
                                    </button>
                                    ${app.status === 'pending' ? `
                                        <button class="btn btn-sm btn-success" onclick="updateStatus('${app.id}', 'approved')">
                                            <i class="fas fa-check"></i> 승인
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="updateStatus('${app.id}', 'rejected')">
                                            <i class="fas fa-times"></i> 거부
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

// ========================================
// 6. 필터링 및 검색
// ========================================
function applyFilters() {
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    filteredApplications = allApplications.filter(app => {
        // 유형 필터
        if (typeFilter && app.application_type !== typeFilter) {
            return false;
        }
        
        // 상태 필터
        if (statusFilter && app.status !== statusFilter) {
            return false;
        }
        
        // 검색
        if (searchQuery) {
            const searchableText = `
                ${app.name} 
                ${app.email} 
                ${app.phone}
            `.toLowerCase();
            
            if (!searchableText.includes(searchQuery)) {
                return false;
            }
        }
        
        return true;
    });
    
    console.log(`Filtered: ${filteredApplications.length} / ${allApplications.length}`);
    renderApplicationsTable();
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        applyFilters();
    }
}

// ========================================
// 7. 상세 보기
// ========================================
function viewDetails(id) {
    const app = allApplications.find(a => a.id === id);
    if (!app) return;
    
    currentApplication = app;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-user"></i> 기본 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">지원 유형</div>
                <div class="detail-value">${getTypeText(app.application_type)}</div>
                
                <div class="detail-label">성명</div>
                <div class="detail-value"><strong>${app.name}</strong></div>
                
                <div class="detail-label">생년월일</div>
                <div class="detail-value">${app.birth_date}</div>
                
                <div class="detail-label">성별</div>
                <div class="detail-value">${app.gender}</div>
                
                <div class="detail-label">연락처</div>
                <div class="detail-value">${app.phone}</div>
                
                <div class="detail-label">이메일</div>
                <div class="detail-value">${app.email}</div>
                
                <div class="detail-label">주소</div>
                <div class="detail-value">${app.address} ${app.address_detail || ''}</div>
            </div>
        </div>

        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-graduation-cap"></i> 학력 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">최종학력</div>
                <div class="detail-value">${app.education_level}</div>
                
                <div class="detail-label">학교명</div>
                <div class="detail-value">${app.education_school}</div>
                
                <div class="detail-label">전공</div>
                <div class="detail-value">${app.education_major || '-'}</div>
                
                <div class="detail-label">졸업구분</div>
                <div class="detail-value">${app.education_status}</div>
            </div>
        </div>

        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-briefcase"></i> 경력 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">총 경력</div>
                <div class="detail-value">${app.career_years}년</div>
                
                <div class="detail-label">자격증</div>
                <div class="detail-value">${app.certificates || '-'}</div>
                
                <div class="detail-label">경력 상세</div>
                <div class="detail-value" style="white-space: pre-wrap;">${app.career_summary || '-'}</div>
            </div>
        </div>

        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-pen"></i> 지원 동기</h3>
            <p style="white-space: pre-wrap; line-height: 1.8; color: var(--text-light);">${app.motivation}</p>
        </div>

        ${app.strengths ? `
        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-star"></i> 강점</h3>
            <p style="white-space: pre-wrap; line-height: 1.8; color: var(--text-light);">${app.strengths}</p>
        </div>
        ` : ''}

        ${app.application_type === 'jobfair' ? `
        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-calendar-alt"></i> 채용설명회 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">희망 날짜</div>
                <div class="detail-value">${app.job_fair_date}</div>
                
                <div class="detail-label">희망 지역</div>
                <div class="detail-value">${app.job_fair_location}</div>
            </div>
        </div>
        ` : ''}

        ${app.application_type === 'referral' ? `
        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-user-tie"></i> 추천인 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">추천인 성명</div>
                <div class="detail-value">${app.referrer_name}</div>
                
                <div class="detail-label">소속 지점</div>
                <div class="detail-value">${app.referrer_branch}</div>
                
                <div class="detail-label">연락처</div>
                <div class="detail-value">${app.referrer_phone}</div>
            </div>
        </div>
        ` : ''}

        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-shield-alt"></i> 개인정보 동의</h3>
            <div class="detail-grid">
                <div class="detail-label">수집/이용 동의</div>
                <div class="detail-value">${app.consent_collection ? '✅ 동의' : '❌ 미동의'}</div>
                
                <div class="detail-label">제3자 제공 동의</div>
                <div class="detail-value">${app.consent_third_party ? '✅ 동의' : '❌ 미동의'}</div>
                
                <div class="detail-label">신용정보 조회 동의</div>
                <div class="detail-value">${app.consent_credit_inquiry ? '✅ 동의' : '❌ 미동의'}</div>
                
                <div class="detail-label">마케팅 활용 동의</div>
                <div class="detail-value">${app.consent_marketing ? '✅ 동의' : '❌ 미동의'}</div>
            </div>
        </div>

        <div class="detail-section">
            <h3 class="detail-section-title"><i class="fas fa-info-circle"></i> 관리 정보</h3>
            <div class="detail-grid">
                <div class="detail-label">지원일</div>
                <div class="detail-value">${formatDateTime(app.submitted_at)}</div>
                
                <div class="detail-label">현재 상태</div>
                <div class="detail-value">${getStatusBadge(app.status)}</div>
                
                ${app.reviewed_at ? `
                <div class="detail-label">검토일</div>
                <div class="detail-value">${formatDateTime(app.reviewed_at)}</div>
                ` : ''}
                
                ${app.reviewed_by ? `
                <div class="detail-label">검토자</div>
                <div class="detail-value">${app.reviewed_by}</div>
                ` : ''}
            </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
            ${app.status === 'pending' ? `
                <button class="btn btn-success" onclick="updateStatus('${app.id}', 'approved')">
                    <i class="fas fa-check"></i> 승인
                </button>
                <button class="btn btn-danger" onclick="updateStatus('${app.id}', 'rejected')">
                    <i class="fas fa-times"></i> 거부
                </button>
            ` : ''}
            <button class="btn btn-primary" onclick="closeModal()">닫기</button>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// ========================================
// 8. 상태 업데이트
// ========================================
async function updateStatus(id, newStatus) {
    if (!confirm(`이 지원서를 ${newStatus === 'approved' ? '승인' : '거부'}하시겠습니까?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/tables/gfc_applications/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus,
                reviewed_at: new Date().toISOString(),
                reviewed_by: 'Admin' // TODO: 실제 관리자 이름
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        alert('상태가 업데이트되었습니다.');
        closeModal();
        loadApplications();
        
    } catch (error) {
        console.error('Error updating status:', error);
        alert('상태 업데이트에 실패했습니다.\n' + error.message);
    }
}

// ========================================
// 9. 유틸리티 함수
// ========================================
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
}

function getTypeText(type) {
    const types = {
        'jobfair': '채용설명회',
        'referral': '추천인 경로',
        'direct': '직접 지원'
    };
    return types[type] || type;
}

function getTypeBadge(type) {
    const badges = {
        'jobfair': '<span style="background: #e3f2fd; color: #1976d2; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">채용설명회</span>',
        'referral': '<span style="background: #fff3e0; color: #f57c00; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">추천인</span>',
        'direct': '<span style="background: #e8f5e9; color: #388e3c; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">직접지원</span>'
    };
    return badges[type] || type;
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="status-badge status-pending">대기 중</span>',
        'reviewing': '<span class="status-badge status-reviewing">검토 중</span>',
        'approved': '<span class="status-badge status-approved">승인됨</span>',
        'rejected': '<span class="status-badge status-rejected">거부됨</span>',
        'interviewed': '<span class="status-badge status-interviewed">면접 완료</span>'
    };
    return badges[status] || status;
}
