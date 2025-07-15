# Bean Scene Express Server

This repository contains the backend server for the Bean Scene restaurant ordering application. The server is built with Node.js, Express, and MongoDB, and serves as the API for the React Native mobile app used by restaurant customers and staff.

## Project Overview

Bean Scene is a comprehensive restaurant management solution with two main components:

- **Ordering System (this repo & 'bean-scene-react-native'):**  
  - Backend: Node.js, Express, MongoDB, Mongoose  
  - Mobile App: React Native  
  - Features: Menu browsing, order placement, user authentication, and order management.

- **Booking System & Website:**  
  - Backend: ASP.NET MVC, Entity Framework, SQLite  
  - Frontend: Bootstrap  
  - Features: Table reservations, restaurant information, and web-based management.

Both systems are developed for Bean Scene, providing seamless integration between mobile ordering and web-based booking.

## Technologies Used

- Node.js (16.20.1 LTS)
- Express.js
- MongoDB (8.0)
- Jest & Supertest (for testing)

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```
   npm install
   ```
3. **Create a `.env` file**  
   Add your environment variables (e.g., `SECRET_JWT_CODE`, `PORT`, etc.)

4. **Start MongoDB server**  
   Ensure MongoDB is running locally:
   ```
   mongod
   ```

5. **Seed the database (optional)**
   ```
   node seed.js
   ```

6. **Start the Express server**
   ```
   npm start
   ```

7. **Run tests**
   ```
   npm test
   ```

## Useful Commands

- **Verify MongoDB connection:**  
  ```
  mongosh mongodb://localhost:27017
  ```
- **Use Mongosh shell in WSL:**  
  ```
  mongosh
  ```