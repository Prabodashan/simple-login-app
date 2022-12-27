// Third-party libraries & modules
const mongoose = require("mongoose");

// Login schema
const loginSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Login", loginSchema);
