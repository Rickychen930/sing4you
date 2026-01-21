# Server Initialization - Quick Start

If the `/var/www/christina-sings4you` directory doesn't exist, follow these steps:

## 🚀 Quick Fix

### Option 1: Using Script (Recommended)

```bash
# On server
cd /root
# Upload init-server.sh file to server, then:
chmod +x init-server.sh
sudo ./init-server.sh
```

This script will:
- ✅ Create directory `/var/www/christina-sings4you`
- ✅ Create log and backup directories
- ✅ Set correct permissions
- ✅ Create `.env` template file

### Option 2: Manual

```bash
# On server
sudo mkdir -p /var/www/christina-sings4you
sudo mkdir -p /var/log/pm2
sudo mkdir -p /backup/christina-sings4you

# Set permissions
sudo chown -R www-data:www-data /var/www/christina-sings4you
sudo chown -R www-data:www-data /var/log/pm2
sudo chmod -R 755 /var/www/christina-sings4you

# Verify
ls -la /var/www/christina-sings4you
```

## 📋 Next Steps

After directory is created:

### 1. Upload Application to Server

**Option A: Using Git**
```bash
cd /var/www
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
```

**Option B: Using SCP/RSYNC (from local machine)**
```bash
# From local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@76.13.96.198:/var/www/christina-sings4you/
```

### 2. Setup Environment Variables

```bash
cd /var/www/christina-sings4you
cp deployment/env.production.template .env
nano .env  # Update with actual values
chmod 600 .env
chown www-data:www-data .env
```

### 3. Complete Server Setup

```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-server.sh
```

### 4. Deploy Application

```bash
cd /var/www/christina-sings4you
sudo ./deployment/scripts/deploy.sh production
```

## ✅ Verification

```bash
# Check directory exists
ls -la /var/www/christina-sings4you

# Check permissions
ls -ld /var/www/christina-sings4you
# Should show: drwxr-xr-x www-data www-data
```

## 🆘 Troubleshooting

### Permission Denied
```bash
sudo chown -R www-data:www-data /var/www/christina-sings4you
sudo chmod -R 755 /var/www/christina-sings4you
```

### Directory still doesn't exist after script
```bash
# Check if script ran with sudo
sudo ./init-server.sh

# Or create manually
sudo mkdir -p /var/www/christina-sings4you
```
