import React, { useState, useRef, useCallback } from 'react';
import { mediaService } from '../../services/mediaService';
import { useToastStore } from '../../stores/toastStore';
import { cn } from '../../utils/helpers';
import { LoadingSpinner } from './LoadingSpinner';
import { LazyImage } from './LazyImage';

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number; // Use Infinity for unlimited
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  label = 'Images',
  className,
  accept = 'image/png,image/jpeg,image/jpg,image/heic,image/heif,image/gif,image/webp',
  maxSizeMB = 10,
  maxFiles = Infinity, // Default to unlimited
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToastStore((state) => state);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files limit (only if maxFiles is not Infinity)
    if (maxFiles !== Infinity && value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed. You can add ${maxFiles - value.length} more.`);
      return;
    }

    // Validate all files
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
    ];
    
    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} is too large. Max size: ${maxSizeMB}MB`);
        continue;
      }
      
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];
      const isValidMimeType = allowedMimeTypes.includes(file.type);
      const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);
      
      if (!isValidMimeType && !isValidExtension) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Upload files one by one
    setIsUploading(true);
    const newUrls: string[] = [...value];
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadingIndex(i);
      
      try {
        const response = await mediaService.uploadFile(file);
        newUrls.push(response.data.url);
      } catch (error) {
        const err = error as Error;
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
    
    onChange(newUrls);
    setIsUploading(false);
    setUploadingIndex(null);
    
    if (validFiles.length > 0) {
      toast.success(`Successfully uploaded ${validFiles.length} image(s)`);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value, maxSizeMB, maxFiles, toast, onChange]);

  const handleRemove = useCallback((index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
    toast.success('Image removed');
  }, [value, onChange, toast]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const newUrls = [...value];
    const [removed] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, removed);
    onChange(newUrls);
  }, [value, onChange]);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm sm:text-base font-medium text-gray-200 font-sans mb-2 sm:mb-2.5 lg:mb-3">
          {label}{maxFiles !== Infinity && ` (${value.length}/${maxFiles})`}
        </label>
      )}

      <div className="space-y-3 sm:space-y-4">
        {/* Image Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-gold-900/50 hover:border-gold-700/80 bg-black/80 group"
              >
                <LazyImage
                  src={url}
                  alt={`${label} ${index + 1}`}
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index - 1)}
                      className="p-2 bg-gold-600/90 hover:bg-gold-600 text-white rounded-full transition-all"
                      aria-label="Move left"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  {index < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index + 1)}
                      className="p-2 bg-gold-600/90 hover:bg-gold-600 text-white rounded-full transition-all"
                      aria-label="Move right"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-all"
                    aria-label="Remove image"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {(maxFiles === Infinity || value.length < maxFiles) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
              multiple
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className={cn(
                'px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 border-2 border-gold-900/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold',
                'text-gray-200 bg-jazz-900/90 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-gold-800/50',
                'hover:border-gold-700/80 hover:shadow-[0_8px_20px_rgba(255,194,51,0.3)]',
                'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-300 min-h-[44px] sm:min-h-[48px] flex items-center justify-center w-full sm:w-auto',
                'hover:drop-shadow-[0_0_10px_rgba(255,194,51,0.4)]'
              )}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Uploading{uploadingIndex !== null ? ` (${uploadingIndex + 1}/${value.length + 1})` : ''}...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Upload Images
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-300">
          Max file size: {maxSizeMB}MB per image. Supported: PNG, JPG, JPEG, HEIF, GIF, WebP.{maxFiles === Infinity ? ' Unlimited images.' : ` Max ${maxFiles} images.`}
        </p>
      </div>
    </div>
  );
};
