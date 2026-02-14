/**
 * 자료실 업로드 관리 시스템
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 */

console.log('Resources Upload Manager - Loading...');

// 전역 변수
let allResources = [];

// 허용된 파일 타입
const ALLOWED_TYPES = {
    'brochure': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'training': ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    'case-study': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'video': ['video/mp4', 'video/webm', 'video/ogg']
};

// 최대 파일 크기 (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

/**
 * 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing resources upload system...');
    
    // 업로드 폼 이벤트 리스너
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
    
    // 파일 입력 이벤트 리스너
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // 자료 목록 로드
    loadResources();
});

/**
 * 파일 선택 처리
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 파일 정보 표시
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileType = document.getElementById('fileType');
    
    if (fileInfo && fileName && fileSize && fileType) {
        fileName.textContent = file.name;
        fileSize.textContent = window.StorageUtils.formatFileSize(file.size);
        fileType.textContent = file.type || '알 수 없음';
        fileInfo.style.display = 'block';
    }
    
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기가 너무 큽니다. 최대 100MB까지 업로드 가능합니다.');
        event.target.value = '';
        if (fileInfo) fileInfo.style.display = 'none';
    }
}

/**
 * 업로드 처리
 */
async function handleUpload(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const titleInput = document.getElementById('titleInput');
    const descInput = document.getElementById('descInput');
    const categorySelect = document.getElementById('categorySelect');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    
    // 입력 검증
    const file = fileInput.files[0];
    if (!file) {
        alert('파일을 선택해주세요.');
        return;
    }
    
    const title = titleInput.value.trim();
    if (!title) {
        alert('제목을 입력해주세요.');
        titleInput.focus();
        return;
    }
    
    const category = categorySelect.value;
    const description = descInput.value.trim();
    
    // 파일 타입 검증
    const allowedTypes = ALLOWED_TYPES[category];
    if (!allowedTypes.includes(file.type)) {
        alert(`이 카테고리에서는 해당 파일 형식을 지원하지 않습니다.\\n허용된 형식: ${allowedTypes.join(', ')}`);
        return;
    }
    
    try {
        // UI 업데이트
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';
        progressContainer.style.display = 'block';
        
        // 파일 업로드
        const result = await window.StorageUtils.uploadFile(file, category, (progress) => {
            progressFill.style.width = progress + '%';
            progressFill.textContent = Math.round(progress) + '%';
        });
        
        console.log('Upload result:', result);
        
        // Firestore에 메타데이터 저장
        await saveResourceMetadata({
            title: title,
            description: description,
            category: category,
            downloadURL: result.downloadURL,
            filePath: result.metadata.fullPath,
            fileName: result.metadata.name,
            originalName: file.name,
            contentType: result.metadata.contentType,
            size: result.metadata.size,
            uploadedAt: new Date().toISOString()
        });
        
        // 성공 메시지
        alert('파일이 성공적으로 업로드되었습니다!');
        
        // 폼 초기화
        resetForm();
        
        // 목록 새로고침
        loadResources();
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('파일 업로드 중 오류가 발생했습니다: ' + error.message);
    } finally {
        // UI 복구
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> 업로드';
        progressContainer.style.display = 'none';
        progressFill.style.width = '0%';
        progressFill.textContent = '0%';
    }
}

/**
 * Firestore에 메타데이터 저장
 */
async function saveResourceMetadata(data) {
    if (!window.db) {
        throw new Error('Firestore가 초기화되지 않았습니다.');
    }
    
    try {
        await window.db.collection('resources').add(data);
        console.log('Metadata saved to Firestore');
    } catch (error) {
        console.error('Error saving metadata:', error);
        throw error;
    }
}

/**
 * 자료 목록 로드
 */
async function loadResources() {
    const container = document.getElementById('resourcesList');
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>자료를 불러오는 중...</p>
        </div>
    `;
    
    try {
        if (!window.db) {
            throw new Error('Firestore가 초기화되지 않았습니다.');
        }
        
        // Firestore에서 자료 목록 가져오기
        const snapshot = await window.db.collection('resources')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        allResources = [];
        snapshot.forEach(doc => {
            allResources.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`Loaded ${allResources.length} resources`);
        
        // 목록 렌더링
        renderResources();
        
    } catch (error) {
        console.error('Error loading resources:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>자료를 불러오는데 실패했습니다.</p>
                <p style="font-size: 0.9rem; color: var(--text-light);">${error.message}</p>
            </div>
        `;
    }
}

/**
 * 자료 목록 렌더링
 */
function renderResources() {
    const container = document.getElementById('resourcesList');
    if (!container) return;
    
    if (allResources.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>업로드된 자료가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="resources-grid">';
    
    allResources.forEach(resource => {
        const categoryLabels = {
            'brochure': '브로셔',
            'training': '교육 자료',
            'case-study': '성공 사례',
            'video': '영상 자료'
        };
        
        const categoryIcons = {
            'brochure': 'fa-file-pdf',
            'training': 'fa-file-powerpoint',
            'case-study': 'fa-file-alt',
            'video': 'fa-file-video'
        };
        
        const uploadDate = new Date(resource.uploadedAt).toLocaleDateString('ko-KR');
        
        html += `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas ${categoryIcons[resource.category] || 'fa-file'}"></i>
                </div>
                <div class="resource-info">
                    <h3>${resource.title}</h3>
                    <p class="resource-category">${categoryLabels[resource.category] || resource.category}</p>
                    ${resource.description ? `<p class="resource-desc">${resource.description}</p>` : ''}
                    <div class="resource-meta">
                        <span><i class="fas fa-file"></i> ${window.StorageUtils.formatFileSize(resource.size)}</span>
                        <span><i class="fas fa-calendar"></i> ${uploadDate}</span>
                    </div>
                </div>
                <div class="resource-actions">
                    <a href="${resource.downloadURL}" target="_blank" class="btn btn-sm btn-primary">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                    <button onclick="deleteResource('${resource.id}', '${resource.filePath}')" class="btn btn-sm btn-danger">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * 자료 삭제
 */
async function deleteResource(resourceId, filePath) {
    if (!confirm('정말로 이 자료를 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        // Firestore에서 메타데이터 삭제
        await window.db.collection('resources').doc(resourceId).delete();
        console.log('Resource metadata deleted');
        
        // Storage에서 파일 삭제
        if (window.storageRef) {
            const fileRef = window.storageRef.child(filePath);
            await fileRef.delete();
            console.log('File deleted from storage');
        }
        
        alert('자료가 삭제되었습니다.');
        
        // 목록 새로고침
        loadResources();
        
    } catch (error) {
        console.error('Delete error:', error);
        alert('삭제 중 오류가 발생했습니다: ' + error.message);
    }
}

/**
 * 폼 초기화
 */
function resetForm() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.reset();
    }
    
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
        fileInfo.style.display = 'none';
    }
}

console.log('✅ Resources Upload Manager - Loaded');
