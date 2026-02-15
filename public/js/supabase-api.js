// Samsung GFC - Supabase API Functions (16 functions)

async function submitGeneralApplication(formData) {
  try {
    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .insert([{
        application_type: formData.hasReferrer ? APPLICATION_TYPES.REFERRAL : APPLICATION_TYPES.VOLUNTARY,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        referrer_name: formData.referrerName || null,
        referrer_phone: formData.referrerPhone || null,
        referrer_branch: formData.referrerBranch || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

async function getApplications(filters = {}) {
  try {
    let query = supabase.from(TABLES.APPLICATIONS).select('*');
    if (filters.status) query = query.eq('status', filters.status);
    query = query.order('submitted_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

window.submitGeneralApplication = submitGeneralApplication;
window.getApplications = getApplications;

console.log('✅ API Functions loaded');
