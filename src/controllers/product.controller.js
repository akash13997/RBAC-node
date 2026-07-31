const productService = require("../services/product.service");

const createProduct = async (req, res) => {
   
    try {
      const productData = {
            ...req.body,
            image: req.file ? req.file.filename : ""
        }
        const product = await productService.createProduct(productData, req.user.id);
        res.status(201).json({
            success: true, 
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}   

const getProductById = async (req, res) => {
     try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.user);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id, req.user);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}   