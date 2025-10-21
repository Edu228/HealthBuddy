# HealthBuddy Production Deployment Guide

This guide provides detailed instructions for deploying HealthBuddy to production environments.

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] All environment variables configured
- [ ] Database backups in place
- [ ] SSL/TLS certificates ready
- [ ] Stripe production keys obtained
- [ ] OAuth production credentials configured
- [ ] LLM API keys validated
- [ ] Monitoring and logging set up
- [ ] Backup and disaster recovery plan in place

## Deployment Options

### Option 1: Vercel (Recommended for Quick Setup)

Vercel provides the easiest deployment path for Node.js applications with automatic scaling and global CDN.

**Prerequisites:**
- Vercel account ([sign up](https://vercel.com))
- GitHub repository connected

**Steps:**

1. **Connect Repository**: Push your code to GitHub and connect the repository to Vercel.

2. **Configure Environment Variables**: In Vercel dashboard, add all required environment variables:
   ```
   DATABASE_URL
   JWT_SECRET
   OAUTH_SERVER_URL
   VITE_OAUTH_PORTAL_URL
   VITE_APP_ID
   VITE_APP_TITLE
   VITE_APP_LOGO
   BUILT_IN_FORGE_API_URL
   BUILT_IN_FORGE_API_KEY
   STRIPE_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY
   ```

3. **Deploy**: Click "Deploy" button. Vercel automatically builds and deploys your application.

4. **Custom Domain**: Add your custom domain in Vercel settings.

5. **Monitoring**: Enable Vercel Analytics for performance monitoring.

**Pros:**
- Zero-configuration deployment
- Automatic SSL certificates
- Global CDN
- Automatic scaling
- Preview deployments for pull requests

**Cons:**
- Limited customization
- Potential vendor lock-in
- Costs scale with usage

### Option 2: Docker + AWS (ECS/Fargate)

For more control and scalability, deploy using Docker containers on AWS.

**Prerequisites:**
- AWS account
- Docker installed locally
- AWS CLI configured

**Steps:**

1. **Build Docker Image**:
   ```bash
   docker build -t healthbuddy:latest .
   ```

2. **Push to ECR** (Elastic Container Registry):
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name healthbuddy --region us-east-1

   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

   # Tag image
   docker tag healthbuddy:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/healthbuddy:latest

   # Push image
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/healthbuddy:latest
   ```

3. **Create RDS Database**:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier healthbuddy-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password <STRONG_PASSWORD> \
     --allocated-storage 20
   ```

4. **Create ECS Cluster**:
   ```bash
   aws ecs create-cluster --cluster-name healthbuddy-cluster
   ```

5. **Create Task Definition**: Create `task-definition.json`:
   ```json
   {
     "family": "healthbuddy",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "healthbuddy",
         "image": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/healthbuddy:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "hostPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DATABASE_URL",
             "value": "mysql://user:password@healthbuddy-db.xxxxx.us-east-1.rds.amazonaws.com:3306/healthbuddy"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/healthbuddy",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

6. **Register Task Definition**:
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   ```

7. **Create Service**:
   ```bash
   aws ecs create-service \
     --cluster healthbuddy-cluster \
     --service-name healthbuddy-service \
     --task-definition healthbuddy \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}"
   ```

8. **Set Up Load Balancer**: Create an Application Load Balancer to distribute traffic.

9. **Configure Auto Scaling**: Set up auto-scaling policies based on CPU/memory metrics.

**Pros:**
- Full control over infrastructure
- Highly scalable
- Cost-effective for high-traffic applications
- Can integrate with other AWS services

**Cons:**
- More complex setup
- Requires AWS knowledge
- More operational overhead

### Option 3: Heroku

Heroku provides a simple platform for deploying Node.js applications.

**Prerequisites:**
- Heroku account ([sign up](https://www.heroku.com))
- Heroku CLI installed

**Steps:**

1. **Login to Heroku**:
   ```bash
   heroku login
   ```

2. **Create Heroku App**:
   ```bash
   heroku create healthbuddy
   ```

3. **Add Buildpacks**:
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

4. **Configure Environment Variables**:
   ```bash
   heroku config:set DATABASE_URL="mysql://..."
   heroku config:set JWT_SECRET="your-secret"
   # ... set all other variables
   ```

5. **Add MySQL Database** (using ClearDB):
   ```bash
   heroku addons:create cleardb:ignite
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **View Logs**:
   ```bash
   heroku logs --tail
   ```

**Pros:**
- Very simple deployment
- Automatic SSL
- Built-in logging and monitoring
- Easy to scale

**Cons:**
- Limited customization
- Can be expensive at scale
- Vendor lock-in

### Option 4: DigitalOcean App Platform

DigitalOcean provides a managed platform for deploying applications.

**Prerequisites:**
- DigitalOcean account ([sign up](https://www.digitalocean.com))
- GitHub repository connected

**Steps:**

1. **Create App**: In DigitalOcean console, click "Create" → "Apps".

2. **Connect Repository**: Select your GitHub repository.

3. **Configure Build Settings**: Set build command to `pnpm build`.

4. **Add Database**: Create a MySQL database cluster.

5. **Set Environment Variables**: Add all required environment variables.

6. **Deploy**: Click "Create App".

**Pros:**
- Affordable pricing
- Good documentation
- Simple interface
- Integrated database options

**Cons:**
- Less mature than AWS/Vercel
- Smaller community
- Limited advanced features

## Post-Deployment Tasks

### 1. Database Migrations

Run migrations on the production database:

```bash
# For Vercel
vercel env pull .env.production.local
pnpm db:push

# For Docker/AWS
docker exec healthbuddy-app pnpm db:push

# For Heroku
heroku run pnpm db:push
```

### 2. SSL/TLS Certificates

Ensure HTTPS is enabled:
- Vercel: Automatic
- AWS: Use AWS Certificate Manager
- Heroku: Automatic
- DigitalOcean: Automatic

### 3. Monitoring & Logging

Set up monitoring:
- **Application Monitoring**: Sentry for error tracking
- **Performance Monitoring**: New Relic or Datadog
- **Log Aggregation**: CloudWatch, LogDNA, or Papertrail
- **Uptime Monitoring**: Pingdom or UptimeRobot

### 4. Backup Strategy

Implement regular backups:
- **Database Backups**: Daily automated backups
- **Code Backups**: Git repository (already done)
- **Configuration Backups**: Store environment variables securely

### 5. Security Hardening

- [ ] Enable WAF (Web Application Firewall)
- [ ] Set up DDoS protection
- [ ] Configure security headers
- [ ] Enable rate limiting
- [ ] Set up API key rotation
- [ ] Enable audit logging

### 6. Performance Optimization

- [ ] Enable caching headers
- [ ] Set up CDN for static assets
- [ ] Optimize database queries
- [ ] Enable gzip compression
- [ ] Monitor and optimize response times

## Scaling Strategies

### Horizontal Scaling

Deploy multiple instances behind a load balancer:
- Vercel: Automatic
- AWS: Use Auto Scaling Groups
- Heroku: Use Dynos
- DigitalOcean: Use App Platform scaling

### Vertical Scaling

Increase resources for a single instance:
- Upgrade database instance size
- Increase memory/CPU allocation
- Use faster storage options

### Database Optimization

- Add read replicas for read-heavy workloads
- Implement caching layer (Redis)
- Optimize indexes
- Archive old data

## Troubleshooting

### Application Won't Start

1. Check logs: `heroku logs --tail` or `docker logs <container>`
2. Verify environment variables are set
3. Check database connectivity
4. Review error messages in logs

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Check database server is running
3. Ensure network connectivity
4. Verify credentials

### High Memory Usage

1. Check for memory leaks
2. Increase instance memory
3. Optimize database queries
4. Enable garbage collection monitoring

### Slow Response Times

1. Check database query performance
2. Enable caching
3. Optimize API endpoints
4. Use CDN for static assets

## Rollback Procedure

If deployment fails:

**Vercel:**
```bash
vercel rollback
```

**Heroku:**
```bash
heroku releases
heroku rollback v<VERSION>
```

**Docker/AWS:**
```bash
# Revert to previous image
aws ecs update-service \
  --cluster healthbuddy-cluster \
  --service healthbuddy-service \
  --force-new-deployment
```

## Monitoring Checklist

After deployment, monitor:

- [ ] Application health (uptime)
- [ ] Response times
- [ ] Error rates
- [ ] Database performance
- [ ] Memory usage
- [ ] CPU usage
- [ ] API quota usage
- [ ] Subscription payments
- [ ] User registrations
- [ ] Feature usage

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

For questions or issues, contact the development team or refer to the main DEPLOYMENT.md guide.

