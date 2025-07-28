# InvTrack - AI-Powered Inventory Management System (With complete offline support)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://inventory-management-topaz-tau.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Active-green)](https://inventory-management-backend-gmik.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

InvTrack is a modern, full-stack inventory management system designed to streamline your stock control processes. Built with a powerful MERN stack and integrated with OpenAI, it provides intelligent insights, automated alerts, a beautiful responsive UI, and a complete offline-first experience.

Postman Link for APIs testing - [View API Documentation](https://chatappteam-4066.postman.co/workspace/Inventory-Management-System~fca858b0-00b0-4251-ae0d-935c5fdfe865/collection/29392182-d91216a6-4b39-4eae-9bb0-210ac3ca2da3?action=share&creator=29392182&active-environment=29392182-e6dcb596-3f9b-4b76-9e9a-506407f3157a)

For testing -

Admin Email: admin@example.com
Admin Password: 123456

Staff Email: staff@example.com
Staff Password: 123456

Note - An email can only be registered as Admin from the DB due to security purposes.

Inventory Management v2 Demo Video - 

https://github.com/user-attachments/assets/45a1df2f-c7b8-4de5-a65d-75f5c6d9aead

In Depth Project Architecture Explanation - 

https://github.com/user-attachments/assets/e4434203-ffd3-4c77-90df-0d53bbaad7a2

Inventory Management v2 architecture diagram -

![v2 detailed architecture (1)](https://github.com/user-attachments/assets/9ba1dd84-14ae-4f9c-aac2-4ce09964622d)

View detailed architecture diagram here: https://drive.google.com/file/d/1zjsHgTla-Eg7HwzSN69jDYSv8apMWJrI/view?usp=sharing

Inventory Management v2 Screenshots -

<img width="1918" height="903" alt="Screenshot 2025-07-27 185433" src="https://github.com/user-attachments/assets/9dce59f0-e159-4352-9a64-f901ca0ae966" />
<img width="1916" height="912" alt="Screenshot 2025-07-27 185733" src="https://github.com/user-attachments/assets/509fed5b-f0ac-45dc-a29d-cb5ddf219f1e" />
<img width="1917" height="898" alt="Screenshot 2025-07-27 185803" src="https://github.com/user-attachments/assets/b679906a-37c6-466e-be5d-705b4b2e0c12" />
<img width="1916" height="887" alt="Screenshot 2025-07-27 190039" src="https://github.com/user-attachments/assets/a8cfd35e-a5ea-4437-a749-ae8588899008" />
<img width="1916" height="898" alt="Screenshot 2025-07-27 190116" src="https://github.com/user-attachments/assets/6a62ea07-c648-40f9-acfb-7cb7bfe163dc" />
<img width="1917" height="902" alt="Screenshot 2025-07-27 190132" src="https://github.com/user-attachments/assets/6d40ad2e-f9ad-43bc-b27e-66e85082ffe5" />
<img width="1918" height="907" alt="Screenshot 2025-07-27 190151" src="https://github.com/user-attachments/assets/afb7dac1-5663-4cc5-bb03-96cc742b6520" />
<img width="1918" height="906" alt="Screenshot 2025-07-27 185536" src="https://github.com/user-attachments/assets/0e99e74d-6d0b-4b9e-a797-874ae2f9a01c" />
<img width="1912" height="905" alt="Screenshot 2025-07-27 190017" src="https://github.com/user-attachments/assets/f99136b0-9c21-4fe0-8b62-db4e6b3ebfa5" />
<img width="1918" height="900" alt="Screenshot 2025-07-27 185945" src="https://github.com/user-attachments/assets/107ec680-2ce8-44b5-8b0c-8dded4c84dee" />
<img width="1918" height="892" alt="Screenshot 2025-07-27 190212" src="https://github.com/user-attachments/assets/4427807c-18f7-4cfd-901c-5d24b33077bb" />


## 🌟 Live Demo

- **Frontend:** [https://inventory-management-topaz-tau.vercel.app/](https://inventory-management-topaz-tau.vercel.app/)
- **Backend API:** [https://inventory-management-backend-gmik.onrender.com/](https://inventory-management-backend-gmik.onrender.com/)

## ✨ Key Features

### 📊 Core Functionality

- **Centralized Dashboard** - A real-time, filterable overview of your entire inventory, including sales, purchases, stock value, and low-stock items
- **Complete Product Management** - Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads via Cloudinary and barcode scanning
- **Supplier & Purchase Orders** - Manage suppliers and track purchase orders from creation to delivery
- **Automated Stock Control** - Stock levels are automatically updated when purchase orders are marked as delivered
- **Detailed Inventory Logs** - Track every single stock movement, whether from a sale, restock, or manual adjustment
- **Secure Authentication** - Sign up and log in with email/password (with OTP verification) or securely via Google and GitHub OAuth
- **Role-Based Access Control** - A secure system with distinct permissions for **Admin** and **Staff** roles
- **Data Reporting & Export** - View detailed reports on inventory movements and export your product data to CSV

### 🧠 AI-Powered Intelligence

- **Natural Language Search** - Use the smart search bar to ask complex questions like "show me low stock beverages" and get instant results
- **Data-Aware Chatbot** - An interactive AI assistant that can answer questions about your current inventory, recent orders, and more
- **Smart Reorder Suggestions** - Get AI recommendations on how much stock to reorder for low-stock items
- **Automated Description & Category** - Generate professional product descriptions and get category suggestions with the click of a button
- **Dynamic Pricing Suggestions** - Receive AI-driven advice on how to price your products for optimal profitability
- **Supplier Performance Analysis** - Get an AI-generated summary of a supplier's reliability based on their order history
- **AI-Generated Low-Stock Alerts** - Receive intelligently drafted, urgent email alerts when stock levels fall below the set threshold

### 🏆 Offline & Data Resiliency (Bonus Features)

- **Full Offline-First Functionality** - The application is fully usable even without an internet connection. Data is cached locally using IndexedDB, allowing users to view products, suppliers, and orders while offline
- **Offline Action Queue** - Create, update, and delete operations performed while offline are automatically saved to a local "outbox"
- **Automatic Syncing** - When the internet connection is restored, the application automatically syncs all pending offline actions with the server
- **Real-Time Status Indicators** - The UI features live indicators for both system health (API, DB, Services) and data sync status (Online, Offline, Syncing)
- **Local Data Backups** - Users can download a complete JSON backup of their locally cached data at any time from the Settings page
- **Automated Backup Reminders** - A non-intrusive toast notification reminds users to perform a backup if their last one was more than 24 hours ago

## 🔐 Authorization Roles

InvTrack has two user roles with specific permissions:

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
| View Health & Settings | ✅ | ✅ |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Axios, Dexie.js, Framer Motion |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentication** | JWT, Passport.js (Google & GitHub OAuth), bcrypt |
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
PORT=4000
MONGODB_URL=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES=1

NODE_ENV=development

ADMIN_EMAIL=your_admin_email@example.com

OPENAI_API_KEY=your_openai_api_key

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
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

Alternatively, to create an Admin user, you must manually update their role in the MongoDB database after registration.

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

- **Natural Language Search**: Ask complex questions using natural language
- **Interactive Chatbot**: Data-aware assistant for inventory queries
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
- **Status Indicators**: Real-time indicators for system health and sync status
- **Backup System**: Local data backups with automated reminders

## 🔒 Security Features

- JWT-based authentication
- Google and GitHub OAuth integration
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
