// Job Fair 데이터 관리
// 실제로는 Supabase나 API에서 가져와야 함

class JobFairManager {
    constructor() {
        this.jobfairs = [];
        this.loadData();
    }

    // 로컬 스토리지에서 데이터 로드
    loadData() {
        const stored = localStorage.getItem('gfc_jobfairs');
        if (stored) {
            this.jobfairs = JSON.parse(stored);
        } else {
            // 기본 샘플 데이터
            this.jobfairs = [
                {
                    id: 1,
                    date: '2026-01-27',
                    day: '화',
                    startTime: '14:00',
                    endTime: '17:00',
                    location: '삼성생명 본관 10층 대회의실',
                    address: '서울시 중구 을지로 100',
                    schedule: [
                        { time: '14:00', subject: '등록 및 접수', speaker: '' },
                        { time: '14:30', subject: 'GFC 직무 소개', speaker: '박재박 팀장' },
                        { time: '15:00', subject: '성공 사례 공유', speaker: '남기석 GFC (TOP 10)' },
                        { time: '15:30', subject: '교육 프로그램 안내', speaker: '인재개발팀' },
                        { time: '16:00', subject: '질의응답 및 상담', speaker: '전체' }
                    ]
                },
                {
                    id: 2,
                    date: '2026-02-15',
                    day: '토',
                    startTime: '10:00',
                    endTime: '13:00',
                    location: '삼성생명 부산지점 세미나실',
                    address: '부산시 해운대구 센텀중앙로 97',
                    schedule: [
                        { time: '10:00', subject: '환영사 및 오리엔테이션', speaker: '지점장' },
                        { time: '10:30', subject: 'GFC 업무 상세 설명', speaker: '박재박 팀장' },
                        { time: '11:30', subject: '현직 GFC와의 대화', speaker: '부산 GFC 3인' },
                        { time: '12:30', subject: '개별 상담', speaker: '전체' }
                    ]
                }
            ];
            this.saveData();
        }
    }

    // 로컬 스토리지에 데이터 저장
    saveData() {
        localStorage.setItem('gfc_jobfairs', JSON.stringify(this.jobfairs));
    }

    // 전체 목록 가져오기
    getAll() {
        return this.jobfairs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // 다가오는 Job Fair만 가져오기
    getUpcoming(limit = null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let upcoming = this.jobfairs
            .filter(fair => new Date(fair.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (limit) {
            upcoming = upcoming.slice(0, limit);
        }
        
        return upcoming;
    }

    // ID로 가져오기
    getById(id) {
        return this.jobfairs.find(f => f.id === id);
    }

    // 추가
    add(jobfair) {
        const newId = this.jobfairs.length > 0 
            ? Math.max(...this.jobfairs.map(f => f.id)) + 1 
            : 1;
        
        const newJobfair = { id: newId, ...jobfair };
        this.jobfairs.push(newJobfair);
        this.saveData();
        return newJobfair;
    }

    // 수정
    update(id, jobfair) {
        const index = this.jobfairs.findIndex(f => f.id === id);
        if (index !== -1) {
            this.jobfairs[index] = { ...this.jobfairs[index], ...jobfair };
            this.saveData();
            return true;
        }
        return false;
    }

    // 삭제
    delete(id) {
        const index = this.jobfairs.findIndex(f => f.id === id);
        if (index !== -1) {
            this.jobfairs.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // 날짜 포맷팅
    formatDate(dateStr, day) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dateNum = date.getDate();
        return `${year}년 ${month}월 ${dateNum}일`;
    }

    // 요일 자동 계산
    calculateDay(dateStr) {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    }
}

// 전역 인스턴스
const jobFairManager = new JobFairManager();

// Export (모듈 방식 사용 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobFairManager;
}
