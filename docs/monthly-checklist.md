# 월별 콘텐츠 업데이트 체크리스트
# Samsung Life GFC 채용 사이트 유지보수 가이드
# Version: 1.0.0
# Last Updated: 2026-02-14

## 🗓️ 매월 1일 - 필수 업데이트

### 1. 통계 데이터 업데이트 ⚡ (30분)
- [ ] 메인 히어로 섹션 통계 확인
  - 지원자 수
  - 현직 GFC 수
  - 총 자산 규모
  - K-ICS 비율
- [ ] 파일: `public/index.html` (Hero Section)
- [ ] 데이터 출처: 삼성생명 공식 보도자료

### 2. 채용 일정 확인 및 업데이트 🗓️ (15분)
- [ ] 채용설명회 날짜/시간 확인
  - 1차 설명회
  - 2차 설명회
- [ ] GTC 교육 일정 업데이트
  - GTC 0 (사전교육)
  - GTC I (정식교육)
  - GTC II (심화교육)
- [ ] 파일: `public/index.html` (Job Fair & GTC Training sections)

### 3. 보도자료 & 뉴스 업데이트 📰 (20분)
- [ ] 최신 보도자료 3-5개 추가
- [ ] 오래된 보도자료 (3개월 이상) 아카이브
- [ ] 이미지 최적화 (WebP 변환)
- [ ] 파일: `public/index.html` (Press & News section)
- [ ] 스크립트: `python3 scripts/optimize-images-webp.py`

### 4. FAQ 업데이트 ❓ (15분)
- [ ] 새로운 질문 추가 (지원자 문의 기반)
- [ ] 기존 FAQ 답변 검토 및 업데이트
- [ ] 파일: `public/index.html` (FAQ section)

### 5. 성공 사례 업데이트 🏆 (30분)
- [ ] 새로운 GFC 인터뷰 추가 (1-2개)
- [ ] 인터뷰 내용 검토
- [ ] 프로필 사진 최적화
- [ ] 파일: `public/index.html` (Success Stories section)
- [ ] 관리: `public/admin/interviews.html`

---

## 🗓️ 매주 월요일 - 정기 점검

### 6. 지원자 데이터 확인 📊 (10분)
- [ ] 새로운 지원자 수 확인
- [ ] 지원서 상태 업데이트 (대기 → 검토 → 승인)
- [ ] 관리 페이지: `public/admin/applications.html`

### 7. 자료실 콘텐츠 점검 📁 (10분)
- [ ] 새로운 자료 업로드 필요 여부 확인
- [ ] 다운로드 통계 확인
- [ ] 만료된 자료 삭제
- [ ] 관리 페이지: `public/admin/resources.html`

### 8. 카카오톡 알림 확인 📱 (5분)
- [ ] 알림 전송 로그 확인
- [ ] 에러 메시지 없는지 확인
- [ ] Firebase Functions 로그: [Firebase Console](https://console.firebase.google.com/project/samsung-gfc)

---

## 🗓️ 분기별 (3개월마다) - 심화 점검

### 9. 콘텐츠 A/B 테스트 🧪 (1시간)
- [ ] Google Analytics 데이터 분석
- [ ] 사용자 행동 패턴 확인
- [ ] 전환율 (지원서 제출률) 분석
- [ ] CTA 버튼 위치/문구 최적화

### 10. SEO 최적화 검토 🔍 (1시간)
- [ ] Google Search Console 확인
- [ ] 키워드 순위 확인
- [ ] 메타 태그 업데이트
- [ ] sitemap.xml 생성/업데이트

### 11. 성능 최적화 점검 ⚡ (1시간)
- [ ] Lighthouse 점수 측정
- [ ] Core Web Vitals 확인 (LCP, FID, CLS)
- [ ] 이미지 최적화 (WebP 변환)
- [ ] 불필요한 코드 제거

### 12. 보안 업데이트 🔒 (30분)
- [ ] Firebase SDK 버전 업데이트
- [ ] npm 패키지 업데이트 (`npm update`)
- [ ] 보안 취약점 스캔 (`npm audit`)
- [ ] `.env` 파일 API 키 확인

---

## 🗓️ 연 2회 (반기별) - 대규모 리뉴얼

### 13. 디자인 트렌드 반영 🎨 (4-8시간)
- [ ] 최신 웹 디자인 트렌드 조사
- [ ] 색상 팔레트 업데이트
- [ ] 타이포그래피 개선
- [ ] 애니메이션 효과 추가/개선

### 14. 사용자 피드백 반영 💬 (4-8시간)
- [ ] 지원자 설문조사 실시
- [ ] 피드백 데이터 분석
- [ ] UI/UX 개선 사항 도출
- [ ] 개선 사항 적용 및 테스트

### 15. 백업 & 복구 테스트 💾 (2시간)
- [ ] Firestore 데이터 백업
- [ ] Storage 파일 백업
- [ ] 백업 파일 복구 테스트
- [ ] 재해 복구 계획 검토

---

## 📋 빠른 체크리스트 (월간)

```bash
# 1. 통계 업데이트
- Hero 섹션 수치 변경

# 2. 일정 업데이트
- 채용설명회 날짜
- GTC 교육 일정

# 3. 뉴스 업데이트
- 최신 3-5개 보도자료 추가

# 4. FAQ 업데이트
- 새로운 질문 추가

# 5. 성공 사례 추가
- 1-2개 인터뷰 추가

# 6. 관리 페이지 점검
- 지원자 데이터 확인
- 자료실 파일 정리

# 7. 성능 최적화
python3 scripts/optimize-images-webp.py

# 8. Git 커밋
git add .
git commit -m "chore: 월간 콘텐츠 업데이트 (2026-02)"
git push origin main

# 9. Firebase 배포
firebase deploy
```

---

## 🔧 자동화 도구

### 이미지 최적화
```bash
# WebP 변환
python3 scripts/optimize-images-webp.py

# 결과: 평균 70-80% 용량 절감
```

### 코드 최소화
```bash
# JavaScript & CSS 압축
bash scripts/safe-minify.sh

# 결과: 파일 크기 40-60% 감소
```

### 보안 점검
```bash
# npm 보안 감사
npm audit

# 취약점 자동 수정
npm audit fix
```

---

## 📞 긴급 연락처

- **개발자**: jb2park@naver.com
- **전화**: 010-5137-2327
- **카카오톡**: [오픈 채팅](https://open.kakao.com/o/sHw2Wgci)
- **GitHub**: [samsung-gfc-recuritment](https://github.com/jbebakPark/samsung-gfc-recuritment)
- **Firebase Console**: https://console.firebase.google.com/project/samsung-gfc

---

## 📊 KPI 목표

### 월간 목표
- 지원자 수: 50+ 명
- 페이지 뷰: 1,000+ 회
- 평균 세션 시간: 3분 이상
- 이탈률: 50% 이하

### 성능 목표
- Lighthouse 점수: 90+ (Performance, SEO)
- First Contentful Paint (FCP): < 1.5초
- Largest Contentful Paint (LCP): < 2.5초
- Time to Interactive (TTI): < 3.5초

---

## ✅ 완료 표시

매달 체크리스트를 출력하여 사용하거나, GitHub Issues로 관리하세요.

```bash
# GitHub Issue 생성 예시
gh issue create \
  --title "월간 콘텐츠 업데이트 (2026-03)" \
  --body "$(cat docs/monthly-checklist.md)" \
  --label "maintenance"
```

---

**마지막 업데이트**: 2026-02-14  
**다음 업데이트 예정**: 2026-03-01
