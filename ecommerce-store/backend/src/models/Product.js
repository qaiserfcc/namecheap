const { query } = require('../config/database');

class Product {
  static async create(productData) {
    const {
      categoryId, name, slug, description, price, comparePrice,
      sku, stockQuantity, imageUrl, images, isActive, isFeatured
    } = productData;
    
    const sql = `
      INSERT INTO products 
      (category_id, name, slug, description, price, compare_price, sku, stock_quantity, 
       image_url, images, is_active, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      categoryId, name, slug, description, price, comparePrice || null,
      sku, stockQuantity || 0, imageUrl || null, 
      images ? JSON.stringify(images) : null,
      isActive !== undefined ? isActive : true,
      isFeatured !== undefined ? isFeatured : false
    ]);
    
    return result.insertId;
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0] ? this.formatProduct(results[0]) : null;
  }

  static async findBySlug(slug) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `;
    const results = await query(sql, [slug]);
    return results[0] ? this.formatProduct(results[0]) : null;
  }

  static async getAll(filters = {}) {
    const { page = 1, limit = 12, categoryId, search, sortBy = 'created_at', order = 'DESC', isActive = true } = filters;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (isActive !== undefined) {
      sql += ' AND p.is_active = ?';
      params.push(isActive);
    }
    
    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }
    
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const validSortColumns = ['created_at', 'name', 'price', 'stock_quantity'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    sql += ` ORDER BY p.${sortColumn} ${sortOrder}`;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
    const countParams = [];
    
    if (isActive !== undefined) {
      countSql += ' AND p.is_active = ?';
      countParams.push(isActive);
    }
    
    if (categoryId) {
      countSql += ' AND p.category_id = ?';
      countParams.push(categoryId);
    }
    
    if (search) {
      countSql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await query(countSql, countParams);
    
    return {
      products: results.map(p => this.formatProduct(p)),
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async update(id, productData) {
    const updates = [];
    const values = [];
    
    const fields = {
      categoryId: 'category_id',
      name: 'name',
      slug: 'slug',
      description: 'description',
      price: 'price',
      comparePrice: 'compare_price',
      sku: 'sku',
      stockQuantity: 'stock_quantity',
      imageUrl: 'image_url',
      isActive: 'is_active',
      isFeatured: 'is_featured'
    };
    
    for (const [jsKey, dbKey] of Object.entries(fields)) {
      if (productData[jsKey] !== undefined) {
        updates.push(`${dbKey} = ?`);
        values.push(productData[jsKey]);
      }
    }
    
    if (productData.images !== undefined) {
      updates.push('images = ?');
      values.push(JSON.stringify(productData.images));
    }
    
    if (updates.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    await query(sql, [id]);
  }

  static async updateStock(id, quantity) {
    const sql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?';
    await query(sql, [quantity, id]);
  }

  static async getFeatured(limit = 8) {
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE AND p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    const results = await query(sql, [limit]);
    return results.map(p => this.formatProduct(p));
  }

  static formatProduct(product) {
    if (!product) return null;
    
    // Parse JSON fields
    if (product.images && typeof product.images === 'string') {
      try {
        product.images = JSON.parse(product.images);
      } catch (e) {
        product.images = [];
      }
    }
    
    return product;
  }
}

module.exports = Product;
