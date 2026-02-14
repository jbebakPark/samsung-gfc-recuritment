// Supabase Configuration - Auto-generated
// Generated: 2026-02-13 15:18:52

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseConfig = {
  url: 'https://nexschnnsopwhtmgfnuu.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leHNjaG5uc29wd2h0bWdmbnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Nzg4OTIsImV4cCI6MjA4NjU1NDg5Mn0.-CE3p9yuS-gxoJJPJqfrP0b7OMxtMgusZyQspK1HOpA'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const TABLES = {
  APPLICATIONS: 'applications',
  JOB_FAIR_APPLICATIONS: 'job_fair_applications',
  NOTIFICATION_LOGS: 'notification_logs',
  APPROVED_USERS: 'approved_users',
  RESOURCES: 'resources'
};

const APPLICATION_TYPES = {
  VOLUNTARY: 'voluntary',
  REFERRAL: 'referral',
  JOBFAIR_NO_REF: 'jobfair_no_ref',
  JOBFAIR_WITH_REF: 'jobfair_with_ref'
};

window.supabase = supabase;
window.TABLES = TABLES;
window.APPLICATION_TYPES = APPLICATION_TYPES;

console.log('✅ Supabase initialized:', supabaseConfig.url);
