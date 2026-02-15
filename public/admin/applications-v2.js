// Admin Page V2.0
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Admin Page V2.0 loaded');
  
  if (!window.supabase) {
    console.error('Supabase not initialized!');
    return;
  }
  
  await loadApplications();
});

async function loadApplications() {
  const result = await getApplications();
  if (result.success) {
    console.log('Loaded applications:', result.data.length);
  }
}
