const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Route to get all menu items
// Endpoint: GET /
// Fetches all menu items sorted alphabetically by name.
router.get('/', menuController.getAllMenuItems);

// Route to get a menu item by its ID
// Endpoint: GET /:id
// Retrieves details of a specific menu item using its unique ID.
router.get('/:id', menuController.getMenuItemById);

// Route to get menu items by category
// Endpoint: GET /category/:category
// Fetches menu items that belong to a specific category (e.g., BREAKFAST, LUNCH, etc.).
router.get('/category/:category', menuController.getMenuItemsByCategory);

// Route to create a new menu item
// Endpoint: POST /
// Adds a new menu item to the database.
router.post('/', menuController.createMenuItem);

// Route to update an existing menu item
// Endpoint: PUT /:id
// Updates the details of an existing menu item identified by its ID.
router.put('/:id', menuController.updateMenuItem);

// Route to delete a menu item
// Endpoint: DELETE /:id
// Deletes a menu item from the database using its ID.
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
