const { query } = require('../config/database');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, phone, role = 'customer' } = userData;
    
    const sql = `
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email, password, firstName, lastName, phone, role]);
    return result.insertId;
  }

  static async findById(id) {
    const sql = 'SELECT id, email, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0] || null;
  }

  static async update(id, userData) {
    const updates = [];
    const values = [];
    
    if (userData.firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(userData.lastName);
    }
    if (userData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.password !== undefined) {
      updates.push('password = ?');
      values.push(userData.password);
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }
    
    if (updates.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  static async updateRefreshToken(userId, refreshToken) {
    const sql = 'UPDATE users SET refresh_token = ? WHERE id = ?';
    await query(sql, [refreshToken, userId]);
  }

  static async findByRefreshToken(refreshToken) {
    const sql = 'SELECT * FROM users WHERE refresh_token = ?';
    const results = await query(sql, [refreshToken]);
    return results[0] || null;
  }

  static async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, email, first_name, last_name, phone, role, is_active, email_verified, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const results = await query(sql, [limit, offset]);
    
    const countSql = 'SELECT COUNT(*) as total FROM users';
    const countResult = await query(countSql);
    
    return {
      users: results,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
  }
}

module.exports = User;
