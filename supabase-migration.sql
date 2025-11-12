-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reg_id TEXT NOT NULL UNIQUE,
  team_name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('Blockchain', 'AIML', 'Open Innovation')),
  leader JSONB NOT NULL,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  idea_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Create index on reg_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_reg_id ON registrations(reg_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow service role full access" ON registrations;

-- Create policy to allow all operations with service role key
-- (Your API routes will use the service role key)
CREATE POLICY "Allow service role full access" ON registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
