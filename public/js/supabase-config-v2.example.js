// Supabase Configuration V2.0
// 개선된 지원자 관리 시스템 - 4가지 지원자 유형 및 추천인 관리
// Phase 2에서 사용할 설정 파일
// 실제 사용 시 .env 파일로 관리하고, .gitignore에 추가

// ⚠️ 주의: 실제 배포 시에는 환경 변수로 관리하세요
// Netlify/Vercel 환경 변수 설정 사용 권장

const supabaseConfig = {
  url: 'YOUR_SUPABASE_PROJECT_URL', // https://xxxxx.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // 공개 키 (클라이언트에서 사용 가능)
  // serviceKey: 'YOUR_SERVICE_ROLE_KEY' // ❌ 절대 클라이언트에 노출하지 말 것!
};

// Supabase Client 초기화 (Phase 2)
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// ========================================
// 테이블 이름 상수
// ========================================
const TABLES = {
  APPLICATIONS: 'applications',              // 일반 지원자 (자발적, 추천인)
  JOB_FAIR_APPLICATIONS: 'job_fair_applications', // Job Fair 지원자
  NOTIFICATION_LOGS: 'notification_logs',    // 알림 로그
  APPROVED_USERS: 'approved_users',          // 승인된 사용자
  RESOURCES: 'resources'                     // 자료실
};

// ========================================
// 지원자 유형 상수
// ========================================
const APPLICATION_TYPES = {
  VOLUNTARY: 'voluntary',           // 자발적 지원 (추천인 없음)
  REFERRAL: 'referral',             // 추천인 지원
  JOBFAIR_NO_REF: 'jobfair_no_ref', // Job Fair (추천인 없음)
  JOBFAIR_WITH_REF: 'jobfair_with_ref' // Job Fair (추천인 있음)
};

// ========================================
// 지원 상태 상수
// ========================================
const APPLICATION_STATUS = {
  PENDING: 'pending',       // 검토 중
  APPROVED: 'approved',     // 승인
  REJECTED: 'rejected',     // 반려
  CONTACTED: 'contacted',   // 연락 완료
  SCHEDULED: 'scheduled'    // 면접 예정
};

const JOB_FAIR_STATUS = {
  REGISTERED: 'registered', // 등록 완료
  CONFIRMED: 'confirmed',   // 참석 확인
  ATTENDED: 'attended',     // 참석 완료
  NO_SHOW: 'no_show',       // 불참
  FOLLOW_UP: 'follow_up'    // 추가 연락 필요
};

// ========================================
// API Functions
// ========================================

/**
 * 1. 일반 지원서 제출 (자발적 또는 추천인)
 * @param {Object} formData - 지원서 데이터
 * @returns {Promise<Object>}
 */
async function submitGeneralApplication(formData) {
  // Phase 2에서 구현
  // const { data, error } = await supabase
  //   .from(TABLES.APPLICATIONS)
  //   .insert([{
  //     application_type: formData.hasReferrer ? APPLICATION_TYPES.REFERRAL : APPLICATION_TYPES.VOLUNTARY,
  //     name: formData.name,
  //     phone: formData.phone,
  //     email: formData.email,
  //     gender: formData.gender,
  //     birth_date: formData.birthDate,
  //     address: formData.address,
  //     region: formData.region,
  //     career: formData.career,
  //     motivation: formData.motivation,
  //     referrer_name: formData.referrerName || null,
  //     referrer_phone: formData.referrerPhone || null,
  //     referrer_branch: formData.referrerBranch || null,
  //     status: APPLICATION_STATUS.PENDING
  //   }])
  //   .select()
  
  // if (error) {
  //   console.error('Error submitting application:', error);
  //   return { success: false, error: error.message };
  // }
  
  // // 카카오톡 알림 전송
  // if (formData.hasReferrer) {
  //   await sendDualKakaoNotification(data[0], 'general');
  // } else {
  //   await sendKakaoNotification(data[0], 'applicant', 'general');
  // }
  
  console.log('Phase 1: General application logged', formData);
  return { success: true, message: 'Phase 2에서 DB 연동 예정' };
}

/**
 * 2. Job Fair 지원서 제출
 * @param {Object} formData - Job Fair 지원 데이터
 * @returns {Promise<Object>}
 */
async function submitJobFairApplication(formData) {
  // Phase 2에서 구현
  // const { data, error } = await supabase
  //   .from(TABLES.JOB_FAIR_APPLICATIONS)
  //   .insert([{
  //     has_referrer: Boolean(formData.referrerName),
  //     name: formData.name,
  //     phone: formData.phone,
  //     email: formData.email,
  //     gender: formData.gender,
  //     birth_date: formData.birthDate,
  //     job_fair_date: formData.jobFairDate,
  //     job_fair_session: formData.jobFairSession,
  //     job_fair_location: formData.jobFairLocation,
  //     referrer_name: formData.referrerName || null,
  //     referrer_phone: formData.referrerPhone || null,
  //     referrer_branch: formData.referrerBranch || null,
  //     status: JOB_FAIR_STATUS.REGISTERED
  //   }])
  //   .select()
  
  // if (error) {
  //   console.error('Error submitting job fair application:', error);
  //   return { success: false, error: error.message };
  // }
  
  // // 카카오톡 알림 전송
  // if (formData.referrerName) {
  //   await sendDualKakaoNotification(data[0], 'jobfair');
  // } else {
  //   await sendKakaoNotification(data[0], 'applicant', 'jobfair');
  // }
  
  console.log('Phase 1: Job Fair application logged', formData);
  return { success: true, message: 'Phase 2에서 DB 연동 예정' };
}

/**
 * 3. 지원자 목록 조회 (관리자)
 * @param {Object} filters - 필터 조건
 * @param {string} tableType - 'general' 또는 'jobfair'
 * @returns {Promise<Array>}
 */
async function getApplications(filters = {}, tableType = 'general') {
  // Phase 2에서 구현
  const tableName = tableType === 'jobfair' ? TABLES.JOB_FAIR_APPLICATIONS : TABLES.APPLICATIONS;
  
  // let query = supabase
  //   .from(tableName)
  //   .select('*')
  //   .order('submitted_at', { ascending: false })
  
  // // 상태 필터
  // if (filters.status) {
  //   query = query.eq('status', filters.status)
  // }
  
  // // 지원 유형 필터 (일반 지원만)
  // if (tableType === 'general' && filters.applicationType) {
  //   query = query.eq('application_type', filters.applicationType)
  // }
  
  // // 추천인 여부 필터 (Job Fair만)
  // if (tableType === 'jobfair' && filters.hasReferrer !== undefined) {
  //   query = query.eq('has_referrer', filters.hasReferrer)
  // }
  
  // // 날짜 범위 필터
  // if (filters.startDate) {
  //   query = query.gte('submitted_at', filters.startDate)
  // }
  // if (filters.endDate) {
  //   query = query.lte('submitted_at', filters.endDate)
  // }
  
  // const { data, error } = await query
  
  // if (error) {
  //   console.error('Error fetching applications:', error);
  //   return [];
  // }
  
  // return data;
  
  return [];
}

/**
 * 4. 지원서 상세 조회
 * @param {string} applicationId - 지원서 ID
 * @param {string} tableType - 'general' 또는 'jobfair'
 * @returns {Promise<Object>}
 */
async function getApplicationById(applicationId, tableType = 'general') {
  // Phase 2에서 구현
  const tableName = tableType === 'jobfair' ? TABLES.JOB_FAIR_APPLICATIONS : TABLES.APPLICATIONS;
  
  // const { data, error } = await supabase
  //   .from(tableName)
  //   .select('*')
  //   .eq('id', applicationId)
  //   .single()
  
  // if (error) {
  //   console.error('Error fetching application:', error);
  //   return null;
  // }
  
  // return data;
  
  return null;
}

/**
 * 5. 지원서 상태 업데이트 (관리자)
 * @param {string} applicationId - 지원서 ID
 * @param {string} status - 새로운 상태
 * @param {string} tableType - 'general' 또는 'jobfair'
 * @returns {Promise<Object>}
 */
async function updateApplicationStatus(applicationId, status, tableType = 'general') {
  // Phase 2에서 구현
  const tableName = tableType === 'jobfair' ? TABLES.JOB_FAIR_APPLICATIONS : TABLES.APPLICATIONS;
  
  // const { data, error } = await supabase
  //   .from(tableName)
  //   .update({ 
  //     status, 
  //     updated_at: new Date().toISOString() 
  //   })
  //   .eq('id', applicationId)
  //   .select()
  
  // if (error) {
  //   console.error('Error updating status:', error);
  //   return { success: false, error: error.message };
  // }
  
  // return { success: true, data: data[0] };
  
  return { success: true };
}

/**
 * 6. 실명 확인 처리
 * @param {string} applicationId - 지원서 ID
 * @param {string} method - 확인 방법 ('phone', 'email', 'manual')
 * @param {string} tableType - 'general' 또는 'jobfair'
 * @returns {Promise<Object>}
 */
async function verifyIdentity(applicationId, method, tableType = 'general') {
  // Phase 2에서 구현
  const tableName = tableType === 'jobfair' ? TABLES.JOB_FAIR_APPLICATIONS : TABLES.APPLICATIONS;
  
  // const { data, error } = await supabase
  //   .from(tableName)
  //   .update({
  //     identity_verified: true,
  //     identity_verified_at: new Date().toISOString(),
  //     identity_method: method
  //   })
  //   .eq('id', applicationId)
  //   .select()
  
  // if (error) {
  //   console.error('Error verifying identity:', error);
  //   return { success: false, error: error.message };
  // }
  
  // return { success: true, data: data[0] };
  
  return { success: true };
}

/**
 * 7. 카카오톡 알림 전송 (단일)
 * @param {Object} application - 지원서 데이터
 * @param {string} recipientType - 'applicant' 또는 'referrer'
 * @param {string} notificationType - 'general' 또는 'jobfair'
 * @returns {Promise<Object>}
 */
async function sendKakaoNotification(application, recipientType, notificationType) {
  // Phase 2에서 구현
  // const KAKAO_WEBHOOK_URL = 'YOUR_KAKAO_WEBHOOK_URL';
  
  // // 메시지 생성
  // let message;
  // if (recipientType === 'applicant') {
  //   if (notificationType === 'jobfair') {
  //     message = `[삼성생명 GFC 채용설명회]\n${application.name}님의 참석 신청이 완료되었습니다.\n\n신청번호: ${application.application_number}\n일시: ${application.job_fair_date}\n장소: ${application.job_fair_location}\n\n당일 신분증을 지참해주세요.`;
  //   } else {
  //     message = `[삼성생명 GFC 채용]\n${application.name}님의 지원서가 접수되었습니다.\n\n지원번호: ${application.application_number}\n접수일시: ${application.submitted_at}\n\n검토 후 영업일 기준 3일 이내 연락드리겠습니다.`;
  //   }
  // } else { // referrer
  //   if (notificationType === 'jobfair') {
  //     message = `[삼성생명 GFC 채용설명회]\n${application.referrer_name}님이 추천하신 ${application.name}님이 채용설명회에 신청하셨습니다.\n\n신청번호: ${application.application_number}\n일시: ${application.job_fair_date}\n지원자: ${application.name} (${application.phone})\n\n감사합니다.`;
  //   } else {
  //     message = `[삼성생명 GFC 채용]\n${application.referrer_name}님이 추천하신 ${application.name}님의 지원서가 접수되었습니다.\n\n지원번호: ${application.application_number}\n지원자: ${application.name} (${application.phone})\n접수일시: ${application.submitted_at}\n\n감사합니다.`;
  //   }
  // }
  
  // // 카카오톡 전송
  // try {
  //   const response = await fetch(KAKAO_WEBHOOK_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       recipient: recipientType === 'applicant' ? application.phone : application.referrer_phone,
  //       message: message
  //     })
  //   });
    
  //   // 알림 로그 저장
  //   await logNotification(application, recipientType, 'kakao', message, response.ok ? 'sent' : 'failed');
    
  //   return { success: response.ok };
  // } catch (error) {
  //   console.error('Kakao notification error:', error);
  //   await logNotification(application, recipientType, 'kakao', message, 'failed', error.message);
  //   return { success: false, error: error.message };
  // }
  
  console.log('Phase 1: Kakao notification logged', { application, recipientType, notificationType });
  return { success: true, message: 'Phase 2에서 구현 예정' };
}

/**
 * 8. 카카오톡 알림 전송 (지원자 + 추천인 동시)
 * @param {Object} application - 지원서 데이터
 * @param {string} notificationType - 'general' 또는 'jobfair'
 * @returns {Promise<Object>}
 */
async function sendDualKakaoNotification(application, notificationType) {
  // Phase 2에서 구현
  // 지원자 알림
  // const applicantResult = await sendKakaoNotification(application, 'applicant', notificationType);
  
  // // 추천인 알림
  // const referrerResult = await sendKakaoNotification(application, 'referrer', notificationType);
  
  // // DB 업데이트
  // const tableName = notificationType === 'jobfair' ? TABLES.JOB_FAIR_APPLICATIONS : TABLES.APPLICATIONS;
  // await supabase
  //   .from(tableName)
  //   .update({
  //     applicant_notified: applicantResult.success,
  //     applicant_notified_at: applicantResult.success ? new Date().toISOString() : null,
  //     applicant_notification_method: 'kakao',
  //     referrer_notified: referrerResult.success,
  //     referrer_notified_at: referrerResult.success ? new Date().toISOString() : null,
  //     referrer_notification_method: 'kakao'
  //   })
  //   .eq('id', application.id)
  
  // return {
  //   success: applicantResult.success && referrerResult.success,
  //   applicant: applicantResult,
  //   referrer: referrerResult
  // };
  
  console.log('Phase 1: Dual Kakao notification logged', { application, notificationType });
  return { success: true, message: 'Phase 2에서 구현 예정' };
}

/**
 * 9. 알림 로그 저장
 * @param {Object} application - 지원서 데이터
 * @param {string} recipientType - 'applicant' 또는 'referrer'
 * @param {string} method - 알림 방법
 * @param {string} content - 알림 내용
 * @param {string} status - 전송 상태
 * @param {string} errorMessage - 에러 메시지 (선택)
 * @returns {Promise<Object>}
 */
async function logNotification(application, recipientType, method, content, status, errorMessage = null) {
  // Phase 2에서 구현
  // const { data, error } = await supabase
  //   .from(TABLES.NOTIFICATION_LOGS)
  //   .insert([{
  //     application_id: application.id,
  //     application_type: application.has_referrer !== undefined ? 'job_fair' : 'application',
  //     recipient_type: recipientType,
  //     recipient_name: recipientType === 'applicant' ? application.name : application.referrer_name,
  //     recipient_phone: recipientType === 'applicant' ? application.phone : application.referrer_phone,
  //     notification_method: method,
  //     content: content,
  //     status: status,
  //     sent_at: status === 'sent' ? new Date().toISOString() : null,
  //     error_message: errorMessage
  //   }])
  
  return { success: true };
}

/**
 * 10. 알림 내역 조회
 * @param {Object} filters - 필터 조건
 * @returns {Promise<Array>}
 */
async function getNotificationLogs(filters = {}) {
  // Phase 2에서 구현
  // let query = supabase
  //   .from(TABLES.NOTIFICATION_LOGS)
  //   .select('*')
  //   .order('created_at', { ascending: false })
  
  // if (filters.applicationId) {
  //   query = query.eq('application_id', filters.applicationId)
  // }
  
  // if (filters.status) {
  //   query = query.eq('status', filters.status)
  // }
  
  // if (filters.recipientPhone) {
  //   query = query.eq('recipient_phone', filters.recipientPhone)
  // }
  
  // const { data, error } = await query
  
  // if (error) {
  //   console.error('Error fetching notification logs:', error);
  //   return [];
  // }
  
  // return data;
  
  return [];
}

/**
 * 11. 추천인별 지원자 통계
 * @param {string} referrerPhone - 추천인 전화번호
 * @returns {Promise<Object>}
 */
async function getReferrerStatistics(referrerPhone) {
  // Phase 2에서 구현
  // // 일반 지원
  // const { data: generalApps } = await supabase
  //   .from(TABLES.APPLICATIONS)
  //   .select('*')
  //   .eq('referrer_phone', referrerPhone)
  
  // // Job Fair 지원
  // const { data: jobFairApps } = await supabase
  //   .from(TABLES.JOB_FAIR_APPLICATIONS)
  //   .select('*')
  //   .eq('referrer_phone', referrerPhone)
  
  // return {
  //   totalReferrals: (generalApps?.length || 0) + (jobFairApps?.length || 0),
  //   generalApplications: generalApps || [],
  //   jobFairApplications: jobFairApps || [],
  //   approvedCount: generalApps?.filter(app => app.status === 'approved').length || 0,
  //   pendingCount: generalApps?.filter(app => app.status === 'pending').length || 0
  // };
  
  return { totalReferrals: 0 };
}

/**
 * 12. Job Fair 통계
 * @param {string} jobFairDate - Job Fair 날짜 (선택)
 * @returns {Promise<Object>}
 */
async function getJobFairStatistics(jobFairDate = null) {
  // Phase 2에서 구현
  // let query = supabase.from(TABLES.JOB_FAIR_APPLICATIONS).select('*')
  
  // if (jobFairDate) {
  //   query = query.eq('job_fair_date', jobFairDate)
  // }
  
  // const { data, error } = await query
  
  // if (error) {
  //   console.error('Error fetching job fair statistics:', error);
  //   return null;
  // }
  
  // return {
  //   totalApplications: data.length,
  //   withReferrer: data.filter(app => app.has_referrer).length,
  //   withoutReferrer: data.filter(app => !app.has_referrer).length,
  //   attended: data.filter(app => app.attended).length,
  //   noShow: data.filter(app => app.status === 'no_show').length,
  //   byDate: jobFairDate ? null : groupByDate(data)
  // };
  
  return { totalApplications: 0 };
}

// ========================================
// 자료실 관련 함수 (기존 유지)
// ========================================

async function uploadResource(file, metadata) {
  // Phase 2에서 구현
  return { success: true };
}

async function getResources(userEmail) {
  // Phase 2에서 구현
  return [];
}

async function downloadResource(resourceId, userEmail) {
  // Phase 2에서 구현
  return '';
}

async function approveUser(applicationId) {
  // Phase 2에서 구현
  return { success: true };
}

// ========================================
// Export (Phase 2)
// ========================================
// export {
//   supabaseConfig,
//   TABLES,
//   APPLICATION_TYPES,
//   APPLICATION_STATUS,
//   JOB_FAIR_STATUS,
//   // 지원서 관련
//   submitGeneralApplication,
//   submitJobFairApplication,
//   getApplications,
//   getApplicationById,
//   updateApplicationStatus,
//   verifyIdentity,
//   // 알림 관련
//   sendKakaoNotification,
//   sendDualKakaoNotification,
//   logNotification,
//   getNotificationLogs,
//   // 통계 관련
//   getReferrerStatistics,
//   getJobFairStatistics,
//   // 자료실 관련
//   uploadResource,
//   getResources,
//   downloadResource,
//   approveUser
// }

// Phase 1: 콘솔에 함수 로드 확인
console.log('Supabase config V2.0 loaded (Phase 2 준비 완료)');
console.log('Available functions:', [
  'submitGeneralApplication',
  'submitJobFairApplication',
  'getApplications',
  'getApplicationById',
  'updateApplicationStatus',
  'verifyIdentity',
  'sendKakaoNotification',
  'sendDualKakaoNotification',
  'logNotification',
  'getNotificationLogs',
  'getReferrerStatistics',
  'getJobFairStatistics',
  'uploadResource',
  'getResources',
  'downloadResource',
  'approveUser'
]);
