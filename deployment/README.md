# Deployment Files

Professional deployment configuration for **christina-sings4you.com.au**.

## 🚀 Quick Start

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

## Support

For detailed instructions, see `DEPLOYMENT_GUIDE.md`.  
For quick reference, see `QUICK_START.md`.  
For verification, use `CHECKLIST.md`.
