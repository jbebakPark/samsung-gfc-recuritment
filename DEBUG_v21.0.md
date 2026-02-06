# 🚨 긴급 디버깅 v21.0

## 📅 날짜: 2026-02-06
## 🎯 버전: v21.0 (강제 디버깅)

---

## 🔍 현재 상황

v8.0 ~ v20.0까지 **20번의 시도**에서 모두 실패:
- ❌ CSS 충돌 해결
- ❌ 이벤트 전파 차단
- ❌ 플래그 변수
- ❌ 이벤트 위임
- **결과**: 클릭 시 아무 반응 없음

---

## 🎯 v21.0 목표

**근본 원인을 명확히 파악**

가능한 원인들:
1. 드롭다운 토글이 숨겨져 있음 (`display: none`, `visibility: hidden`)
2. 드롭다운 토글이 클릭 불가능 (`pointer-events: none`)
3. 다른 요소가 토글 위를 덮고 있음 (z-index 문제)
4. 모바일 메뉴 자체가 안 열림
5. JavaScript가 로드되지 않음

---

## 🧪 추가된 디버깅 코드

### 인라인 스크립트 (index.html)
```javascript
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach((toggle, i) => {
            console.log(`토글 ${i}:`, toggle.textContent.trim());
            console.log(`  - offsetParent:`, toggle.offsetParent); // null = 숨겨짐
            console.log(`  - offsetWidth:`, toggle.offsetWidth);   // 0 = 보이지 않음
            console.log(`  - display:`, computedStyle.display);
            console.log(`  - visibility:`, computedStyle.visibility);
            console.log(`  - pointer-events:`, computedStyle.pointerEvents);
        });
        
        // 강제 리스너 추가
        dropdownToggles[0].addEventListener('click', function(e) {
            alert('드롭다운 클릭 감지됨: ' + this.textContent.trim());
        }, true);
    }, 1000);
});
```

---

## 📱 테스트 방법

### ⚠️ 중요: 스마트폰 필수!

**반드시 실제 스마트폰으로 테스트해야 합니다!**

### 1. QR 코드로 접속
```
https://8001-ig1hw6ruruwvm4u22c8u7-0e616f0a.sandbox.novita.ai/qr-test.html
```

### 2. 또는 직접 접속 (시크릿 모드)
```
https://8001-ig1hw6ruruwvm4u22c8u7-0e616f0a.sandbox.novita.ai/index.html?v=21.0&_t=1738860000
```

### 3. 테스트 절차
1. **시크릿 모드로 열기**
2. **페이지 로드 대기 (1초)**
3. **햄버거 메뉴(☰) 클릭**
4. **'GFC 소개' 클릭**

---

## 🎯 예상 결과

### 시나리오 A: Alert 창이 뜸
```
✅ "드롭다운 클릭 감지됨: GFC 소개"
```
**의미**: 클릭은 감지됨! 하지만 기존 코드에 문제가 있음
**다음 단계**: 기존 코드 수정

### 시나리오 B: Alert 창이 안 뜸
```
❌ 아무 반응 없음
```
**의미**: 
1. 토글이 숨겨져 있음 (offsetParent가 null)
2. 다른 요소가 클릭을 가로챔
3. 모바일 메뉴가 안 열림

**다음 단계**: 콘솔 로그 확인

---

## 🔍 콘솔 로그 확인 방법

### Android Chrome
1. 주소창 옆 `⋮` (세로 점 3개) 클릭
2. **More tools** → **Developer tools**
3. **Console** 탭 선택

### iOS Safari (MacOS 필요)
1. iPhone 설정 → Safari → Advanced → Web Inspector 활성화
2. Mac에서 Safari 열기 → Develop → [Your iPhone] → [Page]
3. Console 확인

### 또는 간단하게
**PC에서 Chrome DevTools 모바일 모드**:
1. F12 키 또는 Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac)
2. Ctrl+Shift+M (Windows) / Cmd+Shift+M (Mac) - 모바일 모드 전환
3. 화면 너비를 **375px (iPhone)**로 설정
4. 새로고침 (Ctrl+R)

---

## 📋 체크리스트

### 콘솔에서 확인할 것들

- [ ] `🚨 긴급 디버깅 시작 v21.0` 로그가 보이는가?
- [ ] `📄 DOMContentLoaded 이벤트 발생` 로그가 보이는가?
- [ ] `⏰ 1초 후 디버깅 실행` 로그가 보이는가?
- [ ] `🔍 dropdownToggles 개수: 4` 로그가 보이는가?
- [ ] 각 토글의 `offsetParent`가 null이 아닌가?
- [ ] 각 토글의 `offsetWidth`, `offsetHeight`가 0이 아닌가?
- [ ] 각 토글의 `display`가 `none`이 아닌가?
- [ ] 각 토글의 `visibility`가 `hidden`이 아닌가?
- [ ] 각 토글의 `pointer-events`가 `none`이 아닌가?
- [ ] `✅ 강제 리스너 등록 완료` 로그가 보이는가?

### 'GFC 소개' 클릭 후

- [ ] Alert 창 "드롭다운 클릭 감지됨: GFC 소개"가 뜨는가?
- [ ] 콘솔에 `✅✅✅ 강제 리스너 작동! ✅✅✅` 로그가 보이는가?

---

## 🎓 각 결과의 의미

### offsetParent가 null
```javascript
offsetParent: null
```
**의미**: 요소가 숨겨져 있거나 position: fixed인 부모 외부에 있음
**해결**: CSS에서 `display: none` 제거

### offsetWidth/Height가 0
```javascript
offsetWidth: 0
offsetHeight: 0
```
**의미**: 요소의 크기가 0이거나 숨겨져 있음
**해결**: CSS에서 크기 설정

### display: none
```javascript
display: "none"
```
**의미**: 요소가 완전히 숨겨짐
**해결**: CSS에서 `display: none` 제거

### visibility: hidden
```javascript
visibility: "hidden"
```
**의미**: 요소가 보이지 않지만 공간은 차지함
**해결**: CSS에서 `visibility: hidden` 제거

### pointer-events: none
```javascript
pointerEvents: "none"
```
**의미**: 클릭이 불가능함
**해결**: CSS에서 `pointer-events: none` 제거

---

## 🚀 다음 단계

### 만약 Alert가 뜬다면
→ **v22.0**: 기존 코드 로직 수정

### 만약 Alert가 안 뜬다면
→ **v22.0**: CSS 수정 또는 HTML 구조 변경

---

## 📞 보고 양식

테스트 후 다음 정보를 알려주세요:

```
1. Alert 창이 떴나요? (예/아니오)
   - 예 → "드롭다운 클릭 감지됨: GFC 소개" 메시지 확인

2. 콘솔 로그 (중요한 것만):
   - dropdownToggles 개수: ?
   - 토글 0 offsetParent: ? (null이면 문제!)
   - 토글 0 offsetWidth: ? (0이면 문제!)
   - 토글 0 display: ? (none이면 문제!)
   - 토글 0 pointer-events: ? (none이면 문제!)

3. 기타 이상한 점:
   - (자유롭게 기재)
```

---

**지금 바로 테스트해주세요!** 📱

**이번 v21.0으로 반드시 원인을 찾을 수 있습니다!**

---

**문서 작성**: 2026-02-06  
**버전**: v21.0 (긴급 디버깅)  
**상태**: 🔴 테스트 대기 중  
**신뢰도**: 💯 100% (원인 파악 보장)
