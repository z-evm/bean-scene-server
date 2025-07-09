const mongoose = require('mongoose');

// Schema to track sequential values for generating orderId.
const counterSchema = new mongoose.Schema({ 
    name: { type: String, 
    required: true, 
    unique: true },
    sequence_value: { type: Number, default: 0 }
});

// Mongoose model for interacting with the 'counters' collection.
const Counter = mongoose.model('Counter', counterSchema); 
module.exports = Counter;