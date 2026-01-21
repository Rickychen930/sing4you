import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      // Input validation
      if (!email || !password) {
        res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid email format' 
        });
        return;
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
      // Log error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', err.message);
      }
      res.status(401).json({ 
        success: false, 
        error: err.message || 'Invalid credentials' 
      });
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
      res.status(401).json({ success: false, error: err.message });
    }
  };

  public logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  };
}