# Seeding Database dengan Dummy Data

File ini menjelaskan cara menambahkan dummy data ke database untuk melihat tampilan website.

## Cara Menjalankan Seeding

### 1. Pastikan MongoDB sudah dikonfigurasi

Pastikan file `.env` sudah ada dan berisi `MONGODB_URI` dengan password yang benar:

```env
MONGODB_URI=mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u
```

### 2. Jalankan script seeding

```bash
npm run seed
```

Script ini akan:
- ✅ Membuat Hero Settings dengan data default
- ✅ Membuat 4 Performance Sections (Solo, Duo, Wedding, Corporate)
- ✅ Membuat 3 Upcoming Performances
- ✅ Membuat 5 Testimonials
- ✅ Membuat 3 Blog Posts
- ✅ Membuat SEO Settings default
- ✅ Membuat Admin User (jika belum ada)

### 3. Login sebagai Admin

Setelah seeding, Anda bisa login ke admin dashboard:

- **URL**: http://localhost:5173/admin/login
- **Email**: `admin@christinasings4u.com.au`
- **Password**: `admin123`

⚠️ **PENTING**: Ganti password admin setelah login pertama kali!

## Data yang Dibuat

### Hero Settings
- Title: "Christina Sings4U"
- Subtitle: "Professional Singer for Your Special Occasions"
- Background image dari Unsplash

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
5 testimonials dari berbagai event types (Wedding, Corporate, Birthday, Anniversary)

### Blog Posts
3 blog posts dengan konten lengkap:
- Top 10 Wedding Songs for 2024
- The Importance of Live Music at Corporate Events
- Sydney's Best Wedding Venues for Music Performances

## Catatan

- Script akan **menghapus semua data yang ada** sebelum membuat data baru (untuk menghindari duplikasi)
- Jika ingin menambah data tanpa menghapus yang lama, edit file `src/server/scripts/seed.ts` dan comment bagian `deleteMany`
- Semua data menggunakan placeholder images dari Unsplash
- Pastikan server **tidak running** saat seeding, atau seed saat development mode aktif

## Troubleshooting

### Error: MONGODB_URI not configured
Pastikan file `.env` ada di root project dan berisi `MONGODB_URI` dengan format yang benar.

### Error: Cannot connect to MongoDB
1. Pastikan password di `MONGODB_URI` sudah benar
2. Pastikan IP Anda sudah di-whitelist di MongoDB Atlas
3. Pastikan network access di MongoDB Atlas sudah dikonfigurasi

### Data tidak muncul di website
1. Pastikan backend server running (`npm run dev:server` atau `npm run dev`)
2. Hard refresh browser (Ctrl+Shift+R atau Cmd+Shift+R)
3. Cek console browser untuk error