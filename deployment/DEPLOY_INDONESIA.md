# Panduan Deployment - christina-sings4you.com.au

Panduan lengkap untuk deploy aplikasi ke server production dalam bahasa Indonesia.

## 📋 Informasi Server

- **Domain**: christina-sings4you.com.au
- **Server IP**: 76.13.96.198
- **SSH**: `ssh root@76.13.96.198`
- **Direktori Aplikasi**: `/var/www/christina-sings4you`

## 🚀 Metode Deployment

Ada 2 metode deployment yang bisa digunakan:

### Metode 1: Deploy dari Local Machine (Recommended)

Menggunakan script `deploy-from-local.sh` untuk build di local dan sync ke server.

```bash
# 1. Pastikan Anda sudah login ke server via SSH key
ssh root@76.13.96.198

# 2. Dari local machine, jalankan:
cd /path/to/sing4you
chmod +x deployment/scripts/deploy-from-local.sh
./deployment/scripts/deploy-from-local.sh production
```

**Keuntungan:**
- Build dilakukan di local (lebih cepat)
- Bisa test build sebelum deploy
- File yang tidak perlu tidak di-upload

### Metode 2: Deploy Langsung di Server

Menggunakan git pull atau upload manual, lalu build di server.

```bash
# 1. SSH ke server
ssh root@76.13.96.198

# 2. Masuk ke direktori aplikasi
cd /var/www/christina-sings4you

# 3. Pull latest code (jika menggunakan git)
git pull origin master

# 4. Jalankan script deploy
chmod +x deployment/scripts/deploy.sh
sudo ./deployment/scripts/deploy.sh production
```

## 📝 Setup Awal (Hanya Sekali)

Jika ini pertama kali deploy, ikuti langkah-langkah berikut:

### 1. Setup Server (Hanya Sekali)

```bash
# SSH ke server
ssh root@76.13.96.198

# Upload file setup-server.sh ke server, lalu:
chmod +x setup-server.sh
sudo ./deployment/scripts/setup-server.sh
```

Script ini akan menginstall:
- Node.js 18.x
- Nginx
- PM2
- Certbot (untuk SSL)
- Git
- Build tools
- Firewall (UFW)

### 2. Upload Aplikasi ke Server

**Opsi A: Menggunakan Git (Recommended)**

```bash
# Di server
cd /var/www
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
```

**Opsi B: Menggunakan SCP/RSYNC**

```bash
# Dari local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@76.13.96.198:/var/www/christina-sings4you/
```

### 3. Setup Environment Variables

```bash
# Di server
cd /var/www/christina-sings4you
cp deployment/env.production.template .env
nano .env
```

Isi file `.env` dengan nilai yang sebenarnya:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# Database Configuration
MONGODB_URI=mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority

# JWT Configuration
# Generate secret dengan: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

**PENTING:** Set permission file `.env`:
```bash
chmod 600 .env
chown www-data:www-data .env
```

### 4. Install Dependencies & Build

```bash
cd /var/www/christina-sings4you
npm install --production
npm run build
npm run build:server
```

### 5. Setup Nginx

```bash
# Copy config nginx
cp deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/christina-sings4you.com.au

# Enable site
ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload nginx
systemctl reload nginx
```

### 6. Setup SSL Certificate

```bash
# Install SSL dengan Let's Encrypt
certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au

# Test auto-renewal
certbot renew --dry-run
```

### 7. Start Backend dengan PM2

```bash
cd /var/www/christina-sings4you
pm2 start deployment/pm2/ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 8. Setup Firewall

```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
ufw status
```

## 🔄 Deployment Rutin (Update Aplikasi)

Setelah setup awal selesai, untuk update aplikasi cukup jalankan:

### Menggunakan Script Deploy

```bash
# Di server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh production
```

Script ini akan:
1. Membuat backup otomatis
2. Pull latest code (jika menggunakan git)
3. Install dependencies
4. Build frontend & backend
5. Restart service
6. Health check

### Atau dari Local Machine

```bash
# Dari local machine
./deployment/scripts/deploy-from-local.sh production
```

## 🔍 Monitoring & Troubleshooting

### Cek Status Aplikasi

```bash
# PM2 status
pm2 status
pm2 logs christina-sings4you-api

# Nginx status
systemctl status nginx
tail -f /var/log/nginx/christina-sings4you-access.log
tail -f /var/log/nginx/christina-sings4you-error.log

# Health check
cd /var/www/christina-sings4you
./deployment/scripts/health-check.sh
```

### Restart Services

```bash
# Restart backend
pm2 restart christina-sings4you-api

# Restart nginx
systemctl reload nginx

# Restart semua
pm2 restart all && systemctl reload nginx
```

### Cek Logs

```bash
# PM2 logs
pm2 logs christina-sings4you-api --lines 100

# Nginx logs
tail -f /var/log/nginx/christina-sings4you-*.log

# System logs
journalctl -u christina-sings4you -f
```

## 💾 Backup

### Manual Backup

```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/backup.sh
```

### Backup Otomatis (Cron Job)

Tambahkan ke crontab untuk backup harian:

```bash
# Edit crontab
crontab -e

# Tambahkan baris ini (backup setiap hari jam 2 pagi)
0 2 * * * /var/www/christina-sings4you/deployment/scripts/backup.sh
```

## 🔒 Security Checklist

Sebelum deploy, pastikan:

- [ ] File `.env` tidak di-commit ke git
- [ ] File `.env` memiliki permission 600
- [ ] JWT secrets menggunakan random string yang kuat
- [ ] MongoDB password tidak hardcoded
- [ ] SSL certificate sudah terinstall
- [ ] Firewall sudah dikonfigurasi
- [ ] SSH key authentication sudah setup (disable password auth)
- [ ] Regular backup sudah dijadwalkan

## 🐛 Troubleshooting

### Backend Tidak Start

1. Cek logs: `pm2 logs christina-sings4you-api`
2. Cek environment variables: `cat .env`
3. Cek port: `netstat -tulpn | grep 3001`
4. Test manual: `cd /var/www/christina-sings4you && node dist/server/index.js`

### Nginx Error

1. Test config: `nginx -t`
2. Cek logs: `tail -f /var/log/nginx/error.log`
3. Cek permission: `ls -la /var/www/christina-sings4you/dist/client`

### SSL Issues

1. Cek certificate: `certbot certificates`
2. Renew manual: `certbot renew`
3. Cek DNS: `dig christina-sings4you.com.au`

### Database Connection Error

1. Cek MongoDB URI di `.env`
2. Cek MongoDB Atlas network access (whitelist IP server)
3. Test connection: `mongosh "your-connection-string"`

## 📚 File Penting

- **Nginx Config**: `/etc/nginx/sites-available/christina-sings4you.com.au`
- **Environment**: `/var/www/christina-sings4you/.env`
- **PM2 Config**: `/var/www/christina-sings4you/deployment/pm2/ecosystem.config.js`
- **Logs**: `/var/log/pm2/` dan `/var/log/nginx/`
- **Backups**: `/backup/christina-sings4you/`

## 🆘 Support

Jika ada masalah:
1. Cek logs terlebih dahulu
2. Jalankan health check script
3. Review dokumentasi di `DEPLOYMENT_GUIDE.md`
4. Cek checklist di `SECURITY_CHECKLIST.md`
