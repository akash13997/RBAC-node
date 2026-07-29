const mongoose = require("mongoose");

const env = require("./env");

const connectDB = async () => {

    try {

        await mongoose.connect(env.DB_URL);

        console.log("Database Connected");

    } catch (error) {

        console.log(error.message);

        process.exit(1);

    }

};

module.exports = connectDB;