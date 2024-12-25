const jwt = require('jsonwebtoken');
const  CustomError  = require('../utils/ErrorHandler');
const { STATUS_CODES, throwError } = require('../utils/constants');
const { User } = require('../models/user.model');

const verifyJWT = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];

    try {
        if (!token) {
            throwError(STATUS_CODES.BAD_REQUEST, "Token is missing or malformed");
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
            throwError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal server error");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("username");

        if (!user) {
            console.error(`User not found for token ID: ${decoded._id}`);
            throwError(STATUS_CODES.UNAUTHORIZED, "User not found");
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error("Invalid token:", error.message);
            return next(new CustomError(STATUS_CODES.UNAUTHORIZED, "Invalid token"));
        } else if (error.name === 'TokenExpiredError') {
            console.error("Token expired:", error.message);
            return next(new CustomError(STATUS_CODES.UNAUTHORIZED, "Token expired"));
        } else {
            console.error("Error in validating token:", error.stack || error.message);
            next(error);
        }
    }
};

module.exports = {
    verifyJWT
};
