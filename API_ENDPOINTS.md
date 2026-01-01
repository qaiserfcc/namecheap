# API Endpoints Documentation

## Overview
All new API endpoints have been created to support the buyer features. This document provides details on how to use each endpoint.

## Authentication
All endpoints require a valid session cookie. The session is created during login and verified on each request.

## Buyer Feature Endpoints

### 1. Profile Management

#### GET `/api/auth/profile`
Get the current user's profile information.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+923001234567",
    "role": "buyer",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/auth/profile`
Update the current user's profile information.

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "+923001234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### 2. Password Management

#### POST `/api/auth/change-password`
Change the current user's password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Validation:**
- All fields are required
- New password must be at least 8 characters
- New password and confirm password must match
- Current password must be correct

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 3. Account Deletion

#### DELETE `/api/auth/delete-account`
Permanently delete the current user's account and all associated data.

**Warning:** This action is irreversible and will delete:
- User account
- All addresses
- All wishlist items
- All product reviews
- All order history

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 4. Address Management

#### GET `/api/addresses`
Get all saved addresses for the current user.

**Response:**
```json
{
  "success": true,
  "addresses": [
    {
      "id": 1,
      "user_id": 1,
      "street_address": "123 Main Street",
      "city": "Lahore",
      "state": "Punjab",
      "postal_code": "54000",
      "country": "Pakistan",
      "phone": "+923001234567",
      "is_default": true,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/addresses`
Create a new address.

**Request Body:**
```json
{
  "street": "123 Main Street",
  "city": "Lahore",
  "state": "Punjab",
  "postalCode": "54000",
  "country": "Pakistan",
  "phone": "+923001234567",
  "isDefault": false
}
```

**Validation:**
- street, city, state, postalCode, and country are required
- phone is optional
- If isDefault is true, all other addresses will be set to non-default

**Response:**
```json
{
  "success": true,
  "message": "Address created successfully",
  "address": { ... }
}
```

#### PUT `/api/addresses/[id]`
Update an existing address.

**Request Body:**
```json
{
  "street": "456 New Street",
  "city": "Karachi",
  "state": "Sindh",
  "postalCode": "75000",
  "country": "Pakistan",
  "phone": "+923007654321",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "address": { ... }
}
```

#### DELETE `/api/addresses/[id]`
Delete an address.

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

#### PUT `/api/addresses/[id]/default`
Set an address as the default shipping address.

**Response:**
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "address": { ... }
}
```

## Existing Endpoints (Already Working)

### Orders
- `GET /api/orders` - Get all orders (admin sees all, buyer sees only their own)
- `POST /api/orders` - Create a new order

### Wishlist
- `GET /api/wishlist` - Get user's wishlist with product details
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[id]` - Remove item from wishlist

## Database Migration Required

Before testing the address endpoints, run the migration script:

```bash
# Connect to your Neon database and run:
psql $DATABASE_URL -f scripts/09_addresses_schema.sql
```

Or using the Neon SQL Editor, execute the contents of `scripts/09_addresses_schema.sql`.

## Error Responses

All endpoints follow a consistent error response format:

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to access this resource"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Specific validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error details"
}
```

## Testing Checklist

- [ ] Run database migration for addresses table
- [ ] Test user profile GET endpoint
- [ ] Test user profile UPDATE endpoint
- [ ] Test password change with correct/incorrect passwords
- [ ] Test address creation
- [ ] Test address listing
- [ ] Test address update
- [ ] Test address deletion
- [ ] Test setting default address
- [ ] Test account deletion (use test account!)
- [ ] Verify orders endpoint returns user-specific data
- [ ] Verify wishlist endpoint works correctly

## Security Notes

1. All endpoints verify user session before processing
2. Users can only access/modify their own data
3. Passwords are hashed using bcrypt
4. Address operations are scoped to the authenticated user
5. Account deletion cascades to related data
6. Default address management ensures only one default per user
