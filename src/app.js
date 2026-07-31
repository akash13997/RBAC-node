const express = require("express");
const logger = require("./middleware/logger");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const multer = require("multer");

const app = express();

app.use(express.json());

app.use(logger);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
});

module.exports = app;
