const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authorize = require('../middleware/role.middleware');
const authenticate = require('../middleware/auth.middleware');
const upload = require('../config/multer');

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "SELLER"),
    upload.single("image"),
    productController.createProduct
);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", authenticate, authorize("ADMIN", "SELLER"), productController.updateProduct);

router.delete("/:id", authenticate, authorize("ADMIN", "SELLER"), productController.deleteProduct);

module.exports = router;