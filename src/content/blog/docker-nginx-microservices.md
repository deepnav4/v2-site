---
title: Building Production-Ready Microservices with Docker and NGINX
date: November 15, 2025
category: devops
tags:
  - docker
  - nginx
  - microservices
  - devops
excerpt: >-
  From development to production: A complete guide to containerizing
  microservices with Docker, setting up NGINX as a reverse proxy, and
  implementing CI/CD pipelines.
---

Microservices are everywhere. But building them is one thing—deploying them to production is another beast entirely. Let me walk you through how I built a production-ready microservice architecture using Docker, NGINX, and GitHub Actions.

## The Problem

I had three Node.js services that needed to talk to each other. In development, they ran on different ports: 3000, 3001, 3002. Simple enough. But in production? Different story.

I needed:
- Load balancing across multiple instances
- SSL termination
- Reverse proxy to hide internal ports
- Container orchestration
- Zero-downtime deployments
- Automatic health checks

## Why Docker?

"Works on my machine" is the oldest joke in software development. Docker kills that joke dead.

With Docker, your app runs in a container—a lightweight, standalone executable package that includes everything: code, runtime, system tools, libraries. If it works in your Docker container locally, it'll work in production. Period.

### The Base Dockerfile

Here's how I containerized my Node.js services:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if needed (for TypeScript)
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## Multi-Stage Builds: Why They Matter

Notice the two `FROM` statements? That's a multi-stage build. Here's why it's brilliant:

The first stage (`builder`) has all the build tools—TypeScript compiler, dev dependencies, etc. The second stage only copies the compiled code and production dependencies.

Result? My final image went from 800MB to 150MB. Faster deploys, less storage, lower costs.

## Docker Compose for Development

During development, I use Docker Compose to run all services together:

```yaml
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./api:/app
      - /app/node_modules
    command: npm run dev

  worker:
    build:
      context: ./worker
      dockerfile: Dockerfile
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - ./worker:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api

volumes:
  postgres_data:
```

One command: `docker-compose up`. Everything starts. Database, cache, API, worker, reverse proxy. All connected, all talking to each other.

## Enter NGINX: The Reverse Proxy

NGINX sits in front of everything. Clients talk to NGINX. NGINX talks to your services. This gives you:

1. **Load balancing**: Distribute requests across multiple instances
2. **SSL termination**: Handle HTTPS at the edge
3. **Caching**: Cache responses to reduce backend load
4. **Security**: Hide internal service architecture

### Basic NGINX Configuration

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api_backend {
        least_conn;
        server api:3000 max_fails=3 fail_timeout=30s;
        server api_replica:3000 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 80;
        server_name api.example.com;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Logging
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        # API routes
        location /api/ {
            proxy_pass http://api_backend/;
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

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Load Balancing Strategies

NGINX supports multiple load balancing algorithms:

### Round Robin (Default)
```nginx
upstream backend {
    server api1:3000;
    server api2:3000;
}
```

### Least Connections
```nginx
upstream backend {
    least_conn;
    server api1:3000;
    server api2:3000;
}
```

### IP Hash (Session Persistence)
```nginx
upstream backend {
    ip_hash;
    server api1:3000;
    server api2:3000;
}
```

I use `least_conn` because my requests vary in processing time. Round robin would unevenly distribute load.

## SSL/TLS with Let's Encrypt

Production needs HTTPS. Let's Encrypt makes it free and automatic:

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://api_backend;
        # ... proxy settings
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}
```

## Health Checks and Graceful Shutdown

Docker containers should handle SIGTERM gracefully:

```javascript
// app.js
const app = express();
const server = app.listen(3000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connections
    db.close().then(() => {
      console.log('Database connections closed');
      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
});
```

NGINX health check:

```nginx
location /health {
    access_log off;
    proxy_pass http://api_backend/health;
    proxy_next_upstream error timeout http_500 http_502 http_503;
}
```

## CI/CD with GitHub Actions

Automate everything:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: username/app:latest,username/app:${{ github.sha }}
        cache-from: type=registry,ref=username/app:buildcache
        cache-to: type=registry,ref=username/app:buildcache,mode=max
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /opt/app
          docker-compose pull
          docker-compose up -d --no-deps --build
          docker system prune -f
```

## Monitoring and Logging

Production systems need observability:

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

## Lessons Learned

1. **Start with Docker Compose**: Get everything working locally first
2. **Use multi-stage builds**: Smaller images = faster deploys
3. **Health checks are critical**: NGINX needs to know which containers are healthy
4. **Graceful shutdown matters**: Don't drop connections during deploys
5. **Monitor everything**: You can't fix what you can't see

## Performance Tips

### 1. Use Alpine Linux Base Images
```dockerfile
FROM node:18-alpine
```
Alpine images are 5-10x smaller than regular ones.

### 2. Layer Caching
```dockerfile
# Copy package.json first
COPY package*.json ./
RUN npm install

# Then copy source code
COPY . .
```
Dependencies change less often than code. This optimizes rebuild times.

### 3. NGINX Caching
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/data {
    proxy_cache api_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503;
    proxy_pass http://api_backend;
}
```

## Conclusion

Docker and NGINX transformed my deployment story from "pray it works" to "confident deploys." The initial setup takes time, but once it's running, deployments become boring (in the best way).

Key takeaways:
- Containerize everything for consistency
- Use NGINX for routing, load balancing, and SSL
- Automate deploys with CI/CD
- Monitor and log everything
- Design for graceful shutdowns

Your infrastructure should be boring and reliable. Docker and NGINX get you there.

Now go build something production-ready. Update Done