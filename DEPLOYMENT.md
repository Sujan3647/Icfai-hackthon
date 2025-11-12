# Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas database (your connection string)

## Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 3. Configure Environment Variables
In Vercel Dashboard > Project > Settings > Environment Variables, add:

**Required:**
- `MONGODB_URI` = `mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon?retryWrites=true&w=majority`

**Optional (only if using authentication):**
- `GOOGLE_CLIENT_ID` = your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` = your Google OAuth client secret
- `JWT_SECRET` = any random secure string

### 4. Deploy
Click "Deploy" and Vercel will build and deploy your application.

## Common Issues & Solutions

### Issue: Build fails with TypeScript errors
**Solution:** The project is configured to show TypeScript errors. Fix any type errors in your code.

### Issue: MongoDB connection fails
**Solution:** 
- Verify your MongoDB URI is correct
- Check MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0)
- Ensure your MongoDB user has read/write permissions

### Issue: Images not loading
**Solution:** 
- Ensure all images are in the `/public` folder
- Use relative paths starting with `/` (e.g., `/images/logo.png`)

### Issue: API routes return 500 errors
**Solution:**
- Check Vercel Function Logs in Dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string includes database name

## MongoDB Atlas Configuration

1. **Network Access:**
   - Go to MongoDB Atlas > Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Vercel's serverless functions

2. **Database User:**
   - Ensure user has `readWrite` permissions on the `ideathon` database

## Post-Deployment

1. Test your deployment at the Vercel URL
2. Test registration form
3. Test admin panel login
4. Check Vercel Function Logs for any errors

## Custom Domain (Optional)

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring

- View logs: Vercel Dashboard > Project > Deployments > [Latest] > Function Logs
- View analytics: Vercel Dashboard > Project > Analytics

## Support

If you encounter issues:
1. Check Vercel Function Logs
2. Verify environment variables
3. Test MongoDB connection separately
4. Check Next.js build logs
