import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  // Don't log client errors (4xx) in production, only log server errors (5xx)
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err as AppError).statusCode || 500;
  
  // Check if it's a MongoDB connection error
  const isMongoError = err.message.includes('Mongo') || 
                       err.message.includes('connection pool') ||
                       err.message.includes('SSL') ||
                       err.message.includes('TLS');
  
  if (statusCode >= 500) {
    // Log server errors with full details
    console.error('Server Error:', {
      message: err.message,
      stack: isMongoError ? 'MongoDB connection error - check database connection' : err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString(),
      isMongoError,
    });
    
    if (isMongoError) {
      console.error('💡 MongoDB Connection Troubleshooting:');
      console.error('   1. Check MONGODB_URI in .env file');
      console.error('   2. Verify MongoDB Atlas cluster is running');
      console.error('   3. Check Network Access settings in MongoDB Atlas');
      console.error('   4. Verify IP whitelist includes your current IP');
      console.error('   5. Check SSL/TLS certificate validity');
    }
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
  
  // Handle MongoDB connection errors with user-friendly message
  let message = err.message || 'An error occurred';
  if (isMongoError) {
    message = isDevelopment 
      ? `Database connection error: ${err.message}`
      : 'Unable to connect to database. Please try again later.';
  } else if (statusCode >= 500 && !isDevelopment) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDevelopment && { 
      stack: err.stack,
      ...((err as AppError).code && { code: (err as AppError).code }),
      ...(isMongoError && { type: 'database_connection_error' }),
    }),
  });
};