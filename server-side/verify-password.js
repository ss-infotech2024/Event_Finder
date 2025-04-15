const bcrypt = require('bcryptjs');

// The hash from your database
const storedHash = '$2b$08$f1fWqHVnQ276CxSPeDnujOmuMMiQJW543Ya3KJ3gYojwK9Vnb5O7u';

// The password to verify
const password = '123456789';

const verifyPassword = async () => {
  try {
    console.log('Verifying password...');
    console.log('Stored hash:', storedHash);
    console.log('Password to verify:', password);
    
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log('Password match result:', isMatch);
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
};

verifyPassword(); 