## Overview

A comprehensive gym management platform built with microservices architecture, enabling seamless operations for members, trainers, and administrators. The system features real-time analytics, automated workflows, and role-based dashboards deployed through Docker containerization and CI/CD pipelines.

## Key Features

- **Multi-Role Dashboards** — Personalized interfaces for members, trainers, and administrators with role-specific functionality
- **Real-Time Analytics** — Live tracking of attendance, revenue trends, and member engagement metrics
- **Class Management** — Complete scheduling system for booking, managing, and tracking fitness classes
- **Payment Integration** — Automated membership billing and subscription management
- **Progress Tracking** — Visual analytics for member fitness goals and performance metrics

## Technical Architecture

Built on a microservices architecture with five independent services: Authentication, Member Management, Trainer Management, Payment Processing, and Analytics. Each service runs in isolated Docker containers, coordinated through NGINX as a reverse proxy and load balancer.

### Technology Stack

**Frontend** — React with TypeScript, Tailwind CSS, Recharts for data visualization

**Backend** — Node.js/Express microservices with RESTful APIs, JWT authentication, PostgreSQL for data persistence, Redis for caching

**DevOps** — Docker containers, NGINX load balancing, GitHub Actions CI/CD, automated deployment to Vercel

## Implementation Highlights

### Microservices Architecture

The distributed architecture enables independent scaling and deployment of each service. NGINX handles request routing, SSL termination, and load distribution across service instances. This design ensures fault isolation—issues in one service don't affect the entire system.

### Real-Time Dashboard

Built custom data visualization using Recharts for attendance trends, revenue analysis, and membership distribution. The dashboard aggregates data from multiple services to provide comprehensive insights for administrators.

### CI/CD Pipeline

Automated workflow using GitHub Actions: code push triggers Docker image builds, runs automated tests, pushes to container registry, and deploys to production. This ensures reliable, consistent deployments.

## Security & Performance

Implemented JWT-based authentication with role-based access control, bcrypt password hashing, and API rate limiting. Performance optimizations include Redis caching for frequently accessed data, PostgreSQL indexing, and React code splitting for faster load times.
