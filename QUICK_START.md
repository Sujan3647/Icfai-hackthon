# 🎯 QUICK START GUIDE

## What's Been Built

A complete, production-ready website for HACK-TO-HIRE Ideathon 2025 with:

✅ **Homepage** - Beautiful hero section with registration form
✅ **Event Details** - Animated domain cards and event info
✅ **Admin Panel** - Full-featured dashboard at `/admin`
✅ **Database** - MongoDB integration for registrations
✅ **Security** - JWT auth, input validation, sanitization

---

## 🚀 Getting Started (5 Minutes)

### 1. Server is Already Running!

The dev server is running at: **http://localhost:3000**

### 2. Test the Registration Form

1. Open http://localhost:3000
2. Fill in the registration form:
   - Team Name: "Test Team"
   - Domain: Select any (Blockchain/AIML/Open Innovation)
   - Leader details (name, email, phone are required)
   - Accept terms
3. Click "Register Now"
4. You'll see a success modal with Registration ID

### 3. Access Admin Panel

1. Go to http://localhost:3000/admin
2. Login with:
   - **Email**: `ABCD1234`
   - **Password**: `qwertypoiu`
3. View, search, filter, and manage registrations

---

## 📝 What You Need to Do Next

### Before Going Live

1. **Replace Placeholder Images**
   - Add real `poster.png` to `/public/images/`
   - Add real `icfai_logo.png` to `/public/images/`
   - Delete the `.svg` placeholders

2. **Update Environment Variables** (`.env.local`)
   - Generate a strong `JWT_SECRET` (use: `openssl rand -base64 32`)
   - Change admin credentials (`ADMIN_FALLBACK_EMAIL` and `ADMIN_FALLBACK_PASSWORD`)

3. **Test MongoDB Connection**
   - Try registering a test team
   - Verify it appears in MongoDB Atlas
   - Check admin panel shows the registration

---

## 🎨 Customization Options

### Change Event Details
Edit `/components/event-details-section.tsx`:
```typescript
const details = [
  { icon: Calendar, label: "Date", value: "17th November 2025" },
  { icon: Clock, label: "Time", value: "10:00 AM onwards" },
  // ... update as needed
]
```

### Modify Form Fields
Edit `/components/registration-form.tsx` to add/remove fields

### Update Colors
The theme uses:
- Primary: `#0b2b54` (deep blue)
- Secondary: `#1e5a9e` (lighter blue)
- Change in components or Tailwind config

---

## 📱 Features Overview

### Registration Form
- ✅ Team name & domain selection
- ✅ Leader details (6 fields)
- ✅ 3 optional team members (6 fields each)
- ✅ Terms & conditions checkbox
- ✅ Client & server validation
- ✅ Success modal with reg ID
- ✅ Fully responsive
- ✅ Framer Motion animations

### Admin Dashboard
- ✅ Secure login with JWT
- ✅ Search registrations
- ✅ Filter by domain/status
- ✅ Pagination (10 per page)
- ✅ Export to CSV
- ✅ Edit status (pending/confirmed/rejected)
- ✅ Delete with confirmation
- ✅ Activity logging
- ✅ Formatted dates/times

### API Endpoints
- `POST /api/register` - Submit registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/registrations` - List all
- `PATCH /api/admin/registrations/[id]` - Update status
- `DELETE /api/admin/registrations/[id]` - Delete registration

---

## 🚀 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "HACK-TO-HIRE website complete"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to vercel.com
   - Import repository
   - Add all `.env.local` variables
   - Deploy

3. **Configure MongoDB**
   - In MongoDB Atlas, go to Network Access
   - Add `0.0.0.0/0` to allow Vercel connections

---

## 🔧 Common Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Install dependencies
npm install --legacy-peer-deps
```

---

## 📊 MongoDB Collections

### registrations
```json
{
  "regId": "H2H-2025-0001",
  "teamName": "Team Name",
  "domain": "Blockchain",
  "leader": { ... },
  "members": [ ... ],
  "status": "pending",
  "createdAt": "2025-11-12T..."
}
```

### admin_logs
```json
{
  "action": "update_status",
  "registrationId": "...",
  "adminEmail": "ABCD1234",
  "timestamp": "2025-11-12T..."
}
```

---

## ✨ Key Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **MongoDB** - Database
- **Zod** - Validation
- **JWT** - Authentication

---

## 📞 Need Help?

1. Check the main `README.md` for detailed documentation
2. View component files for implementation details
3. Test in development before deploying
4. Contact: +91 9077255903

---

**Built for HACK-TO-HIRE Ideathon 2025**
© 2025 ICFAI University Tripura
