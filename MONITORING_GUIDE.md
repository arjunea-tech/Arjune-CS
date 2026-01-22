# Monitoring and Alerting Guide

Production monitoring configuration for CrackerShop application.

## Monitoring Stack

### Recommended Tools
- **Application Monitoring**: New Relic / Datadog / Elastic APM
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot / Pingdom
- **Log Aggregation**: ELK Stack / Cloudflare Logs
- **Metrics**: Prometheus + Grafana
- **Alerting**: PagerDuty / Opsgenie

## Backend Monitoring

### Health Checks
```bash
# Health endpoint
curl https://api.yourdomain.com/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-21T10:00:00.000Z",
  "environment": "production"
}
```

### Key Metrics to Monitor

#### Application Metrics
- Response time (p50, p95, p99)
- Request rate (requests/sec)
- Error rate (5xx errors)
- Active connections
- Memory usage
- CPU usage
- Disk I/O
- Database query times

#### Business Metrics
- Orders per hour
- Payment success rate
- User registrations
- Conversion rate
- Average order value
- Cart abandonment rate

#### Database Metrics
- Connection pool utilization
- Query execution time
- Slow query log
- Replication lag
- Disk space usage
- Backup success

### Alert Thresholds

```json
{
  "response_time": {
    "warning": 500,    // ms
    "critical": 1000   // ms
  },
  "error_rate": {
    "warning": 1,      // %
    "critical": 5      // %
  },
  "memory_usage": {
    "warning": 80,     // %
    "critical": 95     // %
  },
  "cpu_usage": {
    "warning": 70,     // %
    "critical": 90     // %
  },
  "disk_usage": {
    "warning": 75,     // %
    "critical": 90     // %
  },
  "database_connections": {
    "warning": 80,     // %
    "critical": 95     // % of pool
  },
  "error_count": {
    "warning": 10,     // errors/5min
    "critical": 50     // errors/5min
  }
}
```

## Frontend Monitoring

### Web Vitals
```javascript
// Track Core Web Vitals
import web from 'web-vitals';

web.getCLS(console.log);  // Cumulative Layout Shift
web.getFID(console.log);  // First Input Delay
web.getFCP(console.log);  // First Contentful Paint
web.getLCP(console.log);  // Largest Contentful Paint
web.getTTFB(console.log); // Time to First Byte
```

### Error Tracking with Sentry
```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
  environment: 'production',
  beforeSend(event) {
    // Filter out certain errors
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.value?.includes('Network request failed')) {
        return null;
      }
    }
    return event;
  }
});
```

### Performance Monitoring
```javascript
// Track slow requests
const logSlowRequest = (duration, endpoint) => {
  if (duration > 3000) { // 3 seconds
    console.warn(`Slow request: ${endpoint} took ${duration}ms`);
  }
};
```

## Log Monitoring

### Log Levels
```
FATAL: System is unusable
ERROR: Error condition
WARN: Warning condition
INFO: Informational message
DEBUG: Debug-level message
TRACE: Trace-level message (very detailed)
```

### Important Logs to Monitor
```
- Authentication failures
- Authorization denials
- Payment processing errors
- Database connection errors
- File upload failures
- Rate limit violations
- Unhandled exceptions
- API timeout errors
- Cache miss rates
```

### Log Aggregation Query Examples

#### Error Rate
```
level:ERROR | stats count() as error_count
```

#### Failed Logins
```
endpoint:"/api/v1/auth/login" status:401 | stats count() as failed_logins
```

#### Slow Queries
```
query_time > 1000 | stats avg(query_time) as avg_duration
```

#### Payment Failures
```
endpoint:"/api/v1/orders" status:500 | stats count() as payment_errors
```

## Alerting Rules

### Critical Alerts (Immediate Notification)
```
1. API response time > 2000ms for 5 minutes
2. Error rate > 5% for 2 minutes
3. Database connection fails
4. Out of disk space
5. Memory usage > 90%
6. CPU usage > 90%
7. Payment processing down
```

### Warning Alerts (Page/Email)
```
1. API response time > 500ms for 10 minutes
2. Error rate > 1% for 5 minutes
3. Memory usage > 80%
4. Disk usage > 75%
5. Database query time > 1000ms
6. High network latency
7. Backup failed
```

### Info Alerts (Dashboard Only)
```
1. Deployment completed
2. Backup completed
3. New releases detected
4. Rate limit threshold reached
```

## Dashboards

### Executive Dashboard
- Business metrics overview
- Uptime percentage
- Error rate trends
- Revenue metrics
- User growth

### Operations Dashboard
- System health status
- Resource utilization
- Active alerts
- Recent deployments
- Performance trends

### Development Dashboard
- Error details
- API response times
- Database performance
- Cache hit rates
- Request volume

### Security Dashboard
- Failed login attempts
- Rate limit violations
- Suspicious activities
- API abuse detection
- Data access logs

## Incident Response

### Severity Levels
```
P1 (Critical): Service down, data loss, security breach
P2 (High): Significant functionality impaired, performance degradation
P3 (Medium): Minor functionality issues, workaround available
P4 (Low): Documentation issues, cosmetic problems
```

### Incident Response Procedure
1. **Detection**: Alert triggers
2. **Notification**: Page on-call engineer
3. **Investigation**: Check logs and metrics
4. **Mitigation**: Apply temporary fix
5. **Communication**: Update stakeholders
6. **Resolution**: Fix root cause
7. **Post-Mortem**: Document and learn

## SLA Targets

```
Availability: 99.5% uptime
Response Time: < 200ms (p95)
Error Rate: < 0.1%
MTTR (Mean Time To Resolve): < 15 minutes
MTTD (Mean Time To Detect): < 1 minute
RTO (Recovery Time Objective): < 1 hour
RPO (Recovery Point Objective): < 5 minutes
```

## Maintenance Windows

```
Scheduled Maintenance: Every Sunday 2:00 AM - 4:00 AM UTC
Database Optimization: Every Monday 1:00 AM - 3:00 AM UTC
Security Updates: As needed, communicated 48 hours in advance
```

## Runbooks

### Common Issues and Solutions

#### High API Response Time
```
1. Check database query performance
2. Review application logs
3. Check server resource usage
4. Verify network latency
5. Scale horizontally if needed
```

#### High Error Rate
```
1. Check error logs for patterns
2. Review recent deployments
3. Check external service status
4. Verify database connectivity
5. Check rate limiting
```

#### Database Connection Failures
```
1. Verify network connectivity
2. Check MongoDB Atlas status
3. Review IP whitelist
4. Check connection pool settings
5. Restart database connection
```

#### Payment Processing Down
```
1. Check payment gateway status
2. Verify API credentials
3. Check rate limiting
4. Review transaction logs
5. Contact payment provider
```

## Backup Monitoring

### Backup Verification
```bash
# Verify backup exists
aws s3 ls s3://crackershop-backups/

# Check backup size
aws s3 ls s3://crackershop-backups/ --recursive --summarize

# Test restore procedure
mongorestore --uri "mongodb+srv://..." /backup/path
```

### Backup Alerts
- [ ] Backup failed
- [ ] Backup older than 24 hours
- [ ] Backup storage size exceeded threshold
- [ ] Restore test failed

## Monitoring Best Practices

1. **Alert Fatigue**: Avoid too many alerts, focus on actionable items
2. **Baselines**: Establish normal baselines before alerting
3. **Testing**: Test alert channels regularly
4. **Documentation**: Document all alerts and thresholds
5. **Review**: Monthly review of alert effectiveness
6. **Escalation**: Clear escalation paths for critical issues
7. **Training**: Train team on incident response procedures

## Tools Installation

### Sentry (Error Tracking)
```bash
# Backend
npm install @sentry/node

# Frontend
npm install @sentry/react-native
```

### Prometheus (Metrics)
```bash
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz

# Configure scrape targets
# Edit prometheus.yml with backend metrics endpoint
```

### Grafana (Visualization)
```bash
# Docker
docker run -d -p 3000:3000 grafana/grafana

# Access at http://localhost:3000
```

## Contact Information

- **On-Call Engineer**: +91-XXXXXXXXXX
- **Operations Lead**: +91-XXXXXXXXXX
- **Database Admin**: +91-XXXXXXXXXX
- **Incident Commander**: +91-XXXXXXXXXX

---

**Last Updated**: January 21, 2026
**Version**: 1.0.0
