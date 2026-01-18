import express from 'express';
import { HeroController } from '../controllers/HeroController';
import { SectionController } from '../controllers/SectionController';
import { PerformanceController } from '../controllers/PerformanceController';
import { TestimonialController } from '../controllers/TestimonialController';
import { BlogController } from '../controllers/BlogController';
import { SEOController } from '../controllers/SEOController';
import { AuthController } from '../controllers/AuthController';
import { ContactController } from '../controllers/ContactController';
import { SitemapController } from '../controllers/SitemapController';
import { MediaUploadController, uploadMiddleware } from '../controllers/MediaUploadController';
import { CategoryController } from '../controllers/CategoryController';
import { VariationController } from '../controllers/VariationController';
import { MediaController } from '../controllers/MediaController';
import { authMiddleware } from '../middlewares/auth';
import { rateLimiter, authRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// Public routes
const heroController = new HeroController();
const sectionController = new SectionController();
const performanceController = new PerformanceController();
const testimonialController = new TestimonialController();
const blogController = new BlogController();
const seoController = new SEOController();
const contactController = new ContactController();
const sitemapController = new SitemapController();

// Hero
router.get('/api/hero', heroController.getSettings);

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

// Blog
router.get('/api/blog', blogController.getPublished);
router.get('/api/blog/slug/:slug', blogController.getBySlug);
router.get('/api/blog/:id', blogController.getById);

// Categories
const categoryController = new CategoryController();
router.get('/api/categories', categoryController.getAll);
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

// Admin Blog
router.get('/api/admin/blog', authMiddleware, blogController.getAll);
router.post('/api/admin/blog', authMiddleware, blogController.create);
router.put('/api/admin/blog/:id', authMiddleware, blogController.update);
router.delete('/api/admin/blog/:id', authMiddleware, blogController.delete);

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
router.post('/api/admin/media/upload', authMiddleware, uploadMiddleware, mediaUploadController.upload);
router.delete('/api/admin/media/:publicId', authMiddleware, mediaUploadController.delete);

export default router;