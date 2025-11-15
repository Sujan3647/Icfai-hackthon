-- Quick commands to manage your Supabase database
-- Run these in Supabase SQL Editor: https://zgufupmolpnguxzrbjns.supabase.co

-- 1. VIEW ALL REGISTRATIONS
SELECT reg_id, team_name, domain, status, created_at 
FROM registrations 
ORDER BY created_at DESC;

-- 2. COUNT TOTAL REGISTRATIONS
SELECT COUNT(*) as total_registrations FROM registrations;

-- 3. COUNT BY DOMAIN
SELECT domain, COUNT(*) as count 
FROM registrations 
GROUP BY domain 
ORDER BY count DESC;

-- 4. CHECK FOR DUPLICATES
SELECT reg_id, COUNT(*) as duplicate_count
FROM registrations
GROUP BY reg_id
HAVING COUNT(*) > 1;

-- 5. DELETE ALL REGISTRATIONS (START FRESH)
TRUNCATE TABLE registrations;

-- 6. DELETE SPECIFIC REGISTRATION BY ID
DELETE FROM registrations WHERE reg_id = 'YOUR_REG_ID_HERE';

-- 7. DELETE LAST N REGISTRATIONS
DELETE FROM registrations 
WHERE id IN (
  SELECT id FROM registrations 
  ORDER BY created_at DESC 
  LIMIT 5
);

-- 8. VIEW RECENT REGISTRATIONS WITH FULL DETAILS
SELECT * FROM registrations 
ORDER BY created_at DESC 
LIMIT 10;
