/**
 * Ensures an event has a valid image URL
 * If the image is missing or invalid, assigns a default image based on category
 * 
 * @param {Object} event - The event object to process
 * @returns {Object} - The event with a guaranteed image URL
 */
export const ensureEventImage = (event) => {
  if (!event) return event;
  
  // If event already has a valid image, return as is
  if (event.image && typeof event.image === 'string' && event.image.trim() !== '') {
    return event;
  }
  
  // Get a category-based image or general fallback
  const image = getCategoryImage(event.category || 'Other', event.title || 'Event');
  
  // Return event with the image field added/replaced
  return {
    ...event,
    image
  };
};

/**
 * Processes an array of events to ensure they all have valid images
 * 
 * @param {Array} events - Array of event objects 
 * @returns {Array} - Processed events with valid images
 */
export const processEventsWithImages = (events) => {
  if (!Array.isArray(events)) return [];
  
  return events.map(event => ensureEventImage(event));
};

/**
 * Returns an appropriate image URL based on event category
 * 
 * @param {string} category - The event category 
 * @param {string} title - The event title (for fallback text)
 * @returns {string} - URL for category-specific image
 */
export const getCategoryImage = (category, title = 'Event') => {
  const encodedTitle = encodeURIComponent(title);
  
  const categoryImages = {
    'Music': `https://placehold.co/800x400/coral/white?text=${encodedTitle}`,
    'Education': `https://placehold.co/800x400/lightblue/black?text=${encodedTitle}`,
    'Sports': `https://placehold.co/800x400/orange/white?text=${encodedTitle}`,
    'Technology': `https://placehold.co/800x400/purple/white?text=${encodedTitle}`,
    'Arts': `https://placehold.co/800x400/pink/white?text=${encodedTitle}`,
    'Food': `https://placehold.co/800x400/green/white?text=${encodedTitle}`,
    'Business': `https://placehold.co/800x400/gray/white?text=${encodedTitle}`,
    'Health': `https://placehold.co/800x400/teal/white?text=${encodedTitle}`,
    'Art': `https://placehold.co/800x400/pink/white?text=${encodedTitle}`, // For backend compatibility
    'Other': `https://placehold.co/800x400/blue/white?text=${encodedTitle}`
  };
  
  return categoryImages[category] || categoryImages['Other'];
};

/**
 * Validates if a URL is likely an image URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL appears to be an image
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  // Check for image service URLs
  const isImageService = [
    'placehold.co',
    'placeholder.com',
    'picsum.photos',
    'cloudinary.com',
    'imgur.com',
    'unsplash.com'
  ].some(service => url.includes(service));
  
  return hasImageExtension || isImageService;
}; 