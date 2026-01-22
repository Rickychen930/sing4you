# Setup Nginx & PM2 dari Awal

Panduan lengkap untuk setup Nginx dan PM2 dari awal untuk aplikasi **sing4you**.

## 📋 Prerequisites

- Server Ubuntu/Debian
- Akses root/sudo
- Domain name sudah di-point ke server IP

## 🚀 Quick Start

### Opsi 1: Setup Otomatis (Recommended)

Jalankan script master yang akan setup semua:

```bash
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/setup-all.sh
sudo ./deployment/scripts/setup-all.sh
```

### Opsi 2: Setup Manual (Step by Step)

#### Step 1: Setup PM2

```bash
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/setup-pm2.sh
sudo ./deployment/scripts/setup-pm2.sh
```

Script ini akan:
- ✅ Install Node.js 20.x (jika belum ada)
- ✅ Install PM2 globally
- ✅ Create log directories
- ✅ Setup PM2 ecosystem config
- ✅ Configure PM2 startup script
- ✅ Setup log rotation

#### Step 2: Setup Nginx

```bash
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/setup-nginx.sh
sudo ./deployment/scripts/setup-nginx.sh
```

Script ini akan:
- ✅ Install Nginx (jika belum ada)
- ✅ Copy nginx configuration
- ✅ Enable site
- ✅ Remove default site
- ✅ Test configuration
- ✅ Start/Reload Nginx
- ✅ Setup firewall rules
- ✅ Install Certbot (optional)

## 📝 Manual Setup (Tanpa Script)

### 1. Install PM2

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Setup PM2 startup
sudo pm2 startup systemd
# Jalankan command yang ditampilkan
```

### 2. Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 3. Copy Nginx Configuration

```bash
# Copy config
sudo cp /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf \
        /etc/nginx/sites-available/christina-sings4you.com.au.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/christina-sings4you.com.au.conf \
           /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au

# Test auto-renewal
sudo certbot renew --dry-run
```

### 5. Setup Firewall

```bash
# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall (jika belum)
sudo ufw enable
```

## 🔧 Konfigurasi

### PM2 Configuration

File: `/var/www/christina-sings4you/ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'sing4you-api',
    script: './dist/server/server.js',
    cwd: '/var/www/christina-sings4you',
    instances: 1,
    exec_mode: 'fork',
    env_file: 'server/.env',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
    },
    // ... lainnya
  }],
};
```

### Nginx Configuration

File: `/etc/nginx/sites-available/christina-sings4you.com.au.conf`

- Frontend: Serve dari `/var/www/christina-sings4you/build` atau `/var/www/christina-sings4you/current`
- Backend API: Proxy ke `http://localhost:4000`
- SSL: Let's Encrypt certificates
- Security headers: HSTS, XSS protection, dll

## 📦 Setup Environment Variables

```bash
cd /var/www/christina-sings4you
cp deployment/env.production.template server/.env
nano server/.env
```

Edit dengan konfigurasi yang benar:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Generate dengan `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `PORT`: 4000 (default)
- `CLIENT_URL`: https://christina-sings4you.com.au
- dll

## 🚀 Deploy & Start Application

### Build Application

```bash
cd /var/www/christina-sings4you
npm install
npm run build
npm run build:server
```

### Start dengan PM2

```bash
cd /var/www/christina-sings4you
pm2 start ecosystem.config.js
pm2 save
```

### Verify

```bash
# Check PM2
pm2 status
pm2 logs sing4you-api

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/christina-sings4you-error.log

# Test API
curl http://localhost:4000/api/health
```

## 🔍 Troubleshooting

### PM2 tidak start

```bash
# Check logs
pm2 logs sing4you-api --lines 50

# Check process
pm2 describe sing4you-api

# Restart
pm2 restart sing4you-api
```

### Nginx error

```bash
# Test config
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/christina-sings4you-error.log

# Check status
sudo systemctl status nginx
```

### Port sudah digunakan

```bash
# Check port 4000
sudo lsof -i:4000

# Kill process
sudo kill -9 $(sudo lsof -ti:4000)
```

### Permission issues

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/christina-sings4you
sudo chmod -R 755 /var/www/christina-sings4you

# Fix log directory
sudo chown -R $USER:$USER /var/log/pm2
sudo chmod -R 755 /var/log/pm2
```

## 📚 Useful Commands

### PM2 Commands

```bash
pm2 list                    # List semua processes
pm2 status                  # Status semua processes
pm2 logs sing4you-api       # View logs
pm2 restart sing4you-api    # Restart app
pm2 stop sing4you-api       # Stop app
pm2 delete sing4you-api     # Delete app
pm2 save                    # Save current process list
pm2 startup                 # Setup startup script
pm2 monit                   # Monitor resources
```

### Nginx Commands

```bash
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload config
sudo systemctl restart nginx # Restart nginx
sudo systemctl status nginx # Check status
sudo tail -f /var/log/nginx/christina-sings4you-error.log # View error log
```

### SSL Commands

```bash
sudo certbot certificates   # List certificates
sudo certbot renew          # Renew certificates
sudo certbot renew --dry-run # Test renewal
```

## 🔐 Security Checklist

- ✅ SSL/HTTPS enabled
- ✅ Firewall configured (UFW)
- ✅ Security headers set
- ✅ PM2 running as non-root user
- ✅ File permissions set correctly
- ✅ Environment variables protected
- ✅ Logs rotated
- ✅ Auto-restart configured

## 📞 Support

Jika ada masalah:
1. Check logs: `pm2 logs` dan `sudo tail -f /var/log/nginx/*.log`
2. Verify config: `sudo nginx -t` dan `pm2 describe sing4you-api`
3. Check status: `pm2 status` dan `sudo systemctl status nginx`
