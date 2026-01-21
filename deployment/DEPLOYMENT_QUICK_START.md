# 🚀 Quick Start Deployment Guide

Panduan cepat untuk deploy aplikasi sing4you ke server production.

## 📋 Prerequisites

1. **Server sudah siap** dengan IP: `76.13.96.198`
2. **SSH access** ke server sebagai root
3. **Local machine** sudah terinstall Node.js dan npm

## 🎯 Langkah-langkah Deployment

### 1. Setup Server (Hanya sekali, pertama kali)

Jalankan script ini di server untuk setup environment:

```bash
# SSH ke server
ssh root@76.13.96.198

# Upload dan jalankan init script
# (atau copy-paste isi dari deployment/scripts/init-server.sh)
```

Atau jalankan langsung dari local:

```bash
# Upload init script ke server
scp deployment/scripts/init-server.sh root@76.13.96.198:/tmp/

# SSH dan jalankan
ssh root@76.13.96.198 "bash /tmp/init-server.sh"
```

Script ini akan:
- ✅ Update system packages
- ✅ Install Node.js (LTS)
- ✅ Install Nginx
- ✅ Install PM2
- ✅ Setup firewall
- ✅ Setup fail2ban
- ✅ Create directories

### 2. Setup Environment Variables

Buat file `.env` di server:

```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
cp .env.template .env
nano .env
```

Isi dengan konfigurasi yang benar:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key untuk JWT (generate random string)
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CLOUDINARY_*` - Jika menggunakan Cloudinary

### 3. Deploy Application

Dari local machine, jalankan:

```bash
cd /path/to/sing4you
./deployment/scripts/deploy-to-server.sh
```

Atau dengan custom server:

```bash
./deployment/scripts/deploy-to-server.sh 76.13.96.198 root
```

Script ini akan:
- ✅ Build aplikasi (frontend + backend)
- ✅ Upload ke server
- ✅ Install dependencies
- ✅ Setup PM2
- ✅ Start/restart aplikasi
- ✅ Health check

### 4. Setup PM2 (Jika belum)

Jika PM2 belum di-setup:

```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
bash deployment/scripts/setup-pm2.sh
```

### 5. Setup Nginx

Copy konfigurasi Nginx:

```bash
ssh root@76.13.96.198
cp /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/christina-sings4you.com.au.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🔧 Management Commands

### PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs christina-sings4you-api

# Restart
pm2 restart christina-sings4you-api

# Stop
pm2 stop christina-sings4you-api

# Monitor
pm2 monit

# Save process list
pm2 save
```

### Deployment Commands

```bash
# Deploy dari local
./deployment/scripts/deploy-to-server.sh

# Quick deploy (tanpa backup)
ssh root@76.13.96.198 "cd /var/www/christina-sings4you && bash deployment/scripts/quick-deploy.sh"

# Full deploy (dengan backup)
ssh root@76.13.96.198 "cd /var/www/christina-sings4you && bash deployment/scripts/deploy.sh"
```

## 📝 Checklist Deployment

- [ ] Server sudah di-setup (init-server.sh)
- [ ] File .env sudah dibuat dan dikonfigurasi
- [ ] MongoDB connection sudah di-test
- [ ] Aplikasi sudah di-deploy
- [ ] PM2 process sudah running
- [ ] Nginx sudah dikonfigurasi
- [ ] SSL certificate sudah di-setup (jika menggunakan HTTPS)
- [ ] Domain sudah pointing ke server IP
- [ ] Health check berhasil

## 🐛 Troubleshooting

### PM2 Process Tidak Running

```bash
ssh root@76.13.96.198
pm2 logs christina-sings4you-api
pm2 describe christina-sings4you-api
```

### Port 3001 Tidak Listening

```bash
netstat -tuln | grep 3001
# Atau
ss -tuln | grep 3001
```

### Check Nginx Logs

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Check Application Logs

```bash
tail -f /var/log/pm2/christina-sings4you-error.log
tail -f /var/log/pm2/christina-sings4you-out.log
```

## 📞 Support

Jika ada masalah, check:
1. PM2 logs: `pm2 logs christina-sings4you-api`
2. Nginx logs: `/var/log/nginx/error.log`
3. Application logs: `/var/log/pm2/`
4. Server logs: `journalctl -u nginx`
