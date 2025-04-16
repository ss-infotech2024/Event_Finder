// client/src/services/eventService.js
import axios from 'axios';
import { processEventsWithImages, ensureEventImage } from '../utils/imageUtils';

const API_URL = 'http://localhost:5000/api/events';

// Configure axios to include the auth token in all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Get all events with optional filters
export const getEvents = async (filters = {}) => {
  try {
    const { search, category, date, location } = filters;
    
    let queryString = '';
    if (search) queryString += `search=${encodeURIComponent(search)}&`;
    if (category) queryString += `category=${encodeURIComponent(category)}&`;
    if (date) queryString += `date=${encodeURIComponent(date)}&`;
    if (location) queryString += `location=${encodeURIComponent(location)}&`;
    
    const response = await axios.get(`${API_URL}?${queryString}`);
    console.log('Events data:', response.data);
    console.log('Sample event with image?', response.data.length > 0 ? response.data[0].image : 'No events');
    
    // Process events to ensure they all have valid images
    const processedEvents = processEventsWithImages(response.data);
    return processedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get trending events
export const getTrendingEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/trending`);
    console.log('Trending events data:', response.data);
    
    // Debug image issues
    if (response.data.length > 0) {
      console.log('Sample trending event:', response.data[0]);
      console.log('Has image field?', response.data[0].hasOwnProperty('image'));
      console.log('Image value:', response.data[0].image);
    } else {
      console.log('No trending events returned');
    }
    
    // Process events to ensure they all have valid images
    const processedEvents = processEventsWithImages(response.data);
    return processedEvents;
  } catch (error) {
    console.error('Error fetching trending events:', error);
    throw error;
  }
};

// Get recommended events
export const getRecommendedEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/recommended`);
    console.log('Recommended events data:', response.data);
    
    // Debug image issues
    if (response.data.length > 0) {
      console.log('Sample recommended event:', response.data[0]);
      console.log('Has image field?', response.data[0].hasOwnProperty('image'));
      console.log('Image value:', response.data[0].image);
    } else {
      console.log('No recommended events returned');
    }
    
    // Process events to ensure they all have valid images
    const processedEvents = processEventsWithImages(response.data);
    return processedEvents;
  } catch (error) {
    console.error('Error fetching recommended events:', error);
    throw error;
  }
};

// Get event categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get single event by ID - improve to handle potential ObjectID issues
export const getEventById = async (id) => {
  try {
    console.log('Fetching event with ID:', id);
    
    // Handle empty or invalid IDs
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid event ID provided:', id);
      throw new Error('Invalid event ID');
    }
    
    const response = await axios.get(`${API_URL}/${id}`);
    console.log('Event data received:', response.data);
    
    // Debug image issues
    console.log('Has image field?', response.data.hasOwnProperty('image'));
    console.log('Image value:', response.data.image);
    
    // Ensure event has a valid image
    const processedEvent = ensureEventImage(response.data);
    return processedEvent;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    // Add more detailed error info for debugging
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    console.log('Creating event with data:', eventData);
    console.log('Image included in request?', eventData.hasOwnProperty('image'));
    console.log('Image value:', eventData.image);
    
    // Ensure the event has a valid image before sending to server
    const processedEventData = ensureEventImage(eventData);
    
    const response = await axios.post(API_URL, processedEventData);
    console.log('Created event response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  try {
    console.log('Updating event with ID:', id);
    console.log('Image included in update?', eventData.hasOwnProperty('image'));
    console.log('Image value:', eventData.image);
    
    // Ensure the event has a valid image before sending to server
    const processedEventData = ensureEventImage(eventData);
    
    const response = await axios.put(`${API_URL}/${id}`, processedEventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};