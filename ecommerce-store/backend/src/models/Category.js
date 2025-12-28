const { query } = require('../config/database');

class Category {
  static async create(categoryData) {
    const { name, slug, description, imageUrl, parentId, displayOrder } = categoryData;
    
    const sql = `
      INSERT INTO categories (name, slug, description, image_url, parent_id, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      name, slug, description || null, imageUrl || null, 
      parentId || null, displayOrder || 0
    ]);
    
    return result.insertId;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  static async findBySlug(slug) {
    const sql = 'SELECT * FROM categories WHERE slug = ?';
    const results = await query(sql, [slug]);
    return results[0] || null;
  }

  static async getAll(isActive = true) {
    let sql = 'SELECT * FROM categories';
    const params = [];
    
    if (isActive !== undefined) {
      sql += ' WHERE is_active = ?';
      params.push(isActive);
    }
    
    sql += ' ORDER BY display_order ASC, name ASC';
    
    const results = await query(sql, params);
    return results;
  }

  static async update(id, categoryData) {
    const updates = [];
    const values = [];
    
    if (categoryData.name !== undefined) {
      updates.push('name = ?');
      values.push(categoryData.name);
    }
    if (categoryData.slug !== undefined) {
      updates.push('slug = ?');
      values.push(categoryData.slug);
    }
    if (categoryData.description !== undefined) {
      updates.push('description = ?');
      values.push(categoryData.description);
    }
    if (categoryData.imageUrl !== undefined) {
      updates.push('image_url = ?');
      values.push(categoryData.imageUrl);
    }
    if (categoryData.displayOrder !== undefined) {
      updates.push('display_order = ?');
      values.push(categoryData.displayOrder);
    }
    if (categoryData.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(categoryData.isActive);
    }
    
    if (updates.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  static async delete(id) {
    // Check if category has products
    const checkSql = 'SELECT COUNT(*) as count FROM products WHERE category_id = ?';
    const checkResult = await query(checkSql, [id]);
    
    if (checkResult[0].count > 0) {
      throw new Error('Cannot delete category with existing products');
    }
    
    const sql = 'DELETE FROM categories WHERE id = ?';
    await query(sql, [id]);
  }

  static async getWithProductCount() {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `;
    return await query(sql);
  }
}

module.exports = Category;
