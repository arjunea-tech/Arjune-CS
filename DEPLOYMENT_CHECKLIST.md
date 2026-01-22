# Production Deployment Checklist

Complete this checklist before deploying CrackerShop to production.

## Pre-Deployment Phase

### Code Quality
- [ ] All tests passing
- [ ] Linting errors resolved (`npm run lint`)
- [ ] No console.log() statements in production code
- [ ] No hardcoded credentials or secrets
- [ ] Error messages don't expose internal details
- [ ] Code review completed
- [ ] No TODO or FIXME comments left for production
- [ ] TypeScript compilation successful (if applicable)

### Security Audit
- [ ] Security headers configured in Nginx/backend
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL/NoSQL injection prevention verified
- [ ] XSS prevention checked
- [ ] CSRF tokens configured
- [ ] SSL/TLS certificate obtained
- [ ] Certificate chain configured
- [ ] No exposed API keys in code
- [ ] Environment variables documented

### Environment Setup
- [ ] .env.production created with all variables
- [ ] Database credentials secured
- [ ] Cloudinary credentials configured
- [ ] JWT secret is strong (min 32 chars)
- [ ] API URLs configured
- [ ] Email credentials configured (if needed)
- [ ] CDN/static file hosting configured
- [ ] Backup storage configured

### Database Preparation
- [ ] MongoDB Atlas account created
- [ ] Database clusters provisioned
- [ ] Backup enabled
- [ ] IP whitelist configured
- [ ] Database indices created
- [ ] Connection pooling configured
- [ ] Automated backups scheduled
- [ ] Restore procedure tested

### Infrastructure
- [ ] Server/hosting account created
- [ ] Domain registered
- [ ] DNS records configured
- [ ] SSL certificate installed
- [ ] Reverse proxy (Nginx) configured
- [ ] Load balancer configured (if needed)
- [ ] CDN configured
- [ ] Monitoring tools set up
- [ ] Log aggregation configured
- [ ] Error tracking (Sentry) configured

## Deployment Phase

### Backend Deployment

#### Installation
- [ ] Clone repository to production server
- [ ] Install Node.js and npm
- [ ] Install dependencies: `npm install --production`
- [ ] Create necessary directories (logs, uploads)
- [ ] Set proper file permissions
- [ ] Configure process manager (PM2/systemd)

#### Configuration
- [ ] Copy .env.production to backend directory
- [ ] Verify all environment variables
- [ ] Test database connection
- [ ] Test Cloudinary credentials
- [ ] Test JWT functionality

#### Startup
- [ ] Start the backend service
- [ ] Verify service is running
- [ ] Check logs for errors
- [ ] Test health endpoint: `/health`
- [ ] Test API endpoints
- [ ] Verify error handling

### Frontend Deployment

#### Build
- [ ] Update API URLs in environment.js
- [ ] Build for production
- [ ] Verify bundle size
- [ ] Check for build errors
- [ ] Test all routes

#### Deployment
- [ ] Upload build to hosting service
- [ ] Configure CDN for static files
- [ ] Setup automatic deployments (if using CI/CD)
- [ ] Configure redirects (http → https)
- [ ] Test all app features

### Nginx Configuration
- [ ] SSL certificate installed
- [ ] Nginx configuration tested
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] Compression enabled
- [ ] Caching rules configured
- [ ] Proxy settings verified
- [ ] Restart Nginx

## Post-Deployment Phase

### Verification
- [ ] Health check passes
- [ ] API responds correctly
- [ ] Database connection working
- [ ] File uploads working
- [ ] Email notifications working (if applicable)
- [ ] Authentication working
- [ ] Authorization working
- [ ] Admin panel accessible
- [ ] Customer features accessible

### Performance Testing
- [ ] Response times acceptable (< 200ms)
- [ ] Database queries optimized
- [ ] No memory leaks detected
- [ ] CPU usage normal
- [ ] Disk space sufficient
- [ ] Network connectivity stable

### Security Testing
- [ ] SSL certificate valid
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] XSS prevention working
- [ ] SQL injection prevention working
- [ ] CORS policies enforced
- [ ] Authentication enforced

### Monitoring Setup
- [ ] Error tracking active (Sentry)
- [ ] Performance monitoring active (New Relic/DataDog)
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set
- [ ] Log rotation configured
- [ ] Disk space alerts configured
- [ ] CPU/Memory alerts configured
- [ ] Error rate alerts configured

### Backup Verification
- [ ] Automated backups running
- [ ] Backup location accessible
- [ ] Restore procedure tested
- [ ] Point-in-time recovery possible
- [ ] Backup retention policy set
- [ ] Off-site backup configured

### Documentation
- [ ] Deployment guide documented
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Known issues documented
- [ ] Rollback procedure documented
- [ ] Emergency contacts documented

## Ongoing Maintenance

### Daily Tasks
- [ ] Check error logs
- [ ] Monitor application performance
- [ ] Verify backups completed
- [ ] Check server resources

### Weekly Tasks
- [ ] Review application metrics
- [ ] Check for security updates
- [ ] Test backup restoration
- [ ] Review user reports/issues

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Database maintenance
- [ ] Update dependencies
- [ ] Review and rotate credentials

### Quarterly Tasks
- [ ] Disaster recovery drill
- [ ] Security penetration testing
- [ ] Full system review
- [ ] Capacity planning

## Rollback Procedure

In case of critical issues:

1. [ ] Stop the current deployment
2. [ ] Access previous version from git
3. [ ] Revert database changes (if applicable)
4. [ ] Restart backend service
5. [ ] Verify system stability
6. [ ] Notify stakeholders
7. [ ] Schedule post-mortem

## Sign-Off

- [ ] Project Manager: _______________  Date: _______
- [ ] DevOps Engineer: _______________  Date: _______
- [ ] QA Lead: _______________  Date: _______
- [ ] Tech Lead: _______________  Date: _______

## Notes

```
[Add any additional notes, issues, or blockers here]
```

---

**Deployment Date**: _______________
**Environment**: Production
**Version**: 1.0.0
**Deployed By**: _______________

---

## Important Contacts

- **Incident Commander**: +91-XXXXXXXXXX
- **On-Call Engineer**: +91-XXXXXXXXXX
- **Database Admin**: +91-XXXXXXXXXX
- **DevOps Lead**: +91-XXXXXXXXXX

## Quick Links

- Dashboard: https://yourdomain.com/admin
- API Docs: https://api.yourdomain.com/api
- Monitoring: https://monitoring.yourdomain.com
- Error Tracking: https://sentry.yourdomain.com
- Database Admin: https://cloud.mongodb.com
