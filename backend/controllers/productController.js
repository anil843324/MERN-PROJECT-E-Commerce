const Product = require('../models/productModel');

// create product -- Admin
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

// Get all  Products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    result: products.length,
    products,
  });
};


// Get Product Details
exports.getProductDetails = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'product not found',
    });
  }


   res.status(200).json({
    success:true,
    product
   })

};
 

// Update Product -- Admin

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'product not found',
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

   res.status(200).json({
    success:true,
    product
   })

};


// Delte Product

exports.deleteProduct = async (req, res,next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'product not found',
    });
  }

  await product.remove();


  res.status(200).json({
    success: true,
    message:"Product Delete Successfully "
  });
};