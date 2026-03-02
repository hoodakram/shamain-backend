const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect("mongodb+srv://hood:hood016@cluster0.vyjg3xo.mongodb.net/shamain");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
  }
}

module.exports = db;
