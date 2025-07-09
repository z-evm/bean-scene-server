const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Mongoose model for interacting with the 'User' collection.

exports.signup = (req, res) => {
    const { email, password, role } = req.body; // Extracts email, password, and role from the request body.
    if (!email || !password) {
        return res.json({ success: false, error: 'Enter required details.' }); // Returns an error if required fields are missing.
    }
    const salt = crypto.randomBytes(16).toString('hex'); // Generates a random 16-byte salt for password hashing.
    const hashedPassword = bcrypt.hashSync(password + salt, 10); // Hashes the concatenated password and salt with a cost factor of 10.

    User.create({
        email: email,
        password: hashedPassword,
        salt: salt, // Stores the generated salt for later use during login.
        role: role || 'user' // Assigns 'user' role by default if no role is provided.
    }).then((user) => {
        const token = jsonwebtoken.sign({ id: user._id, email: user.email, role: user.role }, // Payload containing user details.
            process.env.SECRET_JWT_CODE, // Secret key used to sign the token.
            { expiresIn: '6h' }); // Token expiration time set to 6 hours.
        res.json({ success: true, token: token }); // Responds with the generated token on successful signup.
    }).catch((err) => {
        res.json({ success: false, error: err.message || err }); // Handles any errors during the database operation.
    });
};

exports.login = (req, res) => {
    console.log("Login attempt with email:", req.body.email); // Logs the email of the user attempting to log in.
    if (!req.body.email || !req.body.password) {
        return res.json({ success: false, error: "Credentials needed." }); // Returns an error if email or password is missing.
    }

    User.findOne({ email: req.body.email }) // Searches for a user in the database by email.
        .then((user) => {
            if (!user) return res.json({ success: false, error: 'User does not exist' });

            const passwordMatch = bcrypt.compareSync(req.body.password + user.salt, user.password);
            // Compares the hashed input password (with salt) against the stored hashed password.
            if (!passwordMatch) return res.json({ success: false, error: 'Wrong password' });

            const token = jsonwebtoken.sign({ id: user._id, email: user.email, role: user.role }, // Payload with user details.
                process.env.SECRET_JWT_CODE, // Secret key used to sign the token.
                { expiresIn: '6h' }); // Token expiration time set to 6 hours.
            res.json({ success: true, token: token }); // Responds with the generated token on successful login.
        })
        .catch((err) => res.json({ success: false, error: err.message || err })); // Handles any errors during the database operation.
};