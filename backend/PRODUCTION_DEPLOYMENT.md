# CrackerShop Backend API - Production Deployment Guide

## Overview
CrackerShop is a full-featured e-commerce API built with Node.js, Express, and MongoDB. This guide covers production deployment and best practices.

## Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Atlas account (or MongoDB server)
- Cloudinary account (for image uploads)
- SSL/TLS certificate (for production)

## Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
```bash
# Copy .env.example to .env for development
cp .env.example .env

# For production, use .env.production
cp .env.production .env.production
```

### 3. Configure Environment Variables
Edit `.env` or `.env.production` with your production values:

```env
# Core
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/CrackerShop

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_secret_key_32_chars_minimum
JWT_EXPIRE=7d

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run prod
# Or with process manager (recommended)
pm2 start server.js --name "crackershop-api" --env production
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/resetpassword` - Reset password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (admin only)
- `PUT /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (admin only)
- `PUT /api/v1/categories/:id` - Update category (admin only)
- `DELETE /api/v1/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/v1/orders` - Get user's orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id` - Update order status

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user details (admin only)
- `PUT /api/v1/users/:id` - Update user (admin only)

## Security Features Implemented

✅ **CORS Protection** - Restricted to allowed origins
✅ **Rate Limiting** - Prevents abuse (100 requests/15 min)
✅ **Authentication Rate Limiting** - Stricter limits on auth endpoints
✅ **Helmet Security Headers** - HSTS, CSP, X-Frame-Options
✅ **MongoDB Injection Prevention** - Data sanitization
✅ **XSS Prevention** - Input validation and sanitization
✅ **HTTPS/TLS Support** - For production
✅ **Request Validation** - Using express-validator
✅ **Error Handling** - Comprehensive error handling
✅ **Logging** - Winston logger with file rotation
✅ **JWT Authentication** - Secure token-based auth

## Production Deployment Checklist

### Prerequisites
- [ ] Environment variables configured
- [ ] MongoDB production instance ready
- [ ] Cloudinary account configured
- [ ] SSL certificate obtained
- [ ] Domain DNS configured

### Deployment Steps

#### Option 1: Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "crackershop" --env production

# Save PM2 config
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

#### Option 2: Using Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t crackershop-api .
docker run -d -p 5000:5000 --env-file .env.production crackershop-api
```

#### Option 3: Using Systemd Service
Create `/etc/systemd/system/crackershop.service`:
```ini
[Unit]
Description=CrackerShop API
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/home/nodejs/crackershop/backend
ExecStart=/usr/bin/node server.js
Restart=always
EnvironmentFile=/home/nodejs/crackershop/backend/.env.production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable crackershop
sudo systemctl start crackershop
```

### Nginx Reverse Proxy Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://localhost:5000/uploads;
    }
}
```

## Monitoring and Maintenance

### Logs
```bash
# View application logs
pm2 logs crackershop

# View error logs
tail -f logs/error.log

# View all logs
tail -f logs/combined.log
```

### Database Maintenance
```bash
# Create backup
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/CrackerShop" --out /backups/db_backup

# Restore backup
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/CrackerShop" /backups/db_backup
```

### Health Checks
```bash
# API health check
curl https://api.yourdomain.com/health

# Should return:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": "2026-01-21T10:00:00.000Z",
#   "environment": "production"
# }
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout**
   - Check connection string
   - Verify IP whitelist in MongoDB Atlas
   - Check network connectivity

2. **Image Upload Failures**
   - Verify Cloudinary credentials
   - Check file size limits
   - Review Cloudinary dashboard

3. **High Memory Usage**
   - Review database queries
   - Check for connection leaks
   - Monitor with `pm2 monit`

4. **Rate Limiting Issues**
   - Adjust RATE_LIMIT settings in .env
   - Check for reverse proxy issues

## Performance Optimization

1. **Database Indexing** - Ensure proper indices on frequently queried fields
2. **Caching** - Implement Redis caching for frequently accessed data
3. **Connection Pooling** - Configured with MongoDB driver
4. **Compression** - Enable gzip compression
5. **CDN** - Use CDN for static assets

## Backup and Recovery

### Automated Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/CrackerShop" --out /backups/backup_$DATE
tar -czf /backups/backup_$DATE.tar.gz /backups/backup_$DATE
rm -rf /backups/backup_$DATE
```

Schedule with cron:
```bash
0 2 * * * /home/nodejs/backup.sh
```

## Support and Documentation

- **API Documentation**: Available at `/api` endpoint
- **Issue Tracking**: GitHub Issues
- **Documentation**: See `/docs` folder

## Version History

### v1.0.0 (2026-01-21)
- Initial production release
- Complete CRUD operations
- Authentication and authorization
- Security hardening
- Comprehensive logging
- Error handling

## License
ISC
