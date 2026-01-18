import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }

    const authService = new AuthService();
    const payload = authService.verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    // Use consistent error format
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';
    res.status(401).json({ success: false, error: errorMessage });
  }
};