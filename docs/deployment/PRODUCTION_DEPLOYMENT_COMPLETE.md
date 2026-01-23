# 🚀 Production Deployment Checklist & Configuration

## Pre-Deployment Verification

### ✅ Backend Verification
```bash
# Test backend health
curl http://192.168.1.37:5000/health

# Test API connectivity
curl http://192.168.1.37:5000/api/v1

# Test database connection
curl http://192.168.1.37:5000/api/v1/products

# Test authentication
curl -X POST http://192.168.1.37:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### ✅ Frontend Verification  
- [ ] App starts without errors
- [ ] Login page loads
- [ ] Can login with test credentials
- [ ] Dashboard loads after login
- [ ] API calls return data
- [ ] No network errors in console

---

## Production Environment Setup

### 1. Domain & DNS Configuration
```
Frontend: crackershop.yourdomain.com → your-server-ip
API: api.crackershop.yourdomain.com → your-server-ip
```

### 2. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone \
  -d crackershop.yourdomain.com \
  -d api.crackershop.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 3. Backend Environment (.env.production)
```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/CrackerShop?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Security
JWT_SECRET=<GENERATE_STRONG_SECRET_32_CHARS+>
JWT_EXPIRE=30d

# CORS & Security
ALLOWED_ORIGINS=https://crackershop.yourdomain.com,https://api.crackershop.yourdomain.com
FRONTEND_URL=https://crackershop.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/crackershop

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_specific_password
ADMIN_EMAIL=admin@yourdomain.com

# API Security
MAX_REQUEST_SIZE=50mb
REQUEST_TIMEOUT=30000
```

### 4. Frontend Environment (environment.js)
```javascript
prod: {
    apiUrl: 'https://api.crackershop.yourdomain.com/api/v1',
    uploadUrl: 'https://api.crackershop.yourdomain.com/uploads',
    environment: 'production',
    logLevel: 'error',
    timeout: 20000
}
```

### 5. Nginx Configuration
```nginx
# /etc/nginx/sites-available/crackershop.conf

upstream api {
    server localhost:5000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name crackershop.yourdomain.com api.crackershop.yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Frontend
server {
    listen 443 ssl http2;
    server_name crackershop.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/crackershop.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crackershop.yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    
    location / {
        root /opt/crackershop/frontend/dist;
        try_files $uri /index.html;
    }
}

# HTTPS API
server {
    listen 443 ssl http2;
    server_name api.crackershop.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/crackershop.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crackershop.yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types application/json;
    
    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;
    
    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files
    location /uploads {
        alias /opt/crackershop/backend/uploads;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. Docker Deployment
```bash
# Build backend
docker build -t crackershop-api:1.0 ./backend

# Run with docker-compose
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f api nginx

# Stop and cleanup
docker-compose down
docker image prune -a
```

---

## Monitoring & Maintenance

### Log Rotation
```bash
# /etc/logrotate.d/crackershop
/var/log/crackershop/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 crackershop crackershop
    postrotate
        systemctl reload crackershop > /dev/null 2>&1 || true
    endscript
}
```

### Health Check Script
```bash
#!/bin/bash
# /opt/crackershop/healthcheck.sh

API_HEALTH=$(curl -s http://localhost:5000/health | jq '.success')
DB_CHECK=$(curl -s http://localhost:5000/api/v1/products | jq '.success')

if [ "$API_HEALTH" != "true" ] || [ "$DB_CHECK" != "true" ]; then
    echo "❌ Health check failed at $(date)" >> /var/log/crackershop/health.log
    # Alert/restart logic here
else
    echo "✅ Health check passed at $(date)" >> /var/log/crackershop/health.log
fi
```

### Cron Jobs
```bash
# Run health check every 5 minutes
*/5 * * * * /opt/crackershop/healthcheck.sh

# Backup MongoDB daily at 2 AM
0 2 * * * mongodump --uri="mongodb+srv://..." --out=/backups/mongodb_$(date +%Y%m%d)

# Clear old logs weekly
0 0 * * 0 find /var/log/crackershop -name "*.log" -mtime +30 -delete
```

---

## Disaster Recovery

### Backup Strategy
1. **Daily**: Database backup
2. **Weekly**: Full system backup
3. **Monthly**: Off-site backup

### Restore Procedure
```bash
# Restore MongoDB
mongorestore --uri="mongodb+srv://..." /backups/mongodb_20260122

# Restore application
rsync -av /backups/app-backup/ /opt/crackershop/

# Restart services
docker-compose restart
```

---

## Performance Optimization

### Backend
- ✅ Connection pooling enabled
- ✅ Rate limiting active
- ✅ Gzip compression enabled
- ✅ Logging optimized
- ✅ Error handling efficient

### Frontend
- ✅ Code splitting configured
- ✅ Image optimization ready
- ✅ Bundle size monitored
- ✅ Lazy loading components
- ✅ API request batching

### Database
- ✅ Indexes created
- ✅ Connection pooling enabled
- ✅ Query optimization ready
- ✅ TTL indexes for sessions

---

## Security Checklist

### ✅ Implemented
- [x] CORS whitelisting
- [x] Rate limiting
- [x] JWT authentication
- [x] Input validation
- [x] SQL injection prevention
- [x] XSS protection
- [x] CSRF protection
- [x] Secure headers
- [x] HTTPS/SSL
- [x] Password hashing (bcrypt)
- [x] Environment variable protection
- [x] API key rotation ready

### 🔒 To Verify
- [ ] No secrets in git history
- [ ] All environment variables set
- [ ] SSL certificate valid
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] Database backed up
- [ ] Logs being collected
- [ ] Monitoring active

---

## Post-Deployment Verification

1. **Frontend Deployment**
   ```bash
   curl https://crackershop.yourdomain.com
   # Should return HTML with React app
   ```

2. **API Deployment**
   ```bash
   curl https://api.crackershop.yourdomain.com/health
   # Should return { success: true, ... }
   ```

3. **Database Connection**
   ```bash
   curl https://api.crackershop.yourdomain.com/api/v1/products
   # Should return products list
   ```

4. **Authentication Flow**
   - [ ] Can login
   - [ ] Token stored securely
   - [ ] Protected routes work
   - [ ] Logout clears session

5. **Error Handling**
   - [ ] Errors logged correctly
   - [ ] User-friendly error messages
   - [ ] No sensitive data in errors
   - [ ] Retry logic works

---

## Support & Troubleshooting

### Common Issues

**Issue**: 502 Bad Gateway
```
Solution: Check if backend is running
systemctl status crackershop
docker ps | grep api
```

**Issue**: SSL Certificate Error
```
Solution: Renew certificate
sudo certbot renew --force-renewal
```

**Issue**: High Memory Usage
```
Solution: Restart application
docker-compose restart api
```

**Issue**: Database Connection Failure
```
Solution: Check MongoDB connection
mongo "mongodb+srv://..." --eval "db.adminCommand('ping')"
```

---

## Rollback Procedure

If issues occur in production:

```bash
# Stop current version
docker-compose down

# Restore previous backup
rsync -av /backups/app-backup-previous/ /opt/crackershop/

# Start previous version
docker-compose up -d

# Verify
curl https://api.crackershop.yourdomain.com/health
```

---

## Version Information

- **App Version**: 1.0.0
- **Node.js**: >=16.0.0
- **MongoDB**: 4.0+
- **Nginx**: 1.20+
- **Docker**: 20.10+
- **Docker Compose**: 1.29+

---

**Last Updated**: January 22, 2026
**Status**: Production Ready ✅
