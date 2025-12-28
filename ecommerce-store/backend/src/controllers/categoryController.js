const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const { withProductCount } = req.query;
    
    let categories;
    
    if (withProductCount === 'true') {
      categories = await Category.getWithProductCount();
    } else {
      categories = await Category.getAll(true);
    }
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit, sortBy, order } = req.query;
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }
    
    const filters = {
      categoryId: parseInt(id),
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
      isActive: true
    };
    
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    const result = await Product.getAll(filters);
    
    res.json({
      success: true,
      data: {
        category,
        ...result
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new category (admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const categoryData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      parentId: req.body.parentId,
      displayOrder: req.body.displayOrder || 0
    };
    
    const categoryId = await Category.create(categoryData);
    const category = await Category.findById(categoryId);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }
    
    const updateData = {};
    const allowedFields = ['name', 'slug', 'description', 'imageUrl', 'displayOrder', 'isActive'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    const category = await Category.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }
    
    await Category.delete(id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    if (error.message.includes('Cannot delete category')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};
