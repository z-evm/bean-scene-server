const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer; // Variable to hold the in-memory MongoDB server instance, used in test environments.

/**
 * Function to establish a connection to the MongoDB database.
 * - Connects to an in-memory MongoDB server if in a test environment.
 * - Otherwise, connects to the production or development database.
 */
const connectDB = async () => {
  try {
    // Create and connect to an in-memory MongoDB server for testing.
    if (process.env.NODE_ENV === 'test') { 
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri(); // Get the connection URI for the in-memory database.
      await mongoose.connect(uri); // Establish connection to the in-memory database.
      console.log('In-memory MongoDB connected for testing');
    } else {
      // Connect to the production or development database.
      await mongoose.connect('mongodb://192.168.56.1:27017/bean-scene'); // Adjust URI as per your setup.
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if unable to connect.
  }
};

/**
 * Function to disconnect from the MongoDB database.
 * - Closes the connection to the database.
 * - Stops the in-memory MongoDB server if it's running (for test environments).
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); // Disconnects from MongoDB.
    await mongoose.connection.close(); // Closes the database connection.
  }
  if (mongoServer) {
    await mongoServer.stop(); // Stops the in-memory MongoDB server.
  }
};

module.exports = { connectDB, disconnectDB };