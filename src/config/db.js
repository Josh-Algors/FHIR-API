require("dotenv").config();
const mongoose = require("mongoose");

console.log(process.env.DB_URI_DEV, process.env.DB_URI)

const dbConfig = {
  development: {
    uri: process.env.DB_URI_DEV,
  },
  staging: {
    uri: process.env.DB_URI,
  },
};

function connectToDatabase(config) {
  mongoose
    .connect(config.uri, config.options)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

connectToDatabase(dbConfig[process.env.NODE_ENV]);

module.exports = mongoose;
