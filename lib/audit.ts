/**
 * Audit Logging System
 * Tracks all admin actions for security and compliance
 */

import { query } from "./db"

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "BULK_UPLOAD"
  | "STATUS_CHANGE"
  | "EXPORT"

export type AuditEntity = "USER" | "PRODUCT" | "ORDER" | "PROMOTION" | "AUTH" | "SYSTEM"

export interface AuditLogEntry {
  userId: number
  userEmail: string
  action: AuditAction
  entity: AuditEntity
  entityId?: number | string
  changes?: Record<string, any>
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Create audit log table if it doesn't exist
 */
export async function ensureAuditTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id VARCHAR(255),
        changes JSONB,
        metadata JSONB,
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
    `)
  } catch (error) {
    console.error("Failed to ensure audit table:", error)
  }
}

/**
 * Log an admin action
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_logs (
        user_id, user_email, action, entity, entity_id, 
        changes, metadata, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        entry.userId,
        entry.userEmail,
        entry.action,
        entry.entity,
        entry.entityId || null,
        entry.changes ? JSON.stringify(entry.changes) : null,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
        entry.ipAddress || null,
        entry.userAgent || null,
      ]
    )
  } catch (error) {
    console.error("Failed to log audit event:", error)
    // Don't throw - audit logging failure shouldn't break the request
  }
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogs(options: {
  entityId?: number | string
  entity?: AuditEntity
  userId?: number
  action?: AuditAction
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (options.entityId) {
    conditions.push(`entity_id = $${paramIndex}`)
    params.push(options.entityId.toString())
    paramIndex++
  }

  if (options.entity) {
    conditions.push(`entity = $${paramIndex}`)
    params.push(options.entity)
    paramIndex++
  }

  if (options.userId) {
    conditions.push(`user_id = $${paramIndex}`)
    params.push(options.userId)
    paramIndex++
  }

  if (options.action) {
    conditions.push(`action = $${paramIndex}`)
    params.push(options.action)
    paramIndex++
  }

  if (options.startDate) {
    conditions.push(`created_at >= $${paramIndex}`)
    params.push(options.startDate.toISOString())
    paramIndex++
  }

  if (options.endDate) {
    conditions.push(`created_at <= $${paramIndex}`)
    params.push(options.endDate.toISOString())
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const limit = options.limit || 50
  const offset = options.offset || 0

  const result = await query(
    `SELECT * FROM audit_logs 
     ${whereClause} 
     ORDER BY created_at DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  )

  return result
}

/**
 * Get audit statistics
 */
export async function getAuditStats(startDate?: Date, endDate?: Date) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex}`)
    params.push(startDate.toISOString())
    paramIndex++
  }

  if (endDate) {
    conditions.push(`created_at <= $${paramIndex}`)
    params.push(endDate.toISOString())
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  const [actionStats, entityStats, userStats] = await Promise.all([
    query(`SELECT action, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY action`, params),
    query(`SELECT entity, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY entity`, params),
    query(
      `SELECT user_email, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY user_email ORDER BY count DESC LIMIT 10`,
      params
    ),
  ])

  return {
    byAction: actionStats,
    byEntity: entityStats,
    topUsers: userStats,
  }
}

/**
 * Helper to extract IP address from request
 */
export function getIpAddress(request: Request): string | undefined {
  // Check various headers for IP address
  const headers = request.headers
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") || // Cloudflare
    undefined
  )
}

/**
 * Helper to get user agent from request
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get("user-agent") || undefined
}
