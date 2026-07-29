require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/db");

const env = require("./config/env");

const startServer = async () => {

    await connectDB();

    app.listen(env.PORT, () => {

        console.log(`Server running on ${env.PORT}`);

    });

};

startServer();