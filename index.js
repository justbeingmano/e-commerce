import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './databaseconnection/connection.js';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import errorMiddleware from './Middlewares/errorMiddleware.js';
import loggerMiddleware from './Middlewares/loggerMiddleware.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';
import { authorizeRoles } from './Middlewares/roleMiddleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();


app.use(express.json());
// Logger Middleware
app.use(loggerMiddleware);
// Public endpoints
app.use("/api/auth", authRoutes);
// Private endpoints 
app.use("/api/prducts",productRoutes)
app.use(authMiddleware)
app.use(authorizeRoles)
// Error Middleware
app.use(errorMiddleware);


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
