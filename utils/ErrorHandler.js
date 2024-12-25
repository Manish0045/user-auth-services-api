class CustomError extends Error {
    constructor(statusCode = 500, message = "Something went wrong") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
    }
};

module.exports = CustomError;