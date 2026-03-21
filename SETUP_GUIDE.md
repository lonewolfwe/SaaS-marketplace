# Zero-Knowledge Setup Guide: SaaS Marketplace

Follow these steps exactly to run this project on your local machine.

## 1. Prerequisites (Must be installed)

*   **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (Version 16 or higher).
*   **MongoDB**: Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
    *   Ensure the MongoDB service is running (Port 27017).
*   **A Code Editor**: [VS Code](https://code.visualstudio.com/) is recommended.

---

## 2. Setting Up the Backend (Server)

1.  Open your terminal/command prompt.
2.  Navigate into the `server` directory:
    ```bash
    cd server
    ```
3.  Install the required packages:
    ```bash
    npm install
    ```
4.  **Configure Environment Variables**:
    *   In the `server` folder, there should be a file named `.env`.
    *   If it doesn't exist, create it and paste this content:
        ```env
        NODE_ENV=development
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/saas-marketplace
        JWT_SECRET=any-long-random-string-for-security
        JWT_EXPIRES_IN=1h
        FRONTEND_URL=http://localhost:5173
        ```
5.  **Start the Server**:
    ```bash
    npm run dev
    ```
    *   You should see: `MongoDB Connected: localhost`.

---

## 3. Setting Up the Frontend (Client)

1.  Open a **NEW terminal window**.
2.  Make sure you are in the **Root Directory** (the folder containing `src` and `package.json`, NOT the server folder).
3.  Install the required packages:
    ```bash
    npm install
    ```
4.  **Start the Frontend**:
    ```bash
    npm run dev
    ```
5.  Open your browser and go to: [http://localhost:5173](http://localhost:5173)

---

## 4. Testing the Application

You don't need to create an account immediately. Use these pre-configured login credentials:

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | `admin@saas-marketplace.com` | `admin123` |
| **Seller** | `seller@example.com` | `password123` |
| **Buyer** | `buyer@example.com` | `password123` |

---

## 5. Troubleshooting

*   **"MongoDB Connection Error"**: Ensure your local MongoDB Service is started. Search for "Services" on Windows and start "MongoDB Server".
*   **"Port 5000 in use"**: Another app is using the server port. You can change `PORT=5000` in the `.env` file and restart.
*   **"npm command not found"**: You need to install Node.js (see Step 1).
