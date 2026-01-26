import jwt from 'jsonwebtoken';
import { AdminUserModel } from '../models/AdminUserModel';
import { Database } from '../config/database';

// Validate JWT secrets in production (lazy loading to avoid module-level errors)
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  // Only validate in production when secret is actually needed
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.trim() === '' || 
        secret === 'your-secret-key-change-in-production' || 
        secret === 'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING') {
      throw new Error(
        'JWT_SECRET must be set in production environment.\n' +
        'Quick fix on server:\n' +
        '  JWT_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")\n' +
        '  echo "JWT_SECRET=$JWT_SECRET" >> /var/www/christina-sings4you/.env\n' +
        '  pm2 restart christina-sings4you-api'
      );
    }
  }
  return secret || 'your-secret-key-change-in-production';
};

const getJWTRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  // Only validate in production when secret is actually needed
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.trim() === '' || 
        secret === 'your-refresh-secret-key-change-in-production' || 
        secret === 'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING') {
      throw new Error(
        'JWT_REFRESH_SECRET must be set in production environment.\n' +
        'Quick fix on server:\n' +
        '  JWT_REFRESH_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")\n' +
        '  echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> /var/www/christina-sings4you/.env\n' +
        '  pm2 restart christina-sings4you-api'
      );
    }
  }
  return secret || 'your-refresh-secret-key-change-in-production';
};

// Lazy load secrets to avoid module-level errors
let JWT_SECRET: string | null = null;
let JWT_REFRESH_SECRET: string | null = null;

const getJWTSecretLazy = (): string => {
  if (!JWT_SECRET) {
    JWT_SECRET = getJWTSecret();
  }
  return JWT_SECRET;
};

const getJWTRefreshSecretLazy = (): string => {
  if (!JWT_REFRESH_SECRET) {
    JWT_REFRESH_SECRET = getJWTRefreshSecret();
  }
  return JWT_REFRESH_SECRET;
};
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  private useMockData(): boolean {
    try {
      return !Database.getInstance().isConnectedToDb();
    } catch (error) {
      // If there's an error checking connection, assume not connected and use mock
      console.error('❌ Error checking database connection:', (error as Error).message);
      return true;
    }
  }

  private getMockUser() {
    return {
      _id: 'mock-admin-user-1',
      email: 'admin@christinasings4u.com.au',
      password: 'admin123', // Plain password for mock - in real DB this would be hashed
      name: 'Admin User',
    };
  }

  public async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; name: string } }> {
    // Use mock data if database is not connected
    if (this.useMockData()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Using mock data for authentication (database not connected)');
      }
      const mockUser = this.getMockUser();
      const emailMatch = email.toLowerCase() === mockUser.email.toLowerCase();
      const passwordMatch = password === mockUser.password;
      
      if (!emailMatch || !passwordMatch) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ Login failed - Email match: ${emailMatch}, Password match: ${passwordMatch}`);
          console.log(`   Expected email: ${mockUser.email}, Got: ${email}`);
          console.log(`💡 Using mock data. Default credentials:`);
          console.log(`   Email: ${mockUser.email}`);
          console.log(`   Password: ${mockUser.password}`);
        }
        throw new Error('Invalid credentials');
      }

      const payload: ITokenPayload = {
        userId: mockUser._id,
        email: mockUser.email,
      };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Login successful using mock data');
      }

      return {
        accessToken,
        refreshToken,
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
        },
      };
    }

    // Real database authentication
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Using database for authentication');
    }
    
    try {
      const user = await AdminUserModel.findByEmail(email);
      if (!user) {
        // Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ Login attempt failed: User not found for email: ${email}`);
          console.log('💡 Tip: Run "npm run seed" to create admin user');
          console.log('   Default admin credentials after seeding:');
          console.log('   Email: admin@christinasings4u.com.au');
          console.log('   Password: admin123');
        }
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await AdminUserModel.comparePassword(password, user.password);
      if (!isPasswordValid) {
        // Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ Login attempt failed: Invalid password for email: ${email}`);
          console.log('💡 Possible issues:');
          console.log('   1. Password might be double-hashed (run "npm run seed" to fix)');
          console.log('   2. Wrong password entered');
          console.log('   3. Password in database was manually changed');
          console.log('   Expected password: admin123');
        }
        throw new Error('Invalid credentials');
      }

      if (!user._id) {
        throw new Error('User ID is missing');
      }

      const payload: ITokenPayload = {
        userId: user._id.toString(),
        email: user.email,
      };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Login successful for user: ${user.email}`);
      }

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      // Re-throw auth errors as-is
      if (error instanceof Error && error.message === 'Invalid credentials') {
        throw error;
      }
      // Wrap database errors
      const err = error as Error;
      console.error('❌ Database error during login:', err.message);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  public generateAccessToken(payload: ITokenPayload): string {
    try {
      const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
      return jwt.sign(payload, getJWTSecretLazy(), options);
    } catch (error) {
      const err = error as Error;
      console.error('❌ Error generating access token:', err.message);
      throw new Error(`Failed to generate access token: ${err.message}`);
    }
  }

  public generateRefreshToken(payload: ITokenPayload): string {
    try {
      const options: jwt.SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
      return jwt.sign(payload, getJWTRefreshSecretLazy(), options);
    } catch (error) {
      const err = error as Error;
      console.error('❌ Error generating refresh token:', err.message);
      throw new Error(`Failed to generate refresh token: ${err.message}`);
    }
  }

  public verifyAccessToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, getJWTSecretLazy()) as ITokenPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  public verifyRefreshToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, getJWTRefreshSecretLazy()) as ITokenPayload;
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = this.verifyRefreshToken(refreshToken);
    
    // Use mock data if database is not connected
    if (this.useMockData()) {
      const mockUser = this.getMockUser();
      if (payload.userId !== mockUser._id) {
        throw new Error('User not found');
      }
      return this.generateAccessToken({
        userId: mockUser._id,
        email: mockUser.email,
      });
    }

    // Real database refresh
    const user = await AdminUserModel.findById(payload.userId);
    if (!user || !user._id) {
      throw new Error('User not found');
    }

    return this.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });
  }
}