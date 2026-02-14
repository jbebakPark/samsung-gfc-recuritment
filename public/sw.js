/**
 * Service Worker for Samsung Life GFC Recruitment PWA
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 */

const CACHE_NAME = 'gfc-recruitment-v1.0.0';
const RUNTIME_CACHE = 'gfc-runtime-v1.0.0';

// 오프라인 시 표시할 페이지
const OFFLINE_URL = '/offline.html';

// 캐시할 정적 리소스
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
    '/css/style.css',
    '/js/main.js',
    '/js/firebase-config.js',
    '/js/env-loader.js',
    '/manifest.json',
    '/images/samsung-life-logo.png',
    '/images/samsung-life-logo-white.png'
];

// Service Worker 설치
self.addEventListener('install', (event) => {
    console.log('[SW] Install');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Service Worker 활성화
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 이전 버전 캐시 삭제
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch 이벤트 - 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // HTML 페이지 요청 처리 (Network First, Cache Fallback)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // 성공적인 응답을 캐시에 저장
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // 네트워크 실패 시 캐시 확인
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // 캐시에도 없으면 오프라인 페이지 표시
                            return caches.match(OFFLINE_URL);
                        });
                })
        );
        return;
    }
    
    // 정적 리소스 요청 처리 (Cache First, Network Fallback)
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // 캐시에 있으면 즉시 반환하고, 백그라운드에서 업데이트
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                cache.put(request, networkResponse.clone());
                            });
                        }
                    }).catch(() => {
                        // 네트워크 오류는 무시 (캐시 사용 중)
                    });
                    return cachedResponse;
                }
                
                // 캐시에 없으면 네트워크 요청
                return fetch(request)
                    .then((networkResponse) => {
                        // 성공적인 응답을 캐시에 저장
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch failed:', error);
                        throw error;
                    });
            })
    );
});

// 메시지 이벤트 - 클라이언트와 통신
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

// Push 알림 이벤트 (향후 확장용)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : '새로운 알림이 있습니다',
        icon: '/images/icon-192.png',
        badge: '/images/icon-96.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '확인하기',
                icon: '/images/icon-96.png'
            },
            {
                action: 'close',
                title: '닫기',
                icon: '/images/icon-96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('삼성생명 GFC 채용', options)
    );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('[SW] Service Worker loaded');
