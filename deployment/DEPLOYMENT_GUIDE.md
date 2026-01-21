# Deployment Guide - christina-sings4you.com.au

Professional deployment guide for production server setup.

## Server Information

- **Domain**: christina-sings4you.com.au
- **Server IP**: 76.13.96.198
- **SSH**: `ssh root@76.13.96.198`

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Nginx installed
- PM2 installed (recommended) or systemd
- Git installed
- Domain DNS pointing to server IP

## Step 1: Initial Server Setup

### 1.1 Connect to Server

```bash
ssh root@76.13.96.198
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Required Software

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2 (recommended for Node.js process management)
npm install -g pm2

# Install Git
apt install -y git

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install build tools
apt install -y build-essential
```

### 1.4 Create Application Directory

```bash
mkdir -p /var/www/christina-sings4you
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/www/christina-sings4you
chown -R www-data:www-data /var/log/pm2
```

## Step 2: Deploy Application

### 2.1 Clone Repository (or upload files)

```bash
cd /var/www/christina-sings4you
git clone <your-repo-url> .
# OR upload files via SCP/SFTP
```

### 2.2 Install Dependencies

```bash
cd /var/www/christina-sings4you
npm install --production
```

### 2.3 Build Application

```bash
# Build frontend
npm run build

# Build backend
npm run build:server
```

### 2.4 Set Up Environment Variables

```bash
nano /var/www/christina-sings4you/.env
```

Add the following (update with your actual values):

```env
# Server Configuration
NODE_ENV=production
PORT=3001
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# Database Configuration
MONGODB_URI=mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u

# JWT Configuration
JWT_SECRET=your-very-secure-random-secret-key-here
JWT_REFRESH_SECRET=your-very-secure-random-refresh-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Important**: Generate secure random secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Set Permissions

```bash
chown -R www-data:www-data /var/www/christina-sings4you
chmod -R 755 /var/www/christina-sings4you
```

## Step 3: Configure Nginx

### 3.1 Copy Nginx Configuration

```bash
cp /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/christina-sings4you.com.au
```

### 3.2 Enable Site

```bash
ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/
```

### 3.3 Test Nginx Configuration

```bash
nginx -t
```

### 3.4 Set Up SSL with Let's Encrypt

```bash
certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au
```

Follow the prompts. Certbot will automatically:
- Obtain SSL certificates
- Configure Nginx to use HTTPS
- Set up auto-renewal

### 3.5 Reload Nginx

```bash
systemctl reload nginx
systemctl enable nginx
```

## Step 4: Start Backend Service

### Option A: Using PM2 (Recommended)

```bash
cd /var/www/christina-sings4you
pm2 start deployment/pm2/ecosystem.config.js --env production
pm2 save
pm2 startup
```

This will:
- Start the backend in cluster mode (2 instances)
- Auto-restart on crashes
- Save configuration for auto-start on reboot

**PM2 Commands:**
```bash
pm2 status                    # Check status
pm2 logs christina-sings4you-api  # View logs
pm2 restart christina-sings4you-api  # Restart
pm2 stop christina-sings4you-api    # Stop
pm2 monit                     # Monitor resources
```

### Option B: Using Systemd

```bash
# Copy service file
cp /var/www/christina-sings4you/deployment/systemd/christina-sings4you.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Start and enable service
systemctl start christina-sings4you
systemctl enable christina-sings4you

# Check status
systemctl status christina-sings4you

# View logs
journalctl -u christina-sings4you -f
```

## Step 5: Firewall Configuration

```bash
# Install UFW if not installed
apt install -y ufw

# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 6: Verify Deployment

### 6.1 Check Services

```bash
# Check Nginx
systemctl status nginx

# Check PM2 (if using)
pm2 status

# Check Systemd (if using)
systemctl status christina-sings4you
```

### 6.2 Test Website

- Visit: https://christina-sings4you.com.au
- Check API: https://christina-sings4you.com.au/api/hero
- Verify SSL: https://www.ssllabs.com/ssltest/analyze.html?d=christina-sings4you.com.au

### 6.3 Check Logs

```bash
# Nginx logs
tail -f /var/log/nginx/christina-sings4you-access.log
tail -f /var/log/nginx/christina-sings4you-error.log

# PM2 logs
pm2 logs christina-sings4you-api

# Systemd logs
journalctl -u christina-sings4you -f
```

## Step 7: Maintenance & Updates

### 7.1 Update Application

```bash
cd /var/www/christina-sings4you
git pull origin master  # or your branch
npm install --production
npm run build
npm run build:server

# Restart service
pm2 restart christina-sings4you-api
# OR
systemctl restart christina-sings4you
```

### 7.2 SSL Certificate Renewal

Certbot automatically sets up renewal. Test renewal:
```bash
certbot renew --dry-run
```

### 7.3 Backup

Set up regular backups:
```bash
# Backup application
tar -czf /backup/christina-sings4you-$(date +%Y%m%d).tar.gz /var/www/christina-sings4you

# Backup database (if using MongoDB locally)
mongodump --out /backup/mongodb-$(date +%Y%m%d)
```

## Troubleshooting

### Backend Not Starting

1. Check logs: `pm2 logs` or `journalctl -u christina-sings4you`
2. Verify environment variables: `cat /var/www/christina-sings4you/.env`
3. Check port: `netstat -tulpn | grep 3001`
4. Test manually: `cd /var/www/christina-sings4you && node dist/server/index.js`

### Nginx Errors

1. Test config: `nginx -t`
2. Check logs: `tail -f /var/log/nginx/error.log`
3. Verify file permissions: `ls -la /var/www/christina-sings4you/dist/client`

### SSL Issues

1. Check certificate: `certbot certificates`
2. Renew manually: `certbot renew`
3. Verify DNS: `dig christina-sings4you.com.au`

### Database Connection Issues

1. Verify MongoDB URI in `.env`
2. Check MongoDB Atlas network access
3. Test connection: `mongosh "your-connection-string"`

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed and auto-renewal enabled
- [ ] Strong JWT secrets set
- [ ] Environment variables secured (`.env` not in git)
- [ ] Nginx security headers configured
- [ ] Regular backups scheduled
- [ ] SSH key authentication (disable password auth)
- [ ] Fail2ban installed (optional but recommended)

## Performance Optimization

- [ ] Enable Nginx caching for static assets
- [ ] Configure PM2 cluster mode (already done)
- [ ] Set up CDN for static assets (optional)
- [ ] Enable MongoDB connection pooling
- [ ] Monitor with PM2 or system monitoring tools

## Support

For issues or questions, check:
- Application logs: `/var/log/pm2/` or `journalctl`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -xe`
