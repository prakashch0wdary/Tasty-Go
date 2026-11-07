const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodie';
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected:', mongoUri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Retry after 5s instead of crashing immediately (useful in k8s while mongo pod starts)
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
