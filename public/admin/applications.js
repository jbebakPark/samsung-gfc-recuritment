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
        
        // 차트 초기화
        initializeCharts();
        
        // 테이블 렌더링
        renderApplicationsTable();
        
    } catch (error) {
        console.error('Error loading applications:', error);
        console.log('Loading sample data instead...');
        
        // 샘플 데이터 로드 (API 연동 전 테스트용)
        allApplications = getSampleApplications();
        filteredApplications = [...allApplications];
        
        console.log(`Loaded ${allApplications.length} sample applications`);
        
        // 통계 업데이트
        updateStatistics();
        
        // 차트 초기화
        initializeCharts();
        
        // 테이블 렌더링
        renderApplicationsTable();
        
        // 안내 메시지 표시
        if (allApplications.length > 0) {
            const notice = document.createElement('div');
            notice.style.cssText = 'background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;';
            notice.innerHTML = `
                <p style="margin: 0; color: #856404;">
                    <i class="fas fa-info-circle"></i> 
                    <strong>샘플 데이터 모드</strong>: API 연동 전이므로 샘플 데이터를 표시합니다.
                </p>
            `;
            container.parentElement.insertBefore(notice, container);
        }
    }
}

// ========================================
// 샘플 데이터 생성 함수
// ========================================
function getSampleApplications() {
    return [
        {
            id: 'app001',
            application_type: 'jobfair',
            name: '김철수',
            birth_date: '1985-03-15',
            gender: '남성',
            phone: '010-1234-5678',
            email: 'kim.cs@example.com',
            address: '서울특별시 강남구 테헤란로 123',
            address_detail: '456호',
            education_level: '대학교 졸업',
            education_school: '서울대학교',
            education_major: '경영학',
            education_status: '졸업',
            career_years: 10,
            certificates: 'CPA, 재무분석사',
            career_summary: '대기업 재무팀 10년 경력\n중소기업 컨설팅 3년',
            motivation: '평생 일할 수 있는 전문직으로 제2의 인생을 시작하고 싶습니다.',
            strengths: '재무 분석 및 기업 컨설팅 경험이 풍부합니다.',
            job_fair_date: '2026-02-15',
            job_fair_location: '서울',
            consent_collection: true,
            consent_third_party: true,
            consent_credit_inquiry: true,
            consent_marketing: true,
            status: 'pending',
            submitted_at: '2026-02-01T09:30:00Z'
        },
        {
            id: 'app002',
            application_type: 'referral',
            name: '이영희',
            birth_date: '1978-07-22',
            gender: '여성',
            phone: '010-2345-6789',
            email: 'lee.yh@example.com',
            address: '경기도 성남시 분당구 판교로 234',
            address_detail: '',
            education_level: '대학원 졸업',
            education_school: '연세대학교',
            education_major: '경제학',
            education_status: '석사 졸업',
            career_years: 15,
            certificates: 'CFP, 증권분석사',
            career_summary: '금융권 15년 경력\n자산관리 전문가',
            motivation: '고객에게 실질적인 도움을 줄 수 있는 일을 하고 싶습니다.',
            strengths: '고객 관리 및 재무 설계 전문성',
            referrer_name: '박지성',
            referrer_branch: '강남지점',
            referrer_phone: '010-3456-7890',
            consent_collection: true,
            consent_third_party: true,
            consent_credit_inquiry: true,
            consent_marketing: false,
            status: 'approved',
            submitted_at: '2026-01-28T14:20:00Z',
            reviewed_at: '2026-01-29T10:15:00Z',
            reviewed_by: '관리자'
        },
        {
            id: 'app003',
            application_type: 'direct',
            name: '박민수',
            birth_date: '1990-11-05',
            gender: '남성',
            phone: '010-3456-7890',
            email: 'park.ms@example.com',
            address: '부산광역시 해운대구 센텀로 345',
            address_detail: '101동 1502호',
            education_level: '대학교 졸업',
            education_school: '부산대학교',
            education_major: '회계학',
            education_status: '졸업',
            career_years: 7,
            certificates: '세무사, 회계사',
            career_summary: '회계법인 7년 근무\n중소기업 세무 컨설팅',
            motivation: '지역 중소기업에 실질적인 도움을 주고 싶습니다.',
            strengths: '세무 및 회계 전문성, 지역 네트워크',
            consent_collection: true,
            consent_third_party: true,
            consent_credit_inquiry: true,
            consent_marketing: true,
            status: 'reviewing',
            submitted_at: '2026-02-02T11:45:00Z'
        },
        {
            id: 'app004',
            application_type: 'jobfair',
            name: '최지혜',
            birth_date: '1982-04-18',
            gender: '여성',
            phone: '010-4567-8901',
            email: 'choi.jh@example.com',
            address: '인천광역시 연수구 송도과학로 456',
            address_detail: '',
            education_level: '대학교 졸업',
            education_school: '인하대학교',
            education_major: '금융학',
            education_status: '졸업',
            career_years: 12,
            certificates: 'FRM, 투자분석사',
            career_summary: '은행 PB 12년 경력\nVIP 고객 관리',
            motivation: '더 많은 고객에게 전문적인 재무 서비스를 제공하고 싶습니다.',
            strengths: 'VIP 고객 관리 경험, 투자 포트폴리오 구성 능력',
            job_fair_date: '2026-02-20',
            job_fair_location: '인천',
            consent_collection: true,
            consent_third_party: true,
            consent_credit_inquiry: true,
            consent_marketing: true,
            status: 'pending',
            submitted_at: '2026-02-03T08:15:00Z'
        },
        {
            id: 'app005',
            application_type: 'referral',
            name: '정우성',
            birth_date: '1975-12-30',
            gender: '남성',
            phone: '010-5678-9012',
            email: 'jung.ws@example.com',
            address: '대전광역시 유성구 대학로 567',
            address_detail: '202호',
            education_level: '대학원 졸업',
            education_school: 'KAIST',
            education_major: '산업공학',
            education_status: '박사 졸업',
            career_years: 20,
            certificates: 'PMP, 경영지도사',
            career_summary: '대기업 경영전략팀 20년\n중소기업 컨설팅 다수',
            motivation: '학문적 지식과 실무 경험을 바탕으로 중소기업 성장에 기여하고 싶습니다.',
            strengths: '전략 수립 및 실행 능력, 데이터 분석',
            referrer_name: '김태희',
            referrer_branch: '대전지점',
            referrer_phone: '010-6789-0123',
            consent_collection: true,
            consent_third_party: true,
            consent_credit_inquiry: true,
            consent_marketing: true,
            status: 'rejected',
            submitted_at: '2026-01-25T16:30:00Z',
            reviewed_at: '2026-01-26T09:00:00Z',
            reviewed_by: '관리자'
        }
    ];
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
    
    // 차트 업데이트
    initializeCharts();
    
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

// ========================================
// 차트 관련 함수
// ========================================

let dailyChartInstance = null;
let trackChartInstance = null;
let regionChartInstance = null;
let ageChartInstance = null;

// 차트 초기화
function initializeCharts() {
    console.log('Initializing charts...');
    
    // 기존 차트 파괴
    if (dailyChartInstance) dailyChartInstance.destroy();
    if (trackChartInstance) trackChartInstance.destroy();
    if (regionChartInstance) regionChartInstance.destroy();
    if (ageChartInstance) ageChartInstance.destroy();
    
    // 데이터 집계 (필터된 데이터 사용)
    const dataSource = filteredApplications.length > 0 ? filteredApplications : allApplications;
    const dailyData = aggregateDailyData(dataSource);
    const trackData = aggregateTrackData(dataSource);
    const regionData = aggregateRegionData(dataSource);
    const ageData = aggregateAgeData(dataSource);
    
    // 차트 렌더링
    renderDailyChart(dailyData);
    renderTrackChart(trackData);
    renderRegionChart(regionData);
    renderAgeChart(ageData);
}

// 일별 데이터 집계 (최근 30일)
function aggregateDailyData(applications = allApplications) {
    const dailyCount = {};
    const today = new Date();
    
    // 최근 30일 초기화
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyCount[dateStr] = 0;
    }
    
    // 지원자 데이터 집계
    applications.forEach(app => {
        if (app.submitted_at) {
            const dateStr = app.submitted_at.split('T')[0];
            if (dailyCount.hasOwnProperty(dateStr)) {
                dailyCount[dateStr]++;
            }
        }
    });
    
    return {
        labels: Object.keys(dailyCount).map(date => {
            const d = new Date(date);
            return `${d.getMonth() + 1}/${d.getDate()}`;
        }),
        data: Object.values(dailyCount)
    };
}

// 트랙별 데이터 집계
function aggregateTrackData(applications = allApplications) {
    const trackCount = {
        'jobfair': 0,
        'referral': 0,
        'direct': 0
    };
    
    applications.forEach(app => {
        const track = app.application_type || 'direct';
        if (trackCount.hasOwnProperty(track)) {
            trackCount[track]++;
        }
    });
    
    return {
        labels: ['채용설명회', '추천인 경로', '직접 지원'],
        data: [trackCount.jobfair, trackCount.referral, trackCount.direct],
        colors: ['#1976d2', '#f57c00', '#388e3c']
    };
}

// 지역별 데이터 집계 (상위 10개)
function aggregateRegionData(applications = allApplications) {
    const regionCount = {};
    
    applications.forEach(app => {
        if (app.address) {
            // 주소에서 시/도 추출
            const parts = app.address.split(' ');
            const region = parts[0] || '기타';
            regionCount[region] = (regionCount[region] || 0) + 1;
        }
    });
    
    // 상위 10개 지역 정렬
    const sorted = Object.entries(regionCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    return {
        labels: sorted.map(item => item[0]),
        data: sorted.map(item => item[1])
    };
}

// 연령대별 데이터 집계
function aggregateAgeData(applications = allApplications) {
    const ageGroups = {
        '20대': 0,
        '30대': 0,
        '40대': 0,
        '50대': 0,
        '60대 이상': 0
    };
    
    applications.forEach(app => {
        if (app.birth_date) {
            const birthYear = new Date(app.birth_date).getFullYear();
            const age = new Date().getFullYear() - birthYear;
            
            if (age >= 20 && age < 30) ageGroups['20대']++;
            else if (age >= 30 && age < 40) ageGroups['30대']++;
            else if (age >= 40 && age < 50) ageGroups['40대']++;
            else if (age >= 50 && age < 60) ageGroups['50대']++;
            else if (age >= 60) ageGroups['60대 이상']++;
        }
    });
    
    return {
        labels: Object.keys(ageGroups),
        data: Object.values(ageGroups)
    };
}

// 일별 지원자 수 차트 렌더링 (Line Chart)
function renderDailyChart(data) {
    const ctx = document.getElementById('dailyChart');
    if (!ctx) return;
    
    dailyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                borderColor: '#034EA2',
                backgroundColor: 'rgba(3, 78, 162, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#034EA2',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return `지원자: ${context.parsed.y}명`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10,
                            family: "'Noto Sans KR', sans-serif"
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 트랙별 분포 차트 렌더링 (Doughnut Chart)
function renderTrackChart(data) {
    const ctx = document.getElementById('trackChart');
    if (!ctx) return;
    
    trackChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed}명 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 지역별 분포 차트 렌더링 (Bar Chart)
function renderRegionChart(data) {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;
    
    regionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                backgroundColor: '#1D74C6',
                borderColor: '#034EA2',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return `지원자: ${context.parsed.y}명`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 연령대별 분포 차트 렌더링 (Bar Chart)
function renderAgeChart(data) {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;
    
    ageChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: '지원자 수',
                data: data.data,
                backgroundColor: [
                    '#FF6B35',
                    '#F7931E',
                    '#FDC830',
                    '#4ECDC4',
                    '#45B7D1'
                ],
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return `지원자: ${context.parsed.y}명`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
