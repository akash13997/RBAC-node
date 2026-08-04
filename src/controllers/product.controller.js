const productService = require("../services/product.service");
const { uploadImage } = require("../services/cloudinary.service");
const fs = require("fs/promises");
const createProduct = async (req, res) => {
  try {
    let image = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      image = await uploadImage(req.file.path);

      await fs.unlink(req.file.path);
    }
    const productData = {
      ...req.body,
      image,
    };
    const product = await productService.createProduct(
      productData,
      req.user.id,
    );
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
       let image;

    if (req.file) {
      // Upload new image to Cloudinary
      image = await uploadImage(req.file.path);

      // Delete temporary local file
      await fs.unlink(req.file.path);
    }

    const productData = {
      ...req.body,
      image,
    };
    const product = await productService.updateProduct(
      req.params.id,
      productData,
      req.user,
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
