// Supabase Configuration
// Phase 2에서 사용할 설정 파일 예시
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

// 테이블 이름 상수
const TABLES = {
  APPLICATIONS: 'applications',
  RESOURCES: 'resources',
  APPROVED_USERS: 'approved_users',
  JOB_FAIRS: 'job_fairs'
};

// API Functions (Phase 2에서 구현 예정)

/**
 * 지원서 제출
 * @param {Object} formData - 지원서 데이터
 * @returns {Promise<Object>}
 */
async function submitApplication(formData) {
  // Phase 2에서 구현
  // const { data, error } = await supabase
  //   .from(TABLES.APPLICATIONS)
  //   .insert([{
  //     track: formData.track,
  //     name: formData.name,
  //     birth: formData.birth,
  //     phone: formData.phone,
  //     email: formData.email,
  //     region: formData.region,
  //     fair_date: formData.fairDate,
  //     career: formData.career,
  //     motivation: formData.motivation,
  //     referrer_name: formData.referrerName,
  //     referrer_branch: formData.referrerBranch,
  //     status: 'pending'
  //   }])
  
  console.log('Phase 1: Form data logged', formData);
  return { success: true, message: 'Phase 2에서 DB 연동 예정' };
}

/**
 * 지원서 목록 조회 (관리자)
 * @param {Object} filters - 필터 조건
 * @returns {Promise<Array>}
 */
async function getApplications(filters = {}) {
  // Phase 2에서 구현
  // let query = supabase
  //   .from(TABLES.APPLICATIONS)
  //   .select('*')
  //   .order('submitted_at', { ascending: false })
  
  // if (filters.status) {
  //   query = query.eq('status', filters.status)
  // }
  
  // if (filters.track) {
  //   query = query.eq('track', filters.track)
  // }
  
  // const { data, error } = await query
  
  return [];
}

/**
 * 지원서 상태 업데이트 (관리자)
 * @param {string} applicationId - 지원서 ID
 * @param {string} status - 새로운 상태
 * @returns {Promise<Object>}
 */
async function updateApplicationStatus(applicationId, status) {
  // Phase 2에서 구현
  // const { data, error } = await supabase
  //   .from(TABLES.APPLICATIONS)
  //   .update({ status, updated_at: new Date().toISOString() })
  //   .eq('id', applicationId)
  
  return { success: true };
}

/**
 * 자료 업로드 (관리자)
 * @param {File} file - 업로드할 파일
 * @param {Object} metadata - 파일 메타데이터
 * @returns {Promise<Object>}
 */
async function uploadResource(file, metadata) {
  // Phase 2에서 구현
  // 1. Supabase Storage에 파일 업로드
  // const { data: uploadData, error: uploadError } = await supabase.storage
  //   .from('resources')
  //   .upload(`${Date.now()}_${file.name}`, file)
  
  // 2. resources 테이블에 메타데이터 저장
  // const { data: resourceData, error: resourceError } = await supabase
  //   .from(TABLES.RESOURCES)
  //   .insert([{
  //     title: metadata.title,
  //     description: metadata.description,
  //     file_url: uploadData.path,
  //     file_type: file.type,
  //     file_size: file.size,
  //     access_level: metadata.accessLevel || 'approved'
  //   }])
  
  return { success: true };
}

/**
 * 자료 목록 조회
 * @param {string} userEmail - 사용자 이메일
 * @returns {Promise<Array>}
 */
async function getResources(userEmail) {
  // Phase 2에서 구현
  // 1. 사용자 권한 확인
  // const { data: user } = await supabase
  //   .from(TABLES.APPROVED_USERS)
  //   .select('*')
  //   .eq('email', userEmail)
  //   .single()
  
  // 2. 권한에 따라 자료 조회
  // let query = supabase.from(TABLES.RESOURCES).select('*')
  
  // if (!user) {
  //   // 비승인 사용자는 public 자료만
  //   query = query.eq('access_level', 'public')
  // }
  
  // const { data, error } = await query
  
  return [];
}

/**
 * 자료 다운로드
 * @param {string} resourceId - 자료 ID
 * @param {string} userEmail - 사용자 이메일
 * @returns {Promise<string>} 다운로드 URL
 */
async function downloadResource(resourceId, userEmail) {
  // Phase 2에서 구현
  // 1. 권한 확인
  // const { data: resource } = await supabase
  //   .from(TABLES.RESOURCES)
  //   .select('*')
  //   .eq('id', resourceId)
  //   .single()
  
  // if (resource.access_level !== 'public') {
  //   const { data: user } = await supabase
  //     .from(TABLES.APPROVED_USERS)
  //     .select('*')
  //     .eq('email', userEmail)
  //     .single()
    
  //   if (!user) {
  //     throw new Error('접근 권한이 없습니다')
  //   }
  // }
  
  // 2. 다운로드 URL 생성
  // const { data } = await supabase.storage
  //   .from('resources')
  //   .createSignedUrl(resource.file_url, 60) // 60초 유효
  
  // return data.signedUrl
  
  return '';
}

/**
 * 사용자 승인 (관리자)
 * @param {string} applicationId - 지원서 ID
 * @returns {Promise<Object>}
 */
async function approveUser(applicationId) {
  // Phase 2에서 구현
  // 1. 지원서 정보 조회
  // const { data: application } = await supabase
  //   .from(TABLES.APPLICATIONS)
  //   .select('*')
  //   .eq('id', applicationId)
  //   .single()
  
  // 2. approved_users 테이블에 추가
  // const { data, error } = await supabase
  //   .from(TABLES.APPROVED_USERS)
  //   .insert([{
  //     email: application.email,
  //     name: application.name,
  //     application_id: applicationId
  //   }])
  
  // 3. 지원서 상태 업데이트
  // await updateApplicationStatus(applicationId, 'approved')
  
  return { success: true };
}

// Export (Phase 2)
// export {
//   supabaseConfig,
//   TABLES,
//   submitApplication,
//   getApplications,
//   updateApplicationStatus,
//   uploadResource,
//   getResources,
//   downloadResource,
//   approveUser
// }

// Phase 1: 콘솔에 함수 로드 확인
console.log('Supabase config loaded (Phase 2 준비 완료)');
console.log('Available functions:', [
  'submitApplication',
  'getApplications',
  'updateApplicationStatus',
  'uploadResource',
  'getResources',
  'downloadResource',
  'approveUser'
]);