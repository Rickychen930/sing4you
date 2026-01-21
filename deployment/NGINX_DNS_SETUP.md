# Setup Nginx and DNS - Domain Still Showing Hostinger

## 🔍 Problem

Domain `https://www.christina-sings4you.com.au/` is still showing Hostinger page (parked domain) because:

1. **DNS not pointed to server** - Domain still using Hostinger nameserver
2. **Nginx not configured on server** - Configuration file not copied and enabled
3. **SSL not setup** - Certificate not installed

## ✅ Complete Solution

### Step 1: Setup DNS in Hostinger

1. **Login to Hostinger** (https://hpanel.hostinger.com/)
2. **Go to Domain Management** → Select domain `christina-sings4you.com.au`
3. **Change DNS Records**:
   - **A Record**: 
     - Name: `@` (or empty)
     - Value: `72.61.214.25` (Your server IP)
     - TTL: 3600
   - **A Record** (for www):
     - Name: `www`
     - Value: `72.61.214.25`
     - TTL: 3600
4. **Save changes**
5. **Wait for DNS propagation** (can take 5 minutes - 48 hours, usually 1-2 hours)

**Note**: If using Hostinger nameserver, use A Records. If you want to use your own server nameserver, change nameserver at registrar.

### Step 2: Setup Nginx on Server

**SSH to server:**
```bash
ssh root@72.61.214.25
```

**Copy nginx configuration file:**
```bash
# Make sure configuration file exists on server
cd /var/www/christina-sings4you

# Copy nginx configuration file
sudo cp deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/christina-sings4you.com.au
```

**Enable site:**
```bash
# Create symlink to sites-enabled
sudo ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default
```

**Test nginx configuration:**
```bash
# Test configuration
sudo nginx -t
```

**If test succeeds, reload nginx:**
```bash
sudo systemctl reload nginx
```

**Verify nginx is running:**
```bash
sudo systemctl status nginx
```

### Step 3: Verify

**Check DNS propagation:**
```bash
# From local machine or server
dig christina-sings4you.com.au
dig www.christina-sings4you.com.au

# Or use online tool:
# https://www.whatsmydns.net/#A/christina-sings4you.com.au
```

**Check nginx status:**
```bash
sudo systemctl status nginx
sudo nginx -t
```

**Check if application is running:**
```bash
# Check PM2
pm2 list

# Check port 3001
netstat -tuln | grep 3001

# Test health endpoint
curl http://localhost:3001/api/health
```

**Test from browser:**
- HTTP: http://christina-sings4you.com.au
- HTTPS: https://christina-sings4you.com.au
- www: https://www.christina-sings4you.com.au

## 🔧 Troubleshooting

### DNS still not propagated

```bash
# Check DNS from various locations
dig @8.8.8.8 christina-sings4you.com.au
dig @1.1.1.1 christina-sings4you.com.au

# Clear local DNS cache (if on Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Nginx error

```bash
# Check error log
sudo tail -f /var/log/nginx/error.log

# Check configuration
sudo nginx -t

# Check if port 80 and 443 are open
sudo ufw status
sudo netstat -tuln | grep -E ':(80|443)'
```

### Application not accessible

```bash
# Check if application is running
pm2 list
pm2 logs christina-sings4you-api

# Check if port 3001 is listening
netstat -tuln | grep 3001

# Test API directly
curl http://localhost:3001/api/health
```

### Still showing Hostinger

1. **Clear browser cache** or use incognito mode
2. **Check DNS is correct** - must point to `72.61.214.25`
3. **Wait for DNS propagation** - can take 1-48 hours
4. **Check nginx is running** and configuration is correct
5. **Check firewall** - port 80 and 443 must be open

## 📋 Checklist

- [ ] DNS A Record set in Hostinger (pointing to `72.61.214.25`)
- [ ] DNS has propagated (check with `dig` or online tool)
- [ ] Nginx config file copied to `/etc/nginx/sites-available/`
- [ ] Site enabled (symlink in `/etc/nginx/sites-enabled/`)
- [ ] Nginx config test successful (`nginx -t`)
- [ ] Nginx reloaded (`systemctl reload nginx`)
- [ ] Application is running (PM2 or systemd)
- [ ] Port 80 and 443 are open in firewall
- [ ] Domain accessible from browser

## 🚀 Quick Setup Script

Buat script untuk automate setup nginx:

```bash
#!/bin/bash
# setup-nginx.sh

APP_DIR="/var/www/christina-sings4you"
NGINX_CONF="$APP_DIR/deployment/nginx/christina-sings4you.com.au.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/christina-sings4you.com.au"
NGINX_ENABLED="/etc/nginx/sites-enabled/christina-sings4you.com.au"

# Copy config
sudo cp "$NGINX_CONF" "$NGINX_AVAILABLE"

# Enable site
sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"

# Remove default
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Nginx configured successfully!"
```

Simpan sebagai `deployment/scripts/setup-nginx.sh` dan jalankan:
```bash
chmod +x deployment/scripts/setup-nginx.sh
sudo ./deployment/scripts/setup-nginx.sh
```
