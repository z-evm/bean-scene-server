const MenuItem = require('../models/menuItem'); // Imports the MenuItem model for interacting with the 'menuItem' collection in MongoDB.

exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find()
            .collation({ locale: 'en', strength: 1 }) // Ensures case-insensitive sorting for English locale.
            .sort({ name: 1}) // Sorts the menu items by name in ascending order.
            .lean({
                transform: (doc) => ({
                    ...doc,
                    _id: doc._id.toString(), // Converts _id from ObjectId to string.
                }),
            });
        res.json(items); // Responds with the sorted and transformed list of menu items.
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch menu items.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.getMenuItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id).lean({
            transform: (doc) => ({
                ...doc,
                _id: doc._id.toString(), // Converts _id from ObjectId to string.
            }),
        });

        if (!item) return res.status(404).json({ error: 'Menu item not found'}); // Returns a 404 error if the item is not found.
        res.json(item); // Responds with the found menu item.
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch menu item.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.getMenuItemsByCategory = async (req, res) => {
    const { category } = req.params; // Extracts the category parameter from the URL.
    try {
        // Fetches menu items that match the category, converted to uppercase for consistency.
        const items = await MenuItem.find({ category: category.toUpperCase() }).lean();
        if (items.length === 0) return res.status(404).json({ message: 'No items found for this category.' }); // Returns a 404 error if no items are found.
        res.json(items); // Responds with the list of menu items in the given category.
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch menu items.'}); // Returns a 500 status code if an error occurs.
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const newItem = new MenuItem(req.body); // Creates a new MenuItem document with data from the request body.
        await newItem.save(); // Saves the new item to the database.
        res.status(201).json(newItem); // Responds with the created menu item and a 201 status code.
    } catch (err) {
        console.error('Error creating menu item:', err); // Logs the error to the console for debugging.
        res.status(400).json({ error: `Failed to create menu item: ${err.message}` }); // Returns a 400 status code if the creation fails.
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        // Updates the specified menu item with new data
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem.toObject()); // Convert the Mongoose document to a plain JavaScript object before responding
    } catch (err) {
        res.status(400).json({ error: 'Failed to update menu item.' });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        // Deletes the specified menu item by its ID.
        await MenuItem.findByIdAndDelete(req.params.id).lean();
        res.json({ message: 'Menu item deleted.' }); // Confirms successful deletion.
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete menu item.' }); // Returns a 500 status code if the deletion fails.
    }
};
