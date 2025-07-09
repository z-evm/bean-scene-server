const mongoose = require('mongoose');
const Order = require('../models/order');
const getNextOrderId = require('../../helpers/getNextOrderId');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderItems.menuItemId') // Populates the 'menuItemId' field in 'orderItems' with data from the related MenuItem document.
            .lean({
                transform: (doc) => {
                    doc.orderItems = Array.isArray(doc.orderItems)
                        ? doc.orderItems.map(item => ({
                            ...item,
                            _id: item._id.toString(), // Converts order item IDs to strings.
                            menuItemId: item.menuItemId ? item.menuItemId.toString() : null, // Converts menuItemId to a string if it exists.
                        }))
                       : [];
                    return doc; // Returns the transformed order document.
                }
            });

        res.json(orders); // Responds with the list of orders.  
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id }) // Searches for an order by its orderId.
            .populate('orderItems.menuItemId') // Populates the 'menuItemId' field in 'orderItems'.
            .lean({
                transform: (doc) => {
                    doc.orderItems = Array.isArray(doc.orderItems)
                        ? doc.orderItems.map(item => ({
                            ...item,
                            _id: item._id.toString(), // Converts order item IDs to strings.
                        }))
                        : [];
                    return doc; // Returns the transformed order document.
                }
            });

        if (!order) return res.status(404).json({ error: 'Order not found.' }); // Returns a 404 error if the order is not found.
        
        res.json(order); // Responds with the found order. 
    } catch (err) {
        console.error('Error fetching order:', err); // Logs error to the console for debugging.
        res.status(500).json({ error: 'Failed to fetch order.' }); // Returns a 500 status code if an error occurs.
    }
};

exports.createOrder = async (req, res) => {
    try {
        const orderId = await getNextOrderId(); // Generates the next sequential order ID using the helper function.
        const newOrder = new Order({
            orderId, // Sets the generated order ID.
            ...req.body // Copies other order details from the request body.
        });
        await newOrder.save(); // Saves the new order to the database.
        res.status(201).json(newOrder); // Responds with the created order and a 201 status code.
    } catch (err) {
        console.error('Error creating order:', err); // Logs the error to the console.
        res.status(400).json({ error: 'Failed to create order.' }); // Returns a 400 status code if creation fails.
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updateOrder = await Order.findOneAndUpdate(
            { orderId: req.params.id }, // Finds the order by orderId.
            req.body, // Updates the order with data from the request body.
            { new: true, runValidators: true } // Returns the updated document and runs validators.
        ).populate('orderItems.menuItemId').lean();

        if (!updateOrder) return res.status(404).json({ error: 'Order not found' }); // Returns a 404 error if the order is not found.

        res.json(updateOrder); // Responds with the updated order.
    } catch (err) {
        console.error('Error updating order:', err); // Logs the error to the console.
        res.status(400).json({ error: `Failed to update order: ${err.message}` }); // Returns a 400 status code if the update fails.
    }
};

exports.updateOrderItemStatus = async (req, res) => {
    const { orderId, itemId } = req.params; // Extracts orderId and itemId from the URL parameters.
    const { status } = req.body; // Extracts the new status from the request body.

    try {
        console.log('Order ID:', orderId, 'Type:', typeof orderId);
        console.log('Item ID:', itemId, 'Type:', typeof itemId);

        const order = await Order.findOne({ orderId: parseInt(orderId, 10) }).lean(); // Finds the order by orderId.
        console.log('Fetched Order:', order);

        if (!order) return res.status(404).json({ error: 'Order not found.' }); // Returns a 404 error if the order is not found.

        const objectIdItemId = new mongoose.Types.ObjectId(itemId); // Converts itemId to a MongoDB ObjectId for comparison.
        const item = order.orderItems.find(i => i._id.equals(objectIdItemId)); // Finds the specific order item by its ID.
        
        if (!item) {
            console.log(`Item with ID ${itemId} not found in order.`); // Logs if the item is not found.
            return res.status(404).json({ error: 'Order item not found.' }); // Returns a 404 error if the item is not found.
        }

        item.menuItemStatus = status; // Updates the item's status.
        
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: parseInt(orderId, 10) }, // Finds the order by orderId.
            { $set: { orderItems: order.orderItems } }, // Updates the order items.
            { new: true, runValidators: true } // Returns the updated document and runs validators.
        ).lean();

        res.json(updatedOrder); // Responds with the updated order.
    } catch (err) {
        console.error('Error updating order menu item status.', err); // Logs the error to the console.
        res.status(400).json({ error: 'Failed to update order item status.'}); // Returns a 400 status code if the update fails.
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({ orderId: req.params.id }).lean(); // Deletes the order by its orderId.

        if (!deletedOrder) return res.status(404).json({ error: 'Order not found.'}); // Returns a 404 error if the order is not found.

        res.json({ message: 'Order deleted.' }); // Confirms successful deletion.
    } catch (err) {
        console.error('Error deleteing order:', err); // Logs the error to the console.
        res.status(500).json({ error: 'Failed to delete order.' }); // Returns a 500 status code if the deletion fails.
    }
};