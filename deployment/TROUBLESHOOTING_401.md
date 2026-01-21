# Troubleshooting Error 401 (Unauthorized)

## 🔍 Common Causes of Error 401

Error 401 (Unauthorized) occurs when API requests don't have a valid token or the token has expired. Here are common causes and solutions:

## ✅ Troubleshooting Checklist

### 1. Check Token in Browser

**Open Browser Console (F12) and run:**

```javascript
// Check if token exists in localStorage
console.log('Access Token:', localStorage.getItem('accessToken'));

// Check if token is valid (not null/undefined)
const token = localStorage.getItem('accessToken');
if (!token) {
  console.error('❌ Token not found in localStorage!');
} else {
  console.log('✅ Token found:', token.substring(0, 20) + '...');
}
```

**Solution if token doesn't exist:**
- Login again at `/admin/login`
- Token will be automatically saved after successful login

### 2. Cek Token Expired

Access token hanya valid selama **1 jam**. Setelah itu, sistem akan otomatis mencoba refresh token menggunakan refresh token dari cookie.

**Check if token expired:**

```javascript
// Decode token (without verifying signature)
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const expired = now > exp;
  
  console.log('Token expires at:', new Date(exp));
  console.log('Current time:', new Date(now));
  console.log('Is expired:', expired);
  
  if (expired) {
    console.log('⚠️ Token has expired! System will automatically refresh...');
  }
}
```

**Solution:**
- System already has auto-refresh mechanism
- If auto-refresh fails, login again

### 3. Check Refresh Token (Cookie)

Refresh token is stored in **httpOnly cookie** for security. This cookie must be able to be sent to the server.

**Check cookie in Browser DevTools:**
1. Open **Application** tab (Chrome) or **Storage** tab (Firefox)
2. View **Cookies** → select your domain
3. Look for cookie named `refreshToken`

**Solution if cookie doesn't exist:**
- Login again
- Make sure `withCredentials: true` in axios config (already in code)
- Make sure CORS allows credentials

### 4. Check CORS Configuration

If in production, make sure CORS is configured correctly to allow credentials.

**Check on server (`src/server/index.ts`):**

```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://christina-sings4you.com.au',
  credentials: true, // Important for cookies!
}));
```

**Solution:**
- Make sure `credentials: true` in CORS config
- Make sure `CLIENT_URL` in `.env` is correct

### 5. Check JWT Secret on Server

If JWT secret doesn't match or isn't set, token cannot be verified.

**Check on server:**

```bash
# SSH to server
ssh root@72.61.214.25

# Check .env file
cd /var/www/christina-sings4you
cat .env | grep JWT

# Must have:
# JWT_SECRET=...
# JWT_REFRESH_SECRET=...
```

**Solution if JWT secret doesn't exist or is default:**

```bash
# Generate secure JWT secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Add to .env
echo "JWT_SECRET=$JWT_SECRET" >> /var/www/christina-sings4you/.env
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> /var/www/christina-sings4you/.env

# Restart application
pm2 restart christina-sings4you-api
```

### 6. Check Cookie Secure Flag in Production

In production, cookies with `secure: true` can only be sent over HTTPS. If still using HTTP, cookies will not be sent.

**Check in `src/server/controllers/AuthController.ts`:**

```typescript
res.cookie('refreshToken', result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production = HTTPS only
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**Solution:**
- Make sure to use HTTPS in production
- Or temporarily set `secure: false` if still testing with HTTP (not recommended for production)

### 7. Check Network Request in Browser

**Open Browser DevTools → Network tab:**

1. Find request that returns 401
2. Check **Request Headers**:
   - Must have: `Authorization: Bearer <token>`
   - If not present, token is not being sent

3. Check **Response**:
   - Error message: `"No token provided"` → Token not sent
   - Error message: `"Invalid or expired token"` → Token invalid/expired
   - Error message: `"No refresh token provided"` → Cookie not sent

### 8. Check Server Logs

**On server, check logs:**

```bash
# PM2 logs
pm2 logs christina-sings4you-api

# Or check error log
tail -f /var/log/nginx/christina-sings4you-error.log
```

**Look for related errors:**
- JWT secret errors
- Token verification errors
- Cookie parsing errors

## 🔧 Quick Solutions

### Solution 1: Clear and Login Again

```javascript
// In browser console
localStorage.clear();
// Or just remove token
localStorage.removeItem('accessToken');

// Then login again at /admin/login
```

### Solution 2: Restart Server

```bash
# On server
pm2 restart christina-sings4you-api
pm2 logs christina-sings4you-api --lines 50
```

### Solution 3: Verify Environment Variables

```bash
# On server
cd /var/www/christina-sings4you
cat .env | grep -E "JWT|NODE_ENV|CLIENT_URL"

# Must have:
# NODE_ENV=production
# JWT_SECRET=<random-string>
# JWT_REFRESH_SECRET=<random-string>
# CLIENT_URL=https://christina-sings4you.com.au
```

### Solution 4: Test API Directly

```bash
# Test login endpoint
curl -X POST https://christina-sings4you.com.au/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@christinasings4u.com.au","password":"your-password"}'

# If successful, will return accessToken
# Save token and test protected endpoint:
curl -X GET https://christina-sings4you.com.au/api/admin/hero \
  -H "Authorization: Bearer <your-access-token>"
```

## 🐛 Debug Mode

Enable debug logging on server to see error details:

```bash
# On server .env
echo "DEBUG=true" >> /var/www/christina-sings4you/.env
pm2 restart christina-sings4you-api
```

Or check directly in code to see more detailed error messages.

## 📋 Complete Checklist

- [ ] Token exists in localStorage (`localStorage.getItem('accessToken')`)
- [ ] Token not expired (check by decoding JWT)
- [ ] Refresh token cookie exists in browser
- [ ] CORS configured with `credentials: true`
- [ ] JWT_SECRET and JWT_REFRESH_SECRET are set on server
- [ ] Using HTTPS in production (for secure cookie)
- [ ] Server is running and accessible
- [ ] Request headers contain `Authorization: Bearer <token>`
- [ ] Network request not blocked by CORS

## 🆘 Still Error?

If still error after trying all solutions above:

1. **Check specific error message** in browser console or network tab
2. **Check server logs** for error details
3. **Test with curl** to ensure server is functioning
4. **Verify all environment variables** are correct
5. **Make sure database connection** is working (for user lookup)

## 📝 Important Notes

1. **Access Token** expires after 1 hour (default)
2. **Refresh Token** expires after 7 days (default)
3. **Auto-refresh** will automatically try to refresh token if access token expired
4. **Cookie** must be able to be sent (CORS + credentials)
5. **HTTPS** required for secure cookie in production
