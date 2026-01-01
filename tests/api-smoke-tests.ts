/**
 * API Smoke Tests
 * Comprehensive smoke tests for all backend API endpoints
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

// Test data
let authToken = ''
let testProductId = ''
let testPromotionId = ''
let testOrderId = ''
let testUserId = ''

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message?: string
  responseTime?: number
}

const results: TestResult[] = []

async function makeRequest(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any; time: number }> {
  const startTime = Date.now()
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Cookie: `session=${token}` } : {}),
      },
    }

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json().catch(() => ({}))
    const time = Date.now() - startTime

    // Capture Set-Cookie header for session management
    const setCookie = response.headers.get('set-cookie')

    return { status: response.status, data, time, cookie: setCookie }
  } catch (error: any) {
    const time = Date.now() - startTime
    throw new Error(`Network error: ${error.message}${error.cause ? ` (Cause: ${error.cause})` : ''}`)
  }
}

function logResult(result: TestResult) {
  const statusColor = result.status === 'PASS' ? colors.green : result.status === 'FAIL' ? colors.red : colors.yellow
  const statusIcon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '○'
  
  console.log(
    `${statusColor}${statusIcon}${colors.reset} ${result.name} ${
      result.responseTime ? `(${result.responseTime}ms)` : ''
    }`
  )
  
  if (result.message) {
    console.log(`  ${colors.cyan}→${colors.reset} ${result.message}`)
  }
}

function addResult(name: string, status: 'PASS' | 'FAIL' | 'SKIP', message?: string, responseTime?: number) {
  const result = { name, status, message, responseTime }
  results.push(result)
  logResult(result)
}

// ==================== AUTH API TESTS ====================

async function testAuthRegister() {
  try {
    const res = await makeRequest('POST', '/api/auth/register', {
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123!',
      fullName: 'Test User',
      role: 'customer',
    })

    if (res.status === 200 || res.status === 201) {
      addResult('POST /api/auth/register', 'PASS', 'User registered successfully', res.time)
      return true
    } else {
      addResult('POST /api/auth/register', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/auth/register', 'FAIL', error.message)
    return false
  }
}

async function testAuthLogin() {
  try {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@cheapname.tyo',
      password: 'password123',
    })

    if (res.status === 200 && res.cookie) {
      // Extract session token from Set-Cookie header
      const match = res.cookie.match(/session=([^;]+)/)
      if (match) {
        authToken = match[1]
      }
      addResult('POST /api/auth/login', 'PASS', 'Login successful, token received', res.time)
      return true
    } else {
      addResult('POST /api/auth/login', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/auth/login', 'FAIL', error.message)
    return false
  }
}

async function testAuthLogout() {
  try {
    const res = await makeRequest('POST', '/api/auth/logout', {}, authToken)

    if (res.status === 200) {
      addResult('POST /api/auth/logout', 'PASS', 'Logout successful', res.time)
      return true
    } else {
      addResult('POST /api/auth/logout', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/auth/logout', 'FAIL', error.message)
    return false
  }
}

// ==================== PRODUCTS API TESTS ====================

async function testProductsGet() {
  try {
    const res = await makeRequest('GET', '/api/products')

    if (res.status === 200 && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        testProductId = res.data[0].id
      }
      addResult('GET /api/products', 'PASS', `Retrieved ${res.data.length} products`, res.time)
      return true
    } else {
      addResult('GET /api/products', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/products', 'FAIL', error.message)
    return false
  }
}

async function testProductsPost() {
  try {
    const res = await makeRequest(
      'POST',
      '/api/products',
      {
        name: `Test Product ${Date.now()}`,
        description: 'Smoke test product',
        price: 99.99,
        category: 'Test',
        imageUrl: 'https://via.placeholder.com/400',
        stock: 100,
      },
      authToken
    )

    if (res.status === 201 || res.status === 200) {
      if (res.data.id) {
        testProductId = res.data.id
      }
      addResult('POST /api/products', 'PASS', 'Product created successfully', res.time)
      return true
    } else {
      addResult('POST /api/products', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/products', 'FAIL', error.message)
    return false
  }
}

async function testProductsGetById() {
  if (!testProductId) {
    addResult('GET /api/products/[id]', 'SKIP', 'No product ID available')
    return false
  }

  try {
    const res = await makeRequest('GET', `/api/products/${testProductId}`)

    if (res.status === 200 && res.data.id) {
      addResult('GET /api/products/[id]', 'PASS', `Retrieved product: ${res.data.name}`, res.time)
      return true
    } else {
      addResult('GET /api/products/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/products/[id]', 'FAIL', error.message)
    return false
  }
}

async function testProductsPut() {
  if (!testProductId) {
    addResult('PATCH /api/products/[id]', 'SKIP', 'No product ID available')
    return false
  }

  try {
    const res = await makeRequest(
      'PATCH',
      `/api/products/${testProductId}`,
      {
        name: `Updated Product ${Date.now()}`,
        price: 149.99,
      },
      authToken
    )

    if (res.status === 200) {
      addResult('PATCH /api/products/[id]', 'PASS', 'Product updated successfully', res.time)
      return true
    } else {
      addResult('PATCH /api/products/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('PATCH /api/products/[id]', 'FAIL', error.message)
    return false
  }
}

// ==================== PROMOTIONS API TESTS ====================

async function testPromotionsGet() {
  try {
    const res = await makeRequest('GET', '/api/promotions')

    if (res.status === 200 && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        testPromotionId = res.data[0].id
      }
      addResult('GET /api/promotions', 'PASS', `Retrieved ${res.data.length} promotions`, res.time)
      return true
    } else {
      addResult('GET /api/promotions', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/promotions', 'FAIL', error.message)
    return false
  }
}

async function testPromotionsPost() {
  try {
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const res = await makeRequest(
      'POST',
      '/api/promotions',
      {
        name: `Smoke Test Promo ${Date.now()}`,
        code: `TEST${Date.now()}`,
        description: 'Smoke test promotion',
        discount_type: 'percentage',
        discount_value: 10,
        starts_at: now.toISOString(),
        ends_at: futureDate.toISOString(),
        active: true,
      },
      authToken
    )

    if (res.status === 201 || res.status === 200) {
      if (res.data.id) {
        testPromotionId = res.data.id
      }
      addResult('POST /api/promotions', 'PASS', 'Promotion created successfully', res.time)
      return true
    } else {
      addResult('POST /api/promotions', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/promotions', 'FAIL', error.message)
    return false
  }
}

async function testPromotionsGetById() {
  if (!testPromotionId) {
    addResult('GET /api/promotions/[id]', 'SKIP', 'No promotion ID available')
    return false
  }

  try {
    const res = await makeRequest('GET', `/api/promotions/${testPromotionId}`)

    if (res.status === 200 && res.data.id) {
      addResult('GET /api/promotions/[id]', 'PASS', `Retrieved promotion: ${res.data.code}`, res.time)
      return true
    } else {
      addResult('GET /api/promotions/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/promotions/[id]', 'FAIL', error.message)
    return false
  }
}

async function testPromotionsPut() {
  if (!testPromotionId) {
    addResult('PATCH /api/promotions/[id]', 'SKIP', 'No promotion ID available')
    return false
  }

  try {
    const res = await makeRequest(
      'PATCH',
      `/api/promotions/${testPromotionId}`,
      {
        discount_value: 15,
        active: true,
      },
      authToken
    )

    if (res.status === 200) {
      addResult('PATCH /api/promotions/[id]', 'PASS', 'Promotion updated successfully', res.time)
      return true
    } else {
      addResult('PATCH /api/promotions/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('PATCH /api/promotions/[id]', 'FAIL', error.message)
    return false
  }
}

async function testPromotionsValidate() {
  if (!testPromotionId) {
    addResult('GET /api/promotions/validate', 'SKIP', 'No promotion available to validate')
    return false
  }

  try {
    // Get the promotion code first
    const promoRes = await makeRequest('GET', `/api/promotions/${testPromotionId}`)
    const code = promoRes.data?.code

    if (!code) {
      addResult('GET /api/promotions/validate', 'SKIP', 'No promotion code available')
      return false
    }

    const res = await makeRequest('GET', `/api/promotions/validate?code=${code}`)

    if (res.status === 200 && res.data.code) {
      addResult('GET /api/promotions/validate', 'PASS', `Validated promo code: ${code}`, res.time)
      return true
    } else {
      addResult('GET /api/promotions/validate', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/promotions/validate', 'FAIL', error.message)
    return false
  }
}

// ==================== ORDERS API TESTS ====================

async function testOrdersGet() {
  try {
    const res = await makeRequest('GET', '/api/orders', {}, authToken)

    if (res.status === 200 && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        testOrderId = res.data[0].id
      }
      addResult('GET /api/orders', 'PASS', `Retrieved ${res.data.length} orders`, res.time)
      return true
    } else {
      addResult('GET /api/orders', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/orders', 'FAIL', error.message)
    return false
  }
}

async function testOrdersPost() {
  if (!testProductId) {
    addResult('POST /api/orders', 'SKIP', 'No product ID available for order creation')
    return false
  }

  try {
    const res = await makeRequest('POST', '/api/orders', {
      items: [
        {
          productId: testProductId,
          quantity: 2,
        },
      ],
      shippingAddress: '123 Test Street, Test City',
    }, authToken)

    if (res.status === 201 || res.status === 200) {
      if (res.data.id) {
        testOrderId = res.data.id
      }
      addResult('POST /api/orders', 'PASS', 'Order created successfully', res.time)
      return true
    } else {
      addResult('POST /api/orders', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/orders', 'FAIL', error.message)
    return false
  }
}

async function testOrdersGetById() {
  if (!testOrderId) {
    addResult('GET /api/orders/[id]', 'SKIP', 'No order ID available')
    return false
  }

  try {
    const res = await makeRequest('GET', `/api/orders/${testOrderId}`, null, authToken)

    if (res.status === 200 && res.data?.id) {
      addResult('GET /api/orders/[id]', 'PASS', `Retrieved order ${res.data.order_number || res.data.id}`, res.time)
      return true
    } else {
      addResult('GET /api/orders/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/orders/[id]', 'FAIL', error.message)
    return false
  }
}

async function testOrdersPut() {
  if (!testOrderId) {
    addResult('PATCH /api/orders/[id]', 'SKIP', 'No order ID available')
    return false
  }

  try {
    const res = await makeRequest(
      'PATCH',
      `/api/orders/${testOrderId}`,
      {
        status: 'confirmed',
        notes: 'Order confirmed via smoke test',
      },
      authToken
    )

    if (res.status === 200) {
      addResult('PATCH /api/orders/[id]', 'PASS', 'Order updated successfully', res.time)
      return true
    } else {
      addResult('PATCH /api/orders/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('PATCH /api/orders/[id]', 'FAIL', error.message)
    return false
  }
}

// ==================== USERS API TESTS ====================

async function testUsersGet() {
  try {
    const res = await makeRequest('GET', '/api/users', {}, authToken)

    if (res.status === 200 && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        testUserId = res.data[0].id
      }
      addResult('GET /api/users', 'PASS', `Retrieved ${res.data.length} users`, res.time)
      return true
    } else {
      addResult('GET /api/users', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/users', 'FAIL', error.message)
    return false
  }
}

async function testUsersPost() {
  try {
    const res = await makeRequest(
      'POST',
      '/api/users',
      {
        email: `newuser_${Date.now()}@example.com`,
        password: 'SecurePassword123!',
        name: 'New Test User',
        role: 'customer',
      },
      authToken
    )

    if (res.status === 201 || res.status === 200) {
      if (res.data.id) {
        // Don't overwrite testUserId if we already have one
        if (!testUserId) {
          testUserId = res.data.id
        }
      }
      addResult('POST /api/users', 'PASS', 'User created successfully', res.time)
      return true
    } else {
      addResult('POST /api/users', 'FAIL', `Status: ${res.status}, ${JSON.stringify(res.data)}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/users', 'FAIL', error.message)
    return false
  }
}

async function testUsersGetById() {
  if (!testUserId) {
    addResult('GET /api/users/[id]', 'SKIP', 'No user ID available')
    return false
  }

  try {
    const res = await makeRequest('GET', `/api/users/${testUserId}`, {}, authToken)

    if (res.status === 200 && res.data.id) {
      addResult('GET /api/users/[id]', 'PASS', `Retrieved user: ${res.data.email}`, res.time)
      return true
    } else {
      addResult('GET /api/users/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/users/[id]', 'FAIL', error.message)
    return false
  }
}

async function testUsersPut() {
  if (!testUserId) {
    addResult('PATCH /api/users/[id]', 'SKIP', 'No user ID available')
    return false
  }

  try {
    const res = await makeRequest(
      'PATCH',
      `/api/users/${testUserId}`,
      {
        full_name: 'Updated Test User',
      },
      authToken
    )

    if (res.status === 200) {
      addResult('PATCH /api/users/[id]', 'PASS', 'User updated successfully', res.time)
      return true
    } else {
      addResult('PATCH /api/users/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('PATCH /api/users/[id]', 'FAIL', error.message)
    return false
  }
}

async function testUsersDelete() {
  if (!testUserId) {
    addResult('DELETE /api/users/[id]', 'SKIP', 'No user ID available')
    return false
  }

  try {
    const res = await makeRequest('DELETE', `/api/users/${testUserId}`, {}, authToken)

    if (res.status === 200) {
      addResult('DELETE /api/users/[id]', 'PASS', 'User deleted successfully', res.time)
      return true
    } else {
      addResult('DELETE /api/users/[id]', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('DELETE /api/users/[id]', 'FAIL', error.message)
    return false
  }
}

// ==================== ADMIN ANALYTICS API TESTS ====================

async function testAdminAnalytics() {
  try {
    const res = await makeRequest('GET', '/api/admin/analytics', {}, authToken)

    if (res.status === 200 && res.data.totalRevenue !== undefined) {
      addResult(
        'GET /api/admin/analytics',
        'PASS',
        `Analytics retrieved - Revenue: Rs ${res.data.totalRevenue}`,
        res.time
      )
      return true
    } else {
      addResult('GET /api/admin/analytics', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('GET /api/admin/analytics', 'FAIL', error.message)
    return false
  }
}

// ==================== BULK UPLOAD API TEST ====================

async function testBulkUpload() {
  try {
    const res = await makeRequest(
      'POST',
      '/api/bulk-upload',
      {
        products: [
          {
            name: 'Bulk Test Product 1',
            description: 'Bulk upload test',
            price: 50,
            category: 'Test',
            stock_quantity: 10,
          },
        ],
      },
      authToken
    )

    if (res.status === 200 || res.status === 201) {
      addResult('POST /api/bulk-upload', 'PASS', 'Bulk upload successful', res.time)
      return true
    } else {
      addResult('POST /api/bulk-upload', 'FAIL', `Status: ${res.status}`, res.time)
      return false
    }
  } catch (error: any) {
    addResult('POST /api/bulk-upload', 'FAIL', error.message)
    return false
  }
}

// ==================== MAIN TEST RUNNER ====================

async function runAllTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}         API SMOKE TESTS - Namecheap E-Commerce${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`)
  console.log(`${colors.cyan}Base URL:${colors.reset} ${BASE_URL}`)
  console.log(`${colors.cyan}Date:${colors.reset} ${new Date().toISOString()}\n`)

  // Authentication Tests
  console.log(`\n${colors.yellow}━━━ Authentication APIs ━━━${colors.reset}`)
  await testAuthRegister()
  await testAuthLogin()
  await testAuthLogout()
  
  // Re-login for subsequent tests
  await testAuthLogin()

  // Products Tests
  console.log(`\n${colors.yellow}━━━ Products APIs ━━━${colors.reset}`)
  await testProductsGet()
  await testProductsPost()
  await testProductsGetById()
  await testProductsPut()

  // Promotions Tests
  console.log(`\n${colors.yellow}━━━ Promotions APIs ━━━${colors.reset}`)
  await testPromotionsGet()
  await testPromotionsPost()
  await testPromotionsGetById()
  await testPromotionsPut()
  await testPromotionsValidate()

  // Orders Tests
  console.log(`\n${colors.yellow}━━━ Orders APIs ━━━${colors.reset}`)
  await testOrdersGet()
  await testOrdersPost()
  await testOrdersGetById()
  await testOrdersPut()

  // Users Tests
  console.log(`\n${colors.yellow}━━━ Users APIs ━━━${colors.reset}`)
  await testUsersGet()
  // await testUsersPost() // No POST endpoint for /api/users
  await testUsersGetById()
  await testUsersPut()
  await testUsersDelete()

  // Admin Tests
  console.log(`\n${colors.yellow}━━━ Admin APIs ━━━${colors.reset}`)
  await testAdminAnalytics()

  // Bulk Upload Test
  console.log(`\n${colors.yellow}━━━ Utility APIs ━━━${colors.reset}`)
  await testBulkUpload()

  // Print Summary
  printSummary()
}

function printSummary() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}                      TEST SUMMARY${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`)

  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  const skipped = results.filter((r) => r.status === 'SKIP').length
  const total = results.length

  const passRate = ((passed / total) * 100).toFixed(1)
  const avgTime =
    results.filter((r) => r.responseTime).reduce((sum, r) => sum + (r.responseTime || 0), 0) /
    results.filter((r) => r.responseTime).length

  console.log(`${colors.cyan}Total Tests:${colors.reset}    ${total}`)
  console.log(`${colors.green}Passed:${colors.reset}         ${passed}`)
  console.log(`${colors.red}Failed:${colors.reset}         ${failed}`)
  console.log(`${colors.yellow}Skipped:${colors.reset}        ${skipped}`)
  console.log(`${colors.cyan}Pass Rate:${colors.reset}      ${passRate}%`)
  console.log(`${colors.cyan}Avg Response:${colors.reset}   ${avgTime.toFixed(0)}ms\n`)

  if (failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`)
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => {
        console.log(`  ${colors.red}✗${colors.reset} ${r.name}`)
        if (r.message) {
          console.log(`    ${colors.cyan}→${colors.reset} ${r.message}`)
        }
      })
    console.log()
  }

  const exitCode = failed > 0 ? 1 : 0
  console.log(
    `${exitCode === 0 ? colors.green : colors.red}${
      exitCode === 0 ? '✓ All tests passed!' : '✗ Some tests failed'
    }${colors.reset}\n`
  )

  process.exit(exitCode)
}

// Run tests
runAllTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error)
  process.exit(1)
})
