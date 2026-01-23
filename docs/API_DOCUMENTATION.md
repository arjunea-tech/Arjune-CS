# CrackerShop API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobileNumber": "9876543210",
  "address": "123 Main St",
  "pincode": "123456",
  "district": "Dist",
  "state": "State"
}
```

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "data": { "user_object" }
}
```

### Forgot Password
```
POST /auth/forgotpassword
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```
POST /auth/resetpassword
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "newpassword123",
  "resetToken": "token_from_email"
}
```

### Get Current User (Protected)
```
GET /auth/me
```

### Update Profile (Protected)
```
PUT /auth/updatedetails
```
**Body:**
```json
{
  "name": "Jane Doe",
  "mobileNumber": "9876543210"
}
```

---

## Address Management (Protected)

### Add Address
```
POST /auth/addresses
```
**Body:**
```json
{
  "label": "Home",
  "address": "123 Main St",
  "pincode": "123456",
  "district": "District",
  "state": "State",
  "isDefault": false
}
```

### Set Default Address
```
PUT /auth/addresses/:id/default
```

### Delete Address
```
DELETE /auth/addresses/:id
```

---

## Products Endpoints

### Get All Products
```
GET /products?page=1&limit=10&category=categoryId&search=query&featured=true&sortBy=-createdAt
```

### Get Single Product
```
GET /products/:id
```

### Search Products
```
GET /products/search/query?q=cracker&limit=10
```

### Create Product (Admin Only)
```
POST /products
```
**Headers:** `Content-Type: multipart/form-data`
**Body:**
```
name: "Product Name"
category: "categoryId"
price: 100
discountPrice: 80
quantity: 50
description: "Product description"
sku: "SKU123"
isFeatured: true
images: [file1, file2, file3]
```

### Update Product (Admin Only)
```
PUT /products/:id
```

### Delete Product (Admin Only)
```
DELETE /products/:id
```

---

## Orders Endpoints (Protected)

### Place Order
```
POST /orders
```
**Body:**
```json
{
  "orderItems": [
    {
      "product": "productId",
      "name": "Product Name",
      "qty": 2,
      "price": 100,
      "image": "image_url"
    }
  ],
  "shippingAddress": "123 Main St, City",
  "paymentMethod": "Cash on Delivery",
  "itemsPrice": 200,
  "taxPrice": 0,
  "shippingPrice": 50,
  "totalPrice": 250
}
```

### Get My Orders (Protected)
```
GET /orders/myorders
```

### Get Order by ID (Protected)
```
GET /orders/:id
```

### Get All Orders (Admin Only)
```
GET /orders?page=1&limit=10&status=Requested&sortBy=-createdAt
```

### Update Order Status (Admin Only)
```
PUT /orders/:id/status
```
**Body:**
```json
{
  "status": "Processing"
}
```
**Valid Statuses:** `Requested`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`

### Update Payment Status (Admin Only)
```
PUT /orders/:id/payment
```
**Body:**
```json
{
  "isPaid": true,
  "paymentMethod": "Bank Transfer"
}
```

---

## Categories Endpoints

### Get All Categories
```
GET /categories
```

### Get Single Category
```
GET /categories/:id
```

### Create Category (Admin Only)
```
POST /categories
```
**Body:**
```json
{
  "name": "Category Name",
  "description": "Category description",
  "image": "image_url"
}
```

### Update Category (Admin Only)
```
PUT /categories/:id
```

### Delete Category (Admin Only)
```
DELETE /categories/:id
```

---

## Users Management (Admin Only)

### Get All Users
```
GET /users?page=1&limit=10&role=customer&status=Active&sortBy=-createdAt
```

### Get Single User
```
GET /users/:id
```

### Update User (Admin Only)
```
PUT /users/:id
```
**Body:**
```json
{
  "role": "customer",
  "status": "Active"
}
```

### Delete User (Admin Only)
```
DELETE /users/:id
```

---

## Dashboard Endpoints (Admin Only)

### Get Dashboard Stats
```
GET /dashboard/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "orders": {
      "total": 150,
      "recent": 25,
      "pending": 10,
      "processing": 5,
      "delivered": 100
    },
    "products": {
      "total": 200,
      "outOfStock": 5,
      "featured": 20
    },
    "users": {
      "total": 500
    },
    "revenue": {
      "total": 50000,
      "thisMonth": 15000,
      "average": 333
    }
  }
}
```

### Get Sales Chart (30 days)
```
GET /dashboard/sales-chart
```

### Get Top Selling Products
```
GET /dashboard/top-products
```

---

## Chit Scheme Endpoints

### Get All Schemes
```
GET /chit/schemes
```

### Get Single Scheme
```
GET /chit/schemes/:id
```

### Create Scheme (Admin Only)
```
POST /chit/schemes
```
**Body:**
```json
{
  "name": "Monthly Chit",
  "amount": 10000,
  "duration": 12,
  "description": "Description"
}
```

### Register for Chit (Protected)
```
POST /chit/register
```
**Body:**
```json
{
  "schemeId": "schemeId",
  "startDate": "2024-01-01"
}
```

---

## Notifications Endpoints (Protected)

### Get My Notifications
```
GET /notifications
```

### Mark as Read
```
PUT /notifications/:id/read
```

### Delete Notification
```
DELETE /notifications/:id
```

---

## Banners Endpoints

### Get All Banners
```
GET /banners
```

### Create Banner (Admin Only)
```
POST /banners
```

### Update Banner (Admin Only)
```
PUT /banners/:id
```

### Delete Banner (Admin Only)
```
DELETE /banners/:id
```

---

## Health Check

### Server Health
```
GET /health
```

### API Info
```
GET /api
```

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Error description"
    }
  ]
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

---

## Payment Methods (COD Available)
- Cash on Delivery (COD)
- Bank Transfer
- UPI
- Other manual payment methods

*Online payment integration is not implemented. All payments are manual/COD.*

---

Generated: January 2026
