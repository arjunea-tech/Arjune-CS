# Quick Start - Production Deployment (30 Minutes)

Fast-track guide to deploy CrackerShop to production.

## Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- Domain with DNS access
- SSL certificate (or use Let's Encrypt)

## 1. Clone and Configure (5 min)

```bash
# Clone repository
git clone <your-repo-url> /opt/crackershop
cd /opt/crackershop

# Configure environment
cp backend/.env.example backend/.env.production

# Edit configuration
nano backend/.env.production
```

**Fill in these variables:**
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/CrackerShop
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=generate_strong_random_string_32_chars_or_more
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## 2. Install Dependencies (5 min)

```bash
# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install --production
```

## 3. Setup Database (3 min)

```bash
# Test connection
cd ../backend
node -e "require('./config/db')()"

# Expected: MongoDB Connected: [your-cluster]
```

## 4. Docker Deployment (10 min)

```bash
# Navigate to root
cd /opt/crackershop

# Build Docker image
docker build -t crackershop-api backend/

# Run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

## 5. Nginx Setup (5 min)

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/crackershop

# Enable site
sudo ln -s /etc/nginx/sites-available/crackershop \
  /etc/nginx/sites-enabled/crackershop

# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

## 6. SSL Certificate (2 min)

```bash
# Using Let's Encrypt (recommended)
sudo apt-get install certbot python3-certbot-nginx

sudo certbot certonly --standalone -d api.yourdomain.com

# Update nginx.conf with certificate paths:
# ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

sudo systemctl reload nginx
```

## Verification

### Health Check
```bash
curl https://api.yourdomain.com/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-21T...",
  "environment": "production"
}
```

### API Test
```bash
# Register user
curl -X POST https://api.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass@123",
    "mobileNumber": "+919876543210",
    "address": "123 Main St",
    "pincode": "123456",
    "district": "TestDistrict",
    "state": "TestState"
  }'
```

## Monitoring Setup

```bash
# Install error tracking (Sentry)
# Go to https://sentry.io -> Create project

# Get your DSN and update backend/server.js with Sentry.init()

# Setup Uptime Monitoring
# Go to https://uptimerobot.com -> Add Monitor
# URL: https://api.yourdomain.com/health
```

## Backup Setup

```bash
# Create cron job for daily backups
sudo crontab -e

# Add this line (3 AM daily):
0 3 * * * /usr/local/bin/crackershop-backup.sh
```

## Frontend Deployment

### Build for Production
```bash
cd frontend

# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android --latest
eas submit --platform ios --latest
```

## Post-Deployment Checklist

- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] Login/Register working
- [ ] Database operations working
- [ ] File uploads working
- [ ] Backups running
- [ ] SSL working (green lock)
- [ ] Rate limiting active
- [ ] Logs writing to files
- [ ] Monitoring alerts configured

## Troubleshooting

### Port 5000 already in use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection failed
```bash
# Check IP whitelist in MongoDB Atlas
# Add your server IP to allowed connections
```

### SSL certificate issue
```bash
# Renew certificate
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

### High memory usage
```bash
# Check process memory
ps aux | grep node

# Restart service
docker-compose restart api
# or
systemctl restart crackershop
```

## Performance Check

```bash
# API response time
time curl -s https://api.yourdomain.com/api/v1/products | head -c 100

# Should be < 500ms

# Check active connections
netstat -antp | grep :5000

# Monitor resources
top
htop
```

## Security Check

```bash
# Verify HTTPS only
curl -i https://api.yourdomain.com

# Check security headers
curl -i https://api.yourdomain.com | grep -i "strict-transport"

# Test rate limiting (should get 429 after limit)
for i in {1..150}; do curl -s https://api.yourdomain.com/api/v1/products > /dev/null & done
```

## Next Steps

1. **Configure Monitoring**: See [MONITORING_GUIDE.md](./MONITORING_GUIDE.md)
2. **Setup Alerts**: Configure email/SMS alerts for critical issues
3. **Backup Testing**: Restore a backup to test procedure
4. **Load Testing**: Test with realistic user volume
5. **Security Audit**: Review security settings
6. **Performance Tuning**: Optimize database indices if needed
7. **Documentation**: Update with your specific setup details

## Important Endpoints

- **Health**: `https://api.yourdomain.com/health`
- **API Info**: `https://api.yourdomain.com/api`
- **API Docs**: `https://api.yourdomain.com/api/v1/products` (GET)
- **Admin Login**: Your app -> Admin role

## Emergency Contacts

- **DevOps**: [Phone Number]
- **Database Admin**: [Phone Number]
- **Security Team**: [Email]

## Need Help?

- Backend: See [PRODUCTION_DEPLOYMENT.md](./backend/PRODUCTION_DEPLOYMENT.md)
- Frontend: See [PRODUCTION_BUILD_GUIDE.md](./frontend/PRODUCTION_BUILD_GUIDE.md)
- Issues: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Monitoring: See [MONITORING_GUIDE.md](./MONITORING_GUIDE.md)

---

**Estimated Total Time**: 30 minutes
**Difficulty**: Medium
**Status**: Ready for Production ✅

Good luck with your deployment! 🚀
