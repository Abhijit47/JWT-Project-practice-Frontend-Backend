const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure the environment file
dotenv.config({ path: './config.env' });
// console.log("env", process.env);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome route." });
});

// User Routes
app.use("/api/v1", userRouter);

// WILDCARD Route
app.all("*", (req, res, next) => {
  res.status(400).json({ message: `Can't ${req.method} on this ${req.originalUrl} URL.` });
  next();
});

module.exports = app;