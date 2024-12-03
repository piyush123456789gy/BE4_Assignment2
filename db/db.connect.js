const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initialiseDatabse = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB Database.");
    })
    .catch((error) => console.log("Error connecting to the database", error));
};

module.exports = { initialiseDatabse };
