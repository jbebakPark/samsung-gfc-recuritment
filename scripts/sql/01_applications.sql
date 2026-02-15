CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('voluntary', 'referral')),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(10),
  birth_date DATE,
  address TEXT,
  region VARCHAR(50),
  career TEXT,
  motivation TEXT,
  referrer_name VARCHAR(100),
  referrer_phone VARCHAR(20),
  referrer_branch VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  identity_verified BOOLEAN DEFAULT FALSE,
  identity_verified_at TIMESTAMP WITH TIME ZONE,
  identity_method VARCHAR(50),
  applicant_notified BOOLEAN DEFAULT FALSE,
  applicant_notified_at TIMESTAMP WITH TIME ZONE,
  referrer_notified BOOLEAN DEFAULT FALSE,
  referrer_notified_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON applications(phone);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can insert applications"
  ON applications FOR INSERT
  WITH CHECK (true);
