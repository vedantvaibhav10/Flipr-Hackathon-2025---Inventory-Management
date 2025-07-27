# InvTrack - AI-Powered Inventory Management Backend

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A powerful and secure RESTful API built with Node.js, Express, and MongoDB. Features role-based access control, automated email alerts, advanced data reporting, and intelligent features powered by OpenAI.

## 🚀 Live Demo

**Deployed API:** [https://inventory-management-backend-j0w6.onrender.com](https://inventory-management-backend-j0w6.onrender.com)

**Postman Collection:** [View API Documentation](https://chatappteam-4066.postman.co/workspace/Inventory-Management-System~fca858b0-00b0-4251-ae0d-935c5fdfe865/collection/29392182-d91216a6-4b39-4eae-9bb0-210ac3ca2da3?action=share&creator=29392182&active-environment=29392182-e6dcb596-3f9b-4b76-9e9a-506407f3157a)

**Test Credentials:**
- Admin: admin@example.com | Password: 123456
- Staff: staff@example.com | Password: 123456

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with httpOnly cookies, plus Google & GitHub OAuth 2.0 via Passport.js
- 👤 **Role-Based Access Control (RBAC)** - Distinct permissions for 'Admin' and 'Staff' roles
- 🤖 **AI Integration** - A full suite of endpoints that leverage the OpenAI API for intelligent data analysis, suggestions, and natural language processing
- 📧 **Automated Email Alerts** - Uses Nodemailer for OTP verification and AI-powered low-stock notifications
- 📊 **Advanced Aggregation** - A powerful reporting endpoint that uses the MongoDB Aggregation Pipeline for efficient, complex data analysis
- 🔍 **Global Search** - Search across products and suppliers
- 📱 **RESTful API** - Clean, documented endpoints
- ☁️ **Cloud Storage** - Cloudinary integration for image management
- 🌐 **CORS Enabled** - Securely configured to work with the deployed frontend application
- 🔒 **Secure** - Input validation, sanitization, and security headers

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │◄──►│   Express API    │◄──►│    MongoDB      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  External APIs   │
                       │  • OpenAI        │
                       │  • Cloudinary    │
                       │  • Nodemailer    │
                       └──────────────────┘
```

## 🔐 Authorization Roles

The API has two user roles with specific permissions:

| Feature / Action | 👤 Staff | 👑 Admin |
|------------------|----------|----------|
| Dashboard & Reports | ✅ | ✅ |
| View Products & Suppliers | ✅ | ✅ |
| Create/Edit/Delete Products | ❌ | ✅ |
| Create/Edit/Delete Suppliers | ❌ | ✅ |
| Create & Update Orders | ✅ | ✅ |
| Delete Orders | ❌ | ✅ |
| Manual Stock Adjustments | ✅ | ✅ |
| View Inventory Logs | ❌ | ✅ |
| Access All AI Features | ❌ | ✅ |
| OAuth Authentication | ✅ | ✅ |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentication** | JWT, Passport.js (Google & GitHub OAuth), bcrypt |
| **Services** | Cloudinary (Image Storage), OpenAI (AI), Nodemailer (Email) |

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Email service (Mailtrap recommended for development)
- Cloudinary account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd inventory-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URL=your_mongodb_connection_string

   # JWT Authentication
   JWT_SECRET=your_super_secret_string_for_jwt
   JWT_EXPIRES_IN=1d
   JWT_COOKIE_EXPIRES=1

   # Email Configuration
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USER=your_mailtrap_user
   MAIL_PASS=your_mailtrap_password
   MAIL_FROM=noreply@invtrack.com
   ADMIN_EMAIL=your_admin_email@example.com

   # Cloudinary (Image Storage)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # OpenAI (AI Features)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
All endpoints are prefixed with `/api/v1`

### Authentication
The API uses JWT tokens stored in HTTP-only cookies. Include credentials in your requests.

---

## 🔗 API Endpoints

### Health Check
```http
GET /health
```
Check server, database, and Cloudinary connectivity status.

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Verify Email
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Logout
```http
POST /auth/logout
```

#### Google OAuth Login
```http
GET /auth/google
```
Initiates Google OAuth2 login flow.

#### GitHub OAuth Login
```http
GET /auth/github
```
Initiates GitHub OAuth login flow.

#### Google OAuth Callback
```http
GET /auth/google/callback
```
Callback URL for Google OAuth2.

#### GitHub OAuth Callback
```http
GET /auth/github/callback
```
Callback URL for GitHub OAuth.

#### Get Current User
```http
GET /auth/me
```

### Global Search
```http
GET /search?q=search_term
```

### Products

#### Create Product
```http
POST /products
Content-Type: multipart/form-data

name: Product Name
sku: SKU123
category: Electronics
description: Product description (optional)
buyingPrice: 100
sellingPrice: 150
stockLevel: 50
threshold: 10
expiryDate: 2024-12-31 (optional)
image: [file] (optional)
```

#### Create Product from Offline Queue
```http
POST /products/sync
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU123",
  "category": "Electronics",
  "description": "Product description",
  "buyingPrice": 100,
  "sellingPrice": 150,
  "stockLevel": 50,
  "threshold": 10,
  "expiryDate": "2024-12-31"
}
```
*(Admin only)*

#### Get All Products
```http
GET /products
```

#### Update Product
```http
PUT /products/:id
Content-Type: multipart/form-data
```

#### Update Product from Offline Queue
```http
PUT /products/:id/sync
Content-Type: application/json
```
*(Admin only)*

#### Delete Product
```http
DELETE /products/:id
```

#### Find Product by Barcode
```http
GET /products/barcode/:barcode
```

### Suppliers

#### Create Supplier
```http
POST /suppliers
Content-Type: application/json

{
  "name": "Supplier Name",
  "contactNumber": "+1234567890",
  "email": "supplier@example.com"
}
```

#### Get All Suppliers
```http
GET /suppliers
```

#### Update Supplier
```http
PUT /suppliers/:id
```

#### Delete Supplier
```http
DELETE /suppliers/:id
```

### Orders

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "product": "product_id",
  "supplier": "supplier_id",
  "quantity": 100,
  "expectedDelivery": "2024-01-15"
}
```

#### Get All Orders
```http
GET /orders
```

#### Update Order Status
```http
PUT /orders/:id
Content-Type: application/json

{
  "status": "Delivered"
}
```
*Status options: "Shipped", "Delivered", "Cancelled", "Returned"*
*Automatically updates stock if status changes to 'Delivered'*

#### Delete Order
```http
DELETE /orders/:id
```

### Inventory

#### Update Stock
```http
POST /inventory/update
Content-Type: application/json

{
  "productId": "product_id",
  "actionType": "SALE",
  "quantity": 5,
  "notes": "Optional notes"
}
```
*Action types: "SALE", "DAMAGE", "RESTOCK", "RETURN"*

#### Get Inventory Logs
```http
GET /inventory/logs
```

### Reports

#### Dashboard Summary
```http
GET /reports/summary
```
*Supports `startDate` and `endDate` query parameters for filtering. Uses MongoDB Aggregation Pipeline for efficient data analysis.*

#### Export Products
```http
GET /reports/products/export
```
*Returns CSV file download*

### AI Features

#### Natural Language Search
```http
POST /ai/search
Content-Type: application/json

{
  "query": "show me low stock beverages"
}
```
*(Admin only)*

#### AI Chatbot
```http
POST /ai/chatbot
Content-Type: application/json

{
  "message": "What are my recent orders?",
  "conversationHistory": []
}
```
*(Admin only)*

#### Generate Product Description
```http
POST /products/generate-description
Content-Type: application/json

{
  "name": "Product Name",
  "category": "Electronics"
}
```

#### Suggest Category
```http
POST /products/suggest-category
Content-Type: application/json

{
  "name": "Product Name"
}
```

#### Reorder Suggestion
```http
GET /ai/reorder-suggestion/:productId
```

#### Supplier Analysis
```http
GET /ai/supplier-analysis/:supplierId
```

#### Pricing Suggestion
```http
GET /ai/pricing-suggestion/:productId
```

## 👨‍💼 Admin User Setup

By default, all registered users have the 'Staff' role. To create an admin:

1. Register a user through the API
2. Connect to your MongoDB database
3. Update the user's role:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" }, 
     { $set: { role: "Admin" } }
   )
   ```

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints. 

### Example cURL Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

curl -X GET http://localhost:5000/api/v1/products \
  -b cookies.txt
```

## 🔧 Configuration

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 1d) |
| `MAIL_HOST` | SMTP host | Yes |
| `MAIL_PORT` | SMTP port | Yes |
| `MAIL_USER` | SMTP username | Yes |
| `MAIL_PASS` | SMTP password | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |

## 🔒 Security Features

- JWT-based authentication with httpOnly cookies
- Google and GitHub OAuth 2.0 integration
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Protected API routes with middleware
- CORS configuration for secure cross-origin requests
- Rate limiting and security headers

## 🤖 AI Integration

The backend integrates with OpenAI to provide intelligent features:

- **Natural Language Search**: Query inventory using natural language
- **Interactive Chatbot**: AI assistant for inventory-related questions
- **Product Description Generation**: Automatically generate compelling product descriptions
- **Category Suggestions**: AI-powered category recommendations
- **Pricing Optimization**: Intelligent pricing suggestions
- **Reorder Recommendations**: Smart inventory reorder suggestions based on patterns
- **Supplier Analysis**: AI-generated supplier performance reports