import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './databaseconnection/connection.js';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
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
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

connectDB();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
});
