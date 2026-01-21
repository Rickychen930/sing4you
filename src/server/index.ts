import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Database } from './config/database';
import { CloudinaryConfig } from './config/cloudinary';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.SITE_URL || 'https://christina-sings4you.com.au',
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}));

// Response compression (improve performance)
// Note: Install compression package for production: npm install compression @types/compression
// For now, this is optional. Most hosting providers (Vercel, Netlify, etc.) handle compression automatically.
// Uncomment below when compression package is installed:
/*
import compression from 'compression';
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
}));
*/

// Caching headers for static and API responses
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Cache control for API responses
  if (req.path.startsWith('/api/') && req.method === 'GET') {
    // Cache GET API responses for 5 minutes (public endpoints)
    if (!req.path.startsWith('/api/admin/')) {
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    }
  }
  
  next();
});

// Body parser with size limits (prevent DoS attacks)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use(routes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database (optional in development for frontend testing)
    const dbUri = process.env.MONGODB_URI || 'mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u';
    
    if (dbUri.includes('<db_password>')) {
      console.warn('⚠️  WARNING: MONGODB_URI not configured in .env file!');
      console.warn('📦 Using mock data for development');
      console.warn('   All API endpoints will work with in-memory mock data');
      console.warn('   Data will reset on server restart');
      console.warn('   To use real database: Update MONGODB_URI in .env file');
    } else {
      const database = Database.getInstance();
      // Use Promise.race to ensure server starts even if DB connection hangs
      try {
        await Promise.race([
          database.connect(dbUri),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database connection timeout')), 10000)
          )
        ]);
        console.log('✅ Connected to MongoDB');
      } catch {
        console.error('❌ Failed to connect to MongoDB');
        console.warn('📦 Using mock data for development');
        console.warn('   All API endpoints will work with in-memory mock data');
        console.warn('   Data will reset on server restart');
      }
    }

    // Initialize Cloudinary (optional)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      CloudinaryConfig.initialize();
      console.log('✅ Cloudinary initialized');
    }

    // Listen on all interfaces in production, localhost in development
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    app.listen(PORT, host, () => {
      console.log(`✅ Server running on http://${host}:${PORT}`);
      console.log(`📡 API available at http://${host}:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();