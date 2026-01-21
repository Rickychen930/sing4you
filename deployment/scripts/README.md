# Deployment Scripts

Koleksi script untuk deployment dan maintenance aplikasi christina-sings4you.com.au.

## 📋 Daftar Script

### 1. init-server.sh ⭐ NEW
**Tujuan**: Setup lengkap server dari awal (hanya sekali)  
**Usage**: `sudo ./init-server.sh` (di server)  
**Fungsi**:
- Update system packages
- Install Node.js (LTS)
- Install Nginx
- Install PM2
- Setup firewall (UFW)
- Setup fail2ban
- Create application directories
- Create .env template

**Kapan digunakan**: Hanya sekali saat pertama kali setup server baru.

---

### 2. setup-pm2.sh ⭐ NEW
**Tujuan**: Setup PM2 di server  
**Usage**: `sudo ./setup-pm2.sh` (di server)  
**Fungsi**:
- Install PM2 globally (jika belum)
- Create log directories
- Setup PM2 startup script
- Save PM2 process list

**Kapan digunakan**: Setelah init-server atau jika PM2 belum di-setup.

---

### 3. deploy-to-server.sh ⭐ NEW
**Tujuan**: Deploy dari local machine ke server (Recommended)  
**Usage**: `./deploy-to-server.sh [server_ip] [server_user]`  
**Fungsi**:
- Build aplikasi di local (frontend + backend)
- Create deployment package
- Upload ke server via SCP
- Extract dan install dependencies
- Setup PM2
- Start/restart aplikasi
- Health check

**Kapan digunakan**: **Recommended** untuk deployment rutin dari local machine.

**Example**:
```bash
./deploy-to-server.sh 76.13.96.198 root
```

---

### 4. check-pm2-status.sh ⭐ NEW
**Tujuan**: Check PM2 status di remote server  
**Usage**: `./check-pm2-status.sh [server_ip] [server_user]`  
**Fungsi**:
- Check PM2 process list
- Show process details
- Show recent logs
- Show system resources

**Kapan digunakan**: Untuk monitoring dan troubleshooting.

---

### 5. update-nginx-pm2.sh ⭐ NEW
**Tujuan**: Update Nginx dan PM2 dari local machine  
**Usage**: `./update-nginx-pm2.sh [server_ip] [server_user]`  
**Fungsi**:
- Update system packages
- Update Nginx ke versi terbaru
- Update PM2 ke versi terbaru
- Test dan reload Nginx
- Save PM2 process list

**Kapan digunakan**: Untuk update Nginx dan PM2 secara rutin dari local machine.

---

### 6. update-nginx-pm2-on-server.sh ⭐ NEW
**Tujuan**: Update Nginx dan PM2 langsung di server  
**Usage**: `sudo ./update-nginx-pm2-on-server.sh` (di server)  
**Fungsi**:
- Update system packages
- Update Nginx ke versi terbaru
- Update PM2 ke versi terbaru
- Test dan reload Nginx
- Save PM2 process list
- Show detailed status

**Kapan digunakan**: Untuk update Nginx dan PM2 langsung di server.

---

### 7. setup-nginx-config.sh ⭐ NEW
**Tujuan**: Setup/update Nginx configuration  
**Usage**: `sudo ./setup-nginx-config.sh` (di server)  
**Fungsi**:
- Copy Nginx config ke sites-available
- Create symlink di sites-enabled
- Backup existing config
- Test configuration
- Reload Nginx

**Kapan digunakan**: Untuk setup atau update Nginx configuration.

---

### 8. setup-server.sh
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

**Opsi A: Menggunakan Script Baru (Recommended)**

```bash
# 1. Setup server (hanya sekali)
ssh root@76.13.96.198
bash /tmp/init-server.sh
# Atau upload dulu: scp deployment/scripts/init-server.sh root@76.13.96.198:/tmp/

# 2. Setup environment variables
ssh root@76.13.96.198
cd /var/www/christina-sings4you
cp .env.template .env
nano .env  # Isi dengan nilai sebenarnya

# 3. Deploy aplikasi dari local
cd /path/to/sing4you
./deployment/scripts/deploy-to-server.sh

# 4. Setup Nginx
ssh root@76.13.96.198
cp /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/christina-sings4you.com.au.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 5. Setup SSL (optional)
certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au
```

**Opsi B: Manual Setup**

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

**Opsi A: Menggunakan deploy-to-server.sh (Recommended) ⭐**
```bash
# Dari local machine
cd /path/to/sing4you
./deployment/scripts/deploy-to-server.sh
```

**Opsi B: Menggunakan deploy-from-local.sh**
```bash
# Dari local machine
cd /path/to/sing4you
./deployment/scripts/deploy-from-local.sh production
```

**Opsi C: Di Server**
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
- `DEPLOYMENT_QUICK_START.md` ⭐ - Quick start guide (Bahasa Indonesia)
- `DEPLOY_INDONESIA.md` - Panduan lengkap (Bahasa Indonesia)
- `DEPLOYMENT_GUIDE.md` - Complete guide (English)
- `DEPLOY_CHECKLIST.md` - Checklist deployment

## 🆕 Script Baru

Script-script baru yang sudah dibuat:
- ✅ `init-server.sh` - Setup server lengkap
- ✅ `setup-pm2.sh` - Setup PM2
- ✅ `deploy-to-server.sh` - Deploy dari local ke server
- ✅ `check-pm2-status.sh` - Check PM2 status remote
