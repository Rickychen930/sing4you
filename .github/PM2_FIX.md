# Fix PM2 Ecosystem Config Error

## ❌ Error: "module is not defined in ES module scope"

Error ini terjadi karena:
1. `package.json` memiliki `"type": "module"` yang membuat semua `.js` files dianggap ES modules
2. `ecosystem.config.js` menggunakan CommonJS syntax (`module.exports`)
3. PM2 tidak bisa load file karena format tidak sesuai

## 🔧 Solusi

### 1. Rename File ke `.cjs`

File sudah di-rename dari `ecosystem.config.js` ke `ecosystem.config.cjs` untuk menandai bahwa ini CommonJS module.

### 2. Update Deployment Script

Deployment script sudah di-update untuk:
- ✅ Check jika PM2 process sudah running
- ✅ Restart jika exists, start jika tidak
- ✅ Menggunakan `ecosystem.config.cjs`
- ✅ Better error handling

### 3. Update All References

Semua referensi ke `ecosystem.config.js` sudah di-update ke `ecosystem.config.cjs`:
- ✅ `deployment/scripts/deploy.sh`
- ✅ `deployment/scripts/rollback.sh`
- ✅ `deployment/scripts/quick-deploy.sh`
- ✅ `deployment/scripts/verify-setup.sh`
- ✅ `deployment/pm2/ecosystem.config.cjs` (post-deploy command)

## 📋 Perubahan

### File Rename
```bash
deployment/pm2/ecosystem.config.js → deployment/pm2/ecosystem.config.cjs
```

### Deployment Script Update

**Sebelum:**
```bash
pm2 restart christina-sings4you-api || pm2 start deployment/pm2/ecosystem.config.js --env production
```

**Sesudah:**
```bash
if pm2 list | grep -q "christina-sings4you-api"; then
    pm2 restart christina-sings4you-api --update-env
else
    pm2 start deployment/pm2/ecosystem.config.cjs --env production
fi
```

## ✅ Verification

Setelah deploy, check PM2:

```bash
# Di server
pm2 list
# Should show: christina-sings4you-api

pm2 info christina-sings4you-api
# Should show process details

pm2 logs christina-sings4you-api
# Should show application logs
```

## 🔍 Troubleshooting

### Issue: "Process not found"

**Fix:**
```bash
# Di server
cd /var/www/christina-sings4you
pm2 start deployment/pm2/ecosystem.config.cjs --env production
pm2 save
```

### Issue: "File not found"

**Check:**
```bash
# Di server
ls -la /var/www/christina-sings4you/deployment/pm2/
# Should show: ecosystem.config.cjs
```

**Fix:**
- Pastikan file di-sync ke server
- Check rsync exclude patterns

### Issue: "PM2 not installed"

**Install PM2:**
```bash
# Di server
sudo npm install -g pm2
pm2 startup
# Follow instructions
```

## 📚 Related

- [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) - Deployment build fix
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
