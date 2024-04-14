const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes.js');

require('dotenv').config();

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});