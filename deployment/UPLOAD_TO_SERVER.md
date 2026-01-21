# Upload Aplikasi ke Server

Panduan untuk upload aplikasi ke server setelah direktori dibuat.

## 🚀 Metode Upload

### Metode 1: Menggunakan Git (Recommended)

Jika repository sudah di GitHub:

```bash
# Di server
cd /var/www
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
```

**Contoh:**
```bash
cd /var/www
git clone https://github.com/yourusername/sing4you.git christina-sings4you
cd christina-sings4you
```

### Metode 2: Menggunakan SCP (dari Local Machine)

```bash
# Dari local machine (di terminal baru, jangan tutup SSH session)
cd /path/to/sing4you
scp -r . root@72.61.214.25:/var/www/christina-sings4you/
```

**Atau dengan rsync (lebih baik, exclude node_modules):**
```bash
# Dari local machine
cd /path/to/sing4you
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  --exclude '*.log' \
  ./ root@72.61.214.25:/var/www/christina-sings4you/
```

### Metode 3: Menggunakan SFTP (FileZilla, WinSCP, dll)

1. Connect ke server: `sftp://root@72.61.214.25`
2. Navigate ke `/var/www/christina-sings4you`
3. Upload semua file (kecuali `node_modules`, `.git`, `dist`)

## ✅ Setelah Upload

### 1. Set Permissions

```bash
# Di server
cd /var/www/christina-sings4you
sudo chown -R www-data:www-data .
sudo chmod +x deployment/scripts/*.sh
```

### 2. Setup Environment Variables

```bash
# Di server
cd /var/www/christina-sings4you
cp deployment/env.production.template .env
nano .env  # Update dengan nilai sebenarnya
chmod 600 .env
chown www-data:www-data .env
```

### 3. Setup Server (Jika Belum)

```bash
# Di server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-server.sh
```

### 4. Setup GitHub Actions (Jika Menggunakan CI/CD)

```bash
# Di server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-github-actions.sh
```

## 🔍 Verifikasi

```bash
# Di server
cd /var/www/christina-sings4you
ls -la  # Harus ada file-file aplikasi
ls -la deployment/scripts/  # Harus ada script-script
```

## 📝 Quick Command (Dari Local)

Jika menggunakan rsync dari local machine:

```bash
# Pastikan Anda di direktori project
cd /Users/blackver69/sing4you

# Upload ke server
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  ./ root@72.61.214.25:/var/www/christina-sings4you/
```

Setelah upload selesai, kembali ke SSH session dan lanjutkan setup.

## ⚠️ Troubleshooting

### File tidak muncul setelah upload

```bash
# Di server, cek apakah file sudah ada
cd /var/www/christina-sings4you
ls -la

# Jika masih kosong, cek permissions
ls -ld /var/www/christina-sings4you
```

### Permission denied saat upload

```bash
# Pastikan direktori bisa di-write
sudo chmod 755 /var/www/christina-sings4you
```

### Script tidak bisa dijalankan

```bash
# Set executable permission
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/*.sh
```
