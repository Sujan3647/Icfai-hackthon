# 📦 MongoDB to Firebase Data Migration Guide

## ✅ Code Migration Complete!

All code has been successfully migrated to use Firebase Firestore. Now you need to migrate your existing data.

## 🔄 Option 1: Manual Data Migration (Recommended for Small Datasets)

If you have a small number of registrations, you can manually re-register them through the form.

## 🔄 Option 2: Automated Data Migration (For Existing MongoDB Data)

### Step 1: Export Data from MongoDB

#### Using MongoDB Compass (GUI Tool):
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB URI:
   ```
   mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon
   ```
3. Navigate to: `ideathon` database → `registrations` collection
4. Click **"Export Data"** → Select **JSON**
5. Save as `mongodb-export.json`

#### Using MongoDB CLI:
```bash
# Install MongoDB Database Tools if not installed
# https://www.mongodb.com/try/download/database-tools

# Export to JSON
mongoexport --uri="mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon" \
  --collection=registrations \
  --out=mongodb-export.json \
  --jsonArray
```

### Step 2: Create Migration Script

Create a file `migrate-data.js` in your project root:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData() {
  try {
    // Read MongoDB export
    const mongoData = JSON.parse(fs.readFileSync('./mongodb-export.json', 'utf8'));
    
    console.log(`Found ${mongoData.length} documents to migrate`);
    
    const batch = db.batch();
    let count = 0;
    
    for (const doc of mongoData) {
      // Remove MongoDB _id field
      const { _id, ...cleanDoc } = doc;
      
      // Add to Firestore batch
      const docRef = db.collection('registrations').doc();
      batch.set(docRef, cleanDoc);
      
      count++;
      
      // Commit batch every 500 documents (Firestore limit)
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Migrated ${count} documents...`);
      }
    }
    
    // Commit remaining documents
    if (count % 500 !== 0) {
      await batch.commit();
    }
    
    console.log(`✅ Successfully migrated ${count} documents!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
```

### Step 3: Run Migration Script

1. **Download Firebase Service Account JSON:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Project Settings → Service Accounts → Generate New Private Key
   - Save as `firebase-service-account.json` in project root

2. **Run the migration:**
   ```bash
   node migrate-data.js
   ```

3. **Clean up sensitive files:**
   ```bash
   rm firebase-service-account.json
   rm mongodb-export.json
   rm migrate-data.js
   ```

## 🔄 Option 3: Firebase Import Tool (Advanced)

### Step 1: Export from MongoDB in Firestore-compatible format

Create `export-for-firebase.js`:

```javascript
const { MongoClient } = require('mongodb');
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://sujan:45789@sujan.moz7hj7.mongodb.net/ideathon';

async function exportData() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('ideathon');
  const registrations = await db.collection('registrations').find({}).toArray();
  
  // Convert to Firestore format
  const firestoreData = {
    __collections__: {
      registrations: {}
    }
  };
  
  registrations.forEach(doc => {
    const { _id, ...data } = doc;
    const docId = _id.toString();
    
    firestoreData.__collections__.registrations[docId] = {
      __doc__: data
    };
  });
  
  fs.writeFileSync('firestore-import.json', JSON.stringify(firestoreData, null, 2));
  console.log('✅ Export complete!');
  await client.close();
}

exportData();
```

### Step 2: Import to Firestore

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Import data
firebase firestore:import firestore-import.json --project your-project-id
```

## 🧪 Verify Migration

### Check in Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Check the `registrations` collection
5. Verify all documents are present

### Check in Your Application:
1. Run your app locally: `pnpm dev`
2. Go to Admin Panel: `http://localhost:3000/admin`
3. Login and verify all registrations appear
4. Check that the count matches

## 📊 Data Structure Comparison

### MongoDB Document:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "regId": "H2H-2025-0001",
  "teamName": "Team Alpha",
  "domain": "AIML",
  "createdAt": "2025-11-12T10:30:00.000Z",
  ...
}
```

### Firebase Document:
```json
{
  "regId": "H2H-2025-0001",
  "teamName": "Team Alpha",
  "domain": "AIML",
  "createdAt": "2025-11-12T10:30:00.000Z",
  ...
}
```

**Note:** Firebase auto-generates document IDs, so `_id` is removed.

## ⚠️ Important Notes

1. **ID Field Change:**
   - MongoDB: `_id` (ObjectId)
   - Firebase: Auto-generated document ID (accessed via `doc.id`)

2. **No Data Loss:**
   - All fields except `_id` are preserved
   - Registration IDs (`regId`) remain the same

3. **Security:**
   - Delete service account JSON file after migration
   - Never commit sensitive files to Git

4. **Testing:**
   - Test migration with a few documents first
   - Verify in Firebase Console before deploying

## 🚀 After Migration

1. ✅ Verify data in Firebase Console
2. ✅ Test admin panel functionality
3. ✅ Test registration form
4. ✅ Deploy to Vercel with Firebase credentials
5. ✅ Delete old MongoDB cluster (optional, after confirming everything works)

## 🆘 Troubleshooting

### "Collection not found"
- Make sure Firestore database is created in Firebase Console

### "Permission denied"
- Check Firebase security rules
- Verify service account has proper permissions

### "Invalid credentials"
- Ensure `.env.local` has correct Firebase credentials
- Verify service account JSON is valid

### "Documents missing"
- Check migration script ran successfully
- Verify in Firebase Console
- Check for any error messages during migration

---

**Need help?** Check [Firestore Documentation](https://firebase.google.com/docs/firestore)
