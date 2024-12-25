const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomError = require('./ErrorHandler');

const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Hash password
const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throwError(STATUS_CODES.FORBIDDEN, 'Error hashing password');
    }
};

// Compare password with hashed password
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error('Error comparing password:', err);
        throwError(STATUS_CODES.FORBIDDEN, 'Error comparing password');
    }
};

// Generate access token
const generateAccessToken = ({ _id, username }) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.warn("ACCESS_TOKEN_SECRET is missing... Using a default value might be risky in production.");
        throwError(STATUS_CODES.NOT_FOUND, "ACCESS_TOKEN_SECRET is missing...!");
    }
    return jwt.sign({ _id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });
};

const throwError = (statusCode, message) => {
    throw new CustomError(statusCode, message);
}

module.exports = {
    STATUS_CODES,
    hashPassword,
    comparePassword,
    generateAccessToken,
    throwError
};
