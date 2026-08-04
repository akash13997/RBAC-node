const Product = require("../models/Product");
const mongoose = require("mongoose");
const { deleteImage } = require("./cloudinary.service");

const createProduct = async (productData, sellerId) => {
  const {
    name,

    description,

    price,

    stock,

    category,

    image,
  } = productData;

  if (
    !name ||
    !description ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    throw new Error("All fields are required");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const product = await Product.create({
    name,

    description,

    price,

    stock,

    category,

    image,

    seller: sellerId,
  });

  return product;
};

const getProducts = async (query) => {
  let {
    page = 1,

    limit = 10,

    search = "",

    category,

    sort = "-createdAt",
  } = query;

  page = Number(page);

  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.name = {
      $regex: search,

      $options: "i",
    };
  }

  const products = await Product.find(filter)

    .sort(sort)

    .skip(skip)

    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    products,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (productId, data, user) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid Product ID");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (user.role === "SELLER" && product.seller.toString() !== user.id) {
    throw new Error("You can update only your own products");
  }
  if (data.name !== undefined) product.name = data.name;
  if (data.description !== undefined) product.description = data.description;
  if (data.price !== undefined) product.price = data.price;
  if (data.stock !== undefined) product.stock = data.stock;
  if (data.category !== undefined) product.category = data.category;
  if (data.image) {
    if (product.image?.publicId) {
      await deleteImage(product.image.publicId);
    }

    product.image = data.image;
  }
  if (product.price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (product.stock < 0) {
    throw new Error("Stock cannot be negative");
  }
  await product.save();

  return product;
};

const deleteProduct = async (productId, user) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid Product ID");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (user.role === "SELLER" && product.seller.toString() !== user.id) {
    throw new Error("You can delete only your own products");
  }
  product.isActive = false;
  await product.save();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
