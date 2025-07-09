const mongoose = require('mongoose');
const MenuItem = require('./api/models/menuItem');
const Order = require('./api/models/order');
const { connectDB } = require('./config/mongoose');
const getNextOrderId = require('./helpers/getNextOrderId');
const User = require('./api/models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Generate a salt and hash the password using bcrypt
const salt = crypto.randomBytes(16).toString('hex'); // Create a random salt using crypto
const hashedPassword = bcrypt.hashSync("XanMan88!" + salt, 10); // Hash the password along with the salt

// Array of menu items to be seeded into the database
const menuItems = [
  { name: 'Avocado Toast', description: '...', price: 12.5, category: 'BREAKFAST', ingredients: ['sourdough', 'avocado', 'eggs'], dietary: ['vegetarian'], available: true },
  { name: 'Pancakes with Maple Syrup', description: '...', price: 14.0, category: 'BREAKFAST', ingredients: ['flour', 'eggs', 'milk', 'maple syrup'], dietary: ['vegetarian'], available: true },
  { name: 'Caesar Salad', description: '...', price: 18.0, category: 'LUNCH', ingredients: ['lettuce', 'chicken', 'parmesan', 'croutons'], dietary: ['gluten-free'], available: true },
  { name: 'Grilled Chicken Wrap', description: '...', price: 12.9, category: 'LUNCH', ingredients: ['wholemeal wrap', 'chicken', 'salad'], dietary: ['dairy-free'], available: true },
  { name: 'Steak with Garlic Butter', description: '...', price: 29.9, category: 'DINNER', ingredients: ['beef steak', 'butter', 'herbs'], dietary: ['gluten-free'], available: true },
  { name: 'Spaghetti Carbonara', description: '...', price: 22.5, category: 'DINNER', ingredients: ['spaghetti', 'egg yolk', 'parmesan', 'pancetta'], dietary: ['gluten'], available: true },
];

// Array of users to be seeded into the database, including hashed passwords and salt
const users = [
  { email: "alexandermaniago@gmail.com", password: hashedPassword, salt: salt, role: "user"},
 { email: "xanderman88@hotmail.com", password: hashedPassword, salt: salt, role: "admin"},
];

// Function to create sample orders based on the inserted menu items
const createOrders = async (menuItems) => [
  {
    orderId: await getNextOrderId(), // Get the next unique order ID
    tableNumber: '5',
    orderStatus: 'PAID',
    notes: 'Used for additional information about the order.',
    orderItems: [
      {
        menuItemId: menuItems[0]._id, // Reference to the menu item by ID
        menuItemName: menuItems[0].name,
        price: menuItems[0].price,
        qty: 2,
        notes: 'Remove avocado',
        menuItemStatus: 'SERVED',
      },
      {
        menuItemId: menuItems[1]._id, // Another menu item for the order
        menuItemName: menuItems[1].name,
        price: menuItems[1].price,
        qty: 1,
        menuItemStatus: 'CANCELLED',
      },
    ],
  },
  {
    orderId: await getNextOrderId(),
    tableNumber: 'M1',
    orderStatus: 'PENDING',
    orderItems: [
      {
        menuItemId: menuItems[2]._id, // Reference to another menu item
        menuItemName: menuItems[2].name,
        price: menuItems[2].price,
        qty: 1,
        menuItemStatus: 'ORDERED',
      },
    ],
  },
];

// Main function to seed the database
const seedDatabase = async () => {
  try {
    console.log('Starting to seed database...');
    // Delete existing entries to avoid duplicates
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();
    // Insert menu items into the database
    const insertedMenuItems = await MenuItem.insertMany(menuItems);
    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedMenuItems.length} menu items seeded successfully!`);
    console.log(`${insertedUsers.length} users seeded successfully!`);
    // Create sample orders based on the inserted menu items
    const orders = await createOrders(insertedMenuItems);
    const insertedOrders = await Order.insertMany(orders);
    console.log(`${insertedOrders.length} orders seeded successfully!`);
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // Disconnect from the database after seeding is complete
    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0); // Exit the process
  }
};

// Connect to the database and start seeding
const run = async () => {
  try {
    await connectDB(); // Connect to the database
    await seedDatabase(); // Seed the database with data
  } catch (err) {
    console.error('An error occurred:', err);
    process.exit(1); // Exit the process with an error code
  }
};

// Run the seeding process
run();
