import bcrypt from "bcryptjs"
import { createUser, getUserByEmail } from "./db"

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function registerUser(email: string, password: string, fullName: string, role = "buyer") {
  const existingUser = await getUserByEmail(email)
  if (existingUser && existingUser.length > 0) {
    throw new Error("User already exists")
  }

  const passwordHash = await hashPassword(password)
  const result = await createUser(email, passwordHash, fullName, role)
  return result[0]
}

export async function authenticateUser(email: string, password: string) {
  const result = await getUserByEmail(email)
  if (!result || result.length === 0) {
    throw new Error("Invalid credentials")
  }

  const user = result[0]
  const isPasswordValid = await verifyPassword(password, user.password_hash)

  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
  }
}
