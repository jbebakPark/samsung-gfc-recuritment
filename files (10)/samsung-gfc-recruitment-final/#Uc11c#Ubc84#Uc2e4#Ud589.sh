#!/bin/bash

clear
echo ""
echo "================================================"
echo "  삼성생명 GFC 채용 사이트 - 로컬 서버 실행"
echo "================================================"
echo ""
echo "[1] Python으로 서버 실행 (포트 8000)"
echo "[2] 브라우저에서 직접 열기"
echo "[3] 종료"
echo ""
read -p "선택 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Python 서버를 실행합니다..."
        echo "브라우저에서 http://localhost:8000 접속"
        echo "종료하려면 Ctrl+C를 누르세요"
        echo ""
        python3 -m http.server 8000
        ;;
    2)
        echo ""
        echo "브라우저에서 index.html을 엽니다..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open index.html
        else
            # Linux
            xdg-open index.html
        fi
        ;;
    3)
        echo ""
        echo "프로그램을 종료합니다."
        exit 0
        ;;
    *)
        echo ""
        echo "잘못된 선택입니다."
        exit 1
        ;;
esac
