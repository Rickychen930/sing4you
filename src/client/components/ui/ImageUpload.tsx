import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
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

export const ImageUpload: React.FC<ImageUploadProps> = memo(({
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
  const errorShownRef = useRef(false);
  const toast = useToastStore((state) => state);

  // Sync preview with value prop when it changes externally
  useEffect(() => {
    if (value && value.trim() !== '') {
      // Add cache busting to force browser reload
      const urlWithCacheBust = `${value}${value.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      setPreview(urlWithCacheBust);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const uploadedUrl = response.data.url;
      
      // Add cache busting to URL to force browser reload
      const urlWithCacheBust = `${uploadedUrl}${uploadedUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      
      // Update preview immediately with uploaded URL (with cache bust)
      setPreview(urlWithCacheBust);
      
      // Call onChange with original URL (without cache bust, server will handle it)
      onChange(uploadedUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to upload image');
      // Revert preview to previous value on error
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxSizeMB, toast, value, onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm sm:text-base font-medium text-gray-200 font-sans mb-2 sm:mb-2.5 lg:mb-3">
          {label}
        </label>
      )}

      <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
        {/* Preview */}
        {showPreview && preview && (
          <div className="relative w-full max-w-md mx-auto sm:mx-0">
            <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-gold-900/60 sm:border-gold-900/50 hover:border-gold-800/70 bg-gradient-to-br from-jazz-900/80 sm:from-jazz-900/70 to-jazz-800/80 sm:to-jazz-800/70 shadow-[0_10px_28px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,194,51,0.12)_inset] hover:shadow-[0_14px_36px_rgba(255,194,51,0.25),0_0_0_1px_rgba(255,194,51,0.2)_inset] backdrop-blur-sm group transition-all duration-300 hover:scale-[1.01]">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 via-musical-500/15 to-gold-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
              {preview.startsWith('data:video') || preview.includes('video') ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                  aria-label="Video preview"
                />
              ) : (
                <img
                  src={preview}
                  alt={`${label} preview`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    // Prevent error from bubbling and showing in console
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // If image fails to load, try without cache bust
                    const urlWithoutCacheBust = preview.split('?')[0].split('&')[0];
                    if (urlWithoutCacheBust !== preview) {
                      setPreview(urlWithoutCacheBust);
                    } else {
                      // If still fails, show placeholder
                      setPreview(null);
                      // Only show error once per image
                      if (!errorShownRef.current) {
                        errorShownRef.current = true;
                        toast.error('Image not found. Please upload a new image.');
                        // Reset after a delay to allow showing error again if user tries different image
                        setTimeout(() => {
                          errorShownRef.current = false;
                        }, 5000);
                      }
                    }
                  }}
                  key={preview} // Force re-render when preview changes
                />
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-600/95 sm:bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1.5 sm:p-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_6px_18px_rgba(239,68,68,0.35)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] backdrop-blur-sm border-2 border-red-500/60 sm:border-red-500/50 hover:border-red-400/80 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
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
            aria-label={value ? "Change image" : "Upload image"}
            className={cn(
              'px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 border-2 border-gold-900/60 sm:border-gold-900/50 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold',
              'text-gray-200 bg-jazz-900/90 sm:bg-jazz-900/80 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-gold-800/50',
              'hover:border-gold-700/80 hover:shadow-[0_8px_20px_rgba(255,194,51,0.3),0_0_0_1px_rgba(255,194,51,0.15)]',
              'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-jazz-900/80',
              'transition-all duration-300 min-h-[44px] sm:min-h-[48px] flex items-center justify-center w-full sm:w-auto hover:drop-shadow-[0_0_10px_rgba(255,194,51,0.4)] hover:scale-[1.02] active:scale-[0.98] group/upload'
            )}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm sm:text-base">Uploading...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {value ? 'Change Image' : 'Upload Image'}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/upload:translate-y-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </span>
            )}
          </button>
          {value && (
            <span className="text-xs sm:text-sm text-gray-300 flex items-center justify-center sm:justify-start">
              or{' '}
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove current image"
                className="text-red-400 hover:text-red-300 underline font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1 min-h-[44px] sm:min-h-[48px] flex items-center hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.4)] touch-manipulation"
              >
                remove
              </button>
            </span>
          )}
        </div>

        {/* Current URL Display - Show if value exists but preview failed to load */}
        {value && !preview && (
          <div className="text-xs sm:text-sm text-gray-200 font-sans break-all p-2 bg-jazz-900/50 rounded border border-gold-900/30">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-gray-300 block mb-1">Current URL: </span>
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold-400 hover:text-gold-300 underline transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] break-all"
                >
                  {value}
                </a>
                <p className="text-red-400 text-xs mt-1">⚠️ Image not found. Please upload a new image or check if the file exists on the server.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Try to load preview with cache busting
                  const urlWithCacheBust = `${value}${value.includes('?') ? '&' : '?'}_t=${Date.now()}`;
                  setPreview(urlWithCacheBust);
                }}
                className="ml-2 text-xs text-gold-400 hover:text-gold-300 underline whitespace-nowrap"
              >
                Load Preview
              </button>
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-300">
          Max file size: {maxSizeMB}MB. Supported: Images (PNG, JPG, JPEG, HEIF, GIF, WebP) and Videos (MP4, WebM)
        </p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // OPTIMIZED: Memo comparison - skip className for better performance
  return (
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.accept === nextProps.accept &&
    prevProps.maxSizeMB === nextProps.maxSizeMB &&
    prevProps.showPreview === nextProps.showPreview &&
    prevProps.onChange === nextProps.onChange
    // Removed className comparison - it changes too frequently
  );
});

ImageUpload.displayName = 'ImageUpload';
