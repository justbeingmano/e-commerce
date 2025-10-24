const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./databaseconnection/connection');
const router = require('./Routes/authRoutes');


dotenv.config()
const app = express();

app.use("/api/", router);
app.use(express.json())
connectDB()


PORT=process.env.PORT

app.listen(()=>{
    console.log(`server is running on port ${PORT}`)
})


