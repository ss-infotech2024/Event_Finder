// client/src/pages/CreateEvent.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEventById, createEvent, updateEvent } from '../services/eventService';
import '../styles/createEvent.css';

const CreateEvent = ({ isEditing = false }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    ticketAvailability: '',
    ticketPrice: '',
    image: ''
  });
  
  // Image file state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  
  // Available categories
  const categories = [
    'Music', 
    'Education', 
    'Sports', 
    'Technology', 
    'Arts', 
    'Food', 
    'Business', 
    'Health',
    'Other'
  ];
  
  // Sample events data (in a real app, you would fetch from API)
  const sampleEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      description: 'Join us for three days of amazing live music performances featuring top artists from around the world. The festival will include multiple stages, food vendors, art installations, and camping options.',
      category: 'Music',
      date: '2025-06-15',
      time: '18:00',
      location: 'Central Park, New York',
      ticketAvailability: 500,
      ticketPrice: 75,
      image: 'https://placehold.co/800x400/coral/white?text=Music+Event',
      organizer: {
        id: 'test123',
        name: 'NYC Events'
      }
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      description: 'Intensive 2-day workshop covering the latest web development techniques and tools. Perfect for beginners and intermediate developers looking to enhance their skills.',
      category: 'Education',
      date: '2025-05-20',
      time: '09:00',
      location: 'Tech Hub, San Francisco',
      ticketAvailability: 50,
      ticketPrice: 120,
      image: 'https://placehold.co/800x400/lightblue/black?text=Tech+Bootcamp',
      organizer: {
        id: 'test123',
        name: 'CodeMasters'
      }
    }
  ];
  
  // Fetch event details if editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      
      const fetchEvent = async () => {
        try {
          // Get event details from API
          const eventData = await getEventById(id);
          
          if (eventData) {
            // Format data for form inputs
            setFormData({
              title: eventData.title,
              description: eventData.description,
              category: eventData.category,
              date: formatDateForInput(eventData.date),
              time: formatTimeForInput(eventData.date),
              location: eventData.location,
              ticketAvailability: eventData.ticketAvailability.toString(),
              ticketPrice: eventData.ticketPrice.toString(),
              image: eventData.image
            });
            
            // Set image preview if there's an image
            if (eventData.image) {
              setImagePreview(eventData.image);
            }
          } else {
            // Fallback to sample data if needed
            const eventToEdit = sampleEvents.find(e => e.id === parseInt(id));
            if (eventToEdit) {
              setFormData({
                title: eventToEdit.title,
                description: eventToEdit.description,
                category: eventToEdit.category,
                date: eventToEdit.date,
                time: eventToEdit.time,
                location: eventToEdit.location,
                ticketAvailability: eventToEdit.ticketAvailability.toString(),
                ticketPrice: eventToEdit.ticketPrice.toString(),
                image: eventToEdit.image
              });
            } else {
              alert('Event not found');
              navigate('/home');
            }
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          // Fallback to sample data if API fails
          const eventToEdit = sampleEvents.find(e => e.id === parseInt(id));
          if (eventToEdit) {
            setFormData({
              title: eventToEdit.title,
              description: eventToEdit.description,
              category: eventToEdit.category,
              date: eventToEdit.date,
              time: eventToEdit.time,
              location: eventToEdit.location,
              ticketAvailability: eventToEdit.ticketAvailability.toString(),
              ticketPrice: eventToEdit.ticketPrice.toString(),
              image: eventToEdit.image
            });
          } else {
            alert('Event not found');
            navigate('/home');
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [isEditing, id, navigate]);
  
  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Format time for input (HH:MM)
  const formatTimeForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user changes input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: 'Only JPG, JPEG, and PNG files are allowed'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size must be less than 5MB'
        });
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear any existing image error
      if (errors.image) {
        setErrors({
          ...errors,
          image: null
        });
      }
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    
    // If editing and there was a previous image URL, clear it
    if (formData.image) {
      setFormData({
        ...formData,
        image: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Numeric fields
    if (formData.ticketAvailability === '') {
      newErrors.ticketAvailability = 'Ticket availability is required';
    } else if (isNaN(formData.ticketAvailability) || parseInt(formData.ticketAvailability) < 0) {
      newErrors.ticketAvailability = 'Must be a positive number';
    }
    
    if (formData.ticketPrice === '') {
      newErrors.ticketPrice = 'Ticket price is required';
    } else if (isNaN(formData.ticketPrice) || parseFloat(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare event data with proper structure
      const eventData = {
        ...formData,
        organizer: {
          id: user.id,
          name: user.name
        },
        ticketAvailability: parseInt(formData.ticketAvailability),
        ticketPrice: parseFloat(formData.ticketPrice),
      };

      // Handle image file upload
      if (imageFile) {
        // In a real implementation, we would upload to a server/cloud storage
        // For now, we'll use a more appropriate placeholder image with a unique ID
        // instead of using the filename as text which causes loading issues
        
        // Generate a more appropriate image placeholder 
        // In a real app, this would be replaced with actual image upload code
        
        // Option 1: Use a sample image based on category instead of the filename
        const categoryImage = getCategoryImage(eventData.category);
        eventData.image = categoryImage;
        
        // Option 2: For demo purposes only - use an actual image service 
        // This would be replaced with your actual upload code in production
        // eventData.image = `https://picsum.photos/800/400?random=${Date.now()}`;
      }
      
      // Set default image if none provided
      if (!eventData.image && !imageFile) {
        // Default images based on category
        eventData.image = getCategoryImage(eventData.category);
      }

      // Use our API service functions to save the event
      let savedEvent;
      if (isEditing) {
        savedEvent = await updateEvent(id, eventData);
      } else {
        savedEvent = await createEvent(eventData);
      }

      alert(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/home');
    } catch (error) {
      setIsSubmitting(false);
      alert(`Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} event:`, error);
    }
  };
  
  // Helper function to get appropriate category image
  const getCategoryImage = (category) => {
    const categoryImages = {
      'Music': 'https://placehold.co/800x400/coral/white?text=Music+Event',
      'Education': 'https://placehold.co/800x400/lightblue/black?text=Education+Event',
      'Sports': 'https://placehold.co/800x400/orange/white?text=Sports+Event',
      'Technology': 'https://placehold.co/800x400/purple/white?text=Tech+Event',
      'Arts': 'https://placehold.co/800x400/pink/white?text=Arts+Event',
      'Food': 'https://placehold.co/800x400/green/white?text=Food+Event',
      'Business': 'https://placehold.co/800x400/gray/white?text=Business+Event',
      'Health': 'https://placehold.co/800x400/teal/white?text=Health+Event',
      'Other': 'https://placehold.co/800x400/blue/white?text=Event'
    };
    return categoryImages[category] || categoryImages['Other'];
  };
  
  // Get current date in YYYY-MM-DD format for min date
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  if (!user) {
    return (
      <div className="auth-required-message">
        <h2>Authentication Required</h2>
        <p>You must be logged in to {isEditing ? 'edit' : 'create'} an event.</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }
  
  return (
    <div className="create-event-container">
      <header className="header">
        <div className="header-content">
          <Link to="/home" className="back-button">
            <span>←</span> Back to Events
          </Link>
          <h1 className="site-title">Event Finder</h1>
        </div>
      </header>
      
      <main className="form-container">
        <h1 className="page-title">{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
        
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Describe your event, include details that will help attendees"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location <span className="required">*</span></label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Venue, Address, City"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date <span className="required">*</span></label>
              <input
                type="date"
                id="date"
                name="date"
                min={isEditing ? undefined : getCurrentDate()}
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Time <span className="required">*</span></label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? 'error' : ''}
              />
              {errors.time && <div className="error-message">{errors.time}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ticketAvailability">Available Tickets <span className="required">*</span></label>
              <input
                type="number"
                id="ticketAvailability"
                name="ticketAvailability"
                placeholder="Number of tickets available"
                min="0"
                value={formData.ticketAvailability}
                onChange={handleChange}
                className={errors.ticketAvailability ? 'error' : ''}
              />
              {errors.ticketAvailability && <div className="error-message">{errors.ticketAvailability}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="ticketPrice">Ticket Price ($) <span className="required">*</span></label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                placeholder="Enter 0 for free events"
                min="0"
                step="0.01"
                value={formData.ticketPrice}
                onChange={handleChange}
                className={errors.ticketPrice ? 'error' : ''}
              />
              {errors.ticketPrice && <div className="error-message">{errors.ticketPrice}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Event Image</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="image-preview" 
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {!imagePreview && (
                <div className="upload-placeholder">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className={errors.image ? 'error' : ''}
                  />
                  <label htmlFor="image" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <div>
                      Click to upload image<br />
                      <span className="upload-note">(JPG, JPEG, PNG - max 5MB)</span>
                    </div>
                  </label>
                </div>
              )}
              
              {errors.image && <div className="error-message">{errors.image}</div>}
              <div className="hint">Leave blank to use a default image based on category</div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(isEditing ? `/events/${id}` : '/home')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;