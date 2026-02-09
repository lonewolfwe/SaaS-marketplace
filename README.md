# SaaS Marketplace

A production-ready marketplace for buying and selling SaaS projects.

## 🚀 Getting Started

This project consists of a **Frontend** (React + Vite) and a **Backend** (Node.js + Express + MongoDB). You need to run both simultaneously.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Ensure it's running locally on port 27017)

### 1. Installation

You need to install dependencies for both the root (frontend) and the server (backend).

**Frontend:**
```bash
# In the root directory
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

---

### 2. Running the Application

Open **two separate terminals** to run the full stack.

#### Terminal 1: Backend Server 🗄️
```bash
cd server
npm run dev
```
*Runs on [http://localhost:5000](http://localhost:5000)*

#### Terminal 2: Frontend Client 💻
```bash
# In the root directory
npm run dev
```
*Runs on [http://localhost:5173](http://localhost:5173)*

---

### 3. Default Credentials 🔑

The system comes with pre-configured accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@saas-marketplace.com` | `admin123` |
| **Seller** | `seller@example.com` | `password123` |
| **Buyer** | `buyer@example.com` | `password123` |

### 4. Project Structure

- `/src` - React Frontend (Pages, Components, Context)
- `/server` - Express Backend (API, Models, Controllers)
- `/server/.env` - Backend Environment Variables

### 5. Common Issues

- **Data not loading?** Ensure the backend server is running in a separate terminal.
- **Login failing?** Check if MongoDB is running (`mongod`).
- **Port in use?** The app defaults to ports 5173 (Frontend) and 5000 (Backend).
