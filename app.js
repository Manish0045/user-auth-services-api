const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());

app.use('/api', require('./routes/user.routes'));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Server Error";

    console.error("Error details:", err);

    return res.status(statusCode).json({
        statusCode,
        message,
        success: false
    });
});

const gracefulShutdown = async () => {
    console.log("Graceful shutdown initiated...");
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    } catch (error) {
        console.error("Error during MongoDB disconnection:", error);
    } finally {
        process.exit(0);
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;