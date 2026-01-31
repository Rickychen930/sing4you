# User Flows & Perbaikan (PM/Designer)

## Ringkasan flow utama

| Tujuan user | Flow yang disarankan |
|-------------|----------------------|
| **Lihat & booking layanan** | Home → **Services** (nav) → Pilih kategori → Pilih paket/variation → Book via WhatsApp / Contact |
| **Lihat event/pertunjukan** | Home → **Performances** → Pilih event → Get Tickets / Get Location / **Contact Us** |
| **Tanya-tanya dulu** | Home → **FAQ** → (opsional) **Contact** |
| **Langsung hubungi** | Home / Footer / CTA → **Contact** (form atau WhatsApp/Email) |

---

## Masalah yang ditemukan & perbaikan

### 1. **Breadcrumb vs navigasi tidak selaras**
- **Masalah:** Nav pakai label **"Services"** (`/categories`), tapi breadcrumb pakai **"Categories"** / **"Performance Categories"**. User bingung: "Saya klik Services, kok di breadcrumb tertulis Categories?"
- **Perbaikan:**
  - **CategoriesPage:** Breadcrumb sekarang **Home > Services** (current).
  - **VariationsPage:** **Home > Services > [Nama kategori]**.
  - **VariationDetailPage:** **Home > Services > [Kategori] > [Variation]**.
  - Semua **Back** dari flow Services pakai label **"Back to Services"** (bukan "Back to Categories").
- **Dampak:** Satu istilah **"Services"** dari nav sampai breadcrumb, flow lebih jelas.

### 2. **Performance Detail: tidak ada jalan ke Contact**
- **Masalah:** Di halaman detail event hanya ada "Get Tickets" dan "Get Location". User yang mau tanya atau booking lewat situs tidak dapat aksi langsung ke Contact.
- **Perbaikan:** Tombol **"Contact Us"** (link ke `/contact`) ditambah di baris aksi yang sama dengan Get Tickets dan Get Location.
- **Dampak:** Satu tempat untuk: beli tiket, lihat lokasi, dan hubungi untuk tanya/booking.

### 3. **404: jalan keluar terbatas**
- **Masalah:** Di 404 hanya ada "Go to Homepage" dan "Go Back". Kalau user salah URL, opsi lain (cari layanan, hubungi) kurang kentara.
- **Perbaikan:** Tambah **"Or try:"** dengan link **Browse Services** (`/categories`) dan **Contact Us** (`/contact`).
- **Dampak:** User yang tersesat punya dua jalan jelas: jelajah layanan atau langsung kontak.

### 4. **Intro halaman Services**
- **Masalah:** Teks "Select a category to see available packages..." kurang menjelaskan hubungan antara "Services" (nav) dan "category".
- **Perbaikan:** Diperjelas jadi: *"Our services are organised by performance style. Select a category to see packages, pricing, and book."*
- **Dampak:** User paham bahwa kategori = gaya pertunjukan di bawah Services.

---

## Perbaikan lanjutan (fase 2)

### 5. **Contact form dengan konteks (query params)**
- **Perbaikan:**
  - URL `/contact?interest=...` (dari halaman paket/variation) → field Message diisi: *"I'm interested in [nama paket]. Please send me more details."*
  - URL `/contact?event=...` (dari halaman performance/event) → field Message diisi: *"I have a question about "[nama event]"."*
  - Prefill hanya sekali per kunjungan halaman; jika user mengosongkan message, teks tidak di-overwrite saat navigasi.
- **Asal link:** Tombol "Ask Questions" di Variation Detail → `/contact?interest=...`; tombol "Contact Us" di Performance Detail → `/contact?event=...`.

### 6. **Footer "Home Sections" lebih jelas**
- **Perbaikan:** Setiap link di "Home Sections" punya `title` dan `aria-label` yang menjelaskan bahwa link mengarah ke **scroll ke section di Home**, mis. "Scroll to Services section on home page". User paham bedanya dengan nav "Services" (halaman penuh `/categories`).

### 7. **Contact success: langkah berikutnya**
- **Perbaikan:** Setelah form Contact berhasil dikirim, ditampilkan blok sukses plus **"What would you like to do next?"** dengan link **Browse Services** (`/categories`) dan **View Performances** (`/performances`). User punya aksi jelas tanpa harus cari dari nav.

### 8. **Back button konsisten**
- **Perbaikan:** Di halaman Performance Detail, tombol Back pakai label **"Back to Performances"** (selaras dengan "Back to Services" di flow Services). Di About CTA, tombol "Contact Me" pakai `font-sans` dan ikon `flex-shrink-0` agar konsisten dengan design system.

---

## Rekomendasi ke depan (opsional)

- **Deep link variation:** URL `/variations/:id` sudah didukung; breadcrumb "Services > [Category] > [Variation]" dan Back ke kategori sudah konsisten.

---

*Terakhir diperbarui: Jan 2026 — audit flow & perbaikan sebagai PM/Designer.*
