# 에러 핸들러 사용 가이드

## 개요
사용자 친화적인 에러 메시지와 로딩 상태를 표시하는 전역 에러 핸들러입니다.

## 사용 방법

### 1. HTML에 추가
```html
<link rel="stylesheet" href="/css/error-handler.css">
<script src="/js/error-handler.js"></script>
```

### 2. 에러 표시
```javascript
try {
    // 코드 실행
} catch (error) {
    ErrorHandler.showError(error, '작업 컨텍스트');
}
```

### 3. Toast 메시지
```javascript
ErrorHandler.showToast('성공 메시지', 'success');
ErrorHandler.showToast('정보 메시지', 'info');
ErrorHandler.showToast('에러 메시지', 'error');
```

### 4. 로딩 인디케이터
```javascript
ErrorHandler.showLoading('처리 중...');
// 비동기 작업
ErrorHandler.hideLoading();
```

## 자동 감지
- 전역 에러 자동 감지
- Promise rejection 자동 감지
- 네트워크 오류 자동 처리

## 커스터마이징
- ERROR_MESSAGES 객체에서 메시지 수정
- CSS에서 스타일 변경

## 예제

### 폼 제출 예제
```javascript
async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        ErrorHandler.showLoading('지원서를 제출하는 중입니다...');
        
        const formData = collectFormData();
        await saveToFirebase(formData);
        
        ErrorHandler.showToast('지원서가 성공적으로 제출되었습니다!', 'success');
        
    } catch (error) {
        ErrorHandler.showError(error, '지원서 제출');
    } finally {
        ErrorHandler.hideLoading();
    }
}
```

### Firebase 에러 처리
```javascript
try {
    await db.collection('applications').add(data);
} catch (error) {
    // 자동으로 사용자 친화적 메시지 표시
    ErrorHandler.showError(error, 'Firebase 저장');
}
```

## 지원하는 에러 타입

| 에러 코드 | 메시지 |
|----------|--------|
| permission-denied | 접근 권한이 없습니다 |
| unavailable | 네트워크 연결을 확인해주세요 |
| unauthenticated | 로그인이 필요합니다 |
| not-found | 요청한 데이터를 찾을 수 없습니다 |
| already-exists | 이미 존재하는 데이터입니다 |
| invalid-argument | 입력값이 올바르지 않습니다 |
| deadline-exceeded | 요청 시간이 초과되었습니다 |

## 작성일
2026년 2월 13일

## 작성자
GenSpark AI Developer (자동화 스크립트)
