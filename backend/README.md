# Inventory Management System - API Documentation

Welcome to the backend API for the Inventory Management System. This document provides a comprehensive guide to setting up the project, understanding its architecture, and using every available endpoint.

This powerful and secure RESTful API is built with Node.js, Express, and MongoDB. It includes role-based access control, automated email alerts, advanced data reporting, and intelligent features powered by AI.

**Deployed Link:** [https://inventory-management-backend-gmik.onrender.com](https://inventory-management-backend-gmik.onrender.com)

## Table of Contents
1.  [Project Setup](#project-setup)
2.  [API Endpoints](#api-endpoints)
    -   [Health Check](#health-check)
    -   [Authentication](#authentication)
    -   [Products](#products)
    -   [Suppliers](#suppliers)
    -   [Orders](#orders)
    -   [Inventory](#inventory)
    -   [Reports](#reports)
    -   [AI Features](#ai-features)
3.  [Admin User Creation](#admin-user-creation)

---

## 1. Project Setup

Follow these steps to get the backend server running on your local machine.

### Prerequisites
-   Node.js (v14 or higher)
-   npm & MongoDB
-   An email account for sending alerts (e.g., Mailtrap)
-   A Cloudinary account for image storage
-   An OpenAI account for AI features

### Installation
1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd inventory-management-backend
    ```
2.  Install the required npm packages:
    ```bash
    npm install
    ```

### Environment Variables
Create a file named `.env` in the root directory and add the following variables.

```dotenv
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_super_secret_string_for_jwt
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES=1 # In days

# Nodemailer (for sending emails)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password
MAIL_FROM=noreply@invtrack.com
ADMIN_EMAIL=your_admin_email_for_alerts@example.com

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

### Running the Server
-   Development mode: `npm run dev`
-   Production mode: `npm run start`

---

## 2. API Endpoints

All routes are prefixed with `/api/v1`.

### Health Check

#### `GET /health`
-   **Description:** Checks the health of the server, database, and Cloudinary.
-   **Roles:** Public

### Authentication

#### `POST /api/v1/auth/register`
-   **Description:** Registers a new user as 'Staff'.
-   **Body:** `{ "name": "...", "email": "...", "password": "..." }`

#### `POST /api/v1/auth/verify-otp`
-   **Description:** Verifies the user's email with the OTP.
-   **Body:** `{ "email": "...", "otp": "..." }`

#### `POST /api/v1/auth/login`
-   **Description:** Logs in a verified user.
-   **Body:** `{ "email": "...", "password": "..." }`

#### `POST /api/v1/auth/logout`
-   **Description:** Logs out the current user.
-   **Roles:** Admin, Staff

### Products

#### `POST /api/v1/products`
-   **Description:** Creates a new product.
-   **Roles:** Admin
-   **Body:** `multipart/form-data` with fields: `name`, `sku`, `category`, `buyingPrice`, `sellingPrice`, `stockLevel`, `threshold`, `expiryDate` (optional), `image` (optional file).

#### `GET /api/v1/products`
-   **Description:** Retrieves all products.
-   **Roles:** Admin, Staff

#### `PUT /api/v1/products/:id`
-   **Description:** Updates a product.
-   **Roles:** Admin

#### `DELETE /api/v1/products/:id`
-   **Description:** Deletes a product.
-   **Roles:** Admin

### Suppliers

#### `POST /api/v1/suppliers`
-   **Description:** Creates a new supplier.
-   **Roles:** Admin
-   **Body:** `{ "name": "...", "contactNumber": "...", "email": "..." }`

#### `GET /api/v1/suppliers`
-   **Description:** Retrieves all suppliers.
-   **Roles:** Admin, Staff

### Orders

#### `POST /api/v1/orders`
-   **Description:** Creates a new purchase order.
-   **Roles:** Admin, Staff
-   **Body:** `{ "product": "...", "supplier": "...", "quantity": ..., "orderValue": ..., "status": "...", "expectedDelivery": "..." }`

#### `PUT /api/v1/orders/:id`
-   **Description:** Updates an order. If status becomes 'Delivered', product stock is automatically increased.
-   **Roles:** Admin, Staff
-   **Body:** `{ "status": "Delivered" }`

### Inventory

#### `POST /api/v1/inventory/update`
-   **Description:** Manually updates stock for sales, damages, etc. Triggers a **smart, AI-powered low-stock alert** if the threshold is crossed.
-   **Roles:** Admin, Staff
-   **Body:** `{ "productId": "...", "actionType": "SALE", "quantity": ... }`

#### `GET /api/v1/inventory/logs`
-   **Description:** Retrieves all inventory logs.
-   **Roles:** Admin

### Reports

#### `GET /api/v1/reports/summary`
-   **Description:** Retrieves aggregated data for the main dashboard.
-   **Roles:** Admin

#### `GET /api/v1/reports/products/export`
-   **Description:** Downloads a CSV file of all products.
-   **Roles:** Admin

### AI Features
Advanced endpoints powered by the OpenAI API.

#### `POST /api/v1/products/generate-description`
-   **Description:** Generates a professional product description.
-   **Roles:** Admin
-   **Body:** `{ "name": "...", "category": "..." }`

#### `POST /api/v1/products/suggest-category`
-   **Description:** Suggests a category for a new product.
-   **Roles:** Admin
-   **Body:** `{ "name": "..." }`

#### `GET /api/v1/ai/reorder-suggestion/:productId`
-   **Description:** Generates a smart reorder suggestion for a low-stock product.
-   **Roles:** Admin

#### `GET /api/v1/ai/supplier-analysis/:supplierId`
-   **Description:** Generates a performance analysis of a supplier.
-   **Roles:** Admin

#### `GET /api/v1/ai/pricing-suggestion/:productId`
-   **Description:** Generates a suggestion for optimizing a product's selling price.
-   **Roles:** Admin

---

## 3. Admin User Creation
By default, all registered users have the 'Staff' role. To create an admin, manually update their role in the database.
1.  Register a new user via the API.
2.  Connect to your MongoDB database.
3.  Run: `db.users.updateOne({ email: "your-admin-email@example.com" }, { $set: { role: "Admin" } })`
