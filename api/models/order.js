const mongoose = require('mongoose');

// Sub-schema to represent individual items in an order.
const orderItemSchema = new mongoose.Schema({
    menuItemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MenuItem', 
        required: true // Links to a specific menu item.
    },
    menuItemName: { type: String, required: true }, // Name of the menu item in the order.
    price: { type: Number, required: true }, // Price of the menu item at the time of order.
    qty: { type: Number, required: true }, // Quantity of the menu item ordered.
    notes: { type: String }, // Optional notes for the menu item (e.g., special requests).
    menuItemStatus: {
        type: String, 
        enum: ['ORDERED', 'SERVED', 'CANCELLED'], 
        default: 'ORDERED' // Status of the menu item in the order.
    }
});

// Schema to represent customer orders in the restaurant.
const orderSchema = new mongoose.Schema({
    orderId: { type: Number, required: true, unique: true }, // Ensures each order has a unique identifier.
    orderDate: { type: Date, default: Date.now }, // Defaults to the current date and time.
    tableNumber: { type: String, required: true }, // Indicates the table associated with the order.
    orderStatus: { 
        type: String, 
        enum: ['PENDING', 'PAID', 'CANCELLED'], 
        default: 'PENDING' // Tracks the status of the overall order.
    },
    notes: { type: String }, // Optional notes for the entire order.
    orderItems: [orderItemSchema] // Array of items included in the order.
    },
    { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields.
);

// Mongoose model for interacting with the 'orders' collection.
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;