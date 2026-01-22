# Deployment Files

Professional deployment configuration for **christina-sings4you.com.au**.

## 🚀 Quick Start

### Setup Nginx & PM2 dari Awal

**Untuk setup Nginx dan PM2 dari awal (recommended untuk server baru):**

```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/setup-all.sh
sudo ./deployment/scripts/setup-all.sh
```

Atau setup secara terpisah:
- **Setup PM2 saja**: `sudo ./deployment/scripts/setup-pm2.sh`
- **Setup Nginx saja**: `sudo ./deployment/scripts/setup-nginx.sh`

Lihat **[SETUP_NGINX_PM2.md](./SETUP_NGINX_PM2.md)** untuk panduan lengkap.

### Untuk Deployment Pertama Kali

1. **Setup Server** (hanya sekali):
   ```bash
   ssh root@76.13.96.198
   cd /var/www/christina-sings4you
   chmod +x deployment/scripts/setup-server.sh
   sudo ./deployment/scripts/setup-server.sh
   ```

2. **Deploy Aplikasi**:
   ```bash
   # Opsi A: Deploy dari local machine (Recommended)
   ./deployment/scripts/deploy-from-local.sh production
   
   # Opsi B: Deploy langsung di server
   ssh root@76.13.96.198
   cd /var/www/christina-sings4you
   sudo ./deployment/scripts/deploy.sh production
   ```

### Untuk Update Aplikasi

```bash
# Dari local machine (Recommended)
./deployment/scripts/deploy-from-local.sh production

# Atau di server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh production
```

## 📁 File Structure

```
deployment/
├── nginx/
│   └── christina-sings4you.com.au.conf    # Nginx configuration
├── pm2/
│   └── ecosystem.config.js                # PM2 process manager config
├── systemd/
│   └── christina-sings4you.service        # Systemd service (alternative)
├── scripts/
│   ├── setup-all.sh                       # Master setup script (Nginx + PM2)
│   ├── setup-nginx.sh                     # Nginx setup script
│   ├── setup-pm2.sh                       # PM2 setup script
│   ├── setup-server.sh                    # Initial server setup (run once)
│   ├── deploy.sh                          # Deployment automation (on server)
│   ├── deploy-from-local.sh               # Deploy from local machine
│   ├── quick-deploy.sh                    # Quick deploy (no backup)
│   ├── backup.sh                          # Backup script
│   └── health-check.sh                    # Health check script
├── env.production.template                # Environment variables template
├── DEPLOYMENT_GUIDE.md                    # Detailed deployment guide (English)
├── DEPLOY_INDONESIA.md                    # Panduan deployment (Bahasa Indonesia)
├── DEPLOY_CHECKLIST.md                    # Deployment checklist lengkap
├── QUICK_START.md                         # Quick reference guide
├── CHECKLIST.md                           # Basic deployment checklist
├── SYNC_SUMMARY.md                        # Synchronization summary
└── README.md                              # This file
```

## Configuration Files

### Nginx Configuration
- **Location**: `nginx/christina-sings4you.com.au.conf`
- **Features**:
  - SSL/HTTPS with Let's Encrypt
  - Security headers
  - Gzip compression
  - Static file caching
  - API proxy to backend
  - SPA routing support

### PM2 Configuration
- **Location**: `pm2/ecosystem.config.js`
- **Features**:
  - Cluster mode (2 instances)
  - Auto-restart
  - Logging
  - Memory limits

### Systemd Service
- **Location**: `systemd/christina-sings4you.service`
- **Alternative** to PM2 for process management
- Includes security hardening

## Environment Variables

Copy `env.production.template` to `/var/www/christina-sings4you/.env` and configure:

```bash
# Generate secure JWT secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Steps Summary

1. **Server Setup**: Run `setup-server.sh` once
2. **Upload Code**: Upload application to `/var/www/christina-sings4you`
3. **Configure Nginx**: Copy nginx config and enable site
4. **Set Up SSL**: Run `certbot --nginx -d christina-sings4you.com.au`
5. **Configure Environment**: Set up `.env` file
6. **Build & Start**: Run `deploy.sh` or manually build and start

## Maintenance

### Update Application
```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh
```

### View Logs
```bash
# PM2 logs
pm2 logs christina-sings4you-api

# Nginx logs
tail -f /var/log/nginx/christina-sings4you-*.log

# Systemd logs
journalctl -u christina-sings4you -f
```

### Restart Services
```bash
# PM2
pm2 restart christina-sings4you-api

# Systemd
systemctl restart christina-sings4you

# Nginx
systemctl reload nginx
```

## Security Features

✅ SSL/HTTPS with auto-renewal  
✅ Security headers (HSTS, XSS protection, etc.)  
✅ Firewall (UFW) configured  
✅ Process isolation  
✅ Secure file permissions  
✅ Environment variable protection  

## 📚 Documentation

### Bahasa Indonesia (Recommended)
- **DEPLOY_INDONESIA.md** - Panduan deployment lengkap dalam Bahasa Indonesia
- **DEPLOY_CHECKLIST.md** - Checklist deployment yang lengkap
- **CI_CD_SETUP.md** - Setup CI/CD dengan GitHub Actions (Bahasa Indonesia)

### English
- **DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment guide
- **QUICK_START.md** - Quick reference for common tasks
- **CHECKLIST.md** - Basic deployment checklist
- **SYNC_SUMMARY.md** - Summary of all synchronized configurations

## 🔧 Scripts Overview

### setup-all.sh
**Master setup script** - Setup lengkap Nginx dan PM2 dari awal. **Recommended untuk server baru**.

### setup-nginx.sh
Setup Nginx dari awal: install, konfigurasi, SSL setup, firewall. Bisa dijalankan terpisah.

### setup-pm2.sh
Setup PM2 dari awal: install Node.js, PM2, konfigurasi ecosystem, startup script, log rotation. Bisa dijalankan terpisah.

### setup-server.sh
Setup awal server (install Node.js, Nginx, PM2, dll). **Jalankan hanya sekali** saat pertama kali setup server.

### deploy.sh
Script deployment lengkap yang dijalankan di server. Membuat backup, pull code, build, dan restart service.

### deploy-from-local.sh
Script untuk deploy dari local machine. Build di local, lalu sync ke server. **Recommended untuk deployment rutin**.

### quick-deploy.sh
Deployment cepat tanpa backup. Gunakan dengan hati-hati, hanya untuk update kecil.

### backup.sh
Script untuk membuat backup aplikasi. Backup disimpan di `/backup/christina-sings4you/`.

### health-check.sh
Script untuk mengecek status aplikasi, service, dan kesehatan sistem.

### start-pm2.sh
**Script manual untuk start PM2** - Gunakan jika PM2 belum running atau setelah deployment. Script ini akan:
- Mengecek file-file yang diperlukan (dist/server/index.js, node_modules, .env)
- Install dependencies jika belum ada
- Stop dan delete process lama jika ada
- Start PM2 dengan konfigurasi yang benar
- Verifikasi bahwa process berhasil start

**Cara penggunaan:**
```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
bash deployment/scripts/start-pm2.sh
```

### check-deployment.sh
**Script diagnostik untuk mengecek status deployment** - Gunakan untuk troubleshooting jika ada masalah. Script ini akan mengecek:
- Project directory dan file-file penting
- Backend dist files (dist/server/index.js)
- node_modules dan dependencies
- .env files
- ecosystem.config.js
- PM2 status dan process
- Port 4000 usage
- Backend health check
- Nginx status dan config

**Cara penggunaan:**
```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
bash deployment/scripts/check-deployment.sh
```

## Troubleshooting

### PM2 Tidak Running

Jika PM2 tidak running setelah deployment:

1. **Cek status deployment:**
   ```bash
   bash deployment/scripts/check-deployment.sh
   ```

2. **Start PM2 manually:**
   ```bash
   bash deployment/scripts/start-pm2.sh
   ```

3. **Cek logs jika masih error:**
   ```bash
   pm2 logs sing4you-api --lines 50
   ```

### Nginx Config Kosong

Jika nginx config file kosong:

1. **Upload config manual:**
   ```bash
   # Dari local machine
   scp deployment/nginx/christina-sings4you.com.au.conf root@76.13.96.198:/tmp/
   
   # Di server
   sudo cp /tmp/christina-sings4you.com.au.conf /etc/nginx/sites-available/
   sudo ln -sf /etc/nginx/sites-available/christina-sings4you.com.au.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Atau tunggu deployment workflow** yang akan otomatis upload config

## Support

For detailed instructions, see `DEPLOYMENT_GUIDE.md`.  
For quick reference, see `QUICK_START.md`.  
For verification, use `CHECKLIST.md`.
