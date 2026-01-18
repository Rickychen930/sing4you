import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryConfig {
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) {
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });

    this.initialized = true;
    console.log('Cloudinary initialized');
  }

  public static getInstance() {
    if (!this.initialized) {
      this.initialize();
    }
    return cloudinary;
  }
}