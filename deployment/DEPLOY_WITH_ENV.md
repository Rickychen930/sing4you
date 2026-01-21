# 🚀 Deploy dengan .env File

## 📋 Overview

Script deployment sudah di-update untuk handle `.env` file dengan benar. Ada beberapa opsi:

## 🎯 Opsi 1: Deploy dengan Upload .env (RECOMMENDED)

Script khusus untuk deploy dengan upload .env file:

```bash
cd /Users/blackver69/sing4you
./deployment/scripts/deploy-with-env.sh production
```

Script ini akan:
1. ✅ Upload .env file ke server
2. ✅ Set permissions yang benar (600, www-data:www-data)
3. ✅ Build aplikasi lokal
4. ✅ Sync files ke server (exclude .env karena sudah di-upload)
5. ✅ Run deployment script di server
6. ✅ Health check

## 🎯 Opsi 2: Deploy Normal (Auto-detect .env)

Script deployment normal yang akan auto-upload .env jika ada:

```bash
cd /Users/blackver69/sing4you
./deployment/scripts/deploy-from-local.sh production
```

Script ini akan:
- ✅ Cek apakah .env ada di local
- ✅ Jika ada, upload ke server
- ✅ Jika tidak ada, warning (tapi tetap deploy)
- ✅ Build dan sync files
- ✅ Run deployment script di server

## 🎯 Opsi 3: Deploy di Server (GitHub Actions / Manual)

Jika deploy via GitHub Actions atau manual di server:

### GitHub Actions
- ✅ Sudah handle .env via GitHub Secrets (line 218-246 di `.github/workflows/deploy.yml`)
- ✅ .env dibuat dari GitHub Secrets saat deployment

### Manual di Server
```bash
# Di server
cd /var/www/christina-sings4you

# Pastikan .env ada
ls -la .env

# Jika tidak ada, buat:
sudo ./deployment/scripts/create-env-on-server.sh

# Deploy
sudo ./deployment/scripts/deploy.sh production
```

## 📝 How to Use

### 1. Make Sure .env File Exists Locally

```bash
cd /Users/blackver69/sing4you
ls -la .env
```

### 2. Deploy with .env

```bash
# Option A: Special script with .env
./deployment/scripts/deploy-with-env.sh production

# Option B: Normal script (auto-detect)
./deployment/scripts/deploy-from-local.sh production
```

### 3. Verify on Server

```bash
# SSH to server
ssh root@72.61.214.25

# Check .env file
cd /var/www/christina-sings4you
cat .env | grep JWT_SECRET

# Check PM2 logs
pm2 logs christina-sings4you-api --lines 20
```

## 🔒 Security Notes

1. **.env file tidak di-commit ke git** (sudah di .gitignore)
2. **.env di-exclude dari rsync** (di-upload terpisah dengan scp)
3. **Permissions otomatis di-set** (600, www-data:www-data)
4. **Backup .env** sebelum deployment (di deploy.sh)

## 🔧 Troubleshooting

### Error: .env file not found

```bash
# Make sure .env exists locally
cd /Users/blackver69/sing4you
ls -la .env

# If not exists, copy from template or create new
cp deployment/env.production.template .env
# Edit .env and fill with correct values
```

### Error: Permission denied when uploading .env

```bash
# Make sure SSH key is set up
ssh root@72.61.214.25 "echo 'SSH connection OK'"

# Or use password authentication
```

### .env not uploaded

```bash
# Check if upload was successful
ssh root@72.61.214.25 "ls -la /var/www/christina-sings4you/.env"

# If not exists, upload manually:
scp .env root@72.61.214.25:/var/www/christina-sings4you/.env
ssh root@72.61.214.25 "chmod 600 /var/www/christina-sings4you/.env && chown www-data:www-data /var/www/christina-sings4you/.env"
```

### JWT_SECRET still error after deploy

```bash
# On server, check .env
cat /var/www/christina-sings4you/.env | grep JWT_SECRET

# Make sure format is correct (no spaces, no quotes)
# Must be: JWT_SECRET=64characterhexstring

# Rebuild and restart
cd /var/www/christina-sings4you
npm run build:server
pm2 restart christina-sings4you-api
```

## 📋 Checklist Deployment

- [ ] .env file ada di local dengan nilai yang benar
- [ ] JWT_SECRET sudah di-set (bukan default)
- [ ] JWT_REFRESH_SECRET sudah di-set (bukan default)
- [ ] MONGODB_URI sudah benar
- [ ] Deploy script dijalankan
- [ ] .env ter-upload ke server
- [ ] Permissions .env sudah benar (600, www-data:www-data)
- [ ] Build berhasil
- [ ] PM2 restart berhasil
- [ ] Health check passed
- [ ] Tidak ada error di PM2 logs

## 🚀 Quick Deploy Command

```bash
# Deploy dengan .env (one command)
cd /Users/blackver69/sing4you && ./deployment/scripts/deploy-with-env.sh production
```
