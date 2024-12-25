const { User } = require('../models/user.model');
const ApiResponse = require('../utils/ApiResponse');
const { STATUS_CODES, hashPassword, throwError, comparePassword, generateAccessToken } = require('../utils/constants');
const { sendConfirmationMail } = require('../utils/MailServices');

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) throwError(STATUS_CODES.BAD_REQUEST, "Missing required fields..!");

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) throwError(STATUS_CODES.CONFLICT, "Username or Email already exists!");

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) throwError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Error while hashing password!");

        const newUser = { username, email, password: hashedPassword };

        const data = await User.create(newUser);
        if (!data) throwError(STATUS_CODES.FORBIDDEN, "Error while registering user!");

        sendConfirmationMail(data.username, data.email).catch(err => console.error("Email sending failed:", err));

        return res.status(STATUS_CODES.CREATED).json(
            new ApiResponse(STATUS_CODES.CREATED, { _id: data._id, username, email }, "User has been registered successfully!")
        );
    } catch (error) {
        console.error("Error registering user:", error.message);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username && !email) throwError(STATUS_CODES.BAD_REQUEST, "Username or email is required to sign in!");
        if (!password) throwError(STATUS_CODES.BAD_REQUEST, "Please provide password!");

        const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");
        if (!user) throwError(STATUS_CODES.NOT_FOUND, "Invalid username or email");

        if (!user.isVerified) throwError(STATUS_CODES.FORBIDDEN, "Please verify your email to login!");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throwError(STATUS_CODES.BAD_REQUEST, "Invalid credentials");

        const accessToken = generateAccessToken({ _id: user._id, username: user.username });

        return res.status(STATUS_CODES.OK).json(
            new ApiResponse(STATUS_CODES.OK, { username, email, token: accessToken }, "User logged in successfully!")
        );
    } catch (error) {
        console.error("Error signing in user:", error.message);
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) throwError(STATUS_CODES.NOT_FOUND, "User not found!");

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, user, "User details found!"));
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    const { username, email, password } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);

        if (!user) throwError(STATUS_CODES.NOT_FOUND, "User not found!");

        if (username && username !== user.username) {
            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) throwError(STATUS_CODES.CONFLICT, "Username already taken!");
        }

        if (email && email !== user.email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) throwError(STATUS_CODES.CONFLICT, "Email already in use!");
        }

        user.username = username || user.username;
        user.email = email || user.email;

        if (password) {
            user.password = await hashPassword(password);
        }

        await user.save();

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, { username, email }, "User updated successfully!"));
    } catch (error) {
        console.error("Error updating user:", error.message);
        next(error);
    }
};

const verifyAccount = async (req, res, next) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email });

        if (!user) throwError(STATUS_CODES.FORBIDDEN, "Invalid verification link");

        if (user.isVerified) throwError(STATUS_CODES.CONFLICT, "Already verified!");

        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.ACCEPTED).json(new ApiResponse(STATUS_CODES.ACCEPTED, null, "Your email has been successfully verified. You can now log in."));
    } catch (error) {
        console.error("Error validating account:", error.message);
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    verifyAccount
};
