# Firebase Setup Guide

## ✅ Migration Complete!

Your project has been successfully migrated from MongoDB to Firebase Firestore.

## 🔥 Firebase Console Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name (e.g., "ideathon")
4. Follow the setup wizard

### 2. Get Your Service Account Credentials

1. In Firebase Console, click the **⚙️ Settings icon** → **Project settings**
2. Go to **Service accounts** tab
3. Click **"Generate new private key"**
4. A JSON file will be downloaded - **Keep this file secure!**

### 3. Extract Credentials from JSON

The downloaded JSON file will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 4. Update Your `.env.local` File

Copy these values from your JSON file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Keep the `\n` characters in the private key
- Don't commit this file to Git!

## 📝 Firestore Database Setup

### 1. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** or **Test mode**
   - **Production mode**: More secure, requires security rules
   - **Test mode**: Open access for 30 days (good for development)
4. Select your preferred location (e.g., `us-central`, `asia-southeast1`)
5. Click **"Enable"**

### 2. Set Security Rules (Production Mode)

If you chose production mode, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{registration} {
      // Allow read/write from authenticated admin
      allow read, write: if true; // Change this based on your auth
    }
  }
}
```

**For better security, implement proper authentication!**

## 🚀 Deploy to Vercel

### Environment Variables to Add in Vercel:

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `FIREBASE_PROJECT_ID` | your-project-id | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | firebase-adminsdk-xxxxx@... | Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY` | -----BEGIN PRIVATE KEY----- ... | Production, Preview, Development |

**Important:** 
- For `FIREBASE_PRIVATE_KEY`, paste the entire private key including:
  - `-----BEGIN PRIVATE KEY-----`
  - All the key content
  - `-----END PRIVATE KEY-----`
- Keep the `\n` characters

## 🧪 Test Locally

1. Make sure your `.env.local` is updated with Firebase credentials
2. Run the development server:
   ```bash
   pnpm dev
   ```
3. Test registration at: `http://localhost:3000/register`
4. Check admin panel at: `http://localhost:3000/admin`

## 📊 View Your Data

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Firestore Database** in the sidebar
4. You'll see your `registrations` collection with all documents

## 🔐 Security Best Practices

1. **Never commit** your service account JSON file to Git
2. **Never commit** `.env.local` to Git (it's in `.gitignore` by default)
3. Add `.env.local` to your `.gitignore`:
   ```
   .env.local
   .env.*.local
   ```
4. Consider implementing Firebase Authentication for admin access
5. Update Firestore security rules for production

## 🆘 Troubleshooting

### "Permission denied" error
- Check your Firestore security rules
- Verify your service account credentials are correct

### "Project not found" error
- Verify `FIREBASE_PROJECT_ID` matches your Firebase project

### "Invalid private key" error
- Make sure the private key includes `\n` characters
- Verify quotes are around the entire key value

### Connection timeout
- Check if Firestore is enabled in your Firebase project
- Verify your internet connection

## 📚 Next Steps

1. ✅ Set up Firebase project
2. ✅ Get service account credentials
3. ✅ Update `.env.local`
4. ✅ Enable Firestore Database
5. ✅ Test locally
6. ✅ Add environment variables to Vercel
7. ✅ Deploy to Vercel
8. 🔒 Implement proper authentication (recommended)
9. 🔒 Update security rules (recommended)

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs/firestore)
