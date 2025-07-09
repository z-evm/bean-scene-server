# Bean Scene Express Server

This is the backend server for the Bean Scene ordering application.

## Technologies Used

Node.js (Version 16.20.1 LTS)
Express.js
MongoDB (Version 8.0)
Mongosh (Version 2.3.2)
Mongoose (8.7.2)

## Setup

Clone the repository
Set up package: npm init -y
Install dependencies: npm install
Install Express: npm install express
Install MongoDB Node.js driver: npm install mongodb@6.10.0
Install Mongoose: npm install mongoose
Install Bcrypt: npm install bcrypt
Install Jest: npm install jest --save-dev
Install Supertest: npm install supertest --save-dev
Create a .env file
Configure environment variables
Start the MongoDB server: mongod
Verify connection: mongosh mongodb://localhost:27017
Start the Express server: node server.js
Seed the database: node seed.js
Use the Mongosh shell in WSL: mongosh