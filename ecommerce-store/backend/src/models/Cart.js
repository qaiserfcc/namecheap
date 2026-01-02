const { query } = require('../config/database');

class Cart {
  static async addItem(userId, productId, quantity = 1) {
    // Check if item already exists in cart
    const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    const existing = await query(checkSql, [userId, productId]);
    
    if (existing.length > 0) {
      // Update quantity
      const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
      await query(updateSql, [quantity, userId, productId]);
      return existing[0].id;
    } else {
      // Insert new item
      const insertSql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
      const result = await query(insertSql, [userId, productId, quantity]);
      return result.insertId;
    }
  }

  static async getCartItems(userId) {
    const sql = `
      SELECT 
        c.id,
        c.quantity,
        c.created_at,
        p.id as product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.price,
        p.compare_price,
        p.image_url,
        p.stock_quantity,
        p.is_active,
        (p.price * c.quantity) as subtotal
      FROM cart c
      INNER JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;
    
    const items = await query(sql, [userId]);
    
    // Calculate totals
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      items,
      summary: {
        itemCount,
        subtotal: total,
        total
      }
    };
  }

  static async updateQuantity(cartItemId, userId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(cartItemId, userId);
    }
    
    const sql = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';
    await query(sql, [quantity, cartItemId, userId]);
  }

  static async removeItem(cartItemId, userId) {
    const sql = 'DELETE FROM cart WHERE id = ? AND user_id = ?';
    await query(sql, [cartItemId, userId]);
  }

  static async clearCart(userId) {
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    await query(sql, [userId]);
  }

  static async getItemCount(userId) {
    const sql = 'SELECT SUM(quantity) as count FROM cart WHERE user_id = ?';
    const result = await query(sql, [userId]);
    return result[0].count || 0;
  }
}

module.exports = Cart;
