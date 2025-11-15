-- SQL Script to remove duplicate registrations
-- Run this in Supabase SQL Editor if you have duplicate reg_id entries

-- Option 1: Delete ALL registrations (use this to start fresh)
-- TRUNCATE TABLE registrations;

-- Option 2: Keep only the most recent entry for each reg_id
DELETE FROM registrations a USING (
  SELECT MIN(ctid) as ctid, reg_id
  FROM registrations 
  GROUP BY reg_id HAVING COUNT(*) > 1
) b
WHERE a.reg_id = b.reg_id 
AND a.ctid <> b.ctid;

-- Option 3: View duplicates before deleting
-- SELECT reg_id, COUNT(*) as count
-- FROM registrations
-- GROUP BY reg_id
-- HAVING COUNT(*) > 1;

-- After cleaning, verify no duplicates remain
SELECT reg_id, COUNT(*) as count
FROM registrations
GROUP BY reg_id
HAVING COUNT(*) > 1;
