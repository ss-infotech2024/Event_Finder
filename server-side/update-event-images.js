const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const updateEventImages = async () => {
  try {
    // Get all events
    const events = await Event.find();
    console.log(`Found ${events.length} events in the database.`);
    
    let updatedCount = 0;
    
    // Update each event with a new image URL
    for (const event of events) {
      // Generate a new image URL based on the event title
      const newImageUrl = `https://placehold.co/800x400/random?text=${encodeURIComponent(event.title)}`;
      
      // Update the event
      await Event.updateOne(
        { _id: event._id },
        { $set: { image: newImageUrl } }
      );
      
      console.log(`Updated event: ${event.title}`);
      console.log(`  Old image: ${event.image}`);
      console.log(`  New image: ${newImageUrl}`);
      console.log('----------------------------');
      
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} event images.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating event images:', error);
    mongoose.connection.close();
  }
};

updateEventImages(); 