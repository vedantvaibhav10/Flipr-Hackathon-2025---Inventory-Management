# InvTrack - AI-Powered Inventory Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://inventory-management-topaz-tau.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Active-green)](https://inventory-management-backend-gmik.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

InvTrack is a modern, full-stack inventory management system designed to streamline your stock control processes. Built with a powerful MERN stack and integrated with OpenAI, it provides intelligent insights, automated alerts, and a beautiful, responsive user interface.

Postman Link for APIs testing - [https://chatappteam-4066.postman.co/workspace/Inventory-Management-System~fca858b0-00b0-4251-ae0d-935c5fdfe865/collection/29392182-d91216a6-4b39-4eae-9bb0-210ac3ca2da3?action=share&creator=29392182&active-environment=29392182-e6dcb596-3f9b-4b76-9e9a-506407f3157a](https://chatappteam-4066.postman.co/workspace/Inventory-Management-System~fca858b0-00b0-4251-ae0d-935c5fdfe865/collection/29392182-d91216a6-4b39-4eae-9bb0-210ac3ca2da3?action=share&creator=29392182&active-environment=29392182-e6dcb596-3f9b-4b76-9e9a-506407f3157a)

For testing -

Admin Email: admin@example.com
Admin Password: 123456

Staff Email: staff@example.com
Staff Password: 123456

v1 Demo Video - 

https://github.com/user-attachments/assets/b74e0e9c-7cce-4335-953e-b22aa5ee2ebf

v2 architecture diagram -

<img width="2672" height="3840" alt="inv arch" src="https://github.com/user-attachments/assets/9b46a4ca-03c1-4426-96de-761edd2b0c72" />


v2 Screenshots -

<img width="1919" height="899" alt="Screenshot 2025-07-26 215639" src="https://github.com/user-attachments/assets/cf5faf41-91f1-403a-a8ca-74f616844a84" />

<img width="1919" height="903" alt="Screenshot 2025-07-26 215624" src="https://github.com/user-attachments/assets/bc3872a7-1e33-465e-8536-52eb0066b20f" />

<img width="1919" height="910" alt="Screenshot 2025-07-26 215612" src="https://github.com/user-attachments/assets/7e6eb673-13fe-402a-9cca-5ab98f1fc520" />

<img width="1919" height="901" alt="Screenshot 2025-07-26 215519" src="https://github.com/user-attachments/assets/dbf74b98-72f7-49b5-a708-2730e5e1af23" />

<img width="1919" height="902" alt="Screenshot 2025-07-26 215511" src="https://github.com/user-attachments/assets/c8e8b992-1f27-4c86-932b-1a532ccb439a" />

<img width="1919" height="899" alt="Screenshot 2025-07-26 215459" src="https://github.com/user-attachments/assets/e1976a94-7936-4599-ba8b-60c745cc2412" />

<img width="1919" height="903" alt="Screenshot 2025-07-26 215448" src="https://github.com/user-attachments/assets/12375abb-7754-4faa-9d5f-132d9b70d87c" />


## 🌟 Live Demo

- **Frontend:** [https://inventory-management-topaz-tau.vercel.app/](https://inventory-management-topaz-tau.vercel.app/)
- **Backend API:** [https://inventory-management-backend-gmik.onrender.com/](https://inventory-management-backend-gmik.onrender.com/)

## ✨ Key Features

### 📊 Core Functionality

- **Centralized Dashboard** - Get a real-time overview of your entire inventory, including stock value and low-stock items
- **Complete Product Management** - Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads via Cloudinary
- **Supplier & Purchase Orders** - Manage suppliers and track purchase orders from creation to delivery
- **Automated Stock Control** - Stock levels are automatically updated when purchase orders are marked as delivered
- **Detailed Inventory Logs** - Track every single stock movement, whether from a sale, restock, or manual adjustment
- **Role-Based Access Control** - A secure system with distinct permissions for **Admin** and **Staff** roles
- **Data Reporting & Export** - View detailed reports on inventory movements and export your product data to CSV

### 🧠 AI-Powered Intelligence

- **Smart Reorder Suggestions** - Get AI recommendations on how much stock to reorder for low-stock items
- **Automated Description & Category** - Generate professional product descriptions and get category suggestions with the click of a button
- **Dynamic Pricing Suggestions** - Receive AI-driven advice on how to price your products for optimal profitability
- **Supplier Performance Analysis** - Get an AI-generated summary of a supplier's reliability based on their order history
- **AI-Generated Low-Stock Alerts** - Receive intelligently drafted, urgent email alerts when stock levels fall below the set threshold

### 🏆 Offline & Data Resiliency Features

- **Full Offline-First Functionality** - The application is fully usable even without an internet connection. Data is cached locally using IndexedDB
- **Offline Action Queue** - Create, update, and delete operations performed while offline are automatically saved to a local "outbox"
- **Automatic Syncing** - When the internet connection is restored, the application automatically syncs all pending offline actions with the server
- **Real-Time Status Indicators** - The UI features live indicators for both system health (API, DB, Services) and data sync status (Online, Offline, Syncing)
- **Local Data Backups** - Users can download a complete JSON backup of their locally cached data at any time from the Settings page
- **Automated Backup Reminders** - A non-intrusive toast notification reminds users to perform a backup if their last one was more than 24 hours ago

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Axios, Dexie.js |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Services** | Cloudinary (Image Storage), OpenAI (AI), Nodemailer (Email) |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invtrack.git
cd invtrack
```

#### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (Nodemailer)
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

```bash
# Start the backend server
npm run dev
```

#### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../inventory-frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
```

Add the following to your `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
# Start the frontend development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Usage

### Creating an Admin User

1. Register a new user through the application
2. Access your MongoDB database
3. Find the user document and update the `role` field to `"admin"`

```javascript
// MongoDB update command
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Role Permissions

- **Admin**: Full access to all features including user management, system settings, and advanced AI features
- **Staff**: Access to inventory management, basic reporting, and standard operations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier
- `DELETE /api/suppliers/:id` - Delete a supplier

### Purchase Orders
- `GET /api/orders` - Get all purchase orders
- `POST /api/orders` - Create a new purchase order
- `PUT /api/orders/:id` - Update a purchase order
- `DELETE /api/orders/:id` - Delete a purchase order

## 🤖 AI Features

The application integrates with OpenAI to provide intelligent features:

- **Product Description Generation**: Automatically generate compelling product descriptions
- **Category Suggestions**: Get AI-powered category recommendations
- **Pricing Optimization**: Receive intelligent pricing suggestions
- **Reorder Recommendations**: Smart inventory reorder suggestions based on sales patterns
- **Supplier Analysis**: AI-generated supplier performance reports

## 📱 Offline Functionality

InvTrack is built with offline-first architecture:

- **Local Storage**: All data is cached using IndexedDB via Dexie.js
- **Offline Operations**: Full CRUD operations available offline
- **Smart Sync**: Automatic synchronization when connection is restored
- **Conflict Resolution**: Intelligent handling of data conflicts during sync

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Protected API routes
- CORS configuration

## 📊 Data Export

Export your inventory data in multiple formats:
- CSV export for products, suppliers, and orders
- JSON backup for complete data portability
- Real-time reporting with charts and analytics
