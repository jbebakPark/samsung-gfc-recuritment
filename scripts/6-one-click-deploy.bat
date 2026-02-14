@echo off
REM 6-one-click-deploy.bat
REM 완전 자동화 원클릭 배포 스크립트 (Windows용)
REM 사용법: 6-one-click-deploy.bat 더블클릭

setlocal EnableDelayedExpansion

REM 색상 코드 (Windows 10 이상)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "CYAN=[96m"
set "MAGENTA=[95m"
set "BOLD=[1m"
set "NC=[0m"

REM 프로젝트 정보
set "REPO_URL=https://github.com/jbebakPark/samsung-gfc-recuritment"
set "REPO_NAME=samsung-gfc-recuritment"
set "FIREBASE_PROJECT=samsung-gfc"
set "PROD_URL=https://samsung-gfc.web.app"

REM 헤더 표시
cls
echo.
echo %MAGENTA%=========================================================%NC%
echo.
echo      🚀 삼성생명 GFC 원클릭 배포 자동화 도구
echo.
echo         Complete Automated Deployment Script
echo.
echo %MAGENTA%=========================================================%NC%
echo.

REM Step 1: 시스템 요구사항 확인
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 1: 시스템 요구사항 확인 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

REM Git 확인
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%❌ Git이 설치되어 있지 않습니다%NC%
    echo.
    echo Git 다운로드: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%✅ Git 설치됨%NC%
    git --version
)

REM Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%❌ Node.js가 설치되어 있지 않습니다%NC%
    echo.
    echo Node.js 다운로드: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%✅ Node.js 설치됨%NC%
    node --version
)

REM npm 확인
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%❌ npm이 설치되어 있지 않습니다%NC%
    pause
    exit /b 1
) else (
    echo %GREEN%✅ npm 설치됨%NC%
    npm --version
)

echo.
echo %GREEN%✅ 모든 필수 도구가 설치되어 있습니다!%NC%

REM Step 2: Firebase CLI 설치
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 2: Firebase CLI 설치 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %BLUE%ℹ️  Firebase CLI 설치 중...%NC%
    call npm install -g firebase-tools
) else (
    echo %BLUE%ℹ️  Firebase CLI가 이미 설치되어 있습니다%NC%
    echo %BLUE%ℹ️  최신 버전으로 업데이트 중...%NC%
    call npm install -g firebase-tools
)

echo.
echo %GREEN%✅ Firebase CLI 설치 완료!%NC%
firebase --version

REM Step 3: 프로젝트 클론 또는 업데이트
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 3: 프로젝트 준비 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

if exist "%REPO_NAME%" (
    echo %BLUE%ℹ️  프로젝트가 이미 존재합니다. 최신 코드로 업데이트 중...%NC%
    cd "%REPO_NAME%"
    
    git fetch origin
    git pull origin main
    
    echo %GREEN%✅ 최신 코드로 업데이트 완료!%NC%
) else (
    echo %BLUE%ℹ️  프로젝트 클론 중...%NC%
    git clone "%REPO_URL%" "%REPO_NAME%"
    cd "%REPO_NAME%"
    
    echo %GREEN%✅ 프로젝트 클론 완료!%NC%
)

echo.
echo %BLUE%ℹ️  현재 위치: %CD%%NC%

REM Step 4: Firebase 로그인
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 4: Firebase 인증 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

REM 이미 로그인되어 있는지 확인
firebase projects:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %BLUE%ℹ️  Firebase 로그인이 필요합니다.%NC%
    echo %BLUE%ℹ️  브라우저가 열리면 Google 계정으로 로그인하세요...%NC%
    echo.
    
    call firebase login
    
    if !ERRORLEVEL! NEQ 0 (
        echo %RED%❌ Firebase 로그인 실패%NC%
        pause
        exit /b 1
    )
    
    echo %GREEN%✅ Firebase 로그인 성공!%NC%
) else (
    echo %GREEN%✅ Firebase에 이미 로그인되어 있습니다!%NC%
)

REM Step 5: Firebase 프로젝트 확인
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 5: Firebase 프로젝트 확인 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

if exist ".firebaserc" (
    echo %GREEN%✅ .firebaserc 파일이 존재합니다%NC%
) else (
    echo %YELLOW%⚠️  .firebaserc 파일이 없습니다. 프로젝트를 연결합니다...%NC%
    firebase use "%FIREBASE_PROJECT%"
)

if exist "firebase.json" (
    echo %GREEN%✅ firebase.json 파일이 존재합니다%NC%
) else (
    echo %RED%❌ firebase.json 파일이 없습니다%NC%
    pause
    exit /b 1
)

REM Step 6: 배포 전 검증
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 6: 배포 전 검증 중...%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

if exist "public" (
    echo %GREEN%✅ public 디렉토리 확인됨%NC%
) else (
    echo %RED%❌ public 디렉토리가 없습니다%NC%
    pause
    exit /b 1
)

if exist "public\index.html" (
    echo %GREEN%✅ index.html 확인됨%NC%
) else (
    echo %RED%❌ public\index.html이 없습니다%NC%
    pause
    exit /b 1
)

echo %GREEN%✅ 배포 전 검증 완료!%NC%

REM Step 7: 사용자 확인
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 7: 배포 시작%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

echo %YELLOW%⚠️  배포를 시작합니다. 약 1-2분 소요됩니다...%NC%
echo.
echo 배포할 사이트: %PROD_URL%
echo.

set /p CONFIRM="계속하시겠습니까? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo.
    echo %BLUE%ℹ️  배포가 취소되었습니다.%NC%
    pause
    exit /b 0
)

REM Firebase 배포
echo.
echo %BLUE%ℹ️  Firebase에 배포 중...%NC%
echo.

call firebase deploy --only hosting --project "%FIREBASE_PROJECT%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo %RED%❌ 배포 실패%NC%
    pause
    exit /b 1
)

echo.
echo %GREEN%✅ 배포 완료!%NC%

REM Step 8: 최종 안내
echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %CYAN%Step 8: 최종 안내%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

echo.
echo %GREEN%🎉 배포가 성공적으로 완료되었습니다!%NC%
echo.
echo %BLUE%ℹ️  배포된 사이트:%NC%
echo   %PROD_URL%
echo.
echo %YELLOW%⚠️  브라우저 캐시 정리 방법:%NC%
echo   - Chrome/Edge: Ctrl+Shift+R
echo   - Firefox: Ctrl+Shift+R
echo.
echo %BLUE%ℹ️  Firebase Console:%NC%
echo   https://console.firebase.google.com/project/%FIREBASE_PROJECT%/hosting
echo.
echo %BLUE%ℹ️  GitHub 저장소:%NC%
echo   %REPO_URL%
echo.

REM 브라우저 자동 열기 (선택)
set /p OPEN_BROWSER="배포된 사이트를 브라우저로 열까요? (Y/N): "
if /i "%OPEN_BROWSER%"=="Y" (
    start "" "%PROD_URL%"
)

echo.
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo %GREEN%전체 작업이 완료되었습니다!%NC%
echo %CYAN%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%
echo.

pause
