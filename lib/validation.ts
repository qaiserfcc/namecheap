/**
 * Input Validation Schemas
 * Using Zod for type-safe validation of API inputs
 */

import { z } from "zod"

// ==================== User Validation ====================

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(1, "Full name is required").max(255).trim(),
  role: z.enum(["buyer", "admin"]).optional().default("buyer"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(255).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
  fullName: z.string().min(1).max(255).trim().optional(),
  role: z.enum(["buyer", "admin"]).optional(),
  phone: z.string().max(20).optional(),
})

// ==================== Product Validation ====================

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255).trim(),
  description: z.string().max(5000).trim().optional(),
  price: z.number().positive("Price must be positive").max(999999.99),
  category: z.string().min(1, "Category is required").max(100).trim(),
  imageUrl: z.string().url("Invalid image URL").max(500).optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").max(999999),
})

export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(5000).trim().optional(),
  price: z.number().positive().max(999999.99).optional(),
  category: z.string().min(1).max(100).trim().optional(),
  imageUrl: z.string().url().max(500).optional(),
  stock: z.number().int().min(0).max(999999).optional(),
})

export const productImageSchema = z.object({
  image_url: z.string().url("Invalid image URL").max(500),
  alt_text: z.string().max(255).optional(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
})

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(100).trim(),
  attributes: z.record(z.string()),
  price: z.number().positive().max(999999.99).optional(),
  stock: z.number().int().min(0).max(999999),
})

// ==================== Order Validation ====================

export const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(1000),
        price: z.number().positive().max(999999.99),
      })
    )
    .min(1, "Order must have at least one item")
    .max(100, "Order cannot have more than 100 items"),
  shippingAddress: z.string().min(10, "Shipping address is required").max(500).trim(),
  town: z.string().min(1, "Town is required").max(100).trim(),
  fullName: z.string().min(1, "Full name is required").max(255).trim(),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number is required").max(20).trim(),
  promotionCode: z.string().max(50).trim().optional(),
})

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
  tracking_number: z.string().max(100).trim().optional(),
  shipping_provider: z.string().max(100).trim().optional(),
  expected_delivery: z.string().datetime().optional(),
  notes: z.string().max(1000).trim().optional(),
  eventNotes: z.string().max(500).trim().optional(),
})

// ==================== Promotion Validation ====================

export const createPromotionSchema = z.object({
  name: z.string().min(1, "Promotion name is required").max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  code: z
    .string()
    .max(50)
    .trim()
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores")
    .optional(),
  auto_apply: z.boolean().default(false),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive("Discount value must be positive").max(100),
  min_order_amount: z.number().min(0).max(999999.99).optional(),
  product_ids: z.array(z.number().int().positive()).optional(),
  category: z.string().max(100).trim().optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  active: z.boolean().default(true),
  usage_limit: z.number().int().positive().max(999999).optional(),
  max_discount: z.number().positive().max(999999.99).optional(),
  stackable: z.boolean().default(false),
})

export const updatePromotionSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  code: z
    .string()
    .max(50)
    .trim()
    .regex(/^[A-Z0-9_-]+$/)
    .optional(),
  auto_apply: z.boolean().optional(),
  discount_type: z.enum(["percentage", "fixed"]).optional(),
  discount_value: z.number().positive().max(100).optional(),
  min_order_amount: z.number().min(0).max(999999.99).optional(),
  product_ids: z.array(z.number().int().positive()).optional(),
  category: z.string().max(100).trim().optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  active: z.boolean().optional(),
  usage_limit: z.number().int().positive().max(999999).optional(),
  max_discount: z.number().positive().max(999999.99).optional(),
  stackable: z.boolean().optional(),
})

// ==================== Bulk Upload Validation ====================

/**
 * Helper to validate and parse number from string
 */
function parseNumberSafe(value: string, fieldName: string, mustBePositive = true): number | typeof z.NEVER {
  const num = parseFloat(value)
  const isInvalid = isNaN(num) || (mustBePositive ? num <= 0 : num < 0)
  
  if (isInvalid) {
    const message = mustBePositive 
      ? `${fieldName} must be a valid positive number`
      : `${fieldName} must be a valid number (cannot be negative)`
    throw new z.ZodError([{
      code: z.ZodIssueCode.custom,
      message,
      path: [fieldName]
    }])
  }
  return num
}

/**
 * Helper to validate and parse integer from string or number
 */
function parseIntSafe(value: string | number, fieldName: string): number | typeof z.NEVER {
  const num = typeof value === "string" ? parseInt(value, 10) : value
  if (isNaN(num) || num < 0) {
    throw new z.ZodError([{
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be a valid non-negative integer`,
      path: [fieldName]
    }])
  }
  return num
}

export const bulkUploadProductSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  description: z.string().max(5000).trim().optional(),
  price: z.string().transform((val) => parseNumberSafe(val, "price", true)), // mustBePositive = true
  category: z.string().min(1).max(100).trim(),
  stock_quantity: z
    .union([z.string(), z.number()])
    .transform((val) => parseIntSafe(val, "stock_quantity")),
})

// ==================== Pagination Validation ====================

export const paginationSchema = z.object({
  page: z.number().int().positive().max(1000).default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// ==================== Helper Functions ====================

/**
 * Validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data)
}

/**
 * Sanitize string input to prevent XSS
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim()
}

/**
 * Sanitize object by sanitizing all string values
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key]) as any
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  return sanitized
}
