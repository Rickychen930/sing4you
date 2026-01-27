import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { resolve, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { CloudinaryConfig } from '../config/cloudinary';

// Determine upload directory path
// Priority: UPLOAD_DIR > BACKEND_ROOT/uploads > default paths
const getUploadDir = (): string => {
  let uploadDir: string;
  
  // If UPLOAD_DIR is explicitly set, use it (highest priority)
  if (process.env.UPLOAD_DIR) {
    uploadDir = resolve(process.env.UPLOAD_DIR);
  } 
  // In production/VPS, use UPLOAD_DIR > PROJECT_ROOT/uploads > default paths
  // RECOMMENDED: Shared uploads directory at project root (safest, never deleted)
  else if (process.env.NODE_ENV === 'production') {
    // Priority 1: UPLOAD_DIR (explicitly set - highest priority)
    // Priority 2: PROJECT_ROOT/uploads (recommended - shared, safe location)
    if (process.env.BACKEND_ROOT) {
      // Use parent directory of BACKEND_ROOT as project root
      const projectRoot = resolve(process.env.BACKEND_ROOT, '..');
      uploadDir = resolve(projectRoot, 'uploads');
    } 
    // Priority 3: Default VPS path (project root/uploads)
    else {
      uploadDir = resolve('/var/www/christina-sings4you/uploads');
    }
  } 
  // In development, use project root/uploads
  // Use process.cwd() to get project root (works in both dev and production)
  else {
    // process.cwd() returns the current working directory (project root)
    uploadDir = resolve(process.cwd(), 'uploads');
  }
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  }
  
  return uploadDir;
};

const uploadDir = getUploadDir();

// Log upload directory path (both dev and production for debugging)
console.log(`📁 Upload directory: ${uploadDir}`);
console.log(`📁 Upload directory exists: ${existsSync(uploadDir)}`);
if (process.env.NODE_ENV === 'production') {
  console.log(`📁 Production mode - BACKEND_ROOT: ${process.env.BACKEND_ROOT || 'not set'}`);
  console.log(`📁 Production mode - UPLOAD_DIR: ${process.env.UPLOAD_DIR || 'not set'}`);
  if (process.env.BACKEND_ROOT) {
    const projectRoot = resolve(process.env.BACKEND_ROOT, '..');
    console.log(`📁 Production mode - Project Root: ${projectRoot}`);
    console.log(`📁 Production mode - Uploads will be at: ${resolve(projectRoot, 'uploads')}`);
  }
}

// Configure multer for disk storage (local file system)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    const name = file.originalname.split('.').slice(0, -1).join('.');
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${timestamp}-${random}-${sanitizedName}.${ext}`;
    cb(null, filename);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept images and videos
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/heic-sequence',
      'image/heif-sequence',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ];

    // Also check file extension as fallback (some browsers may not send correct MIME type)
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'mp4', 'webm', 'ogg'];

    if (allowedMimes.includes(file.mimetype) || (fileExtension && allowedExtensions.includes(fileExtension))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (PNG, JPG, JPEG, GIF, WebP, HEIF) and videos (MP4, WebM) are allowed.'));
    }
  },
});

export const uploadMiddleware = upload.single('file');

export class MediaUploadController {
  public upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded.',
        });
        return;
      }

      // Check if we should use Cloudinary or local storage
      const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                           process.env.CLOUDINARY_API_KEY && 
                           process.env.CLOUDINARY_API_SECRET;

      if (useCloudinary) {
        // Use Cloudinary if configured
        CloudinaryConfig.initialize();
        const cloudinaryInstance = CloudinaryConfig.getInstance();

        // Read file from disk and convert to base64 for Cloudinary
        const fs = await import('fs/promises');
        const fileBuffer = await fs.readFile(req.file.path);
        const base64File = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinaryInstance.uploader.upload(base64File, {
          folder: 'christinasings4u',
          resource_type: 'auto',
          transformation: [
            {
              quality: 'auto:good',
              fetch_format: 'auto',
            },
          ],
        });

        // Delete local file after successful Cloudinary upload
        try {
          unlinkSync(req.file.path);
        } catch {
          // Ignore deletion errors
        }

        res.json({
          success: true,
          data: {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            resourceType: uploadResult.resource_type,
            bytes: uploadResult.bytes,
          },
        });
      } else {
        // Use local storage
        const filename = req.file.filename;
        const filePath = req.file.path;
        // Generate URL: /uploads/filename
        const url = `/uploads/${filename}`;

        // CRITICAL: Verify file actually exists after upload
        if (!existsSync(filePath)) {
          console.error(`❌ ERROR: File was not saved! Path: ${filePath}`);
          res.status(500).json({
            success: false,
            error: 'File upload failed: file was not saved to disk.',
            details: {
              filename,
              filePath,
              uploadDir,
              uploadDirExists: existsSync(uploadDir),
            },
          });
          return;
        }

        // Verify file size matches
        const fs = await import('fs/promises');
        const stats = await fs.stat(filePath).catch(() => null);
        if (!stats) {
          console.error(`❌ ERROR: Cannot read file stats! Path: ${filePath}`);
          res.status(500).json({
            success: false,
            error: 'File upload failed: cannot verify file.',
            details: {
              filename,
              filePath,
            },
          });
          return;
        }

        if (stats.size !== req.file.size) {
          console.warn(`⚠️  WARNING: File size mismatch! Expected: ${req.file.size}, Actual: ${stats.size}`);
        }

        // Log upload details (both dev and production for debugging)
        console.log(`📤 File uploaded successfully:`);
        console.log(`   - Filename: ${filename}`);
        console.log(`   - File path: ${filePath}`);
        console.log(`   - URL: ${url}`);
        console.log(`   - Size: ${req.file.size} bytes (verified: ${stats.size} bytes)`);
        console.log(`   - File exists: ${existsSync(filePath)}`);
        console.log(`   - Upload directory: ${uploadDir}`);
        console.log(`   - Upload directory exists: ${existsSync(uploadDir)}`);
        console.log(`   - File permissions: ${stats.mode.toString(8)}`);
        console.log(`   - File readable: ${(stats.mode & parseInt('444', 8)) !== 0}`);

        res.json({
          success: true,
          data: {
            url,
            filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            verified: true, // Indicate file was verified
          },
        });
      }
    } catch (error) {
      // Clean up file on error
      if (req.file?.path && existsSync(req.file.path)) {
        try {
          unlinkSync(req.file.path);
        } catch {
          // Ignore deletion errors
        }
      }
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicId = req.query.publicId as string | undefined;
      const filename = req.query.filename as string | undefined;

      // Check if we should use Cloudinary or local storage
      const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && publicId;

      if (useCloudinary && publicId) {
        // Delete from Cloudinary
        CloudinaryConfig.initialize();
        const cloudinaryInstance = CloudinaryConfig.getInstance();
        const result = await cloudinaryInstance.uploader.destroy(publicId);

        if (result.result === 'ok') {
          res.json({
            success: true,
            message: 'Media deleted successfully.',
          });
        } else {
          res.status(404).json({
            success: false,
            error: 'Media not found or already deleted.',
          });
        }
      } else if (filename) {
        // Delete from local storage
        const filePath = join(uploadDir, filename);
        
        if (existsSync(filePath)) {
          try {
            unlinkSync(filePath);
            res.json({
              success: true,
              message: 'Media deleted successfully.',
            });
          } catch {
            res.status(500).json({
              success: false,
              error: 'Failed to delete file.',
            });
          }
        } else {
          res.status(404).json({
            success: false,
            error: 'File not found.',
          });
        }
      } else {
        res.status(400).json({
          success: false,
          error: 'Either publicId (for Cloudinary) or filename (for local) is required.',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

// Export upload directory path for static file serving
export const getUploadDirectory = (): string => uploadDir;
