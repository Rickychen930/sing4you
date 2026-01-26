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
      
      // Log error for debugging
      console.error('❌ Login error:', err.message);
      if (process.env.NODE_ENV === 'development') {
        console.error('   Stack:', err.stack);
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
        res.status(500).json({ 
          success: false, 
          error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error. Please try again later.' 
            : err.message || 'An unexpected error occurred'
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