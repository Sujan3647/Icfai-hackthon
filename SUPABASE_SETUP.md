# Supabase Setup Guide

This project has been migrated from Firebase to Supabase for better performance and easier deployment.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `ideathon-2025` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**
6. Wait for the project to be provisioned (~2 minutes)

### 2. Set Up the Database

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-migration.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see a success message

### 3. Get Your API Credentials

1. In the Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL**:
   ```
   https://your-project-id.supabase.co
   ```

   **Service Role Key** (under "Project API keys" section):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   ⚠️ **IMPORTANT**: Use the **service_role** key (not the anon key) for server-side operations!

### 4. Update Environment Variables

#### For Local Development:

Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual Supabase URL and service role key.

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables for **Production**, **Preview**, and **Development**:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

4. Save and redeploy your application

### 5. Test the Setup

1. Run the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3001/register`
3. Fill out and submit the registration form
4. Check your Supabase dashboard:
   - Click **"Table Editor"** in the left sidebar
   - Select the `registrations` table
   - You should see your test registration!

## 📊 Database Structure

The `registrations` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `reg_id` | TEXT | Registration ID (e.g., H2H-2025-0001) |
| `team_name` | TEXT | Team name |
| `domain` | TEXT | Domain (Blockchain, AIML, or Open Innovation) |
| `leader` | JSONB | Team leader information (JSON object) |
| `members` | JSONB | Array of team members (JSON array) |
| `idea_description` | TEXT | Description of the team's idea |
| `status` | TEXT | Registration status (default: 'pending') |
| `created_at` | TIMESTAMPTZ | When the registration was created |
| `updated_at` | TIMESTAMPTZ | When the registration was last updated |

## 🔒 Security

- Row Level Security (RLS) is enabled on the `registrations` table
- The service role key bypasses RLS for API operations
- Never expose the service role key in client-side code!

## 🎯 Benefits of Supabase over Firebase

✅ **Smaller Bundle Size**: ~5 MB smaller than Firebase Admin SDK  
✅ **PostgreSQL**: More powerful querying and relational data  
✅ **Simpler Deployment**: No need for service account JSON files  
✅ **Better Performance**: Faster cold starts on serverless functions  
✅ **Free Tier**: 500MB database, 2GB file storage, 50,000 monthly active users  

## 📝 Next Steps

- View registrations at `/admin` (credentials: username: `Dipta`, password: `d67s09F#$##!H8WEY8`)
- Set up email notifications using Supabase Edge Functions (optional)
- Add real-time subscriptions for live updates (optional)

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Check the console for error messages during development
