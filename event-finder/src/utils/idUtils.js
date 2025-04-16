/**
 * Safely extract an ID from an event object, handling both MongoDB _id and regular id
 * @param {Object} event - The event object
 * @returns {string} - The ID as a string
 */
export const getEventId = (event) => {
  if (!event) return '';
  
  // Check for MongoDB _id
  if (event._id) {
    return typeof event._id === 'object' && event._id.toString 
      ? event._id.toString() 
      : event._id;
  }
  
  // Fallback to regular id
  return event.id ? event.id.toString() : '';
};

/**
 * Safely check if an ID is valid (not empty)
 * @param {string} id - The ID to check
 * @returns {boolean} - Whether the ID is valid
 */
export const isValidId = (id) => {
  return !!id && id.length > 0;
}; 