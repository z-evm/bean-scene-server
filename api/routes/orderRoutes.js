const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderContoller');

// Route to get all orders
// Endpoint: GET /
// Retrieves all orders, including their items and associated details.
router.get('/', orderController.getAllOrders);


// Route to get an order by its ID
// Endpoint: GET /:id
// Fetches a specific order using its unique order ID.
router.get('/:id', orderController.getOrderById);

// Route to create a new order
// Endpoint: POST /
// Creates a new order with the provided details.
router.post('/', orderController.createOrder);

// Route to update an existing order
// Endpoint: PUT /:id
// Updates the details of an order identified by its order ID.
router.put('/:id', orderController.updateOrder);

// Route to update the status of a specific order item
// Endpoint: PATCH /:orderId/item/:itemId
// Updates the status of an order item (e.g., ORDERED, SERVED, CANCELLED) in a specific order.
router.patch('/:orderId/item/:itemId', orderController.updateOrderItemStatus);

// Route to delete an order
// Endpoint: DELETE /:id
// Deletes an order identified by its order ID.
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
