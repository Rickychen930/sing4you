import jwt from 'jsonwebtoken';
import { AdminUserModel } from '../models/AdminUserModel';
import { Database } from '../config/database';

// Validate JWT secrets in production
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret === 'your-secret-key-change-in-production')) {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  return secret || 'your-secret-key-change-in-production';
};

const getJWTRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret === 'your-refresh-secret-key-change-in-production')) {
    throw new Error('JWT_REFRESH_SECRET must be set in production environment');
  }
  return secret || 'your-refresh-secret-key-change-in-production';
};

const JWT_SECRET = getJWTSecret();
const JWT_REFRESH_SECRET = getJWTRefreshSecret();
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
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
      const mockUser = this.getMockUser();
      if (email.toLowerCase() !== mockUser.email.toLowerCase() || password !== mockUser.password) {
        throw new Error('Invalid credentials');
      }

      const payload: ITokenPayload = {
        userId: mockUser._id,
        email: mockUser.email,
      };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

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
    const user = await AdminUserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await AdminUserModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  public generateAccessToken(payload: ITokenPayload): string {
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  public generateRefreshToken(payload: ITokenPayload): string {
    const options: jwt.SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  }

  public verifyAccessToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as ITokenPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  public verifyRefreshToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as ITokenPayload;
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