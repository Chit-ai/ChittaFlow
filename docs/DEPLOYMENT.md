# Deployment Guide - Chit.ai

This guide provides step-by-step instructions for deploying Chit.ai to production environments.

## 🌐 Production Deployment Options

### Option 1: Cloud Platform Deployment (Recommended)

#### Backend Deployment on Heroku

1. **Prepare the application**
   ```bash
   # Create Procfile
   echo "web: python src/main.py" > ai-agent-platform/Procfile
   
   # Create runtime.txt
   echo "python-3.11.0" > ai-agent-platform/runtime.txt
   ```

2. **Deploy to Heroku**
   ```bash
   cd ai-agent-platform
   heroku create your-app-name-backend
   heroku addons:create heroku-postgresql:hobby-dev
   git add .
   git commit -m "Prepare for deployment"
   git push heroku main
   ```

3. **Configure environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-production-secret-key
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set OPENAI_API_KEY=your-openai-key
   ```

#### Frontend Deployment on Vercel

1. **Build the application**
   ```bash
   cd ai-agent-frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure environment variables**
   - Set `VITE_API_BASE_URL` to your backend URL
   - Configure any other environment-specific variables

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=src/main.py
ENV FLASK_ENV=production

# Run the application
CMD ["python", "src/main.py"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./ai-agent-platform
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/aiagents
      - SECRET_KEY=your-secret-key
    depends_on:
      - db

  frontend:
    build: ./ai-agent-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=aiagents
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize and deploy backend**
   ```bash
   cd ai-agent-platform
   eb init
   eb create production-backend
   eb deploy
   ```

3. **Deploy frontend to S3 + CloudFront**
   ```bash
   cd ai-agent-frontend
   npm run build
   aws s3 sync dist/ s3://your-bucket-name
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## 🔧 Production Configuration

### Environment Variables

#### Backend (.env)
```env
# Production Database
DATABASE_URL=postgresql://username:password@host:port/database

# Security
SECRET_KEY=your-very-secure-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key

# AI Services
OPENAI_API_KEY=your-openai-api-key
LANGCHAIN_API_KEY=your-langchain-api-key

# Application Settings
FLASK_ENV=production
DEBUG=False

# CORS Settings
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=AI Agent Platform
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=your-google-analytics-id
```

### Database Migration

#### PostgreSQL Setup
```sql
-- Create production database
CREATE DATABASE aiagents_production;
CREATE USER aiagents_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE aiagents_production TO aiagents_user;
```

#### Migration Script
```python
# migrate_to_production.py
import os
from src.main import app, db

def migrate_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Seed initial data
        from src.routes.template import seed_templates
        seed_templates()
        
        print("Database migration completed successfully!")

if __name__ == "__main__":
    migrate_database()
```

## 🔒 Security Configuration

### SSL/TLS Setup

#### Using Let's Encrypt with Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Security Headers
```python
# Add to Flask app
from flask_talisman import Talisman

Talisman(app, {
    'force_https': True,
    'strict_transport_security': True,
    'content_security_policy': {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline'",
        'style-src': "'self' 'unsafe-inline'",
    }
})
```

## 📊 Monitoring Setup

### Application Monitoring

#### Sentry Integration
```python
# Backend monitoring
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

```javascript
// Frontend monitoring
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

#### Health Check Endpoints
```python
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }

@app.route('/ready')
def readiness_check():
    try:
        # Check database connection
        db.session.execute('SELECT 1')
        return {'status': 'ready'}
    except Exception as e:
        return {'status': 'not ready', 'error': str(e)}, 503
```

### Infrastructure Monitoring

#### Using DataDog
```yaml
# datadog-agent.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: datadog-agent
spec:
  template:
    spec:
      containers:
      - name: datadog-agent
        image: datadog/agent:latest
        env:
        - name: DD_API_KEY
          value: "your-datadog-api-key"
        - name: DD_SITE
          value: "datadoghq.com"
```

## 🚀 Performance Optimization

### Backend Optimization

#### Database Optimization
```python
# Add database indexes
class Agent(db.Model):
    __tablename__ = 'agents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    agent_type = db.Column(db.String(50), index=True)
    is_active = db.Column(db.Boolean, default=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
```

#### Caching with Redis
```python
import redis
from flask_caching import Cache

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': 'redis://localhost:6379/0'
})

@app.route('/api/templates')
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_templates():
    return jsonify(AgentTemplate.query.all())
```

### Frontend Optimization

#### Code Splitting
```javascript
// Lazy load components
import { lazy, Suspense } from 'react'

const Analytics = lazy(() => import('./components/Analytics'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Analytics />
    </Suspense>
  )
}
```

#### Bundle Optimization
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.11'
    - name: Install dependencies
      run: |
        pip install -r ai-agent-platform/requirements.txt
    - name: Run tests
      run: |
        cd ai-agent-platform
        python -m pytest

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name-backend"
        heroku_email: "your-email@example.com"
        appdir: "ai-agent-platform"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Install and build
      run: |
        cd ai-agent-frontend
        npm ci
        npm run build
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./ai-agent-frontend
```

## 🔧 Maintenance

### Backup Strategy
```bash
#!/bin/bash
# backup.sh - Daily database backup

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="aiagents_production"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Log Rotation
```bash
# /etc/logrotate.d/aiagent-platform
/var/log/aiagent-platform/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### Update Procedure
```bash
#!/bin/bash
# update.sh - Production update script

echo "Starting production update..."

# Backup database
./backup.sh

# Pull latest code
git pull origin main

# Update backend
cd ai-agent-platform
source venv/bin/activate
pip install -r requirements.txt

# Update frontend
cd ../ai-agent-frontend
npm ci
npm run build

# Restart services
sudo systemctl restart aiagent-backend
sudo systemctl restart nginx

echo "Update completed successfully!"
```

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```python
# Check database connectivity
def check_db_connection():
    try:
        db.session.execute('SELECT 1')
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
```

#### Memory Issues
```bash
# Monitor memory usage
free -h
ps aux --sort=-%mem | head

# Restart services if needed
sudo systemctl restart aiagent-backend
```

#### SSL Certificate Issues
```bash
# Renew Let's Encrypt certificates
sudo certbot renew --dry-run
sudo certbot renew
sudo systemctl restart nginx
```

### Monitoring Commands
```bash
# Check service status
sudo systemctl status aiagent-backend
sudo systemctl status nginx

# View logs
sudo journalctl -u aiagent-backend -f
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Monitor network connections
netstat -tulpn | grep :5000
```

## 📞 Support

For deployment issues:
- Check the troubleshooting section above
- Review application logs
- Contact support at support@aiagentplatform.com
- Create an issue on GitHub

---

**Deployment Guide v1.0**  
*Last updated: June 2025*

