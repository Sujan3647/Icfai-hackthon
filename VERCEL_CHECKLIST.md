# ✅ Vercel Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Repository
- [ ] All code committed to Git
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible

### 2. MongoDB Atlas Configuration
- [ ] MongoDB Atlas account created
- [ ] Database `ideathon` exists
- [ ] User `sujan` has readWrite permissions
- [ ] **Network Access:** 0.0.0.0/0 (Allow from anywhere) ✅ CRITICAL
- [ ] Connection string tested and working

### 3. Environment Variables Ready
- [ ] `MONGODB_URI` copied and ready to paste
  ```
  mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon?retryWrites=true&w=majority
  ```

---

## Deployment Steps

### Step 1: Import to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Sign in with GitHub/GitLab/Bitbucket
- [ ] Click "Import Project"
- [ ] Select your repository
- [ ] Vercel detects Next.js automatically

### Step 2: Configure Project
- [ ] Project name: (choose your name)
- [ ] Framework Preset: Next.js (auto-detected)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `next build` (default)
- [ ] Output Directory: `.next` (default)

### Step 3: Add Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add variable:
  - Name: `MONGODB_URI`
  - Value: `mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon?retryWrites=true&w=majority`
  - Environment: Production, Preview, Development (all selected)

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes for build to complete
- [ ] Build should succeed ✅

---

## Post-Deployment Testing

### Test 1: Homepage
- [ ] Visit your Vercel URL (e.g., `your-project.vercel.app`)
- [ ] Homepage loads without errors
- [ ] Images display correctly
- [ ] ICFAI logo visible
- [ ] Event poster visible
- [ ] "Register Now" button works

### Test 2: Registration Form
- [ ] Click "Register Now"
- [ ] Registration page loads
- [ ] Form displays correctly
- [ ] Fill out a test registration:
  - [ ] Team name
  - [ ] Domain selection
  - [ ] Leader details
  - [ ] At least one member (optional)
  - [ ] Idea description
  - [ ] Accept terms
- [ ] Submit form
- [ ] Success message appears
- [ ] Registration ID displayed

### Test 3: Admin Panel
- [ ] Go to `/admin` route
- [ ] Login page displays
- [ ] Login with credentials:
  - Username: `Dipta`
  - Password: `d67s09F#$##!H8WEY8`
- [ ] Dashboard loads
- [ ] Registrations display
- [ ] Statistics show correct counts
- [ ] Can view registration details
- [ ] Can search registrations

### Test 4: API Routes
- [ ] Test registration API: `POST /api/register`
- [ ] Test admin API: `GET /api/admin/registrations`
- [ ] No 500 errors in Function Logs

---

## Troubleshooting Checklist

### If Build Fails:
- [ ] Check Vercel build logs for specific error
- [ ] Verify all dependencies in `package.json`
- [ ] Check for TypeScript errors
- [ ] Review `next.config.js` configuration

### If MongoDB Connection Fails:
- [ ] Verify `MONGODB_URI` is set in Vercel
- [ ] Check MongoDB Atlas Network Access (0.0.0.0/0)
- [ ] Verify database name is `ideathon`
- [ ] Test connection string locally
- [ ] Check MongoDB user permissions

### If Pages Don't Load:
- [ ] Check Vercel Function Logs
- [ ] Verify environment variables
- [ ] Check browser console for errors
- [ ] Test API routes individually

### If Images Don't Display:
- [ ] Verify images are in `/public/images/`
- [ ] Check image paths start with `/`
- [ ] Verify image files exist in repository
- [ ] Check Next.js image optimization settings

---

## MongoDB Atlas Network Access Setup

**CRITICAL STEP - Don't Skip!**

1. Log into MongoDB Atlas
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere"
5. IP Address: `0.0.0.0/0`
6. Comment: "Vercel Serverless Functions"
7. Click "Confirm"
8. Wait 1-2 minutes for changes to apply

**Why?** Vercel serverless functions use dynamic IPs, so we need to allow all IPs.

---

## Success Indicators

✅ Build completes without errors
✅ Homepage loads in under 3 seconds
✅ Registration form submits successfully
✅ Admin panel displays registrations
✅ No errors in Vercel Function Logs
✅ MongoDB connection successful
✅ All images display correctly

---

## Optional: Custom Domain

### Add Custom Domain:
- [ ] Go to Vercel Dashboard → Project → Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter your domain name
- [ ] Follow DNS configuration instructions
- [ ] Add DNS records to your domain provider
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify domain is active

---

## Monitoring & Maintenance

### Regular Checks:
- [ ] Monitor Vercel Function Logs weekly
- [ ] Check MongoDB Atlas usage
- [ ] Review registration data
- [ ] Test all features monthly
- [ ] Update dependencies quarterly

### Vercel Dashboard:
- [ ] Analytics: Track page views
- [ ] Function Logs: Monitor errors
- [ ] Deployments: View deployment history
- [ ] Settings: Manage environment variables

---

## Emergency Contacts

**MongoDB Issues:**
- MongoDB Atlas Support: https://support.mongodb.com

**Vercel Issues:**
- Vercel Support: https://vercel.com/support
- Vercel Docs: https://vercel.com/docs

**Project Issues:**
- Check GitHub Issues
- Review deployment logs
- Test locally first

---

## Deployment Complete! 🎉

Your HACK-TO-HIRE Ideathon 2025 registration system is now live!

**Next Steps:**
1. Share the Vercel URL with your team
2. Test all features thoroughly
3. Monitor for any issues
4. Collect registrations
5. Celebrate! 🎊

---

**Last Updated:** Ready for deployment
**Status:** ✅ All fixes applied, ready to deploy
