// server/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Education', 'Sports', 'Business', 'Food', 'Art', 'Technology', 'Other']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ticketAvailability: {
    type: Number,
    required: true,
    min: 0
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: 'https://placehold.co/800x400/random?text=Event'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for searching and filtering
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ location: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;