// server/seed-new-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const createTestUser = async () => {
  try {
    // Delete existing user with same email
    await User.deleteOne({ email: 'dio@gmail.com' });
    
    // Create the password hash directly
    const password = '123456789';
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Generated password hash:', hashedPassword);
    
    // Create new user with known password
    const user = await User.create({
      name: 'Dio',
      email: 'dio@gmail.com',
      password: hashedPassword,
      interests: ['Music', 'Art']
    });
    
    console.log('Test user created successfully with ID:', user._id);
    console.log('Full user object:', user);
    
    // Verify the password works
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test:', isMatch);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test user:', error);
    mongoose.connection.close();
  }
};

createTestUser(); 