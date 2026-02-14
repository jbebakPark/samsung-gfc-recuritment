/**
 * PWA 초기화 스크립트
 * Service Worker 등록 및 설치 프롬프트 처리
 */

console.log('[PWA] Initializing...');

let deferredPrompt = null;

// Service Worker 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('[PWA] Service Worker registered:', registration.scope);
            
            // 업데이트 확인
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] New Service Worker installing...');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // 새 버전 사용 가능 알림
                        showUpdateNotification();
                    }
                });
            });
            
        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    });
}

// 앱 설치 프롬프트 처리
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');
    
    // 기본 동작 막기
    e.preventDefault();
    
    // 나중에 사용하기 위해 저장
    deferredPrompt = e;
    
    // 설치 버튼 표시
    showInstallButton();
});

// 설치 버튼 표시
function showInstallButton() {
    // 설치 버튼이 이미 있는지 확인
    let installButton = document.getElementById('pwa-install-button');
    
    if (!installButton) {
        // 설치 버튼 생성
        installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.innerHTML = '<i class="fas fa-download"></i> 앱 설치';
        installButton.className = 'pwa-install-btn';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #034EA2 0%, #1D74C6 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(3, 78, 162, 0.4);
            z-index: 10000;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        installButton.addEventListener('click', handleInstallClick);
        installButton.addEventListener('mouseenter', () => {
            installButton.style.transform = 'translateY(-2px)';
            installButton.style.boxShadow = '0 6px 20px rgba(3, 78, 162, 0.5)';
        });
        installButton.addEventListener('mouseleave', () => {
            installButton.style.transform = 'translateY(0)';
            installButton.style.boxShadow = '0 4px 15px rgba(3, 78, 162, 0.4)';
        });
        
        document.body.appendChild(installButton);
    }
}

// 설치 버튼 클릭 처리
async function handleInstallClick() {
    if (!deferredPrompt) {
        console.log('[PWA] No install prompt available');
        return;
    }
    
    // 설치 프롬프트 표시
    deferredPrompt.prompt();
    
    // 사용자의 선택 대기
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User choice:', outcome);
    
    if (outcome === 'accepted') {
        console.log('[PWA] App installed');
        hideInstallButton();
    } else {
        console.log('[PWA] Install declined');
    }
    
    // 프롬프트는 한 번만 사용 가능
    deferredPrompt = null;
}

// 설치 버튼 숨기기
function hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
        installButton.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            installButton.remove();
        }, 300);
    }
}

// 앱이 설치되었을 때
window.addEventListener('appinstalled', (e) => {
    console.log('[PWA] App installed successfully');
    hideInstallButton();
    
    // 설치 완료 알림 (선택사항)
    showToast('앱이 성공적으로 설치되었습니다!');
});

// 업데이트 알림 표시
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 90%;
        ">
            <span>새 버전이 있습니다</span>
            <button onclick="location.reload()" style="
                padding: 8px 16px;
                background: #034EA2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            ">업데이트</button>
            <button onclick="this.parentElement.parentElement.remove()" style="
                padding: 8px 16px;
                background: #f5f5f5;
                color: #666;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">나중에</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 10초 후 자동 제거
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// 토스트 메시지 표시
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 10002;
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        10%, 90% { opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('[PWA] Initialization complete');
