const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // MongoDB connection URI
        const uri = process.env.MONGODB_URI

        // Connect to MongoDB
        await mongoose.connect(uri, {
        });

        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;