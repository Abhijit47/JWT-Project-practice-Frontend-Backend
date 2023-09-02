const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a user schema with mongoose.schema instance
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Must be at least 3, got {VALUE}"],
    maxLength: 255,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    // required: [true, "email field should\'t be empty"],
    minLength: 10,
    maxLength: 255,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Must be at least 6, got {VALUE}"],
    maxLength: 1024,
  },
  forgotToken: {
    type: String,
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

// Create a model
const User = mongoose.model('User', userSchema);

module.exports = User;