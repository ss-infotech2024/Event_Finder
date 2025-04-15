// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample user and events data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 8);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      interests: ['Music', 'Technology']
    });
    
    // Create Dio user
    const dioUser = await User.create({
      name: 'Dio',
      email: 'Dio@gmail.com',
      password: await bcrypt.hash('123456789', 8),
      interests: ['Music', 'Art']
    });
    
    // Create sample events
    const events = [
      {
        title: 'Summer Music Festival',
        description: 'Join us for a weekend of amazing live music performances',
        category: 'Music',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '12:00 PM - 10:00 PM',
        location: 'Central Park, New York',
        ticketAvailability: 500,
        ticketPrice: 75,
        image: 'https://placehold.co/300x200?text=Music+Festival',
        organizer: user._id
      },
      {
        title: 'Web Development Workshop',
        description: 'Learn the latest web development techniques and tools',
        category: 'Technology',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        time: '9:00 AM - 5:00 PM',
        location: 'Tech Hub, San Francisco',
        ticketAvailability: 50,
        ticketPrice: 120,
        image: 'https://placehold.co/300x200?text=Web+Dev+Workshop',
        organizer: user._id
      },
      {
        title: 'Basketball Tournament',
        description: 'Annual basketball tournament with teams from across the state',
        category: 'Sports',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '10:00 AM - 6:00 PM',
        location: 'Sports Arena, Chicago',
        ticketAvailability: 200,
        ticketPrice: 25,
        image: 'https://placehold.co/300x200?text=Basketball',
        organizer: user._id
      },
      {
        title: 'Cooking Masterclass',
        description: 'Learn to cook authentic Italian dishes with Chef Mario',
        category: 'Food',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '6:00 PM - 9:00 PM',
        location: 'Culinary Institute, Los Angeles',
        ticketAvailability: 30,
        ticketPrice: 85,
        image: 'https://placehold.co/300x200?text=Cooking+Class',
        organizer: user._id
      },
      {
        title: 'Business Networking Mixer',
        description: 'Connect with entrepreneurs and professionals in your industry',
        category: 'Business',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: '7:00 PM - 10:00 PM',
        location: 'Grand Hotel, Dallas',
        ticketAvailability: 100,
        ticketPrice: 50,
        image: 'https://placehold.co/300x200?text=Networking',
        organizer: user._id
      },
      {
        title: 'Art Exhibition: Modern Masters',
        description: 'Exhibition featuring contemporary artists from around the world',
        category: 'Art',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        time: '10:00 AM - 8:00 PM',
        location: 'Modern Art Museum, Seattle',
        ticketAvailability: 150,
        ticketPrice: 35,
        image: 'https://placehold.co/300x200?text=Art+Exhibition',
        organizer: user._id
      }
    ];
    
    await Event.insertMany(events);
    
    console.log('Sample data created successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();