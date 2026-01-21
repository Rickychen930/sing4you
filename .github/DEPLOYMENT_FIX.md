# Fix Deployment Build Error

## ❌ Error: "tsc: not found"

Error ini terjadi karena deployment script mencoba build di server, tetapi TypeScript compiler tidak terinstall (karena `npm ci --production` tidak install devDependencies).

## 🔧 Solusi yang Diterapkan

### 1. Build di GitHub Actions (CI/CD)
Build sudah dilakukan di GitHub Actions sebelum deploy, jadi tidak perlu build lagi di server.

### 2. Sync Build Files ke Server
Workflow sudah di-update untuk sync `dist/` directory ke server.

### 3. Deployment Script Update
Deployment script sekarang:
- ✅ Check jika build files sudah ada (dari CI/CD)
- ✅ Skip build jika files sudah ada
- ✅ Fallback ke build di server jika files tidak ada (dengan install devDependencies)

## 📋 Perubahan

### Deployment Script (`deployment/scripts/deploy.sh`)

**Sebelum:**
```bash
npm ci --production
npm run build  # ❌ Error: tsc not found
```

**Sesudah:**
```bash
npm ci --production

# Check if build files exist
if [ -d "dist" ] && [ -d "dist/client" ] && [ -d "dist/server" ]; then
    log "Build files found from CI/CD, skipping build..."
else
    # Fallback: build on server
    npm ci  # Install dev dependencies
    npm run build
    npm prune --production  # Remove dev dependencies
fi
```

### Workflow (`deploy.yml`)

**Update:**
- ✅ Verify build artifacts sebelum sync
- ✅ Sync hanya file yang diperlukan (exclude source files)
- ✅ Verify dist directory di server setelah sync

## ✅ Verification

Setelah deploy, check:

```bash
# Di server
cd /var/www/christina-sings4you
ls -lah dist/
# Should show:
# dist/client/  (frontend build)
# dist/server/  (backend build)
```

## 🧪 Test Deployment

1. **Build di CI:**
   - GitHub Actions akan build frontend dan backend
   - Build files akan di-upload sebagai artifacts

2. **Sync ke Server:**
   - Workflow akan sync `dist/` directory ke server
   - Verify build files exist

3. **Deploy:**
   - Deployment script akan detect build files
   - Skip build (karena sudah ada)
   - Install production dependencies only
   - Restart services

## 🔍 Troubleshooting

### Issue: "Build files not found on server"

**Check:**
```bash
# Di server
cd /var/www/christina-sings4you
ls -lah dist/
```

**Fix:**
- Pastikan rsync berhasil
- Check permissions
- Verify workflow sync step completed

### Issue: "Still trying to build on server"

**Check deployment script:**
```bash
# Di server
cat /var/www/christina-sings4you/deployment/scripts/deploy.sh | grep -A 10 "Build files"
```

**Fix:**
- Update deployment script dengan versi terbaru
- Pastikan dist directory structure correct

### Issue: "npm ci --production fails"

**Check:**
```bash
# Di server
cd /var/www/christina-sings4you
npm ci --production
```

**Fix:**
- Pastikan package.json dan package-lock.json di-sync
- Check npm version
- Clear npm cache: `npm cache clean --force`

## 📚 Related

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
- [SECRETS_SETUP.md](./SECRETS_SETUP.md) - Setup secrets
