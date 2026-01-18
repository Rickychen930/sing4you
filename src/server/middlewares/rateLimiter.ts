import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

// Helper to get client IP (handles proxies/load balancers)
const getClientIp = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

// Cleanup old entries periodically (prevents memory leak)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 15 * 60 * 1000); // Clean up every 15 minutes

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const key = getClientIp(req);
  const now = Date.now();

  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    return next();
  }

  if (store[key].count >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
    });
    return;
  }

  store[key].count += 1;
  next();
};

// More restrictive rate limiter for auth endpoints
const AUTH_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_AUTH_REQUESTS = 5; // Max auth requests per window

export const authRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const key = `auth:${getClientIp(req)}`;
  const now = Date.now();

  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + AUTH_RATE_LIMIT_WINDOW,
    };
    return next();
  }

  if (store[key].count >= MAX_AUTH_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again in 15 minutes.',
    });
    return;
  }

  store[key].count += 1;
  next();
};