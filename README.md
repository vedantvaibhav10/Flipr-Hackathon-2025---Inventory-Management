# InvTrack - AI-Powered Inventory Management System

![InvTrack Screenshot](https://i.imgur.com/your-screenshot.png) InvTrack is a modern, full-stack inventory management system designed to streamline your stock control processes. Built with a powerful MERN stack and integrated with OpenAI, it provides intelligent insights, automated alerts, and a beautiful, responsive user interface.

**Live Demo:** [[https://your-frontend-deployment-link.com](https://inventory-management-topaz-tau.vercel.app/)]
**Backend API:** [https://inventory-management-backend-gmik.onrender.com](https://inventory-management-backend-gmik.onrender.com)

## ✨ Key Features

### Core Functionality
-   **Centralized Dashboard:** Get a real-time overview of your entire inventory, including stock value and low-stock items.
-   **Complete Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads via Cloudinary.
-   **Supplier & Purchase Orders:** Manage suppliers and track purchase orders from creation to delivery.
-   **Automated Stock Control:** Stock levels are automatically updated when purchase orders are marked as delivered, returned, or cancelled.
-   **Detailed Inventory Logs:** Track every single stock movement, whether from a sale, restock, or manual adjustment.
-   **Role-Based Access Control:** A secure system with distinct permissions for **Admin** and **Staff** roles.
-   **Data Reporting & Export:** View detailed reports on inventory movements and export your product data to CSV.

### 🧠 AI-Powered Intelligence
-   **Smart Reorder Suggestions:** Get AI recommendations on how much stock to reorder for low-stock items.
-   **Automated Description & Category:** Generate professional product descriptions and get category suggestions with the click of a button.
-   **Dynamic Pricing Suggestions:** Receive AI-driven advice on how to price your products for optimal profitability.
-   **Supplier Performance Analysis:** Get an AI-generated summary of a supplier's reliability based on their order history.
-   **AI-Generated Low-Stock Alerts:** Receive intelligently drafted, urgent email alerts when stock levels fall below the set threshold.

### Technical Features
-   **Secure Authentication:** JWT-based authentication with credentials stored in secure, HTTP-only cookies.
-   **Live Health Monitoring:** A real-time status bar monitors the health of the API, database, and connected services.
-   **Responsive UI:** A beautiful and intuitive user interface built with React and Tailwind CSS.

---
## Authorization Roles

InvTrack has two user roles with specific permissions:

| Feature / Action                  | 👤 Staff | 👑 Admin |
| --------------------------------- | :------: | :------: |
| **Dashboard & Reports** |   ✅    |   ✅    |
| **View Products & Suppliers** |   ✅    |   ✅    |
| **Create/Edit/Delete Products** |   ❌    |   ✅    |
| **Create/Edit/Delete Suppliers** |   ❌    |   ✅    |
| **Create & Update Orders** |   ✅    |   ✅    |
| **Delete Orders** |   ❌    |   ✅    |
| **Manual Stock Adjustments** |   ✅    |   ✅    |
| **View Inventory Logs** |   ❌    |   ✅    |
| **Access All AI Features** |   ❌    |   ✅    |

---
## 🛠️ Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Axios    |
| **Backend** | Node.js, Express, MongoDB, Mongoose           |
| **Auth** | JSON Web Tokens (JWT), bcrypt                 |
| **Services** | Cloudinary (Image Storage), OpenAI (AI), Nodemailer (Email) |

---
## 🚀 Project Setup

To run this project locally, you will need to set up both the backend server and the frontend client.

### 1. Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and populate it according to the [Backend README's instructions](https://github.com/your-username/your-repo/blob/main/backend/README.md). 4.  Run the seeder to populate your database with sample data: `npm install bcrypt && node seeder.js -i`
5.  Start the server: `npm run dev` (It will run on `http://localhost:4000` by default)

### 2. Frontend Setup

1.  From the root directory, navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `client` root and add the backend API URL:
    ```dotenv
    VITE_API_BASE_URL=http://localhost:4000
    ```
4.  Start the client: `npm run dev` (It will open in your browser, likely at `http://localhost:5173`)

You can now log in with the seeded user credentials:
-   **Admin Email:** `admin@example.com` | **Password:** `123456`
-   **Staff Email:** `staff@example.com` | **Password:** `123456`
