# Setup CI/CD dengan GitHub Actions

Panduan lengkap untuk setup Continuous Integration/Continuous Deployment (CI/CD) menggunakan GitHub Actions.

## 📋 Overview

CI/CD akan otomatis:
- ✅ Build aplikasi saat push ke branch `master`/`main`
- ✅ Run linter dan test
- ✅ Deploy ke server production
- ✅ Health check setelah deploy
- ✅ Support manual trigger

## 🚀 Setup GitHub Secrets

Sebelum menggunakan CI/CD, Anda perlu setup GitHub Secrets di repository settings.

### Cara Setup GitHub Secrets

1. Buka repository di GitHub
2. Klik **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Tambahkan secrets berikut:

### Required Secrets

#### 1. SSH_PRIVATE_KEY
**Deskripsi**: Private SSH key untuk akses ke server  
**Cara mendapatkan**:
```bash
# Di local machine, generate SSH key jika belum ada
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Copy private key (akan digunakan sebagai secret)
cat ~/.ssh/github_actions_deploy

# Copy public key ke server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@76.13.96.198
```

**Value**: Isi dengan isi file private key (mulai dari `-----BEGIN OPENSSH PRIVATE KEY-----`)

#### 2. SERVER_HOST
**Deskripsi**: IP address atau hostname server  
**Value**: `76.13.96.198`

#### 3. SERVER_USER
**Deskripsi**: Username untuk SSH  
**Value**: `root`

#### 4. CLIENT_URL
**Deskripsi**: URL frontend  
**Value**: `https://christina-sings4you.com.au`

#### 5. SITE_URL
**Deskripsi**: URL website (tanpa https://)  
**Value**: `christina-sings4you.com.au`

#### 6. MONGODB_URI
**Deskripsi**: MongoDB connection string  
**Value**: `mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority`

#### 7. JWT_SECRET
**Deskripsi**: JWT secret key  
**Cara generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Value**: Hasil dari command di atas

#### 8. JWT_REFRESH_SECRET
**Deskripsi**: JWT refresh secret key  
**Cara generate**: Sama seperti JWT_SECRET (gunakan nilai berbeda)  
**Value**: Random string yang berbeda dari JWT_SECRET

### Optional Secrets (Jika menggunakan)

#### 9. CLOUDINARY_CLOUD_NAME
**Deskripsi**: Cloudinary cloud name  
**Value**: Cloud name dari Cloudinary dashboard

#### 10. CLOUDINARY_API_KEY
**Deskripsi**: Cloudinary API key  
**Value**: API key dari Cloudinary dashboard

#### 11. CLOUDINARY_API_SECRET
**Deskripsi**: Cloudinary API secret  
**Value**: API secret dari Cloudinary dashboard

#### 12. SMTP_HOST
**Deskripsi**: SMTP server host  
**Value**: `smtp.gmail.com` (atau SMTP server lain)

#### 13. SMTP_PORT
**Deskripsi**: SMTP server port  
**Value**: `587`

#### 14. SMTP_USER
**Deskripsi**: SMTP username/email  
**Value**: Email untuk SMTP

#### 15. SMTP_PASS
**Deskripsi**: SMTP password/app password  
**Value**: Password atau app password untuk SMTP

#### 16. SMTP_FROM
**Deskripsi**: Email pengirim  
**Value**: Email yang akan muncul sebagai pengirim

## 📝 Checklist Setup

- [ ] SSH key sudah di-generate
- [ ] Public key sudah di-copy ke server
- [ ] Test SSH connection: `ssh -i ~/.ssh/github_actions_deploy root@76.13.96.198`
- [ ] Semua GitHub Secrets sudah di-setup
- [ ] Server sudah di-setup (Node.js, Nginx, PM2)
- [ ] Direktori `/var/www/christina-sings4you` sudah ada
- [ ] Deployment script sudah executable di server

## 🔄 Workflow Files

### 1. `.github/workflows/deploy.yml`
Workflow untuk deploy ke production saat push ke `master`/`main`.

**Trigger**:
- Push ke branch `master` atau `main`
- Manual trigger via GitHub Actions UI

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run linter
5. Build frontend & backend
6. Upload artifacts
7. Deploy ke server
8. Health check

### 2. `.github/workflows/deploy-staging.yml`
Workflow untuk deploy ke staging saat push ke `develop`/`staging`.

**Trigger**:
- Push ke branch `develop` atau `staging`
- Manual trigger

### 3. `.github/workflows/ci.yml`
Workflow untuk CI (lint, test, build) pada setiap PR dan push.

**Trigger**:
- Pull request ke `master`/`main`/`develop`
- Push ke `master`/`main`/`develop`

## 🚀 Cara Menggunakan

### Deploy Otomatis

1. **Push ke branch master/main**:
   ```bash
   git add .
   git commit -m "Update aplikasi"
   git push origin master
   ```

2. **CI/CD akan otomatis**:
   - Build aplikasi
   - Deploy ke server
   - Health check

3. **Cek status**:
   - Buka tab **Actions** di GitHub repository
   - Lihat workflow run status

### Deploy Manual

1. Buka repository di GitHub
2. Klik tab **Actions**
3. Pilih workflow **Deploy to Production**
4. Klik **Run workflow**
5. Pilih branch dan klik **Run workflow**

## 🔍 Monitoring Deployment

### Di GitHub

1. Buka tab **Actions**
2. Klik pada workflow run terbaru
3. Lihat logs untuk setiap step
4. Cek apakah semua step berhasil (✅) atau gagal (❌)

### Di Server

```bash
# SSH ke server
ssh root@76.13.96.198

# Cek PM2 status
pm2 status

# Cek logs
pm2 logs christina-sings4you-api

# Health check
curl https://christina-sings4you.com.au/api/hero
```

## 🐛 Troubleshooting

### Deployment Gagal: SSH Connection Failed

**Masalah**: GitHub Actions tidak bisa connect ke server via SSH

**Solusi**:
1. Pastikan SSH_PRIVATE_KEY sudah benar di GitHub Secrets
2. Pastikan public key sudah di-copy ke server:
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@76.13.96.198
   ```
3. Test SSH connection manual:
   ```bash
   ssh -i ~/.ssh/github_actions_deploy root@76.13.96.198
   ```

### Deployment Gagal: Permission Denied

**Masalah**: Script tidak bisa dijalankan karena permission

**Solusi**:
```bash
# Di server, pastikan script executable
ssh root@76.13.96.198
chmod +x /var/www/christina-sings4you/deployment/scripts/*.sh
```

### Deployment Gagal: Build Error

**Masalah**: Build gagal di GitHub Actions

**Solusi**:
1. Cek logs di GitHub Actions
2. Test build di local:
   ```bash
   npm ci
   npm run build
   npm run build:server
   ```
3. Fix error yang muncul

### Health Check Gagal

**Masalah**: Health check gagal setelah deploy

**Solusi**:
1. Cek apakah aplikasi running:
   ```bash
   ssh root@76.13.96.198
   pm2 status
   ```
2. Cek logs untuk error:
   ```bash
   pm2 logs christina-sings4you-api
   ```
3. Cek environment variables:
   ```bash
   cat /var/www/christina-sings4you/.env
   ```

## 🔒 Security Best Practices

1. **Jangan commit secrets** ke repository
2. **Gunakan GitHub Secrets** untuk semua data sensitif
3. **Rotate SSH keys** secara berkala
4. **Monitor GitHub Actions logs** untuk aktivitas mencurigakan
5. **Limit access** ke repository (hanya yang perlu)
6. **Review workflow files** sebelum merge

## 📚 Referensi

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

## 🆘 Support

Jika ada masalah:
1. Cek logs di GitHub Actions
2. Cek server logs: `pm2 logs`
3. Review dokumentasi deployment: `DEPLOY_INDONESIA.md`
4. Test manual deployment: `./deployment/scripts/deploy.sh`
