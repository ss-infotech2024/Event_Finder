// server/check-event-ids.js
const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const checkEventIds = async () => {
  try {
    const events = await Event.find();
    console.log(`Found ${events.length} events in the database:`);
    
    events.forEach(event => {
      console.log(`ID: ${event._id}`);
      console.log(`  String ID: ${event._id.toString()}`);
      console.log(`  Is valid ObjectId: ${mongoose.Types.ObjectId.isValid(event._id.toString())}`);
      console.log(`  Title: ${event.title}`);
      console.log(`  Category: ${event.category}`);
      console.log('-----------------------------');
    });
    
    // Test looking up one of the events
    if (events.length > 0) {
      const testId = events[0]._id.toString();
      console.log(`\nTesting lookup for ID: ${testId}`);
      
      try {
        const foundEvent = await Event.findById(testId);
        if (foundEvent) {
          console.log('Event found successfully by ID');
        } else {
          console.log('Event not found by ID (null returned)');
        }
      } catch (err) {
        console.error('Error finding event by ID:', err.message);
      }
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking events:', error);
    mongoose.connection.close();
  }
};

checkEventIds(); 