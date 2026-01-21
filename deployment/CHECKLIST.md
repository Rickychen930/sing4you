# Deployment Checklist - christina-sings4you.com.au

## Pre-Deployment Checklist

### Server Information
- [x] Domain: `christina-sings4you.com.au`
- [x] Server IP: `76.13.96.198`
- [x] SSH: `ssh root@76.13.96.198`
- [ ] DNS A record pointing to `76.13.96.198`
- [ ] DNS A record for `www.christina-sings4you.com.au` pointing to `76.13.96.198`

### Configuration Files Sync Status
- [x] Nginx config: Domain set to `christina-sings4you.com.au`
- [x] PM2 config: Port 3001, app name `christina-sings4you-api`
- [x] Systemd service: Port 3001, working directory `/var/www/christina-sings4you`
- [x] Backend server: Listen on `0.0.0.0` in production
- [x] Source code: Default domain updated to `christina-sings4you.com.au`
- [x] API client: Uses relative URLs in production
- [x] Environment template: Domain set correctly

### Server Setup
- [ ] Node.js 18+ installed
- [ ] Nginx installed and configured
- [ ] PM2 installed globally
- [ ] Certbot installed for SSL
- [ ] Firewall (UFW) configured
- [ ] Application directory created: `/var/www/christina-sings4you`
- [ ] Log directories created: `/var/log/pm2`, `/var/log/nginx`
- [ ] Backup directory created: `/backup/christina-sings4you`

### Application Deployment
- [ ] Application files uploaded to `/var/www/christina-sings4you`
- [ ] `.env` file created with production values
- [ ] Dependencies installed: `npm install --production`
- [ ] Frontend built: `npm run build`
- [ ] Backend built: `npm run build:server`
- [ ] File permissions set: `chown -R www-data:www-data /var/www/christina-sings4you`

### Nginx Configuration
- [ ] Nginx config copied to `/etc/nginx/sites-available/christina-sings4you.com.au`
- [ ] Site enabled: `ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/`
- [ ] Nginx config tested: `nginx -t`
- [ ] SSL certificate obtained: `certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au`
- [ ] Nginx reloaded: `systemctl reload nginx`

### Backend Service
- [ ] PM2 started: `pm2 start deployment/pm2/ecosystem.config.js --env production`
- [ ] PM2 saved: `pm2 save`
- [ ] PM2 startup configured: `pm2 startup`
- [ ] OR Systemd service installed and started

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `CLIENT_URL=https://christina-sings4you.com.au`
- [ ] `SITE_URL=https://christina-sings4you.com.au`
- [ ] `MONGODB_URI` configured with actual password
- [ ] `JWT_SECRET` set to secure random string
- [ ] `JWT_REFRESH_SECRET` set to secure random string
- [ ] `CLOUDINARY_*` variables set (if using)

### Security
- [ ] Firewall enabled: `ufw enable`
- [ ] Ports 22, 80, 443 allowed
- [ ] SSL certificate auto-renewal configured
- [ ] Strong JWT secrets generated
- [ ] `.env` file not in git
- [ ] File permissions secured

### Testing
- [ ] Website accessible: `https://christina-sings4you.com.au`
- [ ] API endpoint working: `https://christina-sings4you.com.au/api/hero`
- [ ] SSL certificate valid
- [ ] Backend logs show no errors
- [ ] Nginx logs show no errors
- [ ] Health check passes

### Monitoring
- [ ] PM2 monitoring: `pm2 monit`
- [ ] Log rotation configured
- [ ] Backup strategy in place
- [ ] Error alerting set up (optional)

## Post-Deployment Verification

### Quick Health Check
```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Check backend health
curl http://localhost:3001/api/hero

# Check website
curl -I https://christina-sings4you.com.au
```

### Log Review
```bash
# PM2 logs
pm2 logs christina-sings4you-api

# Nginx access logs
tail -f /var/log/nginx/christina-sings4you-access.log

# Nginx error logs
tail -f /var/log/nginx/christina-sings4you-error.log
```

## Common Issues & Solutions

### Backend not starting
- Check `.env` file exists and has correct values
- Check MongoDB connection string
- Check port 3001 is not in use: `netstat -tulpn | grep 3001`
- Review PM2 logs: `pm2 logs christina-sings4you-api`

### Nginx errors
- Test config: `nginx -t`
- Check file permissions on `/var/www/christina-sings4you/dist/client`
- Verify SSL certificates: `certbot certificates`

### SSL issues
- Verify DNS is pointing correctly
- Check certificate: `certbot certificates`
- Renew if needed: `certbot renew`

### Database connection
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas network access
- Test connection manually
