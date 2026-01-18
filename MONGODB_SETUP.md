# MongoDB Atlas Setup Guide

## Connection String

Your MongoDB Atlas connection string:
```
mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/
```

## Setup Instructions

### 1. Replace Password
Replace `<db_password>` in the connection string with your actual MongoDB Atlas password.

Example:
```
mongodb+srv://sings4you:YourPassword123@sings4you.qahkyi2.mongodb.net/
```

### 2. Add Database Name
Add the database name at the end of the connection string (optional but recommended):
```
mongodb+srv://sings4you:YourPassword123@sings4you.qahkyi2.mongodb.net/christinasings4u
```

### 3. Environment Variable
Add the connection string to your `.env` file:

```env
MONGODB_URI=mongodb+srv://sings4you:YourPassword123@sings4you.qahkyi2.mongodb.net/christinasings4u
```

### 4. Network Access
Make sure your MongoDB Atlas cluster allows connections from:
- **Development**: Your IP address or `0.0.0.0/0` (for testing only)
- **Production**: Your server's IP address

### 5. Database User
Ensure the user `sings4you` has proper permissions:
- Read/Write access to the database
- At minimum: `readWrite` role on the database

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Security Notes

⚠️ **Important**: 
- Never commit your `.env` file to version control
- Never share your password publicly
- Use environment variables for all sensitive data
- Consider using MongoDB Atlas connection pooling for production

## Testing Connection

After setting up, test the connection by starting the server:
```bash
npm run dev:server
```

You should see: `MongoDB connected successfully`

If you see connection errors, check:
1. Password is correct
2. Network access is configured
3. User permissions are correct
4. Connection string format is correct
