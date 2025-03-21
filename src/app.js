const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.routes');
const { dbConnection } = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
dbConnection();

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Export the app
module.exports = app;