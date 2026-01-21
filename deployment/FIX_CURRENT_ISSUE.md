# Fix: Script Not Found Issue

## 🔍 Masalah

Direktori sudah dibuat, tapi file aplikasi belum di-upload ke server, sehingga script tidak ditemukan.

## ✅ Solusi Cepat

### Langkah 1: Upload Aplikasi ke Server

**Dari Local Machine (buka terminal baru):**

```bash
# Pastikan Anda di direktori project
cd /Users/blackver69/sing4you

# Upload menggunakan rsync
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  --exclude '*.log' \
  ./ root@72.61.214.25:/var/www/christina-sings4you/
```

**Atau gunakan script yang sudah disediakan:**
```bash
cd /Users/blackver69/sing4you
./deployment/QUICK_UPLOAD.sh
```

### Langkah 2: Set Permissions di Server

**Kembali ke SSH session:**
```bash
# Di server
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/*.sh
sudo chown -R www-data:www-data .
```

### Langkah 3: Verifikasi

```bash
# Di server
cd /var/www/christina-sings4you
ls -la  # Harus ada file-file aplikasi
ls -la deployment/scripts/  # Harus ada script-script
```

### Langkah 4: Lanjutkan Setup

```bash
# Di server
cd /var/www/christina-sings4you

# Setup server lengkap
sudo ./deployment/scripts/setup-server.sh

# Atau jika hanya perlu setup GitHub Actions
sudo ./deployment/scripts/setup-github-actions.sh
```

## 🚀 Alternatif: Menggunakan Git

Jika repository sudah di GitHub:

```bash
# Di server
cd /var/www
rm -rf christina-sings4you  # Hapus direktori kosong
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
sudo chmod +x deployment/scripts/*.sh
```

## 📋 Checklist

- [ ] File aplikasi sudah di-upload ke server
- [ ] Script sudah executable: `chmod +x deployment/scripts/*.sh`
- [ ] Permissions sudah benar: `chown -R www-data:www-data .`
- [ ] Verifikasi file ada: `ls -la deployment/scripts/`
- [ ] Script bisa dijalankan: `sudo ./deployment/scripts/setup-server.sh`

## 🆘 Masih Error?

### File tidak muncul setelah upload
```bash
# Cek apakah upload berhasil
ls -la /var/www/christina-sings4you

# Jika masih kosong, coba upload lagi dengan verbose
rsync -avz --progress -v ./ root@72.61.214.25:/var/www/christina-sings4you/
```

### Permission denied
```bash
# Pastikan direktori bisa di-write
sudo chmod 755 /var/www/christina-sings4you
sudo chown root:root /var/www/christina-sings4you
```

### Script masih tidak ditemukan
```bash
# Pastikan path benar
cd /var/www/christina-sings4you
pwd  # Harus menunjukkan /var/www/christina-sings4you
ls deployment/scripts/  # Harus ada file-file .sh
```
