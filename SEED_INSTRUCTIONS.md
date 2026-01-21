# Seeding Database with Dummy Data

This file explains how to add dummy data to the database to view the website.

## How to Run Seeding

### 1. Ensure MongoDB is configured

Make sure the `.env` file exists and contains `MONGODB_URI` with the correct password:

```env
MONGODB_URI=mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u
```

### 2. Run the seeding script

```bash
npm run seed
```

This script will:
- ✅ Create Hero Settings with default data
- ✅ Create 4 Performance Sections (Solo, Duo, Wedding, Corporate)
- ✅ Create 3 Upcoming Performances
- ✅ Create 5 Testimonials
- ✅ Create 3 Blog Posts
- ✅ Create default SEO Settings
- ✅ Create Admin User (if not exists)

### 3. Login as Admin

After seeding, you can login to the admin dashboard:

- **URL**: http://localhost:5173/admin/login
- **Email**: `admin@christinasings4u.com.au`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the admin password after first login!

## Data Created

### Hero Settings
- Title: "Christina Sings4U"
- Subtitle: "Professional Singer for Your Special Occasions"
- Background image from Unsplash

### Performance Sections
1. **Solo Performances** - $500 - $1,500
2. **Duo Performances** - $800 - $2,000
3. **Wedding Ceremonies** - $1,200 - $3,000
4. **Corporate Events** - $1,000 - $2,500

### Upcoming Performances
- Jazz Night at Opera Bar (Feb 15, 2024)
- Wedding Showcase Event (Feb 20, 2024)
- Corporate Gala Dinner (Mar 1, 2024)

### Testimonials
5 testimonials from various event types (Wedding, Corporate, Birthday, Anniversary)

### Blog Posts
3 blog posts with complete content:
- Top 10 Wedding Songs for 2024
- The Importance of Live Music at Corporate Events
- Sydney's Best Wedding Venues for Music Performances

## Notes

- The script will **delete all existing data** before creating new data (to avoid duplication)
- If you want to add data without deleting the old ones, edit the file `src/server/scripts/seed.ts` and comment out the `deleteMany` section
- All data uses placeholder images from Unsplash
- Make sure the server is **not running** during seeding, or seed when development mode is active

## Troubleshooting

### Error: MONGODB_URI not configured
Make sure the `.env` file exists in the project root and contains `MONGODB_URI` with the correct format.

### Error: Cannot connect to MongoDB
1. Make sure the password in `MONGODB_URI` is correct
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Make sure network access in MongoDB Atlas is configured

### Data does not appear on the website
1. Make sure the backend server is running (`npm run dev:server` or `npm run dev`)
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the browser console for errors
