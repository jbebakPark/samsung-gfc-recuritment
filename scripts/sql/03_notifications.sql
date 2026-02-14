CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type VARCHAR(50) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  application_id UUID,
  application_table VARCHAR(50) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  message_content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  external_api_response JSON,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
