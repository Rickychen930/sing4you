# Deployment Checklist - christina-sings4you.com.au

Checklist lengkap untuk memastikan deployment berjalan dengan baik.

## ✅ Pre-Deployment Checklist

### 1. Local Development
- [ ] Semua perubahan sudah di-commit ke git
- [ ] Tidak ada file sensitif yang ter-commit (cek dengan `git status`)
- [ ] Aplikasi berjalan dengan baik di local
- [ ] Build berhasil tanpa error (`npm run build` dan `npm run build:server`)
- [ ] Semua test (jika ada) sudah pass

### 2. Security Check
- [ ] File `.env` tidak ter-track di git (cek dengan `git check-ignore .env`)
- [ ] Tidak ada credentials yang hardcoded di source code
- [ ] JWT secrets sudah digenerate dengan random string
- [ ] MongoDB password tidak ada di source code
- [ ] Semua API keys menggunakan environment variables

### 3. Server Preparation
- [ ] SSH access ke server sudah berfungsi
- [ ] Server sudah di-setup (Node.js, Nginx, PM2 terinstall)
- [ ] Firewall sudah dikonfigurasi (port 22, 80, 443)
- [ ] Domain DNS sudah pointing ke server IP

## 🚀 Deployment Steps

### Step 1: Backup (Jika Update)
- [ ] Backup aplikasi saat ini: `./deployment/scripts/backup.sh`
- [ ] Backup database (jika menggunakan local MongoDB)

### Step 2: Deploy Code
- [ ] Pilih metode deployment:
  - [ ] Metode 1: Deploy dari local (`./deployment/scripts/deploy-from-local.sh`)
  - [ ] Metode 2: Deploy di server (`./deployment/scripts/deploy.sh`)

### Step 3: Environment Variables
- [ ] File `.env` sudah ada di server
- [ ] Semua environment variables sudah diisi dengan benar
- [ ] Permission file `.env` sudah benar (600)
- [ ] Owner file `.env` sudah benar (www-data:www-data)

### Step 4: Build & Start
- [ ] Dependencies sudah terinstall
- [ ] Frontend build berhasil
- [ ] Backend build berhasil
- [ ] Service sudah di-start (PM2 atau systemd)

### Step 5: Nginx Configuration
- [ ] Nginx config sudah di-copy ke `/etc/nginx/sites-available/`
- [ ] Site sudah di-enable (symlink ke sites-enabled)
- [ ] Nginx config test berhasil (`nginx -t`)
- [ ] Nginx sudah di-reload

### Step 6: SSL Certificate
- [ ] SSL certificate sudah terinstall
- [ ] Auto-renewal sudah di-setup
- [ ] HTTPS redirect berfungsi

## ✅ Post-Deployment Verification

### 1. Service Status
- [ ] PM2/Systemd service running: `pm2 status` atau `systemctl status`
- [ ] Nginx running: `systemctl status nginx`
- [ ] Health check pass: `./deployment/scripts/health-check.sh`

### 2. Website Access
- [ ] Website accessible via HTTPS: https://christina-sings4you.com.au
- [ ] Website redirect HTTP ke HTTPS
- [ ] SSL certificate valid (tidak ada warning di browser)
- [ ] Frontend loading dengan benar
- [ ] Tidak ada error di console browser

### 3. API Testing
- [ ] API endpoint accessible: https://christina-sings4you.com.au/api/hero
- [ ] API response correct
- [ ] CORS configuration benar
- [ ] Authentication (jika ada) berfungsi

### 4. Functionality Testing
- [ ] Homepage loading
- [ ] Navigation berfungsi
- [ ] Forms bisa submit (contact form, dll)
- [ ] Admin panel accessible (jika ada)
- [ ] File upload berfungsi (jika ada)

### 5. Performance Check
- [ ] Page load time acceptable
- [ ] Images loading dengan baik
- [ ] No 404 errors
- [ ] No 500 errors

### 6. Logs Check
- [ ] No critical errors di PM2 logs
- [ ] No critical errors di Nginx logs
- [ ] No database connection errors
- [ ] No authentication errors

## 🔧 Maintenance Checklist

### Daily
- [ ] Cek logs untuk errors: `pm2 logs` atau `journalctl`
- [ ] Cek disk space: `df -h`
- [ ] Cek memory usage: `free -h` atau `pm2 monit`

### Weekly
- [ ] Review error logs
- [ ] Cek backup berjalan dengan baik
- [ ] Update dependencies (jika perlu)
- [ ] Review security logs

### Monthly
- [ ] Test SSL certificate renewal: `certbot renew --dry-run`
- [ ] Review dan cleanup old backups
- [ ] Update system packages: `apt update && apt upgrade`
- [ ] Review performance metrics

## 🐛 Troubleshooting Checklist

Jika ada masalah, cek:

### Backend Issues
- [ ] Service status: `pm2 status` atau `systemctl status`
- [ ] Logs: `pm2 logs` atau `journalctl -u christina-sings4you`
- [ ] Environment variables: `cat .env`
- [ ] Port availability: `netstat -tulpn | grep 3001`
- [ ] Database connection: test MongoDB connection string

### Frontend Issues
- [ ] Build files exist: `ls -la dist/client`
- [ ] Nginx serving files: `ls -la /var/www/christina-sings4you/dist/client`
- [ ] Nginx config: `nginx -t`
- [ ] Browser console errors
- [ ] Network tab di browser dev tools

### SSL Issues
- [ ] Certificate status: `certbot certificates`
- [ ] Certificate expiry: `openssl x509 -in /etc/letsencrypt/live/christina-sings4you.com.au/cert.pem -noout -dates`
- [ ] DNS records: `dig christina-sings4you.com.au`
- [ ] Nginx SSL config: check nginx config file

### Database Issues
- [ ] MongoDB connection string correct
- [ ] MongoDB Atlas network access (IP whitelist)
- [ ] MongoDB Atlas cluster status
- [ ] Test connection: `mongosh "connection-string"`

## 📝 Notes

- **Backup Location**: `/backup/christina-sings4you/`
- **Logs Location**: 
  - PM2: `/var/log/pm2/`
  - Nginx: `/var/log/nginx/`
  - Systemd: `journalctl -u christina-sings4you`
- **App Directory**: `/var/www/christina-sings4you`
- **Environment File**: `/var/www/christina-sings4you/.env`

## 🆘 Emergency Contacts

Jika ada masalah kritis:
1. Cek logs terlebih dahulu
2. Restart services: `pm2 restart all` dan `systemctl reload nginx`
3. Rollback ke backup sebelumnya jika perlu
4. Contact server administrator jika masalah persist
