const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const User = require('../models/user'); // Mongoose model for interacting with the 'User' collection.

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -salt'); // Fetches all users, excluding the 'password' and 'salt' fields.
        res.status(200).json({ success: true, users }); // Responds with a list of users and a 200 status code.
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching users.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.createUser = async (req, res) => {
    const { email, password, role } = req.body; // Extracts email, password, and role from the request body.
    if (!email || !password) {
        // Returns a 400 status code if email or password is missing.
        return res.status(400).json({ success: false, error: 'Email and password are required.' }); 
    }

    try {
        const existingUser = await User.findOne({ email }); // Checks if a user with the given email already exists.
        if (existingUser) { 
            return res.status(400).json({ success: false, error: 'User already exists.' }); // Returns a 400 status code if the user already exists.
        }

        const salt = crypto.randomBytes(16).toString('hex'); // Generates a random salt for password hashing.
        const hashedPassword = bcrypt.hashSync(password + salt, 10); // Hashes the password concatenated with the salt using bcrypt.

        const newUser = await User.create({
            email, // Sets the user's email.
            password: hashedPassword, // Sets the hashed password.
            salt, // Stores the generated salt.
            role: role || 'user' // Sets the role, defaulting to 'user' if not provided.
        });

        res.status(201).json({ success: true, message: 'User created successfully.', user: newUser });
    } catch (error) { // Responds with the created user and a 201 status code.
        res.status(500).json({ success: false, error: 'Error creating user.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params; // Extracts the user's ID from the URL parameters.
    const { email, password, role } = req.body; // Extracts email, password, and role from the request body.

    try {
        const user = await User.findById(id); // Finds the user by their ID.
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' }); // Returns a 404 status code if the user is not found.
        }

        if (email) user.email = email; // Updates the user's email if provided.
        if (password) {
            const salt = crypto.randomBytes(16).toString('hex'); // Generates a new salt for password hashing.
            user.salt = salt; // Updates the user's salt.
            user.password = bcrypt.hashSync(password + salt, 10); // Updates the user's password with a new hashed value.
        }
        if (role) user.role = role; // Updates the user's role if provided.

        await user.save(); // Saves the updated user document.
        res.status(200).json({ success: true, message: 'User updated successfully.', user }); // Responds with the updated user and a 200 status code.
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error updating user.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Extracts the user's ID from the URL parameters.

    try {
        const user = await User.findByIdAndDelete(id); // Deletes the user by their ID.
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' }); // Returns a 404 status code if the user is not found.
        }

        res.status(200).json({ success: true, message: 'User deleted successfully.' }); // Confirms successful deletion with a 200 status code.
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error deleting user.' }); // Returns a 500 status code if an error occurs.
    }
};
