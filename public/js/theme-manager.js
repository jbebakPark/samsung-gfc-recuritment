/**
 * Theme Manager - Dark Mode System
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * 다크모드 테마 관리 시스템
 * - Auto theme detection (system preference)
 * - Manual theme toggle
 * - localStorage persistence
 * - Smooth transitions
 */

class ThemeManager {
    constructor() {
        this.THEME_KEY = 'gfc-theme-preference';
        this.THEMES = {
            LIGHT: 'light',
            DARK: 'dark',
            AUTO: 'auto'
        };
        
        // 초기화
        this.init();
    }
    
    /**
     * 테마 매니저 초기화
     */
    init() {
        console.log('🎨 Theme Manager initialized');
        
        // 저장된 테마 또는 시스템 설정 적용
        this.applyStoredTheme();
        
        // 토글 버튼 생성
        this.createToggleButton();
        
        // 시스템 테마 변경 감지
        this.watchSystemTheme();
        
        // Chart.js 테마 적용 (차트가 있을 경우)
        this.applyChartTheme();
    }
    
    /**
     * 저장된 테마 적용
     */
    applyStoredTheme() {
        const savedTheme = this.getSavedTheme();
        const effectiveTheme = this.getEffectiveTheme(savedTheme);
        
        this.applyTheme(effectiveTheme);
        console.log(`📱 Applied theme: ${effectiveTheme} (saved: ${savedTheme})`);
    }
    
    /**
     * localStorage에서 저장된 테마 가져오기
     */
    getSavedTheme() {
        try {
            return localStorage.getItem(this.THEME_KEY) || this.THEMES.AUTO;
        } catch (error) {
            console.warn('⚠️ localStorage not available, using system theme');
            return this.THEMES.AUTO;
        }
    }
    
    /**
     * 실제 적용할 테마 결정 (AUTO 처리)
     */
    getEffectiveTheme(preference) {
        if (preference === this.THEMES.AUTO) {
            return this.getSystemTheme();
        }
        return preference;
    }
    
    /**
     * 시스템 테마 가져오기
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return this.THEMES.DARK;
        }
        return this.THEMES.LIGHT;
    }
    
    /**
     * 테마 적용
     */
    applyTheme(theme) {
        const root = document.documentElement;
        
        // data-theme 속성 설정
        root.setAttribute('data-theme', theme);
        
        // body 클래스 설정 (하위 호환성)
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        
        // 메타 테마 색상 업데이트 (PWA)
        this.updateMetaThemeColor(theme);
        
        // 이벤트 발생
        this.dispatchThemeChangeEvent(theme);
    }
    
    /**
     * 메타 테마 색상 업데이트 (PWA 지원)
     */
    updateMetaThemeColor(theme) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        const themeColors = {
            light: '#FFFFFF',
            dark: '#0F1419'
        };
        
        themeColorMeta.content = themeColors[theme];
    }
    
    /**
     * 테마 변경 이벤트 발생
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * 테마 토글
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        
        this.setTheme(newTheme);
        
        // 피드백
        this.showThemeChangeToast(newTheme);
    }
    
    /**
     * 테마 설정 및 저장
     */
    setTheme(theme) {
        // 테마 적용
        this.applyTheme(theme);
        
        // localStorage에 저장
        try {
            localStorage.setItem(this.THEME_KEY, theme);
            console.log(`💾 Theme saved: ${theme}`);
        } catch (error) {
            console.warn('⚠️ Failed to save theme preference');
        }
    }
    
    /**
     * 시스템 테마 변경 감지
     */
    watchSystemTheme() {
        if (!window.matchMedia) return;
        
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (e) => {
            const savedTheme = this.getSavedTheme();
            
            // AUTO 모드일 때만 자동 전환
            if (savedTheme === this.THEMES.AUTO) {
                const newTheme = e.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                this.applyTheme(newTheme);
                console.log(`🔄 System theme changed to: ${newTheme}`);
            }
        });
    }
    
    /**
     * 토글 버튼 생성
     */
    createToggleButton() {
        // 기존 버튼이 있으면 제거
        const existing = document.getElementById('theme-toggle-btn');
        if (existing) existing.remove();
        
        const button = document.createElement('button');
        button.id = 'theme-toggle-btn';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', '다크모드 전환');
        button.setAttribute('title', '다크모드 전환');
        
        button.innerHTML = `
            <span class="theme-toggle-icon">
                <span class="icon-moon">🌙</span>
                <span class="icon-sun">☀️</span>
            </span>
        `;
        
        button.addEventListener('click', () => this.toggleTheme());
        
        document.body.appendChild(button);
        console.log('🔘 Theme toggle button created');
    }
    
    /**
     * 테마 변경 토스트 메시지
     */
    showThemeChangeToast(theme) {
        const messages = {
            light: '☀️ 라이트 모드',
            dark: '🌙 다크 모드'
        };
        
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.textContent = messages[theme];
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-elevated);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(toast);
        
        // 페이드 인
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 페이드 아웃 & 제거
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    /**
     * Chart.js 테마 적용
     */
    applyChartTheme() {
        // Chart.js가 로드되지 않았으면 나중에 시도
        if (typeof Chart === 'undefined') {
            window.addEventListener('chartjs-loaded', () => this.setupChartDefaults());
            return;
        }
        
        this.setupChartDefaults();
    }
    
    /**
     * Chart.js 기본 테마 설정
     */
    setupChartDefaults() {
        if (typeof Chart === 'undefined') return;
        
        const updateChartColors = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const isDark = theme === 'dark';
            
            Chart.defaults.color = isDark ? '#A1A8B0' : '#666666';
            Chart.defaults.borderColor = isDark ? '#3A3F47' : '#E0E0E0';
            
            // 그리드 색상
            if (Chart.defaults.scale) {
                Chart.defaults.scale.grid.color = isDark ? '#3A3F47' : '#E0E0E0';
            }
            
            console.log(`📊 Chart.js theme updated: ${theme}`);
        };
        
        // 초기 설정
        updateChartColors();
        
        // 테마 변경 시 업데이트
        window.addEventListener('themechange', updateChartColors);
    }
    
    /**
     * 현재 테마 가져오기
     */
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme');
    }
    
    /**
     * 특정 테마 여부 확인
     */
    isDarkMode() {
        return this.getCurrentTheme() === this.THEMES.DARK;
    }
    
    isLightMode() {
        return this.getCurrentTheme() === this.THEMES.LIGHT;
    }
}

// ============================================
// Global Instance
// ============================================
let themeManager;

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
        window.themeManager = themeManager;
    });
} else {
    // 이미 로드된 경우 즉시 초기화
    themeManager = new ThemeManager();
    window.themeManager = themeManager;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
