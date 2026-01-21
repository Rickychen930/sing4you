# Deployment Scripts

Koleksi script untuk deployment dan maintenance aplikasi christina-sings4you.com.au.

## 📋 Daftar Script

### 1. setup-server.sh
**Tujuan**: Setup awal server (hanya sekali)  
**Usage**: `sudo ./setup-server.sh`  
**Fungsi**:
- Install Node.js 18.x
- Install Nginx
- Install PM2
- Install Certbot (SSL)
- Install Git dan build tools
- Setup firewall (UFW)
- Buat direktori aplikasi dan log

**Kapan digunakan**: Hanya sekali saat pertama kali setup server baru.

---

### 2. deploy.sh
**Tujuan**: Deployment lengkap di server  
**Usage**: `sudo ./deploy.sh [production|staging]`  
**Fungsi**:
- Buat backup otomatis
- Pull latest code (jika git)
- Install dependencies
- Build frontend & backend
- Set permissions
- Restart service (PM2 atau systemd)
- Reload Nginx
- Health check

**Kapan digunakan**: Untuk deployment rutin di server.

---

### 3. deploy-from-local.sh
**Tujuan**: Deploy dari local machine ke server  
**Usage**: `./deploy-from-local.sh [production|staging]`  
**Fungsi**:
- Build aplikasi di local
- Sync files ke server via rsync
- Jalankan deploy.sh di server
- Health check

**Kapan digunakan**: **Recommended** untuk deployment rutin. Build di local lebih cepat dan bisa test dulu.

**Requirements**:
- SSH access ke server (via key)
- rsync terinstall di local
- Server sudah di-setup

---

### 4. quick-deploy.sh
**Tujuan**: Deployment cepat tanpa backup  
**Usage**: `sudo ./quick-deploy.sh`  
**Fungsi**:
- Pull latest code
- Install dependencies
- Build aplikasi
- Restart service
- Reload Nginx

**Kapan digunakan**: Untuk update kecil yang tidak perlu backup. **Gunakan dengan hati-hati!**

---

### 5. backup.sh
**Tujuan**: Membuat backup aplikasi  
**Usage**: `sudo ./backup.sh`  
**Fungsi**:
- Buat backup archive aplikasi
- Simpan di `/backup/christina-sings4you/`
- Cleanup backup lama (>7 hari)

**Kapan digunakan**: 
- Sebelum deployment besar
- Manual backup
- Setup cron job untuk backup otomatis

---

### 6. health-check.sh
**Tujuan**: Cek kesehatan aplikasi dan sistem  
**Usage**: `./health-check.sh`  
**Fungsi**:
- Cek PM2/Systemd service status
- Cek Nginx status
- Cek backend API response
- Cek SSL certificate
- Cek disk space
- Cek memory usage

**Kapan digunakan**: 
- Setelah deployment
- Troubleshooting
- Monitoring rutin

---

## 🚀 Workflow Deployment

### Deployment Pertama Kali

```bash
# 1. Setup server (hanya sekali)
ssh root@76.13.96.198
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-server.sh

# 2. Setup environment variables
cp deployment/env.production.template .env
nano .env  # Isi dengan nilai sebenarnya

# 3. Setup Nginx
cp deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 4. Setup SSL
certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au

# 5. Deploy aplikasi
sudo ./deployment/scripts/deploy.sh production
```

### Deployment Rutin (Update)

**Opsi A: Dari Local Machine (Recommended)**
```bash
# Dari local machine
cd /path/to/sing4you
./deployment/scripts/deploy-from-local.sh production
```

**Opsi B: Di Server**
```bash
# SSH ke server
ssh root@76.13.96.198
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh production
```

### Quick Update (Tanpa Backup)

```bash
# Di server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/quick-deploy.sh
```

---

## 🔒 Security Notes

- Semua script yang memerlukan root access harus dijalankan dengan `sudo`
- Script `deploy-from-local.sh` memerlukan SSH key authentication
- Pastikan file `.env` tidak ter-commit ke git
- Backup otomatis dibuat sebelum deployment (kecuali quick-deploy)

---

## 📝 Tips

1. **Selalu test build di local** sebelum deploy
2. **Gunakan deploy-from-local.sh** untuk deployment rutin (lebih cepat)
3. **Buat backup manual** sebelum perubahan besar
4. **Jalankan health-check** setelah deployment
5. **Monitor logs** setelah deployment untuk memastikan tidak ada error

---

## 🐛 Troubleshooting

### Script tidak bisa dijalankan
```bash
chmod +x deployment/scripts/*.sh
```

### Permission denied
```bash
# Pastikan menggunakan sudo untuk script yang memerlukan root
sudo ./deployment/scripts/deploy.sh
```

### SSH connection failed
```bash
# Test SSH connection
ssh root@76.13.96.198

# Setup SSH key jika belum
ssh-copy-id root@76.13.96.198
```

### rsync not found
```bash
# Install rsync
# macOS: sudah terinstall default
# Linux: sudo apt install rsync
```

---

## 📚 Dokumentasi Lengkap

Lihat dokumentasi lengkap di:
- `DEPLOY_INDONESIA.md` - Panduan lengkap (Bahasa Indonesia)
- `DEPLOYMENT_GUIDE.md` - Complete guide (English)
- `DEPLOY_CHECKLIST.md` - Checklist deployment
