## Overview

A real-time collaborative code sharing platform that enables developers to share, edit, and collaborate on code snippets instantly. SnippetSync includes a VS Code extension for seamless integration with your development workflow, making code sharing as simple as a keyboard shortcut.

## Key Features

- **Real-Time Collaboration** — Live cursors, instant synchronization, and multi-user editing with conflict resolution
- **VS Code Extension** — Share code directly from your editor with keyboard shortcuts and context menu integration
- **Monaco Editor** — Full-featured code editor with syntax highlighting for 50+ languages
- **WebSocket Sync** — Changes propagate across all connected clients with sub-50ms latency
- **Redis Pub/Sub** — Distributed architecture enabling horizontal scaling across multiple server instances

## Technical Architecture

Built with a distributed backend using Redis Pub/Sub for real-time event distribution. The frontend uses Monaco Editor (VS Code's editor) embedded in a React application, connected via Socket.io for bidirectional real-time communication.

### Technology Stack

**Frontend** — React with TypeScript, Monaco Editor, Socket.io Client, Tailwind CSS

**Backend** — Node.js/Express, Socket.io server, Redis Pub/Sub for event distribution, MongoDB for persistence

**Extension** — VS Code Extension API, TypeScript, WebSocket client for real-time sync

**DevOps** — Docker containers, Vercel for frontend, Railway for backend services

## Implementation Highlights

### Operational Transformation

Implemented OT algorithm to handle concurrent edits without conflicts. Local operations apply immediately for responsiveness, then transform against concurrent operations before broadcasting to other clients. This ensures all users see consistent state regardless of network latency.

### Redis Pub/Sub Architecture

Multiple WebSocket servers communicate through Redis Pub/Sub, enabling horizontal scaling. When a user edits on Server A, the change publishes to Redis, which broadcasts to all servers. This architecture supports thousands of concurrent users without a single point of failure.

### VS Code Extension

Built a full-featured extension that reads editor content, detects programming language, uploads to the SnippetSync API, and opens a browser with a shareable link. The extension includes commands for sharing selections, entire files, and managing your snippet library.

## Real-Time Synchronization

The system broadcasts cursor positions (debounced to 16ms), text changes (using operational transformation), and user presence (join/leave events). WebSocket events flow bidirectionally: clients send operations to the server, which transforms and broadcasts to all other clients in the room.

## Security & Performance

JWT authentication with shareable access tokens, HTTPS encryption, and API rate limiting. Performance optimizations include cursor event debouncing, operation batching for multiple changes, Redis caching for popular snippets, and MongoDB indexing for fast queries.
