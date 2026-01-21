# Quick Start - Deployment

## Server Info
- **Domain**: christina-sings4you.com.au
- **SSH**: `ssh root@76.13.96.198`
- **App Directory**: `/var/www/christina-sings4you`

## One-Time Setup (First Time)

```bash
# 1. Connect to server
ssh root@76.13.96.198

# 2. Run initial setup
cd /var/www/christina-sings4you
chmod +x deployment/scripts/setup-server.sh
sudo ./deployment/scripts/setup-server.sh

# 3. Upload/copy application files to /var/www/christina-sings4you

# 4. Configure environment
cp deployment/env.production.template .env
nano .env  # Update with your actual values

# 5. Install dependencies and build
npm install --production
npm run build
npm run build:server

# 6. Set up Nginx
cp deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/
nginx -t

# 7. Set up SSL
certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au

# 8. Start backend with PM2
pm2 start deployment/pm2/ecosystem.config.js --env production
pm2 save
pm2 startup

# 9. Reload Nginx
systemctl reload nginx
```

## Regular Deployment (Updates)

```bash
# On server
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh
```

## Useful Commands

```bash
# Check status
pm2 status
systemctl status nginx

# View logs
pm2 logs christina-sings4you-api
tail -f /var/log/nginx/christina-sings4you-access.log

# Restart
pm2 restart christina-sings4you-api
systemctl reload nginx

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Important Files

- Nginx config: `/etc/nginx/sites-available/christina-sings4you.com.au`
- Environment: `/var/www/christina-sings4you/.env`
- App directory: `/var/www/christina-sings4you`
- Logs: `/var/log/pm2/` and `/var/log/nginx/`
