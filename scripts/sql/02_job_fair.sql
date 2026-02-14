CREATE TABLE IF NOT EXISTS job_fair_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('jobfair_no_ref', 'jobfair_with_ref')),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  job_fair_date DATE NOT NULL,
  job_fair_location VARCHAR(200),
  booth_number VARCHAR(50),
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  status VARCHAR(50) DEFAULT 'registered',
  admin_notes TEXT,
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP WITH TIME ZONE,
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobfair_email ON job_fair_applications(email);
CREATE INDEX IF NOT EXISTS idx_jobfair_date ON job_fair_applications(job_fair_date);

ALTER TABLE job_fair_applications ENABLE ROW LEVEL SECURITY;
