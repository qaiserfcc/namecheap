const { query, transaction } = require('../config/database');

class Order {
  static async create(orderData, orderItems) {
    return await transaction(async (connection) => {
      const {
        userId, orderNumber, totalAmount, subtotal, taxAmount = 0,
        shippingAmount = 0, discountAmount = 0, paymentMethod,
        shippingAddress, billingAddress, customerNote
      } = orderData;
      
      // Insert order
      const orderSql = `
        INSERT INTO orders 
        (user_id, order_number, total_amount, subtotal, tax_amount, shipping_amount, 
         discount_amount, payment_method, shipping_address, billing_address, customer_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [orderResult] = await connection.execute(orderSql, [
        userId, orderNumber, totalAmount, subtotal, taxAmount, shippingAmount,
        discountAmount, paymentMethod, JSON.stringify(shippingAddress),
        billingAddress ? JSON.stringify(billingAddress) : null, customerNote || null
      ]);
      
      const orderId = orderResult.insertId;
      
      // Insert order items
      const itemSql = `
        INSERT INTO order_items 
        (order_id, product_id, product_name, product_sku, quantity, price, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      for (const item of orderItems) {
        await connection.execute(itemSql, [
          orderId, item.productId, item.productName, item.productSku || null,
          item.quantity, item.price, item.subtotal
        ]);
        
        // Update product stock
        const stockSql = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?';
        await connection.execute(stockSql, [item.quantity, item.productId]);
      }
      
      return orderId;
    });
  }

  static async findById(id, userId = null) {
    let sql = `
      SELECT o.*, 
        u.email as customer_email,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    const params = [id];
    
    if (userId) {
      sql += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    const results = await query(sql, params);
    
    if (!results[0]) return null;
    
    const order = this.formatOrder(results[0]);
    
    // Get order items
    const itemsSql = `
      SELECT * FROM order_items WHERE order_id = ?
    `;
    order.items = await query(itemsSql, [id]);
    
    return order;
  }

  static async findByOrderNumber(orderNumber, userId = null) {
    let sql = `
      SELECT o.*, 
        u.email as customer_email,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ?
    `;
    const params = [orderNumber];
    
    if (userId) {
      sql += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    const results = await query(sql, params);
    
    if (!results[0]) return null;
    
    const order = this.formatOrder(results[0]);
    
    // Get order items
    const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
    order.items = await query(itemsSql, [order.id]);
    
    return order;
  }

  static async getAll(filters = {}) {
    const { page = 1, limit = 20, userId, status } = filters;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT o.*,
        u.email as customer_email,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (userId) {
      sql += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams = [];
    
    if (userId) {
      countSql += ' AND user_id = ?';
      countParams.push(userId);
    }
    
    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }
    
    const countResult = await query(countSql, countParams);
    
    return {
      orders: results.map(o => this.formatOrder(o)),
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async updateStatus(id, status, adminNote = null) {
    const updates = ['status = ?'];
    const values = [status];
    
    if (status === 'shipped') {
      updates.push('shipped_at = CURRENT_TIMESTAMP');
    } else if (status === 'delivered') {
      updates.push('delivered_at = CURRENT_TIMESTAMP');
    } else if (status === 'cancelled') {
      updates.push('cancelled_at = CURRENT_TIMESTAMP');
    }
    
    if (adminNote) {
      updates.push('admin_note = ?');
      values.push(adminNote);
    }
    
    values.push(id);
    const sql = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  static async updatePaymentStatus(id, paymentStatus) {
    const sql = 'UPDATE orders SET payment_status = ? WHERE id = ?';
    await query(sql, [paymentStatus, id]);
  }

  static async cancel(id, userId, reason) {
    const order = await this.findById(id, userId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error('Order cannot be cancelled');
    }
    
    await transaction(async (connection) => {
      // Update order status
      const orderSql = `
        UPDATE orders 
        SET status = 'cancelled', 
            cancelled_at = CURRENT_TIMESTAMP,
            cancellation_reason = ?
        WHERE id = ?
      `;
      await connection.execute(orderSql, [reason, id]);
      
      // Restore product stock
      const items = order.items;
      for (const item of items) {
        const stockSql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?';
        await connection.execute(stockSql, [item.quantity, item.product_id]);
      }
    });
  }

  static async getDashboardStats() {
    const stats = {};
    
    // Total orders
    const totalSql = 'SELECT COUNT(*) as total FROM orders';
    const totalResult = await query(totalSql);
    stats.totalOrders = totalResult[0].total;
    
    // Pending orders
    const pendingSql = "SELECT COUNT(*) as total FROM orders WHERE status = 'pending'";
    const pendingResult = await query(pendingSql);
    stats.pendingOrders = pendingResult[0].total;
    
    // Total revenue
    const revenueSql = "SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'";
    const revenueResult = await query(revenueSql);
    stats.totalRevenue = parseFloat(revenueResult[0].total || 0);
    
    // Recent orders (last 7 days)
    const recentSql = `
      SELECT COUNT(*) as total 
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;
    const recentResult = await query(recentSql);
    stats.recentOrders = recentResult[0].total;
    
    return stats;
  }

  static formatOrder(order) {
    if (!order) return null;
    
    // Parse JSON fields
    if (order.shipping_address && typeof order.shipping_address === 'string') {
      try {
        order.shipping_address = JSON.parse(order.shipping_address);
      } catch (e) {
        order.shipping_address = {};
      }
    }
    
    if (order.billing_address && typeof order.billing_address === 'string') {
      try {
        order.billing_address = JSON.parse(order.billing_address);
      } catch (e) {
        order.billing_address = null;
      }
    }
    
    return order;
  }
}

module.exports = Order;
