import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CloudinaryConfig } from '../config/cloudinary';
import { getRequiredStringParam } from '../utils/requestHelpers';

// Configure multer for memory storage (Cloudinary requires buffer)
const storage = multer.memoryStorage();
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
  public upload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded.',
        });
        return;
      }

      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        res.status(500).json({
          success: false,
          error: 'Cloudinary is not configured. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.',
        });
        return;
      }

      // Initialize Cloudinary
      CloudinaryConfig.initialize();
      const cloudinaryInstance = CloudinaryConfig.getInstance();

      // Convert buffer to base64 for Cloudinary
      const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinaryInstance.uploader.upload(base64File, {
        folder: 'christinasings4u', // Organize uploads in a folder
        resource_type: 'auto', // Automatically detect image or video
        transformation: [
          {
            quality: 'auto:good', // Optimize quality
            fetch_format: 'auto', // Auto format (webp for images)
          },
        ],
      });

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
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicId = getRequiredStringParam(req, 'publicId');

      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        res.status(500).json({
          success: false,
          error: 'Cloudinary is not configured.',
        });
        return;
      }

      // Initialize Cloudinary
      CloudinaryConfig.initialize();
      const cloudinaryInstance = CloudinaryConfig.getInstance();

      // Delete from Cloudinary
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
    } catch (error) {
      next(error);
    }
  };
}
