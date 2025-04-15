// server/check-events.js
const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const checkEvents = async () => {
  try {
    const events = await Event.find();
    console.log(`Found ${events.length} events in the database:`);
    
    events.forEach(event => {
      console.log(`- ${event._id} | ${event.title} | ${event.category}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking events:', error);
    mongoose.connection.close();
  }
};

checkEvents(); 