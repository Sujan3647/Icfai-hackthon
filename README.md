# 🚀 HACK-TO-HIRE Ideathon 2025 - Official Website

A professional, animated, and fully responsive single-page website for the HACK-TO-HIRE Ideathon event organized by **Startup Incubation Center & IIC, ICFAI University Tripura**, in collaboration with **Trikaya** and **BeetleX**.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.10-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 Frontend
- **Animated Hero Section**: Beautiful gradient text, responsive logos, and event poster
- **Registration Form**: 
  - Glass-card design with Framer Motion animations
  - Team name, domain selection (Blockchain/AIML/Open Innovation)
  - Leader + 3 optional members with full details
  - Client & server-side validation (Zod)
  - Success modal with registration ID and copy button
- **Event Details Section**: 
  - Date, time, venue, contact information
  - Animated domain cards with hover effects
- **Fully Responsive**: Mobile-first design, adapts to all screen sizes
- **Modern UI**: Deep blue + white theme, gradient buttons, smooth transitions

### 🔐 Admin Panel (`/admin`)
- **Secure Login**: JWT-based authentication with fallback credentials
- **Comprehensive Dashboard**:
  - Search & filter by team name, domain, status
  - Pagination (10 items per page)
  - Export registrations as CSV
  - Edit status (Pending → Confirmed/Rejected)
  - Delete registrations with confirmation
  - Formatted date/time display
- **Activity Logging**: All admin actions logged to MongoDB

### 🗃️ Backend & Database
- **MongoDB Collections**:
  - `registrations` - Stores all team registrations
  - `admin_logs` - Tracks admin actions
- **API Routes**:
  - `POST /api/register` - Submit registration
  - `POST /api/admin/login` - Admin authentication
  - `GET /api/admin/registrations` - Fetch all registrations
  - `PATCH /api/admin/registrations/[id]` - Update status
  - `DELETE /api/admin/registrations/[id]` - Delete registration

### 🛡️ Security
- Input sanitization & validation (Zod)
- JWT-based admin authentication
- MongoDB injection prevention
- XSS protection

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google Cloud Console** project (for OAuth - optional for basic setup)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd idae
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

> **Note**: We use `--legacy-peer-deps` due to `date-fns` peer dependency compatibility.

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth (Optional - for future Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://sujan:sujan@sujan.q6xlr.mongodb.net/

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin Credentials
ADMIN_FALLBACK_EMAIL=ABCD1234
ADMIN_FALLBACK_PASSWORD=qwertypoiu

# Site Configuration
NEXT_PUBLIC_SITE_NAME=HACK-TO-HIRE
```

**⚠️ Important**: 
- Replace `JWT_SECRET` with a strong random string
- Update `MONGODB_URI` if using a different MongoDB instance
- Change admin credentials before deploying to production

### 4. Add Event Assets

Replace the placeholder images in `/public/images/`:

- **`poster.svg`** → Replace with `poster.png` (Event poster)
- **`icfai_logo.svg`** → Replace with `icfai_logo.png` (University logo)

Images should be:
- **Poster**: 800×1200px (or similar portrait ratio)
- **Logo**: 400×120px (or similar landscape ratio)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "HACK-TO-HIRE website ready"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Configure MongoDB**:
   - Ensure MongoDB Atlas allows connections from Vercel IPs (or allow all: `0.0.0.0/0`)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/idae)

---

## 📂 Project Structure

```
idae/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   ├── api/
│   │   ├── register/
│   │   │   └── route.ts          # Registration endpoint
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts      # Admin login
│   │       └── registrations/
│   │           ├── route.ts      # List registrations
│   │           └── [id]/
│   │               └── route.ts  # Update/Delete registration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── registration-form.tsx     # Main registration form
│   ├── event-details-section.tsx # Event info section
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── mongodb.ts                # MongoDB connection
│   ├── auth.ts                   # Better-auth setup
│   └── auth-client.ts            # Auth client helpers
├── public/
│   └── images/
│       ├── poster.svg            # Event poster (replace with .png)
│       └── icfai_logo.svg        # ICFAI logo (replace with .png)
├── .env.local                    # Environment variables
├── package.json
└── README.md
```

---

## 🔧 Admin Panel Usage

### Access Admin Panel
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with:
   - **Email**: `ABCD1234`
   - **Password**: `qwertypoiu`

### Features
- **Search**: Type team name, reg ID, name, or email
- **Filter**: By domain (Blockchain/AIML/Open Innovation) or status
- **Export**: Download all registrations as CSV
- **Edit**: Click pencil icon to change status
- **Delete**: Click trash icon (requires confirmation)
- **Pagination**: Navigate through pages (10 registrations per page)

---

## 📊 MongoDB Schema

### Registrations Collection
```json
{
  "regId": "H2H-2025-0001",
  "teamName": "Team Gandiva",
  "domain": "Blockchain",
  "leader": {
    "name": "Sujan Ali",
    "id": "IU-2023-001",
    "program": "int.MCA",
    "year": "3rd",
    "email": "sujan@example.com",
    "phone": "+919077255903"
  },
  "members": [
    {
      "name": "Member Name",
      "id": "IU-2023-002",
      "program": "B.Tech CSE",
      "year": "2nd",
      "email": "member@example.com",
      "phone": "+919999999999"
    }
  ],
  "status": "pending",
  "createdAt": "2025-11-12T10:00:00.000Z"
}
```

### Admin Logs Collection
```json
{
  "action": "update_status",
  "registrationId": "673f...",
  "newStatus": "confirmed",
  "adminEmail": "ABCD1234",
  "timestamp": "2025-11-12T11:30:00.000Z"
}
```

---

## 🎨 Customization

### Update Event Details
Edit `/components/event-details-section.tsx`:
```typescript
const details = [
  { icon: Calendar, label: "Date", value: "17th November 2025" },
  { icon: Clock, label: "Time", value: "10:00 AM onwards" },
  { icon: MapPin, label: "Venue", value: "Civil Auditorium" },
  { icon: Phone, label: "Contact", value: "+91 9077255903" },
]
```

### Change Theme Colors
Edit `/app/globals.css` or use Tailwind utilities:
- Primary blue: `#0b2b54`
- Secondary blue: `#1e5a9e`

### Modify Registration Fields
Edit `/components/registration-form.tsx` to add/remove fields.

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### MongoDB Connection Issues
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas network access (allow 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions

### Dependencies Installation
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📄 License

This project is built for **ICFAI University Tripura** internal use.

---

## 👨‍💻 Support

For technical issues or questions:
- **Contact**: +91 9077255903
- **Email**: Use the admin email configured in `.env.local`

---

## 🙏 Acknowledgments

- **Organized by**: Startup Incubation Center & IIC, ICFAI University Tripura
- **In collaboration with**: Trikaya & BeetleX
- **Built with**: Next.js, Tailwind CSS, MongoDB, Framer Motion

---

**Made with ❤️ for HACK-TO-HIRE Ideathon 2025**

© 2025 ICFAI University Tripura. All rights reserved.
