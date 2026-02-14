/**
 * 자료실 다운로드 및 권한 관리 시스템
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 */

console.log('Resources Download Management - Loading...');

// ========================================
// 1. 전역 변수
// ========================================
let allResources = [];
let filteredResources = [];
let currentResourceId = null;
let userEmail = localStorage.getItem('userEmail') || null;

// ========================================
// 2. 초기 로드
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing resources download system');
    loadResources();
});

// ========================================
// 3. 자료 목록 로드
// ========================================
async function loadResources() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    resourcesGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>자료를 불러오는 중...</h3>
        </div>
    `;
    
    try {
        const snapshot = await db.collection('resources')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        allResources = [];
        snapshot.forEach(doc => {
            allResources.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        filteredResources = [...allResources];
        
        if (allResources.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>등록된 자료가 없습니다</h3>
                    <p>곧 유용한 자료를 제공할 예정입니다.</p>
                </div>
            `;
        } else {
            renderResourcesGrid();
        }
        
    } catch (error) {
        console.error('자료 목록 로드 실패:', error);
        resourcesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>자료를 불러오는데 실패했습니다</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ========================================
// 4. 자료 목록 렌더링
// ========================================
function renderResourcesGrid() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    
    let html = '';
    filteredResources.forEach(resource => {
        const isLocked = resource.accessLevel === 'approved';
        const iconClass = getFileIcon(resource.fileType);
        const categoryClass = getCategoryClass(resource.category);
        const categoryName = getCategoryName(resource.category);
        const uploadDate = resource.uploadedAt 
            ? new Date(resource.uploadedAt.toDate()).toLocaleDateString('ko-KR')
            : '날짜 정보 없음';
        
        const size = window.StorageUtils.formatFileSize(resource.fileSize || 0);
        
        html += `
            <div class="resource-card ${isLocked ? 'locked' : ''}">
                ${isLocked ? '<div class="lock-badge"><i class="fas fa-lock"></i> 승인 필요</div>' : ''}
                
                <div class="resource-icon">
                    <i class="${iconClass}"></i>
                </div>
                
                <h3 class="resource-title">${resource.title}</h3>
                
                <span class="resource-category ${categoryClass}">${categoryName}</span>
                
                ${resource.description ? `<p class="resource-description">${resource.description}</p>` : ''}
                
                <div class="resource-meta">
                    <span><i class="fas fa-calendar"></i> ${uploadDate}</span>
                    <span><i class="fas fa-file"></i> ${size}</span>
                    <span><i class="fas fa-download"></i> ${resource.downloadCount || 0}회</span>
                </div>
                
                <button class="btn ${isLocked ? 'btn-disabled' : 'btn-primary'}" 
                        onclick="handleDownload('${resource.id}', ${isLocked})">
                    <i class="fas ${isLocked ? 'fa-lock' : 'fa-download'}"></i>
                    ${isLocked ? '권한 확인 후 다운로드' : '다운로드'}
                </button>
            </div>
        `;
    });
    
    resourcesGrid.innerHTML = html;
}

function getFileIcon(fileType) {
    if (!fileType) return 'fas fa-file';
    
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word')) return 'fas fa-file-word';
    if (fileType.includes('presentation')) return 'fas fa-file-powerpoint';
    if (fileType.includes('video')) return 'fas fa-file-video';
    
    return 'fas fa-file';
}

function getCategoryClass(category) {
    const classes = {
        'brochure': 'category-brochure',
        'training': 'category-training',
        'case-study': 'category-case-study',
        'video': 'category-video'
    };
    return classes[category] || '';
}

function getCategoryName(category) {
    const names = {
        'brochure': '브로셔',
        'training': '교육 자료',
        'case-study': '성공 사례',
        'video': '영상 자료'
    };
    return names[category] || category;
}

// ========================================
// 5. 필터링
// ========================================
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    filteredResources = allResources.filter(resource => {
        // 카테고리 필터
        if (categoryFilter && resource.category !== categoryFilter) {
            return false;
        }
        
        // 검색 필터
        if (searchQuery) {
            const searchableText = `
                ${resource.title}
                ${resource.description || ''}
                ${resource.fileName || ''}
            `.toLowerCase();
            
            if (!searchableText.includes(searchQuery)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderResourcesGrid();
}

// ========================================
// 6. 다운로드 처리
// ========================================
async function handleDownload(resourceId, requiresAuth) {
    const resource = allResources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // 권한 확인이 필요한 경우
    if (requiresAuth) {
        if (!userEmail) {
            // 이메일 입력 모달 표시
            currentResourceId = resourceId;
            showAuthModal();
            return;
        }
        
        // 권한 확인
        const hasPermission = await checkDownloadPermission(userEmail);
        if (!hasPermission) {
            alert(`다운로드 권한이 없습니다.\n\n승인된 이메일: ${userEmail}\n\n관리자에게 권한을 요청하세요.\n연락처: 010-5137-2327`);
            return;
        }
    }
    
    // 다운로드 실행
    await executeDownload(resourceId, resource);
}

async function checkDownloadPermission(email) {
    try {
        const doc = await db.collection('approved_users').doc(email).get();
        return doc.exists;
    } catch (error) {
        console.error('권한 확인 실패:', error);
        return false;
    }
}

async function executeDownload(resourceId, resource) {
    try {
        // 다운로드 카운트 증가
        await db.collection('resources').doc(resourceId).update({
            downloadCount: firebase.firestore.FieldValue.increment(1)
        });
        
        // 다운로드 로그 저장
        await db.collection('download_logs').add({
            resourceId: resourceId,
            resourceTitle: resource.title,
            userEmail: userEmail || 'anonymous',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            fileSize: resource.fileSize,
            category: resource.category
        });
        
        // 파일 다운로드
        window.open(resource.downloadURL, '_blank');
        
        // 목록 새로고침
        loadResources();
        
    } catch (error) {
        console.error('다운로드 실패:', error);
        alert(`다운로드 실패: ${error.message}`);
    }
}

// ========================================
// 7. 인증 모달
// ========================================
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    currentResourceId = null;
}

async function handleAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('userEmail').value.trim();
    if (!email) return;
    
    // 이메일 저장
    userEmail = email;
    localStorage.setItem('userEmail', email);
    
    // 모달 닫기
    closeAuthModal();
    
    // 다운로드 재시도
    if (currentResourceId) {
        await handleDownload(currentResourceId, true);
        currentResourceId = null;
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
});

console.log('✅ Resources Download Management - Loaded');
