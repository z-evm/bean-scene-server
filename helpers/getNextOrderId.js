const Counter = require('../api/models/counter');

/**
 * Function to get the next unique order ID.
 * - Increments the `sequence_value` field in the `Counter` document named 'orderId'.
 * - If the document doesn't exist, it will be created with an initial sequence value.
 * - Returns the updated `sequence_value` as the next order ID.
 */
async function getNextOrderId() {
    // Find the Counter document with the name 'orderId' and increment its sequence_value.
    const counterDoc = await Counter.findOneAndUpdate(
        { name: 'orderId' }, // Filter: Looking for the document with name 'orderId'.
        { $inc: { sequence_value: 1 } }, // Update: Increment the sequence_value by 1.
        { new: true, upsert: true } // Options: 
        // - `new: true`: Return the updated document.
        // - `upsert: true`: If no document is found, create one.
    );
    return counterDoc.sequence_value; // Return the updated sequence value as the next order ID.
}

module.exports = getNextOrderId;