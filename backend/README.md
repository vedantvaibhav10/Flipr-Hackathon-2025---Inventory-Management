# Inventory Management System - API Documentation

Welcome to the backend API for the Inventory Management System. This document provides a comprehensive guide to setting up the project, understanding its architecture, and using every available endpoint.

This powerful and secure RESTful API is built with Node.js, Express, and MongoDB. It includes role-based access control, automated email alerts, advanced data reporting, and intelligent features powered by AI.

## Table of Contents
1.  [Project Setup](#project-setup)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the Server](#running-the-server)
2.  [API Endpoints](#api-endpoints)
    -   [Health Check](#health-check)
    -   [Authentication](#authentication)
    -   [Products](#products)
    -   [Inventory](#inventory)
    -   [Reports](#reports)
    -   [AI Features](#ai-features)
3.  [Admin User Creation](#admin-user-creation)

---

## 1. Project Setup

Follow these steps to get the backend server running on your local machine.

### Prerequisites
-   Node.js (v14 or higher)
-   npm
-   MongoDB (local instance or a cloud service like MongoDB Atlas)
-   An email account for sending alerts (e.g., a Gmail account or a service like Mailtrap for testing)
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
Create a file named `.env` in the root directory of the project and add the following variables.

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
-   To run the server in development mode (with automatic restarts):
    ```bash
    npm run dev
    ```
-   To run the server in production mode:
    ```bash
    npm run start
    ```
The server will be running at `http://localhost:5000`.

---

## 2. API Endpoints

All API routes are prefixed with `/api/v1`. Protected routes require a valid JWT `token` to be sent in an `httpOnly` cookie, which is handled automatically after a successful login.

### Health Check
A public endpoint to monitor the status of the application and its dependencies.

#### `GET /health`
-   **Description:** Checks the health of the server, database (MongoDB), and Cloudinary.
-   **Roles:** Public
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "status": {
            "server": { "status": "ok", "message": "Server is running." },
            "database": { "status": "ok", "message": "MongoDB is connected." },
            "cloudinary": { "status": "ok", "message": "Cloudinary is connected." },
            "uptime": 123.456
        }
    }
    ```

### Authentication
Endpoints for user registration, login, and session management.

#### `POST /api/v1/auth/register`
-   **Description:** Registers a new user with the default role of 'Staff'. Sends an OTP to the user's email for verification.
-   **Roles:** Public
-   **Request Body:**
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123"
    }
    ```
-   **Successful Response (201 Created):**
    ```json
    {
        "success": true,
        "message": "User registered successfully. Please check your email for the OTP."
    }
    ```

#### `POST /api/v1/auth/verify-otp`
-   **Description:** Verifies the user's email with the provided OTP.
-   **Roles:** Public
-   **Request Body:**
    ```json
    {
        "email": "john.doe@example.com",
        "otp": "123456"
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Email verified successfully. You can now log in."
    }
    ```

#### `POST /api/v1/auth/login`
-   **Description:** Logs in a verified user and returns a JWT in a secure `httpOnly` cookie.
-   **Roles:** Public
-   **Request Body:**
    ```json
    {
        "email": "john.doe@example.com",
        "password": "password12_3"
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "token": "...",
        "user": { "...user object without password..." },
        "message": "Logged in successfully."
    }
    ```

#### `POST /api/v1/auth/logout`
-   **Description:** Logs out the currently authenticated user by clearing the token cookie.
-   **Roles:** Admin, Staff
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Logged out successfully."
    }
    ```

### Products
Endpoints for managing inventory products.

#### `POST /api/v1/products`
-   **Description:** Creates a new product.
-   **Roles:** Admin
-   **Request Body:** `multipart/form-data`
    -   `name` (String)
    -   `sku` (String)
    -   `category` (String)
    -   `stockLevel` (Number)
    -   `threshold` (Number)
    -   `image` (File)

#### `GET /api/v1/products`
-   **Description:** Retrieves a list of all products.
-   **Roles:** Admin, Staff

#### `PUT /api/v1/products/:id`
-   **Description:** Updates an existing product's details.
-   **Roles:** Admin
-   **Request Body:** `multipart/form-data` with any fields to update.

#### `DELETE /api/v1/products/:id`
-   **Description:** Deletes a product from the database.
-   **Roles:** Admin

### Inventory
Endpoints for tracking stock movements.

#### `POST /api/v1/inventory/update`
-   **Description:** Updates a product's stock level and creates a corresponding log entry. Triggers a low-stock email alert if the threshold is crossed.
-   **Roles:** Admin, Staff
-   **Request Body:**
    ```json
    {
        "productId": "60d5f2f5c7b5f9a1b8e9d0f3",
        "actionType": "SALE",
        "quantity": 5
    }
    ```
    *Valid `actionType` values: `SALE`, `DAMAGE`, `TRANSFER_OUT`, `RESTOCK`, `RETURN`, `TRANSFER_IN`*

#### `GET /api/v1/inventory/logs`
-   **Description:** Retrieves a list of all inventory logs. Can be filtered by query parameters.
-   **Roles:** Admin
-   **Query Parameters (Optional):**
    -   `productId`
    -   `userId`
    -   `actionType`
-   **Example URL:** `/api/v1/inventory/logs?actionType=SALE`

### Reports
Endpoints for data aggregation and export.

#### `GET /api/v1/reports/summary`
-   **Description:** Retrieves aggregated data for a dashboard, including total products, total stock value, low stock count, and stock distribution by category.
-   **Roles:** Admin

#### `GET /api/v1/reports/products/export`
-   **Description:** Downloads a CSV file containing all product data.
-   **Roles:** Admin

### AI Features
Endpoints powered by the OpenAI API to provide intelligent insights.

#### `POST /api/v1/products/generate-description`
-   **Description:** Generates a professional product description based on its name and category.
-   **Roles:** Admin
-   **Request Body:**
    ```json
    {
        "name": "Ergonomic Wireless Mouse",
        "category": "Electronics"
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "description": "Enhance your productivity with the Ergonomic Wireless Mouse. Designed for all-day comfort, this mouse features a natural grip and precise tracking, making it an essential tool for any workspace in the Electronics category."
    }
    ```

#### `POST /api/v1/products/suggest-category`
-   **Description:** Suggests the most appropriate category for a new product from the list of existing categories.
-   **Roles:** Admin
-   **Request Body:**
    ```json
    {
        "name": "100% Arabica Whole Coffee Beans"
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
        "success": true,
        "suggestedCategory": "Beverages"
    }
    ```

#### `GET /api/v1/reports/products/:id/forecast`
-   **Description:** Provides a text-based sales demand forecast for a specific product based on its recent sales history.
-   **Roles:** Admin
-   **Prerequisite:** The product must have at least 5 `SALE` transactions in the inventory logs.

---

## 3. Admin User Creation
By default, all registered users have the 'Staff' role for security. To create an admin, you must manually update the user's role in the database.

1.  Register a new user via the API.
2.  Connect to your MongoDB database using a tool like MongoDB Compass or the `mongosh` terminal.
3.  Run the following command to update the user's role:
    ```javascript
    db.users.updateOne(
       { email: "your-admin-email@example.com" },
       { $set: { role: "Admin" } }
    )
    ```
The user will now have admin privileges upon their next login.
