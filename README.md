# CrackerShop - E-Commerce & Chit Management Platform

A comprehensive full-stack application built with React Native (Expo), Node.js/Express, and MongoDB.

---

## 📁 Project Structure

```
CrackerShop/
├── backend/                    # Node.js/Express API server
│   ├── config/                 # Database configuration
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Custom middleware (auth, error, security)
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions and helpers
│   ├── scripts/                # Database seeds and utilities
│   ├── server.js               # Main server entry point
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React Native (Expo) mobile app
│   ├── app/                    # Navigation and screens
│   ├── Components/             # Reusable UI components
│   ├── assets/                 # Images and static files
│   ├── constant/               # Theme and constants
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Styling configuration
│
├── config/                     # Configuration files
│   ├── docker/                 # Docker and docker-compose configs
│   ├── nginx/                  # Nginx reverse proxy config
│   └── production/             # Production deployment scripts
│
├── docs/                       # Documentation
│   ├── guides/                 # Getting started and quick start guides
│   ├── deployment/             # Deployment and monitoring guides
│   ├── troubleshooting/        # Debugging and fixes
│   ├── references/             # Project status and file references
│   ├── START_HERE.md           # Project overview
│   └── README.md               # Documentation home
│
├── tests/                      # Test files and API testing
│   └── test-api.js             # API endpoint tests
│
├── .gitignore                  # Git ignore rules
├── package-lock.json           # Root lockfile
└── README.md                   # This file

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Expo CLI (for frontend development)

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📖 Documentation

- **Getting Started**: See [docs/START_HERE.md](docs/START_HERE.md)
- **Quick Deployment**: See [docs/guides/QUICK_START_DEPLOYMENT.md](docs/guides/QUICK_START_DEPLOYMENT.md)
- **Deployment Guide**: See [docs/deployment/](docs/deployment/)
- **Troubleshooting**: See [docs/troubleshooting/](docs/troubleshooting/)
- **Project References**: See [docs/references/](docs/references/)

---

## 🐳 Docker Deployment

Configuration files are located in `config/`:
- Docker Compose: `config/docker/docker-compose.yml`
- Nginx Config: `config/nginx/nginx.conf`
- Production Scripts: `config/production/`

---

## 🧪 Testing

Run API tests:
```bash
node tests/test-api.js
```

---

## 📚 Architecture

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Middleware**: Security, Error Handling, Async wrapper

### Frontend
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Styling**: Tailwind CSS + NativeWind
- **State Management**: Context API

---

## 🔒 Features

- User Authentication & Authorization
- Product Management & Browsing
- Shopping Cart & Checkout
- Order Management
- Chit Scheme Registration & Payments
- Admin Dashboard
- Notifications System
- User Profiles & Saved Addresses

---

## 📞 Support

For issues and troubleshooting, refer to:
- [Troubleshooting Guide](docs/troubleshooting/)
- [Complete Resolution Guide](docs/troubleshooting/COMPLETE_RESOLUTION_GUIDE.md)

---

**Last Updated**: January 2026
