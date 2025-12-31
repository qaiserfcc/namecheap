import crypto from "node:crypto"

const baseUrl = process.env.BASE_URL || "http://localhost:3000"

async function postJson(path: string, body: any) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function getJson(path: string) {
  const res = await fetch(`${baseUrl}${path}`)
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function run() {
  console.log(`🌐 Hitting API at ${baseUrl}`)

  const unique = crypto.randomUUID().slice(0, 8)
  const email = `smoke-${unique}@cheapname.tyo`
  const password = "P@ssw0rd!123"

  // Register buyer
  const register = await postJson("/api/auth/register", {
    email,
    password,
    fullName: "Smoke Test User",
    role: "buyer",
  })
  console.log("➡️  POST /api/auth/register", register.status, register.data)
  if (register.status !== 200) {
    throw new Error("Register failed")
  }

  // Login buyer
  const loginBuyer = await postJson("/api/auth/login", { email, password })
  console.log("➡️  POST /api/auth/login (buyer)", loginBuyer.status, loginBuyer.data)
  if (loginBuyer.status !== 200) {
    throw new Error("Buyer login failed")
  }

  // Login admin
  const loginAdmin = await postJson("/api/auth/login", {
    email: "admin@cheapname.tyo",
    password: "password123",
  })
  console.log("➡️  POST /api/auth/login (admin)", loginAdmin.status, loginAdmin.data)
  if (loginAdmin.status !== 200) {
    throw new Error("Admin login failed")
  }

  // Fetch products
  const products = await getJson("/api/products")
  console.log("➡️  GET /api/products", products.status, Array.isArray(products.data) ? `${products.data.length} items` : products.data)
  if (products.status !== 200) {
    throw new Error("Products fetch failed")
  }

  console.log("✅ API smoke tests passed")
}

run().catch((err) => {
  console.error("❌ API smoke test failed:", err.message)
  process.exit(1)
})
