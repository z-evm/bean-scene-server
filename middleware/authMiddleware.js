const jsonwebtoken = require('jsonwebtoken');
const User = require('../api/models/user');

/**
 * Function to fetch a user based on the JWT token present in the request header.
 * - Decodes the token and fetches the corresponding user from the database.
 * - Handles token verification, user retrieval, and potential errors.
 *
 * @param {Object} req - The HTTP request object.
 * @returns {Promise} Resolves with the user object if found, or rejects with an error message.
 */
function fetchUserByToken(req) {
    return new Promise((resolve, reject) => {
        // Check if the Authorization header exists
        if (req.headers && req.headers.authorization) {
            // Extract the token from the 'Authorization' header (Bearer <token>)
            const authorization = req.headers.authorization.split(' ')[1];
            let decoded;
            try {
                decoded = jsonwebtoken.verify(authorization, process.env.SECRET_JWT_CODE); // Verify and decode the token using the secret key
            } catch (e) {
                return reject("Token not valid"); // If token is invalid, reject with an error
            }

            const userId = decoded.id; // Extract the user ID from the decoded token
            User.findOne({ _id: userId }) // Find the user in the database by user ID
                .then((user) => {
                    if (user) {
                        resolve(user); // If user is found, resolve the promise with the user object
                    } else {
                        reject("User not found"); // If user is not found, reject with a 'User not found' error
                    }
                })
                .catch(() => {
                    reject("Token error"); // If there is a database error, reject with a 'Token error' error
                });
        } else {
            reject("Token not found"); // If no token is found in the headers, reject with a 'Token not found' error
        }
    });
}

module.exports = fetchUserByToken;