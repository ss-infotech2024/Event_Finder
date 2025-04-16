import React, { useState, useEffect } from 'react';
import { isValidImageUrl } from '../utils/imageUtils';

/**
 * A component that displays an image with fallback handling
 * for when images fail to load
 */
const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  // Generate a fallback image URL based on the alt text
  const fallbackSrc = `https://placehold.co/800x400/4f46e5/ffffff?text=${encodeURIComponent(alt || 'Event')}`;
  
  // Validate and set image source when component mounts or src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    
    // Check if src is a valid image URL
    if (!src || !isValidImageUrl(src)) {
      console.log('Invalid image source, using fallback:', src);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }
    
    // Check if src contains a filename being used as placeholder text
    // This is a common error pattern we need to detect
    if (src.includes('?text=WhatsApp') || 
        src.includes('?text=IMG_') || 
        src.includes('?text=image') ||
        /\?text=.*\.(jpg|jpeg|png|gif)/i.test(src)) {
      console.log('Detected filename being used as placeholder text:', src);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }
    
    console.log('Setting valid image source:', src);
    setImgSrc(src);
  }, [src, alt, fallbackSrc]);

  const handleError = () => {
    console.log(`Image failed to load: ${imgSrc}`);
    console.log('Using fallback instead:', fallbackSrc);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${imgSrc}`);
    setIsLoading(false);
  };

  return (
    <div className={`image-container ${isLoading ? 'loading' : ''} ${className || ''}`}>
      {isLoading && (
        <div className="image-loading-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt || 'Event'}
        onError={handleError}
        onLoad={handleLoad}
        style={{ opacity: isLoading ? 0 : 1 }}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback; 