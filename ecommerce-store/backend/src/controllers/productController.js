const Product = require('../models/Product');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, categoryId, search, sortBy, order, featured } = req.query;
    
    const filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
      isActive: true
    };
    
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    let result;
    
    if (featured === 'true') {
      const products = await Product.getFeatured(parseInt(limit) || 8);
      result = {
        products,
        total: products.length,
        page: 1,
        limit: products.length,
        totalPages: 1
      };
    } else {
      result = await Product.getAll(filters);
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findBySlug(slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create new product (admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const productData = {
      categoryId: req.body.categoryId,
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      comparePrice: req.body.comparePrice,
      sku: req.body.sku,
      stockQuantity: req.body.stockQuantity || 0,
      imageUrl: req.body.imageUrl,
      images: req.body.images,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : false
    };
    
    const productId = await Product.create(productData);
    const product = await Product.findById(productId);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    const updateData = {};
    const allowedFields = [
      'categoryId', 'name', 'slug', 'description', 'price', 'comparePrice',
      'sku', 'stockQuantity', 'imageUrl', 'images', 'isActive', 'isFeatured'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    const product = await Product.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    await Product.delete(id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getFeatured(limit);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
