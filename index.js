const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./databaseconnection/connection');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');

const {fileURLToPath}=require("url")
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// API Routes (must come before static files)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

connectDB();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
});
