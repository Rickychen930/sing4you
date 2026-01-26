import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      let { email, password } = req.body;
      
      // Input validation
      if (!email || !password) {
        res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
        return;
      }

      // Normalize email (trim whitespace and convert to lowercase)
      email = email.trim().toLowerCase();
      password = password.trim();

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid email format' 
        });
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Login attempt for email: ${email}`);
      }

      const result = await this.authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      const err = error as Error;
      
      // Detailed error logging for debugging
      console.error('❌ Login error:', err.message);
      console.error('   Error type:', err.constructor.name);
      
      // Check for specific error types
      const isJWTSecretError = err.message.includes('JWT_SECRET') || 
                                err.message.includes('JWT_REFRESH_SECRET') ||
                                err.message.includes('must be set in production');
      const isDatabaseError = err.message.includes('Database error') ||
                              err.message.includes('Mongo') ||
                              err.message.includes('connection');
      const isTokenError = err.message.includes('Failed to generate') ||
                          err.message.includes('token');
      
      if (process.env.NODE_ENV === 'development' || isJWTSecretError || isDatabaseError) {
        console.error('   Stack:', err.stack);
        if (isJWTSecretError) {
          console.error('💡 JWT Secret Error Detected!');
          console.error('   This usually means JWT_SECRET or JWT_REFRESH_SECRET is not set in production.');
          console.error('   Quick fix:');
          console.error('     JWT_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
          console.error('     JWT_REFRESH_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
          console.error('     Add these to your .env file and restart the server.');
        }
        if (isDatabaseError) {
          console.error('💡 Database Error Detected!');
          console.error('   Check MONGODB_URI in .env file and database connection.');
        }
        if (isTokenError) {
          console.error('💡 Token Generation Error!');
          console.error('   This might be related to JWT secret configuration.');
        }
      }
      
      // Check if it's an authentication error (should return 401)
      const isAuthError = err.message.includes('Invalid credentials') || 
                          err.message.includes('User not found') ||
                          err.message.includes('Invalid or expired');
      
      if (isAuthError) {
        // For auth errors, return 401
        res.status(401).json({ 
          success: false, 
          error: err.message || 'Invalid credentials' 
        });
      } else {
        // For other errors (database, JWT, etc.), return 500
        // Include more details in development
        const errorMessage = process.env.NODE_ENV === 'production' 
          ? 'Internal server error. Please try again later.' 
          : err.message || 'An unexpected error occurred';
        
        res.status(500).json({ 
          success: false, 
          error: errorMessage,
          ...(process.env.NODE_ENV === 'development' && {
            details: {
              type: err.constructor.name,
              isJWTSecretError,
              isDatabaseError,
              isTokenError,
            }
          })
        });
      }
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ success: false, error: 'No refresh token provided' });
        return;
      }

      const accessToken = await this.authService.refreshAccessToken(refreshToken);
      res.json({ success: true, data: { accessToken } });
    } catch (error) {
      const err = error as Error;
      // For auth errors, return 401 directly (not 500)
      res.status(401).json({ success: false, error: err.message });
    }
  };

  public logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  };
}