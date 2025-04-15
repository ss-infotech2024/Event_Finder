// server/controllers/eventController.js
const Event = require('../models/Event');
const User = require('../models/User');

// Get all events (with optional filtering)
exports.getEvents = async (req, res) => {
  try {
    const { search, category, date, location } = req.query;
    const query = {};

    // Apply search filter if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // Apply date filter if provided
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    // Apply location filter if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name')
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending events
exports.getTrendingEvents = async (req, res) => {
  try {
    // For now, we'll just return the most recent events as trending
    // In a real app, you would track views, likes, etc.
    const trendingEvents = await Event.find()
      .populate('organizer', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json(trendingEvents);
  } catch (error) {
    console.error('Get trending events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recommended events
exports.getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    // For now, we'll just return events in the user's interests
    // If user has no interests, return recent events across categories
    let recommendedEvents;
    
    if (user.interests && user.interests.length > 0) {
      recommendedEvents = await Event.find({ category: { $in: user.interests } })
        .populate('organizer', 'name')
        .sort({ date: 1 })
        .limit(6);
    } else {
      recommendedEvents = await Event.find()
        .populate('organizer', 'name')
        .sort({ createdAt: -1 })
        .limit(6);
    }

    res.status(200).json(recommendedEvents);
  } catch (error) {
    console.error('Get recommended events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event categories
exports.getCategories = async (req, res) => {
  try {
    const categories = ['Music', 'Education', 'Sports', 'Business', 'Food', 'Art', 'Technology', 'Other'];
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Fetching event with ID:', eventId);
    
    // Check if ID is in valid MongoDB ObjectId format
    const mongoose = require('mongoose');
    const isValidObjectId = mongoose.Types.ObjectId.isValid(eventId);
    
    if (!isValidObjectId) {
      console.log('Invalid ObjectId format:', eventId);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const event = await Event.findById(eventId).populate('organizer', 'name');
    
    if (!event) {
      console.log('Event not found with ID:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    console.log('Event found:', event.title);
    res.status(200).json(event);
  } catch (error) {
    console.error(`Get event by ID error: ${error.message}`, error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to validate and sanitize image URLs
const validateImageUrl = (imageUrl, title) => {
  // Check if image URL is provided and is a valid URL
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    // Return a default placeholder with event title
    return `https://placehold.co/800x400/random?text=${encodeURIComponent(title)}`;
  }

  // Check if it's a valid URL format
  try {
    new URL(imageUrl);
    
    // Check if it appears to be an image URL (has image extension or from known image service)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => imageUrl.toLowerCase().endsWith(ext));
    
    const imageServices = [
      'placehold.co',
      'placeholder.com',
      'picsum.photos',
      'cloudinary.com',
      'imgur.com',
      'unsplash.com'
    ];
    const isImageService = imageServices.some(service => imageUrl.includes(service));
    
    if (hasImageExtension || isImageService) {
      return imageUrl; // Valid image URL
    }
  } catch (error) {
    // Not a valid URL
    console.log('Invalid image URL format:', imageUrl);
  }
  
  // If we got here, the URL is invalid or not an image
  // Return a category-based placeholder
  return getDefaultImageForCategory(title);
};

// Helper to get a default image for a category
const getDefaultImageForCategory = (title) => {
  return `https://placehold.co/800x400/random?text=${encodeURIComponent(title)}`;
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      date, 
      time, 
      location, 
      ticketAvailability, 
      ticketPrice, 
      image 
    } = req.body;
    
    if (!title || !description || !category || !date || !time || !location) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Get the user ID from auth middleware
    const userId = req.userId;
    
    // Validate and sanitize the image URL
    const validatedImage = validateImageUrl(image, title);
    
    const newEvent = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      ticketAvailability: ticketAvailability || 0,
      ticketPrice: ticketPrice || 0,
      image: validatedImage,
      organizer: userId
    });
    
    await newEvent.save();
    
    // Populate the organizer field for the response
    const populatedEvent = await Event.findById(newEvent._id).populate('organizer', 'name');
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error during event creation' });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { 
      title, 
      description, 
      category, 
      date, 
      time, 
      location, 
      ticketAvailability, 
      ticketPrice, 
      image 
    } = req.body;
    
    // Check if ID is in valid MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Validate and sanitize the image URL if provided
    const validatedImage = image ? validateImageUrl(image, title || event.title) : event.image;
    
    // Update event fields
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title: title || event.title,
        description: description || event.description,
        category: category || event.category,
        date: date || event.date,
        time: time || event.time,
        location: location || event.location,
        ticketAvailability: ticketAvailability || event.ticketAvailability,
        ticketPrice: ticketPrice || event.ticketPrice,
        image: validatedImage
      },
      { new: true }
    ).populate('organizer', 'name');
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(`Update event error: ${error.message}`);
    res.status(500).json({ message: 'Server error during event update' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if ID is in valid MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }
    
    await Event.findByIdAndDelete(eventId);
    
    res.status(200).json({ message: 'Event successfully deleted' });
  } catch (error) {
    console.error(`Delete event error: ${error.message}`);
    res.status(500).json({ message: 'Server error during event deletion' });
  }
};