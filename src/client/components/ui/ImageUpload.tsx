import React, { useState, useRef } from 'react';
import { mediaService } from '../../services/mediaService';
import { useToastStore } from '../../stores/toastStore';
import { cn } from '../../utils/helpers';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  className,
  accept = 'image/png,image/jpeg,image/jpg,image/heic,image/heif,image/gif,image/webp',
  maxSizeMB = 10,
  showPreview = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToastStore((state) => state);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type - check MIME type and file extension
    const allowedMimeTypes = [
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
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'mp4', 'webm', 'ogg'];
    
    const isValidMimeType = allowedMimeTypes.includes(file.type);
    const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);
    const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
    
    if (!isValidMimeType && !isValidExtension && !isImageOrVideo) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, HEIF, GIF, WebP) or video file');
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setIsUploading(true);
    try {
      const response = await mediaService.uploadFile(file);
      onChange(response.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to upload image');
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Preview */}
        {showPreview && preview && (
          <div className="relative w-full max-w-md">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gold-900/50 bg-gradient-to-br from-jazz-900/60 to-jazz-800/60 shadow-elegant backdrop-blur-sm">
              {preview.startsWith('data:video') || preview.includes('video') ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className={cn(
              'px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium',
              'text-gray-200 bg-jazz-900/60 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-gold-800/30',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-300'
            )}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Uploading...
              </span>
            ) : value ? (
              'Change Image'
            ) : (
              'Upload Image'
            )}
          </button>
          {value && (
            <span className="text-sm text-gray-400">
              or{' '}
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-400 hover:text-red-300 underline font-medium transition-colors"
              >
                remove
              </button>
            </span>
          )}
        </div>

        {/* Current URL Display */}
        {value && !preview && (
          <div className="text-sm text-gray-300 break-all">
            Current: <a href={value} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline transition-colors">{value}</a>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Max file size: {maxSizeMB}MB. Supported: Images (PNG, JPG, JPEG, HEIF, GIF, WebP) and Videos (MP4, WebM)
        </p>
      </div>
    </div>
  );
};
