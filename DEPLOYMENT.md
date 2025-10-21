# HealthBuddy Deployment Guide

## Overview

This guide provides instructions for deploying the HealthBuddy application to production environments on both iOS and Android platforms.

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ and pnpm installed
- MySQL database (TiDB or compatible)
- Stripe account for payment processing
- OAuth provider credentials (Manus OAuth)
- Apple Developer account (for iOS deployment)
- Google Play Developer account (for Android deployment)
- Environment variables configured

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Application
VITE_APP_ID=your-app-id
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://your-domain.com/logo.png

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# LLM & APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Owner
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id
```

## Web Deployment

### Build for Production

```bash
pnpm install
pnpm build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Other Platforms

The application can be deployed to any Node.js hosting platform:

**AWS Elastic Beanstalk**:
```bash
eb init
eb create healthbuddy-env
eb deploy
```

**Heroku**:
```bash
heroku create healthbuddy
git push heroku main
```

**Docker**:
```bash
docker build -t healthbuddy .
docker run -p 3000:3000 healthbuddy
```

## Mobile Deployment

### iOS Deployment

**Prerequisites**:
- Xcode 14+
- Apple Developer account
- iOS deployment certificate

**Steps**:

1. Install dependencies:
```bash
pnpm install
```

2. Build for iOS:
```bash
pnpm build:ios
```

3. Open in Xcode:
```bash
open ios/HealthBuddy.xcworkspace
```

4. Configure signing:
   - Select your development team
   - Update bundle identifier
   - Configure provisioning profiles

5. Build and archive:
   - Product → Archive
   - Validate with App Store Connect
   - Upload to App Store

### Android Deployment

**Prerequisites**:
- Android Studio
- Google Play Developer account
- Keystore file for signing

**Steps**:

1. Install dependencies:
```bash
pnpm install
```

2. Build for Android:
```bash
pnpm build:android
```

3. Generate signed APK/AAB:
```bash
cd android
./gradlew bundleRelease
```

4. Upload to Google Play Console:
   - Create new release
   - Upload AAB file
   - Configure store listing
   - Submit for review

## Database Setup

### Initialize Database

```bash
# Run migrations
pnpm db:push

# Seed initial data (optional)
pnpm db:seed
```

### Backup Strategy

Implement regular backups:

```bash
# Daily backup to S3
0 2 * * * mysqldump -u user -p database | gzip | aws s3 cp - s3://backups/healthbuddy-$(date +\%Y\%m\%d).sql.gz
```

## SSL/TLS Configuration

Ensure HTTPS is enabled:

```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --standalone -d your-domain.com

# Configure in environment
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

## Performance Optimization

### Enable Compression

```bash
# In production server
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### CDN Configuration

Configure CloudFlare or similar CDN:

1. Add domain to CDN
2. Update DNS records
3. Enable caching rules
4. Configure cache TTL

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_userProfiles_userId ON userProfiles(userId);
CREATE INDEX idx_healthTracking_userId_createdAt ON healthTracking(userId, createdAt);
```

## Monitoring & Logging

### Application Monitoring

Use monitoring tools like:

- **New Relic**: APM and infrastructure monitoring
- **Datadog**: Distributed tracing
- **Sentry**: Error tracking

### Log Aggregation

```bash
# Configure log shipping
LOG_LEVEL=info
LOG_FORMAT=json
LOG_DESTINATION=https://logs.your-domain.com
```

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set securely
- [ ] Database credentials are not in version control
- [ ] SSL/TLS certificates are valid
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] SQL injection protection is active
- [ ] CSRF tokens are configured
- [ ] Security headers are set
- [ ] Regular security audits are scheduled

## Post-Deployment

### Verify Deployment

```bash
# Test API endpoints
curl https://your-domain.com/api/trpc/auth.me

# Check database connectivity
npm run db:check

# Monitor logs
tail -f logs/production.log
```

### Health Checks

Implement health check endpoint:

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

### Rollback Procedure

If issues occur:

```bash
# Revert to previous version
git revert HEAD
pnpm build
# Redeploy
```

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      - name: Deploy
        run: |
          # Your deployment command here
```

## Troubleshooting

### Common Issues

**Database Connection Error**:
```bash
# Verify connection string
mysql -u user -p -h host database
```

**LLM Service Timeout**:
- Increase timeout in environment
- Check API key validity
- Verify network connectivity

**Payment Processing Failures**:
- Verify Stripe keys
- Check webhook configuration
- Review transaction logs

## Support & Maintenance

For ongoing support:

- Monitor application logs
- Review performance metrics
- Update dependencies regularly
- Conduct security audits
- Plan capacity upgrades

## Contact

For deployment issues, contact the development team or refer to the main README.md.

