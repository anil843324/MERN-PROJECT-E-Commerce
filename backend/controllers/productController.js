const Product = require('../models/productModel');
const ErrorHander = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// create product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
 
  req.body.user=req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all  Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
 
  const resultPerPage = 5;
  const productCount= await Product.countDocuments()
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    allProducts: productCount,
    result:products.length,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander('Product Not Found', 404));
  }

  res.status(200).json({
    success: true,
    product,
   
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander('Product Not Found', 500));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delte Product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander('Product Not Found', 500));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: 'Product Delete Successfully ',
  });
});
