# Inisialisasi Server - Quick Start

Jika direktori `/var/www/christina-sings4you` belum ada, ikuti langkah berikut:

## 🚀 Quick Fix

### Opsi 1: Menggunakan Script (Recommended)

```bash
# Di server
cd /root
# Upload file init-server.sh ke server, lalu:
chmod +x init-server.sh
sudo ./init-server.sh
```

Script ini akan:
- ✅ Membuat direktori `/var/www/christina-sings4you`
- ✅ Membuat direktori log dan backup
- ✅ Set permissions yang benar
- ✅ Membuat template file `.env`

### Opsi 2: Manual

```bash
# Di server
sudo mkdir -p /var/www/christina-sings4you
sudo mkdir -p /var/log/pm2
sudo mkdir -p /backup/christina-sings4you

# Set permissions
sudo chown -R www-data:www-data /var/www/christina-sings4you
sudo chown -R www-data:www-data /var/log/pm2
sudo chmod -R 755 /var/www/christina-sings4you

# Verifikasi
ls -la /var/www/christina-sings4you
```

## 📋 Langkah Selanjutnya

Setelah direktori dibuat:

### 1. Upload Aplikasi ke Server

**Opsi A: Menggunakan Git**
```bash
cd /var/www
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
```

**Opsi B: Menggunakan SCP/RSYNC (dari local machine)**
```bash
# Dari local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@76.13.96.198:/var/www/christina-sings4you/
```

### 2. Setup Environment Variables

```bash
cd /var/www/christina-sings4you
cp deployment/env.production.template .env
nano .env  # Update dengan nilai sebenarnya
chmod 600 .env
chown www-data:www-data .env
```

### 3. Setup Server Lengkap

```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-server.sh
```

### 4. Deploy Aplikasi

```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh production
```

## ✅ Verifikasi

```bash
# Cek direktori sudah ada
ls -la /var/www/christina-sings4you

# Cek permissions
ls -ld /var/www/christina-sings4you
# Harus menunjukkan: drwxr-xr-x www-data www-data
```

## 🆘 Troubleshooting

### Permission Denied
```bash
sudo chown -R www-data:www-data /var/www/christina-sings4you
sudo chmod -R 755 /var/www/christina-sings4you
```

### Directory masih tidak ada setelah script
```bash
# Cek apakah script berjalan dengan sudo
sudo ./init-server.sh

# Atau buat manual
sudo mkdir -p /var/www/christina-sings4you
```
