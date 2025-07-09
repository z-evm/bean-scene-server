const mongoose = require('mongoose');

// Schema to represent menu items in the restaurant.
const menuItemSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, // Menu item name is mandatory.
    description: { type: String }, // Optional description of the menu item.
    price: { type: Number, required: true }, // Price of the menu item is mandatory.
    category: { 
        type: String, 
        enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'BEVERAGE', 'DESSERT'], 
        required: true // Restricts categories to predefined values.
    },
    ingredients: [{ type: String }], // Array of ingredients used in the menu item.
    dietary: [{ type: String }], // Array to store dietary information    
    available: { type: Boolean, default: true }, // Indicates if the menu item is available.
    }, 
    { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields.
);

// Mongoose model for interacting with the 'menuitems' collection.
const MenuItem = mongoose.model('MenuItem', menuItemSchema); 
module.exports = MenuItem;
