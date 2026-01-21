# GitHub Actions Workflows

Repository ini menggunakan GitHub Actions untuk CI/CD otomatis.

## 📋 Workflows

### 1. CI (Continuous Integration)
**File**: `.github/workflows/ci.yml`

**Trigger**:
- Pull request ke `master`/`main`/`develop`
- Push ke `master`/`main`/`develop`

**Fungsi**:
- Lint code
- Build frontend & backend
- Check untuk sensitive data

### 2. Deploy to Production
**File**: `.github/workflows/deploy.yml`

**Trigger**:
- Push ke branch `master` atau `main`
- Manual trigger via GitHub Actions UI

**Fungsi**:
- Build aplikasi
- Deploy ke server production
- Health check setelah deploy

### 3. Deploy to Staging
**File**: `.github/workflows/deploy-staging.yml`

**Trigger**:
- Push ke branch `develop` atau `staging`
- Manual trigger

**Fungsi**:
- Build dan deploy ke staging environment

## 🚀 Quick Start

### Setup Awal

1. **Setup GitHub Secrets** (lihat `deployment/CI_CD_SETUP.md`)
2. **Setup server** untuk GitHub Actions:
   ```bash
   ssh root@76.13.96.198
   cd /var/www/christina-sings4you
   sudo ./deployment/scripts/setup-github-actions.sh
   ```
3. **Test deployment** dengan push ke `master`:
   ```bash
   git push origin master
   ```

### Deploy Otomatis

Setelah setup, setiap push ke `master` akan otomatis:
1. Build aplikasi
2. Deploy ke server
3. Health check

### Deploy Manual

1. Buka repository di GitHub
2. Klik tab **Actions**
3. Pilih workflow **Deploy to Production**
4. Klik **Run workflow**

## 📚 Dokumentasi Lengkap

Lihat `deployment/CI_CD_SETUP.md` untuk:
- Setup GitHub Secrets lengkap
- Troubleshooting
- Security best practices
