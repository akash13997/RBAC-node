const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authorize = require('../middleware/role.middleware');
const authenticate = require('../middleware/auth.middleware');

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "SELLER"),
    productController.createProduct
);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", authenticate, authorize("ADMIN", "SELLER"), productController.updateProduct);

router.delete("/:id", authenticate, authorize('ADMIN'), productController.deleteProduct);

module.exports = router;