const express = require('express');
const requireAdminRole = require('../../middleware/roleMiddleware');
const userController = require('../controllers/userController'); 
const router = express.Router();

// Route to get all users
// Endpoint: GET /
// Requires admin role.
// Retrieves a list of all users, excluding sensitive fields like passwords and salts.
router.get('/', requireAdminRole, userController.getAllUsers);

// Route to create a new user
// Endpoint: POST /
// Requires admin role.
// Creates a new user with the provided email, password, and role.
router.post('/', requireAdminRole, userController.createUser);

// Route to update an existing user
// Endpoint: PUT /:id
// Requires admin role.
// Updates user details (email, password, or role) for the specified user ID.
router.put('/:id', requireAdminRole, userController.updateUser);

// Route to delete a user
// Endpoint: DELETE /:id
// Requires admin role.
// Deletes the user with the specified user ID.
router.delete('/:id', requireAdminRole, userController.deleteUser);

module.exports = router;
