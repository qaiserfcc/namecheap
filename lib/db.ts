import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  try {
    // Use sql.query for positional parameters; returns rows array directly
    const rows = await sql.query(text, params)
    return rows as T[]
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

// User operations
export async function createUser(email: string, passwordHash: string, fullName: string, role = "buyer") {
  const result = await query(
    "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role",
    [email, passwordHash, fullName, role],
  )
  return result
}

export async function getUserByEmail(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result
}

export async function getUserById(id: number) {
  const result = await query("SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = $1", [id])
  return result
}

// Product operations
export async function getProducts() {
  return query("SELECT * FROM products ORDER BY created_at DESC")
}

export async function getProductById(id: number) {
  const result = await query("SELECT * FROM products WHERE id = $1", [id])
  return result
}

export async function createProduct(
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl: string,
  stock: number,
) {
  return query(
    "INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, description, price, category, imageUrl, stock],
  )
}

// Order operations
export async function createOrder(userId: number, totalAmount: number, shippingAddress: string, town: string) {
  return query(
    "INSERT INTO orders (user_id, total_amount, shipping_address, town) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, totalAmount, shippingAddress, town],
  )
}

export async function getOrdersByUserId(userId: number) {
  return query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId])
}

export async function getAllOrders() {
  return query(
    "SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC",
  )
}

export async function updateOrderStatus(orderId: number, status: string) {
  return query("UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [
    status,
    orderId,
  ])
}
