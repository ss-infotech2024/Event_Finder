// server/routes/eventRoutes.js
const express = require('express');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events (with optional filtering)
router.get('/', eventController.getEvents);

// Get trending events
router.get('/trending', eventController.getTrendingEvents);

// Get recommended events (requires authentication)
router.get('/recommended', auth, eventController.getRecommendedEvents);

// Get event categories
router.get('/categories', eventController.getCategories);

// Create a new event (requires authentication)
router.post('/', auth, eventController.createEvent);

// Update an event (requires authentication)
router.put('/:id', auth, eventController.updateEvent);

// Delete an event (requires authentication)
router.delete('/:id', auth, eventController.deleteEvent);

// Get single event by ID - this needs to be last to avoid route conflicts
router.get('/:id', eventController.getEventById);

module.exports = router;