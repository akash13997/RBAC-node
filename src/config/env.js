require("dotenv").config();
module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_URL: process.env.DB_URL,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};