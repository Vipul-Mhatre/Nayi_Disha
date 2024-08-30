const mongoose = require('mongoose');

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error: MongoDB connection error', error);
    }
};

module.exports = mongoConnect;