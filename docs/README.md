# CrackerShop - E-Commerce Mobile & Web Application

Production-grade full-stack e-commerce application built with Node.js, Express, MongoDB, React Native, and Expo.

## 📱 Project Overview

CrackerShop is a comprehensive e-commerce platform specializing in Indian sweets and crackers. The application features a mobile-first design with support for multiple payment methods, installment schemes, and real-time order tracking.

### Key Features
✅ User authentication & authorization
✅ Product catalog with filtering & search
✅ Shopping cart management
✅ Order management system
✅ Multiple payment methods (COD, UPI, Card)
✅ Installment payment scheme (Chit)
✅ Admin dashboard for product & order management
✅ Real-time notifications
✅ Address management
✅ Order history & tracking
✅ Banner management for promotions
✅ Multi-role authorization (Customer, Admin)

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

**Frontend:**
- **Framework**: React Native
- **State Management**: Context API / Redux
- **UI Framework**: Expo, Nativewind (Tailwind CSS)
- **Routing**: Expo Router
- **HTTP Client**: Axios
- **Form Management**: Formik + Yup
- **Styling**: Tailwind CSS

**Infrastructure:**
- **Hosting**: AWS EC2 / DigitalOcean / Heroku
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
CrackerShop/
├── backend/                    # Node.js/Express API
│   ├── config/               # Database & configuration
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Custom middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   ├── scripts/             # Utility scripts
│   ├── .env.example         # Environment template
│   ├── .env.production      # Production config
│   ├── server.js            # Entry point
│   └── PRODUCTION_DEPLOYMENT.md  # Deployment guide
│
├── frontend/                   # React Native/Expo App
│   ├── app/                 # App screens & layout
│   ├── components/          # Reusable components
│   ├── assets/              # Images & icons
│   ├── constant/            # Constants & theme
│   ├── environment.js       # Environment config
│   ├── app.json             # Expo configuration
│   └── PRODUCTION_BUILD_GUIDE.md  # Build guide
│
└── README.md (this file)
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Update .env with your credentials
# - MongoDB URI
# - Cloudinary credentials
# - JWT Secret

# Start development server
npm run dev

# Start production server
npm run prod
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update environment.js with API URL

# Start development
npm start

# For Android
npm run android

# For iOS
npm run ios
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order (admin)

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin)

#### Admin
- `GET /users` - Get all users (admin)
- `GET /banners` - Get promotional banners

See [Backend Deployment Guide](./backend/PRODUCTION_DEPLOYMENT.md) for complete API reference.

## 🔒 Security Features

✅ **Authentication**: JWT-based authentication
✅ **Authorization**: Role-based access control (RBAC)
✅ **Rate Limiting**: Request rate limiting to prevent abuse
✅ **Data Validation**: Input validation & sanitization
✅ **CORS**: Configured CORS policies
✅ **Security Headers**: Helmet.js for secure headers
✅ **MongoDB Injection**: Protected against NoSQL injection
✅ **XSS Prevention**: Input sanitization
✅ **HTTPS**: Support for SSL/TLS
✅ **Error Handling**: Comprehensive error handling without exposing internals

## 📊 Performance Optimization

### Backend
- MongoDB connection pooling
- Efficient database indexing
- Request caching
- Gzip compression
- Asset optimization

### Frontend
- Code splitting & lazy loading
- Image optimization
- Bundle size optimization
- Network request caching
- Offline support

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:watch
```

### Frontend
```bash
cd frontend
npm run lint
npm run type-check
```

## 📦 Deployment

### Backend Deployment
See [Backend Production Deployment Guide](./backend/PRODUCTION_DEPLOYMENT.md)

### Frontend Deployment
See [Frontend Production Build Guide](./frontend/PRODUCTION_BUILD_GUIDE.md)

### Quick Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups in place
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] CDN configured (for images)
- [ ] Monitoring tools set up
- [ ] Error tracking (Sentry) configured
- [ ] Analytics configured
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Database indices created
- [ ] Backup strategy implemented

## 🔄 Environment Variables

### Backend
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=... (min 32 chars)
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend
```javascript
// environment.js
prod: {
    apiUrl: 'https://api.yourdomain.com/api/v1',
    uploadUrl: 'https://api.yourdomain.com/uploads',
    environment: 'production'
}
```

## 📱 App Screenshots

[Add screenshots here]

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

**Rate Limiting Issues**
- Adjust RATE_LIMIT settings
- Check reverse proxy configuration
- Verify X-Forwarded-For header

**File Upload Failures**
- Verify Cloudinary credentials
- Check file size limits
- Verify Cloudinary quota

### Frontend Issues

**API Connection Failed**
- Verify API URL in environment.js
- Check backend server status
- Verify CORS configuration

**Build Fails**
- Clear cache: `npm start -- -c`
- Reinstall dependencies
- Check Node.js version

## 📝 Changelog

### Version 1.0.0 (2026-01-21)
- Initial production release
- Complete product catalog
- User authentication & authorization
- Order management system
- Payment integration
- Installment scheme support
- Real-time notifications
- Admin dashboard
- Comprehensive error handling
- Production-grade logging
- Security hardening

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Open Pull Request

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com
- **Phone**: +91-XXXXXXXXXX

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

## 👨‍💻 Author

[Your Name]
[Your Email]
[Your Website]

---

## 🎯 Production Readiness Checklist

### Code Quality
- [ ] All tests passing
- [ ] Linting errors resolved
- [ ] Code review completed
- [ ] No hardcoded credentials
- [ ] Error messages don't expose internals

### Security
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Security headers configured
- [ ] Database credentials secured
- [ ] API keys secured
- [ ] No console.log statements

### Performance
- [ ] Database indices created
- [ ] Connection pooling configured
- [ ] Caching implemented
- [ ] Bundle size optimized
- [ ] CDN configured
- [ ] Compression enabled

### Monitoring
- [ ] Error tracking enabled
- [ ] Logging configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring enabled
- [ ] Database backups scheduled
- [ ] Health checks configured

### Documentation
- [ ] README completed
- [ ] API documented
- [ ] Deployment guide created
- [ ] Environment variables documented
- [ ] Troubleshooting guide included

---

**Last Updated**: January 21, 2026
**Status**: Production Ready ✅
