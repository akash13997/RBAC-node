const express = require("express");
const logger = require("./middleware/logger");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());



app.use(logger);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
module.exports = app;