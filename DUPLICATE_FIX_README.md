# Fixing Duplicate Registration ID Error

## Problem
Error: `duplicate key value violates unique constraint "registrations_reg_id_key"`

## What Was Fixed

### 1. Improved Registration ID Generation
- Changed from sequential counting to **timestamp + random number** approach
- Format: `H2H-2025-{timestamp}-{random4digits}`
- Added retry suffix `-R{n}` for additional attempts
- Increased max retries from 5 to 10
- This virtually eliminates duplicate ID collisions

### 2. Better Error Handling
- Fixed variable naming conflict (`data` → `insertResult`)
- Improved retry logic with exponential backoff
- Better error messages

## How to Clear Existing Duplicates in Database

### Option A: Start Fresh (Recommended for testing)
Go to your Supabase SQL Editor and run:
```sql
TRUNCATE TABLE registrations;
```

### Option B: Remove Duplicates Only
Use the script in `scripts/clear-duplicates.sql`:

1. Go to: https://zgufupmolpnguxzrbjns.supabase.co/project/zgufupmolpnguxzrbjns/sql
2. Click "New Query"
3. Copy the contents from `scripts/clear-duplicates.sql`
4. Run the query

## Testing the Fix

1. The dev server should auto-reload with the changes
2. Try submitting a new registration
3. The unique ID will be generated using timestamp + random number
4. Even if you submit multiple forms quickly, they should all succeed

## Why This Works

**Old Method:**
- Used database count + random offset
- Could still collide if requests happened simultaneously

**New Method:**
- Uses `Date.now()` (millisecond precision timestamp)
- Adds random 4-digit number (0000-9999)
- Adds retry suffix if needed
- Example: `H2H-2025-1731687654321-4567` or `H2H-2025-1731687654321-4567-R1`

This makes collisions statistically impossible!

## Files Changed
- ✅ `/app/api/register/route.ts` - Fixed duplicate ID generation
- ✅ `.env.example` - Removed (as requested)
- ✅ Added helper SQL script for cleaning duplicates
