/**
 * Firebase Storage 설정 및 유틸리티 함수
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 */

console.log('Firebase Storage Config - Loading...');

// Firebase Storage 인스턴스
let storage = null;
let storageRef = null;

/**
 * Storage 초기화
 */
function initializeStorage() {
    if (!firebase.apps || firebase.apps.length === 0) {
        console.error('❌ Firebase가 초기화되지 않았습니다.');
        return;
    }
    
    try {
        storage = firebase.storage();
        storageRef = storage.ref();
        console.log('✅ Firebase Storage 초기화 완료');
        
        // 전역 객체에 할당
        window.storage = storage;
        window.storageRef = storageRef;
    } catch (error) {
        console.error('❌ Firebase Storage 초기화 실패:', error);
    }
}

/**
 * 파일 업로드 함수
 * @param {File} file - 업로드할 파일
 * @param {string} category - 카테고리 (brochure, training, case-study, video)
 * @param {function} onProgress - 진행률 콜백 (percentage)
 * @returns {Promise<Object>} - {downloadURL, metadata}
 */
async function uploadFile(file, category, onProgress = null) {
    if (!storage || !storageRef) {
        throw new Error('Storage가 초기화되지 않았습니다.');
    }
    
    // 파일명 정리 (한글 지원, 공백 제거)
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    
    // Storage 경로
    const path = `resources/${category}/${fileName}`;
    const fileRef = storageRef.child(path);
    
    // 메타데이터 설정
    const metadata = {
        contentType: file.type,
        customMetadata: {
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
            category: category,
            size: file.size.toString()
        }
    };
    
    // 업로드 태스크 생성
    const uploadTask = fileRef.put(file, metadata);
    
    // 진행률 모니터링
    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            // 진행률 콜백
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload: ${progress.toFixed(2)}%`);
                
                if (onProgress) {
                    onProgress(progress);
                }
            },
            // 에러 콜백
            (error) => {
                console.error('❌ 파일 업로드 실패:', error);
                reject(error);
            },
            // 완료 콜백
            async () => {
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    const uploadMetadata = uploadTask.snapshot.metadata;
                    
                    console.log('✅ 파일 업로드 완료:', downloadURL);
                    
                    resolve({
                        downloadURL,
                        metadata: {
                            name: uploadMetadata.name,
                            fullPath: uploadMetadata.fullPath,
                            contentType: uploadMetadata.contentType,
                            size: uploadMetadata.size,
                            timeCreated: uploadMetadata.timeCreated
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

/**
 * 파일 크기 포맷팅
 * @param {number} bytes - 바이트 크기
 * @returns {string} - 포맷된 크기
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeStorage, 500);
    });
} else {
    setTimeout(initializeStorage, 500);
}

// 전역 함수로 내보내기
window.StorageUtils = {
    uploadFile,
    formatFileSize
};

console.log('✅ Firebase Storage Config - Loaded');
