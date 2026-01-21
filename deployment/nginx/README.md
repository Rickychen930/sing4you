# Nginx Configuration Files

Konfigurasi Nginx untuk aplikasi Christina Sings4You.

## File yang Tersedia

1. **`christina-sings4you.com.au.conf`** - Konfigurasi lengkap dengan SSL (HTTPS)

## Instalasi

### 1. Copy File ke Server

```bash
# Dari local machine
scp deployment/nginx/christina-sings4you.com.au.conf root@76.13.96.198:/tmp/

# Atau jika sudah di server
sudo cp /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf /etc/nginx/sites-available/
```

### 2. Buat Symlink

```bash
sudo ln -s /etc/nginx/sites-available/christina-sings4you.com.au.conf /etc/nginx/sites-enabled/
```

### 3. Hapus Default Site (jika ada)

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 4. Test Konfigurasi

```bash
sudo nginx -t
```

### 5. Reload Nginx

```bash
sudo systemctl reload nginx
```

## Verifikasi

### 1. Test Backend

```bash
curl http://localhost:3001/api/health
```

### 2. Test Proxy

```bash
# Dari server
curl -H "Host: christina-sings4you.com.au" http://localhost/api/health

# Dari local machine
curl https://christina-sings4you.com.au/api/health
```

### 3. Check Logs

```bash
# Access log
sudo tail -f /var/log/nginx/christina-sings4you-access.log

# Error log
sudo tail -f /var/log/nginx/christina-sings4you-error.log
```

## Troubleshooting

### Problem: 502 Bad Gateway

**Solusi:**
1. Cek backend running: `pm2 list`
2. Test backend: `curl http://localhost:3001/api/health`
3. Restart backend: `pm2 restart all`

### Problem: Nginx Config Test Failed

**Solusi:**
1. Check syntax: `sudo nginx -t`
2. Lihat error detail di output
3. Fix error di config file
4. Test lagi: `sudo nginx -t`

## Quick Commands

```bash
# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View config
sudo cat /etc/nginx/sites-available/christina-sings4you.com.au.conf

# Edit config
sudo nano /etc/nginx/sites-available/christina-sings4you.com.au.conf
```

## File Locations

- **Config file**: `/etc/nginx/sites-available/christina-sings4you.com.au.conf`
- **Symlink**: `/etc/nginx/sites-enabled/christina-sings4you.com.au.conf`
- **Access log**: `/var/log/nginx/christina-sings4you-access.log`
- **Error log**: `/var/log/nginx/christina-sings4you-error.log`
