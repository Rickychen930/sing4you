# 📤 Upload .env File to Server

## 🚀 Option 1: Create .env Directly on Server (RECOMMENDED)

This is more secure because it doesn't require transferring sensitive files over the network.

### Copy-Paste Script to Server

Run on server SSH:

```bash
cd /var/www/christina-sings4you

# Generate secrets dan buat .env
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Buat .env file
cat > .env << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=3001
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# Database Configuration
# IMPORTANT: Replace <db_password> with your actual MongoDB Atlas password
MONGODB_URI=mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=REPLACE_WITH_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_REFRESH_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EOF

# Replace JWT secrets
sed -i "s|JWT_SECRET=REPLACE_WITH_SECRET|JWT_SECRET=$JWT_SECRET|" .env
sed -i "s|JWT_REFRESH_SECRET=REPLACE_WITH_REFRESH_SECRET|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" .env

# Set permissions
chmod 600 .env
chown www-data:www-data .env

echo "✅ .env file created!"
echo "⚠️  Don't forget to update MONGODB_URI with your actual password!"
```

### Or Use Helper Script

Upload script `deployment/scripts/create-env-on-server.sh` to server, then:

```bash
# On server
chmod +x deployment/scripts/create-env-on-server.sh
sudo ./deployment/scripts/create-env-on-server.sh
```

## 📤 Option 2: Upload .env from Local to Server

**⚠️ WARNING: Only do this if you're sure the .env file locally is correct and secure!**

### Upload dengan SCP

```bash
cd /Users/blackver69/sing4you

# Upload .env ke server
scp .env root@72.61.214.25:/var/www/christina-sings4you/.env

# Set permissions di server
ssh root@72.61.214.25 "chmod 600 /var/www/christina-sings4you/.env && chown www-data:www-data /var/www/christina-sings4you/.env"
```

### Upload dengan RSYNC

```bash
cd /Users/blackver69/sing4you
rsync -avz --progress .env root@72.61.214.25:/var/www/christina-sings4you/
```

## ✅ After Upload, Verify on Server

```bash
# SSH to server
ssh root@72.61.214.25

# Check .env file
cd /var/www/christina-sings4you
ls -la .env

# Check contents (make sure JWT_SECRET is set)
cat .env | grep JWT_SECRET

# Set permissions if not already set
chmod 600 .env
chown www-data:www-data .env

# Rebuild and restart
npm run build:server
pm2 delete christina-sings4you-api
pm2 start deployment/pm2/ecosystem.config.cjs --env production
pm2 save
```

## 🔧 Update MONGODB_URI

After .env is created, don't forget to update MONGODB_URI:

```bash
# On server
nano /var/www/christina-sings4you/.env

# Replace <db_password> with actual MongoDB Atlas password
# Example:
# MONGODB_URI=mongodb+srv://sings4you:YourActualPassword123@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority
```

## 📋 Checklist

- [ ] .env file created on server
- [ ] JWT_SECRET is set (64 character hex)
- [ ] JWT_REFRESH_SECRET is set (64 character hex)
- [ ] MONGODB_URI updated (replace <db_password>)
- [ ] NODE_ENV=production
- [ ] Permissions correct (600, www-data:www-data)
- [ ] Code rebuilt (`npm run build:server`)
- [ ] PM2 restarted
- [ ] No errors in PM2 logs

## 🆘 Troubleshooting

### Error: Permission denied when uploading

```bash
# Make sure using correct SSH key or password
# Or create .env directly on server (Option 1)
```

### .env file doesn't appear on server

```bash
# Check if upload was successful
ls -la /var/www/christina-sings4you/.env

# If not exists, create directly on server
```

### JWT_SECRET still error after upload

```bash
# Make sure .env file is readable
cat /var/www/christina-sings4you/.env | grep JWT_SECRET

# Make sure format is correct (no spaces, no quotes)
# Must be: JWT_SECRET=64characterhexstring

# Rebuild and restart
npm run build:server
pm2 restart christina-sings4you-api
```
