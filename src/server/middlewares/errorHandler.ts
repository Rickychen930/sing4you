import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Don't log client errors (4xx) in production, only log server errors (5xx)
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err as AppError).statusCode || 500;
  
  if (statusCode >= 500) {
    // Log server errors with full details
    console.error('Server Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
  } else {
    // Log client errors with minimal info
    console.warn('Client Error:', {
      message: err.message,
      statusCode,
      url: req.url,
      method: req.method,
    });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Don't expose internal error messages in production
  const message = statusCode >= 500 && !isDevelopment
    ? 'Internal server error'
    : (err.message || 'An error occurred');

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDevelopment && { 
      stack: err.stack,
      ...((err as AppError).code && { code: (err as AppError).code }),
    }),
  });
};