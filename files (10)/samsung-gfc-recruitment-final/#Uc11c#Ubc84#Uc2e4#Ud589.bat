@echo off
chcp 65001 >nul
echo.
echo ================================================
echo   삼성생명 GFC 채용 사이트 - 로컬 서버 실행
echo ================================================
echo.
echo [1] Python으로 서버 실행 (포트 8000)
echo [2] 브라우저에서 직접 열기
echo [3] 종료
echo.
set /p choice="선택 (1-3): "

if "%choice%"=="1" goto python_server
if "%choice%"=="2" goto open_browser
if "%choice%"=="3" goto end

:python_server
echo.
echo Python 서버를 실행합니다...
echo 브라우저에서 http://localhost:8000 접속
echo 종료하려면 Ctrl+C를 누르세요
echo.
python -m http.server 8000
goto end

:open_browser
echo.
echo 브라우저에서 index.html을 엽니다...
start index.html
goto end

:end
echo.
echo 프로그램을 종료합니다.
pause
