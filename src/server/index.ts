import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Database } from './config/database.js';
import { CloudinaryConfig } from './config/cloudinary.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root (not from dist/server)
// In production, use BACKEND_ROOT env var if set, otherwise default to /var/www/christina-sings4you
// This allows flexibility for different deployment paths
const productionEnvPath = process.env.BACKEND_ROOT 
  ? resolve(process.env.BACKEND_ROOT, '.env')
  : resolve('/var/www/christina-sings4you/.env');
  
const envPath = process.env.NODE_ENV === 'production' 
  ? productionEnvPath
  : resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.SITE_URL || 'https://christina-sings4you.com.au',
  // Domain utama: https://christina-sings4you.com.au (dengan hyphen)
  'https://christina-sings4you.com.au',
  'https://www.christina-sings4you.com.au',
  // Add http versions for development/testing (if needed)
  ...(process.env.NODE_ENV === 'development' ? [
    'http://christina-sings4you.com.au',
    'http://www.christina-sings4you.com.au',
  ] : []),
].filter(Boolean); // Remove any undefined values

// Log allowed origins in development
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 Allowed CORS origins:', allowedOrigins);
}

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server, etc.)
    if (!origin) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ CORS: Allowing request with no origin (server-to-server/internal)');
      }
      return callback(null, true);
    }
    
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed || 
             normalizedOrigin.startsWith(normalizedAllowed);
    });
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ CORS: Allowing origin in development: ${normalizedOrigin}`);
      }
      return callback(null, true);
    }
    
    if (isAllowed) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ CORS: Allowing origin: ${normalizedOrigin}`);
      }
      callback(null, true);
    } else {
      // Log rejected origin for debugging
      console.warn(`❌ CORS: Rejected origin: ${normalizedOrigin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Not allowed by CORS. Origin: ${normalizedOrigin}`));
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
    // No cache for admin endpoints to prevent stale data
    if (req.path.startsWith('/api/admin/')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      // Cache GET API responses for 5 minutes (public endpoints only)
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    }
  }
  
  next();
});

// Body parser with size limits (prevent DoS attacks)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve uploaded files statically (must be before routes)
// Determine upload directory path (same logic as MediaUploadController)
// Priority: UPLOAD_DIR > BACKEND_ROOT/uploads > default paths
const getUploadDir = (): string => {
  let uploadDir: string;
  
  // If UPLOAD_DIR is explicitly set, use it (highest priority)
  if (process.env.UPLOAD_DIR) {
    uploadDir = resolve(process.env.UPLOAD_DIR);
  } 
  // In production/VPS, use BACKEND_ROOT/uploads if set
  else if (process.env.NODE_ENV === 'production') {
    if (process.env.BACKEND_ROOT) {
      uploadDir = resolve(process.env.BACKEND_ROOT, 'uploads');
    } else {
      // Default VPS path
      uploadDir = resolve('/var/www/christina-sings4you/uploads');
    }
  } 
  // In development, use project root/uploads
  // Use process.cwd() to get project root (works in both dev and production)
  else {
    // process.cwd() returns the current working directory (project root)
    uploadDir = resolve(process.cwd(), 'uploads');
  }
  
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  }
  
  // Log upload directory path (both dev and production for debugging)
  console.log(`📁 Static serve directory: ${uploadDir}`);
  console.log(`📁 Static serve directory exists: ${existsSync(uploadDir)}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📁 Production mode - BACKEND_ROOT: ${process.env.BACKEND_ROOT || 'not set'}`);
    console.log(`📁 Production mode - UPLOAD_DIR: ${process.env.UPLOAD_DIR || 'not set'}`);
    console.log(`📁 Production mode - NODE_ENV: ${process.env.NODE_ENV}`);
  } else {
    console.log(`📁 Development mode - Current working directory: ${process.cwd()}`);
    console.log(`📁 Development mode - __dirname: ${__dirname}`);
  }
  
  return uploadDir;
};

const staticUploadDir = getUploadDir();

// Enhanced static file serving with better error handling
app.use('/uploads', express.static(staticUploadDir, {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  setHeaders: (res, path) => {
    // Log when file is served (only in development or with DEBUG env)
    if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
      console.log(`📥 Serving static file: ${path}`);
    }
    // Add cache busting support via query params
    if (path.includes('_t=')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
  // Don't fall through - return 404 if file not found
  fallthrough: false,
}));

// API routes with no-cache headers for admin endpoints
app.use('/api', (req, res, next) => {
  // Set no-cache for admin endpoints to prevent stale data
  if (req.path.startsWith('/api/admin/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

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
        
        // Auto-seed database on startup (only if AUTO_SEED env is set to 'true')
        // Also auto-seed in development if AUTO_SEED is not explicitly set to 'false'
        const shouldAutoSeed = process.env.AUTO_SEED === 'true' || 
                              (process.env.NODE_ENV === 'development' && process.env.AUTO_SEED !== 'false');
        
        if (shouldAutoSeed) {
          console.log('🌱 Auto-seeding database...');
          try {
            // Set flag to prevent seed from exiting
            const originalAutoSeed = process.env.AUTO_SEED;
            process.env.AUTO_SEED = 'true';
            const { seedDatabase } = await import('./scripts/seed.js');
            await seedDatabase();
            // Restore original value
            if (originalAutoSeed) {
              process.env.AUTO_SEED = originalAutoSeed;
            } else {
              delete process.env.AUTO_SEED;
            }
            console.log('✅ Auto-seed completed');
          } catch (seedError) {
            console.error('⚠️  Auto-seed failed (continuing anyway):', seedError);
            // Don't exit - server should continue even if seed fails
          }
        }
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
    const server = app.listen(PORT, host, () => {
      console.log(`✅ Server running on http://${host}:${PORT}`);
      console.log(`📡 API available at http://${host}:${PORT}/api`);
      
      // Send ready signal to PM2 (if using PM2)
      if (process.send) {
        process.send('ready');
      }
    });

    // Handle server errors gracefully
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`   Please stop the process using port ${PORT} or change the PORT in .env`);
        console.error(`   To find the process: lsof -ti:${PORT}`);
        console.error(`   To kill it: kill -9 $(lsof -ti:${PORT})`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();