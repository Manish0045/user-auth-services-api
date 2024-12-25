const mongoose = require('mongoose');

const connectDB = async function () {
    const maxRetries = 3;
    let attempt = 0;

    const DATABASE = process.env.DB_NAME ?? "user-authentication";
    const MONGO_URL = process.env.MONGO_URI + DATABASE;

    while (attempt < maxRetries) {
        try {
            const connectionInstance = await mongoose.connect(MONGO_URL, { maxPoolSize: 10 });
            console.log("DATABASE connected!");
            console.table({ "DATABASE": connectionInstance.connection.name, "HOST": connectionInstance.connection.host });
            return;
        } catch (error) {
            attempt++;
            console.error(`DB connection attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) {
                throw new Error('Unable to connect to the database after multiple attempts.');
            }
            await new Promise(res => setTimeout(res, 5000));
        }
    }

};

module.exports = connectDB;