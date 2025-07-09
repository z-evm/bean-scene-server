const mongoose = require('mongoose');

// Schema to represent users in the application.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // Ensures email addresses are unique for each user.
        required: true, // Email is mandatory.
        lowercase: true, // Converts email to lowercase for consistency.
        trim: true // Removes leading/trailing spaces from email.
    },
    password: {
        type: String,
        required: true // Stores the hashed password for security.
    },
    salt: {
         type: String, 
         required: true // Random salt used for password hashing.
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restricts roles to 'user' or 'admin'.
        default: 'user' // Default role is 'user'.
    }
}, { collection: "users" }); // Explicitly sets the collection name to 'users'.

// Mongoose model for interacting with the 'users' collection.
const User = mongoose.model("User", userSchema);
module.exports = User;