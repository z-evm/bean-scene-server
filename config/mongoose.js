const mongoose = require('mongoose');

let mongoServer; // Variable to hold the in-memory MongoDB server instance, used in test environments.

/**
 * Function to establish a connection to the MongoDB database.
 * Connects to the production or development database.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bean-scene';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Function to disconnect from the MongoDB database.
 * - Closes the connection to the database.
 */
const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

module.exports = { connectDB, disconnectDB };