import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { HeroController } from '../controllers/HeroController';
import { SectionController } from '../controllers/SectionController';
import { PerformanceController } from '../controllers/PerformanceController';
import { TestimonialController } from '../controllers/TestimonialController';
import { SEOController } from '../controllers/SEOController';
import { AuthController } from '../controllers/AuthController';
import { ContactController } from '../controllers/ContactController';
import { SitemapController } from '../controllers/SitemapController';
import { MediaUploadController, uploadMiddleware } from '../controllers/MediaUploadController';
import { CategoryController } from '../controllers/CategoryController';
import { VariationController } from '../controllers/VariationController';
import { MediaController } from '../controllers/MediaController';
import { AboutPageController } from '../controllers/AboutPageController';
import { authMiddleware } from '../middlewares/auth';
import { rateLimiter, authRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// Health check endpoint
router.get('/api/health', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Uploads directory verification endpoint (admin only)
router.get('/api/admin/uploads/verify', authMiddleware, async (_req, res) => {
  try {
    const { getUploadDirectory } = await import('../controllers/MediaUploadController');
    const { existsSync, readdirSync, statSync } = await import('fs');
    const { resolve } = await import('path');
    const uploadDir = getUploadDirectory();
    
    const dirExists = existsSync(uploadDir);
    let files: Array<{ name: string; size: number; modified: Date; path: string; exists: boolean }> = [];
    let error: string | null = null;
    
    if (dirExists) {
      try {
        const fileList = readdirSync(uploadDir);
        files = fileList.slice(0, 20).map(name => {
          const filePath = resolve(uploadDir, name);
          const fileExists = existsSync(filePath);
          let stats: ReturnType<typeof statSync> | null = null;
          if (fileExists) {
            try {
              stats = statSync(filePath);
            } catch {
              // Ignore stat errors
            }
          }
          return {
            name,
            size: stats?.size || 0,
            modified: stats?.mtime || new Date(),
            path: filePath,
            exists: fileExists,
          };
        });
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error reading directory';
      }
    }
    
    // Calculate project root from BACKEND_ROOT if available
    let projectRoot: string | null = null;
    if (process.env.BACKEND_ROOT) {
      projectRoot = resolve(process.env.BACKEND_ROOT, '..');
    }
    
    res.json({
      success: true,
      data: {
        uploadDir,
        projectRoot,
        exists: dirExists,
        readable: dirExists && !error,
        fileCount: files.length,
        files: files.slice(0, 10), // Show first 10 files
        error,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          BACKEND_ROOT: process.env.BACKEND_ROOT || 'not set',
          UPLOAD_DIR: process.env.UPLOAD_DIR || 'not set',
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Check if specific file exists (admin only)
router.get('/api/admin/uploads/check/:filename', authMiddleware, async (req, res) => {
  try {
    const { getUploadDirectory } = await import('../controllers/MediaUploadController');
    const { existsSync, statSync } = await import('fs');
    const { resolve } = await import('path');
    const uploadDir = getUploadDirectory();
    const filename = (Array.isArray(req.params.filename) ? req.params.filename[0] : req.params.filename) ?? '';
    const filePath = resolve(uploadDir, filename);
    
    const fileExists = existsSync(filePath);
    let stats: ReturnType<typeof statSync> | null = null;
    let readable = false;
    
    if (fileExists) {
      try {
        stats = statSync(filePath);
        readable = (stats.mode & parseInt('444', 8)) !== 0;
      } catch {
        // Ignore stat errors
      }
    }
    
    res.json({
      success: true,
      data: {
        filename,
        filePath,
        exists: fileExists,
        readable,
        size: stats?.size || 0,
        modified: stats?.mtime || null,
        uploadDir,
        url: `/uploads/${filename}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Public routes
const heroController = new HeroController();
const sectionController = new SectionController();
const performanceController = new PerformanceController();
const testimonialController = new TestimonialController();
const seoController = new SEOController();
const contactController = new ContactController();
const sitemapController = new SitemapController();
const aboutPageController = new AboutPageController();

// Hero
router.get('/api/hero', heroController.getSettings);

// About Page
router.get('/api/about', aboutPageController.getSettings);

// Sections
router.get('/api/sections', sectionController.getAll);
router.get('/api/sections/type/:type', sectionController.getByType);
router.get('/api/sections/slug/:slug', sectionController.getBySlug);
router.get('/api/sections/:id', sectionController.getById);

// Performances
router.get('/api/performances', performanceController.getAll);
router.get('/api/performances/upcoming', performanceController.getUpcoming);
router.get('/api/performances/:id', performanceController.getById);

// Testimonials
router.get('/api/testimonials', testimonialController.getAll);
router.get('/api/testimonials/:id', testimonialController.getById);


// Categories
const categoryController = new CategoryController();
router.get('/api/categories', categoryController.getAll);
router.get('/api/categories/type/:type', categoryController.getByType);
router.get('/api/categories/slug/:slug', categoryController.getBySlug);
router.get('/api/categories/:id', categoryController.getById);

// Variations
const variationController = new VariationController();
router.get('/api/variations', variationController.getAll);
router.get('/api/variations/:id', variationController.getById);
router.get('/api/categories/:categoryId/variations', variationController.getByCategoryId);
router.get('/api/variations/slug/:slug', variationController.getBySlug);

// Media
const mediaController = new MediaController();
router.get('/api/media', mediaController.getAll);
router.get('/api/media/:id', mediaController.getById);
router.get('/api/variations/:variationId/media', mediaController.getByVariationId);

// SEO
router.get('/api/seo', seoController.getSettings);

// Contact (with rate limiting)
router.post('/api/contact', rateLimiter, contactController.submit);

// Sitemap
router.get('/sitemap.xml', sitemapController.generate);

// Admin routes (protected)
const authController = new AuthController();

// Auth (with rate limiting)
router.post('/api/admin/auth/login', authRateLimiter, authController.login);
router.post('/api/admin/auth/refresh', authRateLimiter, authController.refresh);
router.post('/api/admin/auth/logout', authController.logout);

// Admin Hero
router.put('/api/admin/hero', authMiddleware, heroController.updateSettings);

// Admin About Page
router.put('/api/admin/about', authMiddleware, aboutPageController.updateSettings);

// Admin Sections
router.post('/api/admin/sections', authMiddleware, sectionController.create);
router.put('/api/admin/sections/:id', authMiddleware, sectionController.update);
router.delete('/api/admin/sections/:id', authMiddleware, sectionController.delete);

// Admin Performances
router.post('/api/admin/performances', authMiddleware, performanceController.create);
router.put('/api/admin/performances/:id', authMiddleware, performanceController.update);
router.delete('/api/admin/performances/:id', authMiddleware, performanceController.delete);

// Admin Testimonials
router.post('/api/admin/testimonials', authMiddleware, testimonialController.create);
router.put('/api/admin/testimonials/:id', authMiddleware, testimonialController.update);
router.delete('/api/admin/testimonials/:id', authMiddleware, testimonialController.delete);


// Admin SEO
router.put('/api/admin/seo', authMiddleware, seoController.updateSettings);

// Admin Categories
router.post('/api/admin/categories', authMiddleware, categoryController.create);
router.put('/api/admin/categories/:id', authMiddleware, categoryController.update);
router.delete('/api/admin/categories/:id', authMiddleware, categoryController.delete);

// Admin Variations
router.post('/api/admin/variations', authMiddleware, variationController.create);
router.put('/api/admin/variations/:id', authMiddleware, variationController.update);
router.delete('/api/admin/variations/:id', authMiddleware, variationController.delete);

// Admin Media
router.post('/api/admin/media', authMiddleware, mediaController.create);
router.put('/api/admin/media/:id', authMiddleware, mediaController.update);
router.delete('/api/admin/media/:id', authMiddleware, mediaController.delete);

// Admin Media Upload (protected)
const mediaUploadController = new MediaUploadController();
// Wrap multer middleware to handle errors properly
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      // Multer errors (file size, file type, etc.)
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large. Maximum size is 10MB.',
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'File upload error',
        });
      }
      // Other errors (fileFilter errors, etc.)
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload error',
      });
    }
    next();
  });
};
router.post('/api/admin/media/upload', authMiddleware, handleUpload, mediaUploadController.upload);
router.delete('/api/admin/media/:publicId', authMiddleware, mediaUploadController.delete);

// Handle method not allowed for auth routes (catch non-POST methods)
// These handlers will only be reached for non-POST methods since POST is handled above
router.all('/api/admin/auth/login', (req, res) => {
  res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed. This endpoint only accepts POST requests.`
  });
});

router.all('/api/admin/auth/refresh', (req, res) => {
  res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed. This endpoint only accepts POST requests.`
  });
});

router.all('/api/admin/auth/logout', (req, res) => {
  res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed. This endpoint only accepts POST requests.`
  });
});

// 404 handler for unmatched routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
});

export default router;