const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../api/models/user');
const { disconnectDB } = require('../config/mongoose');
const crypto = require('crypto');

dotenv.config();

// Clean up the database before each test to ensure consistent data state
beforeEach(async () => {
    await User.deleteMany({ email: 'testuser@example.com' });
});

// Test to check if the orders endpoint returns a list of orders
test('GET /api/orders should respond with a list of orders', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
});

// Test for fetching a single order by ID
test('GET /api/orders/:id should respond with a single order', async () => {
    const orderId = 10;
    const response = await request(app).get(`/api/orders/${orderId}`);
    if (response.status === 200) {
        expect(response.body).toHaveProperty('orderId', orderId); // Check if orderId matches
    } else {
        expect(response.status).toBe(404); // If order not found, expect 404
    }
});

// Test to create a new order via POST request
test('POST /api/orders should create a new order', async () => {
    const newOrder = {
        orderId: undefined, // This will be assigned by the server
        tableNumber: 'M1',
        orderStatus: 'PENDING',
        notes: 'Some notes on how you like your food.',
        orderItems: [
            {
                menuItemId: '67256384454628ca733f6b9a',
                menuItemName: 'Avocado Toast',
                price: 12.50,
                qty: 1,
                menuItemStatus: 'ORDERED',
            }
        ]
    };
    const response = await request(app).post('/api/orders').send(newOrder);
    expect(response.status).toBe(201); // Expect a 201 status for successful creation
    expect(response.body).toHaveProperty('orderId'); // Check if the orderId is present
    expect(response.body).toHaveProperty('tableNumber', newOrder.tableNumber); // Ensure table number is correct
    expect(response.body.orderItems).toBeDefined(); // Ensure orderItems are returned
    expect(response.body.orderItems.length).toBe(newOrder.orderItems.length); // Validate item length
    expect(response.body.orderItems[0]).toHaveProperty('menuItemName', newOrder.orderItems[0].menuItemName); // Check item details
});

// Test for updating an existing order
test('PUT /api/orders/:id should update an existing order', async () => {
    const orderId = 10;
    const updatedOrderData = {
      orderStatus: 'PAID',
      tableNumber: 'M1',
      notes: 'Updated notes for the order',
      orderItems: [
        {
          menuItemId: '67256384454628ca733f6b9a',
          menuItemName: 'Avocado Toast',
          price: 12.50,
          qty: 1,
          menuItemStatus: 'SERVED',
        }
      ]
    };

    const response = await request(app).put(`/api/orders/${orderId}`).send(updatedOrderData);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('orderStatus', updatedOrderData.orderStatus); // Validate updated status
      expect(response.body).toHaveProperty('tableNumber', updatedOrderData.tableNumber); // Validate table number
      expect(response.body).toHaveProperty('notes', updatedOrderData.notes); // Validate updated notes
      expect(response.body.orderItems[0]).toHaveProperty('qty', updatedOrderData.orderItems[0].qty); // Validate item quantity
      expect(response.body.orderItems[0]).toHaveProperty('menuItemStatus', updatedOrderData.orderItems[0].menuItemStatus); // Validate item status
    } else {
      expect(response.status).toBe(404); // Return 404 if order is not found
    }
}); 

// Test to update the status of a specific item in an order
test('PATCH /api/orders/:orderId/item/:itemId should update item status', async () => {
    const orderId = 10;
    const menuItemId = '67256384454628ca733f6b9a';
    const updatedStatus = { orderStatus: 'SERVED' };
    const response = await request(app).patch(`/api/orders/${orderId}/item/${menuItemId}`).send(updatedStatus);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('orderItems'); // Check if orderItems are updated
    } else {
      expect(response.status).toBe(404); // Return 404 if item is not found
    }
});

// Test to delete an order
test('DELETE /api/orders/:id should delete an order', async () => {
    const orderId = 10;
    const response = await request(app).delete(`/api/orders/${orderId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe('Order deleted.'); // Ensure the correct deletion message
    } else {
      expect(response.status).toBe(404); // Return 404 if order not found
    }
});

// Test for fetching all menu items
test('GET /api/menu-items should respond with a list of menu items', async () => {
    const response = await request(app).get('/api/menu-items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
});

// Test for fetching a single menu item by its ID
test('GET /api/menu-items/:id should respond with a single menu item', async () => {
    const menuItemId = '67256384454628ca733f6b9a';
    const response = await request(app).get(`/api/menu-items/${menuItemId}`);
    if (response.status === 200) {
        expect(response.body).toHaveProperty('_id', menuItemId); // Check if ID matches
    } else {
        expect(response.status).toBe(404); // Return 404 if menu item not found
    }
});

// Test to create a new menu item
test('POST /api/menu-items should create a new menu item', async () => {
    const newMenuItem = {
        name: 'Chicken Wings',
        price: 15.99,
        category: 'LUNCH',
        description: 'A delicious new dish to try!',
    };
    
    const response = await request(app).post('/api/menu-items').send(newMenuItem);
    expect(response.status).toBe(201); // Check for successful creation
    expect(response.body).toHaveProperty('_id'); // Check if ID is returned
    expect(response.body).toHaveProperty('name', newMenuItem.name); // Validate name field
    expect(response.body).toHaveProperty('price', newMenuItem.price); // Validate price field
});

// Test to delete a menu item
test('DELETE /api/menu-items/:id should delete a menu item', async () => {
    const menuItemId = '67256384454628ca733f6b9a';
    const response = await request(app).delete(`/api/menu-items/${menuItemId}`);
    if (response.status === 200) {
        expect(response.body.message).toBe('Menu item deleted.'); // Ensure correct deletion message
    } else {
        expect(response.status).toBe(404); // Return 404 if menu item not found
    }
});

// Test for user signup with valid details
test('POST /auth/user/signup - Successful Signup', async () => {
    const newUser = {
        email: `testuser${Date.now()}@example.com`,
        password: 'Password123',
    };

    const response = await request(app).post('/auth/user/signup').send(newUser);
    expect(response.status).toBe(200); // Check for successful response
    expect(response.body.success).toBe(true); // Ensure success flag is true
    expect(response.body).toHaveProperty('token'); // Ensure a token is returned
});

// Test for user signup with missing fields
test('POST /auth/user/signup - Missing Fields', async () => {
    const response = await request(app).post('/auth/user/signup').send({ email: 'missingpassword@example.com' });
    expect(response.status).toBe(200); // Expect status 200, even if unsuccessful
    expect(response.body.success).toBe(false); // Ensure failure response
    expect(response.body.error).toBe('Enter required details.'); // Check for correct error message
});

// Test for successful login
test('POST /auth/user/login - Successful Login', async () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = bcrypt.hashSync('Password123' + salt, 10);

    await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        salt: salt,
    });

    const userCredentials = {
        email: 'testuser@example.com',
        password: 'Password123',
    };

    const response = await request(app).post('/auth/user/login').send(userCredentials); 
    expect(response.status).toBe(200); // Check for successful response
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token'); // Ensure token is returned
});

// Test for failed login (wrong password)
test('POST /auth/user/login - Incorrect Password', async () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = bcrypt.hashSync('Password123' + salt, 10);

    await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        salt: salt,
    });

    const response = await request(app).post('/auth/user/login').send({ email: 'testuser@example.com', password: 'WrongPassword' });
    expect(response.status).toBe(200); // Expect status 200, even if unsuccessful
    expect(response.body.success).toBe(false); // Ensure failure flag is false
    expect(response.body.error).toBe('Wrong password'); // Check for correct error message
});

// Test for login with a user that does not exist
test('POST /auth/user/login - User Does Not Exist', async () => {
    const response = await request(app).post('/auth/user/login').send({ email: 'nonexistent@example.com', password: 'Password123' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('User does not exist');
});

// Test for login with missing fields
test('POST /user/login - Missing Fields', async () => {
    const response = await request(app).post('/auth/user/login').send({ email: '' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Credentials needed.');
});
// Cleanup after tests
afterAll(async () => {
    await disconnectDB();
    await new Promise((resolve) => server.close(resolve));
})