---
title: "WebSockets vs Server-Sent Events: Building Real-Time Features"
date: "October 28, 2025"
category: "web-development"
tags: ["websockets", "sse", "real-time", "nodejs"]
excerpt: "A deep dive into real-time communication patterns on the web. When to use WebSockets, when Server-Sent Events are better, and how to implement both in production applications."
---

Real-time features are everywhere now. Chat apps, live notifications, collaborative editing, stock tickers. But how do you actually build them? Two main technologies: WebSockets and Server-Sent Events (SSE).

I've built chat systems with both. Here's what I learned.

## The HTTP Problem

Traditional HTTP is request-response. Client asks, server answers. Done.

But what if you want the server to push updates to the client? Like new messages in a chat, or live scores in a sports app?

You could poll. Send a request every second: "Any new messages?" This works, but it's wasteful. Most requests return nothing new. You're hammering your server for no reason.

Enter real-time communication.

## WebSockets: Full-Duplex Communication

WebSockets are a persistent, bidirectional connection between client and server. Once established, both sides can send messages anytime.

### How WebSockets Work

1. Client sends HTTP upgrade request
2. Server agrees and upgrades connection to WebSocket protocol
3. Connection stays open
4. Both sides can send messages freely
5. Connection closes when either side disconnects

### Basic WebSocket Implementation

**Server (Node.js with ws library):**

```javascript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  clients.add(ws);

  // Handle incoming messages
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    
    // Parse message
    const message = JSON.parse(data.toString());
    
    // Broadcast to all clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'message',
          user: message.user,
          text: message.text,
          timestamp: Date.now()
        }));
      }
    });
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    text: 'Welcome to the chat!'
  }));
});

console.log('WebSocket server running on ws://localhost:8080');
```

**Client (Browser):**

```javascript
class ChatClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from server');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  handleMessage(message) {
    if (message.type === 'message') {
      this.displayMessage(message);
    } else if (message.type === 'system') {
      this.displaySystemMessage(message.text);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const chat = new ChatClient('ws://localhost:8080');
chat.connect();

// Send message
document.querySelector('#send-btn').addEventListener('click', () => {
  const input = document.querySelector('#message-input');
  chat.send({
    user: 'Alice',
    text: input.value
  });
  input.value = '';
});
```

## Server-Sent Events: One-Way Push

SSE is simpler. Server pushes updates to client over HTTP. Client can't send messages back through the same connection (it uses regular HTTP requests for that).

### How SSE Works

1. Client opens HTTP connection with `Accept: text/event-stream`
2. Server keeps connection open
3. Server sends events as text
4. Client receives events and fires JavaScript events
5. Connection auto-reconnects if dropped

### Basic SSE Implementation

**Server (Node.js with Express):**

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// Store connected clients
const clients = new Map();

// SSE endpoint
app.get('/events', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // Generate client ID
  const clientId = Date.now();
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

  // Store client
  clients.set(clientId, res);

  // Send heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

// Endpoint to trigger events
app.post('/notify', express.json(), (req, res) => {
  const { message } = req.body;

  // Broadcast to all connected clients
  clients.forEach((client, clientId) => {
    client.write(`data: ${JSON.stringify({
      type: 'notification',
      message,
      timestamp: Date.now()
    })}\n\n`);
  });

  res.json({ success: true, clients: clients.size });
});

app.listen(3000, () => {
  console.log('SSE server running on http://localhost:3000');
});
```

**Client (Browser):**

```javascript
class NotificationClient {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.reconnectAttempts = 0;
  }

  connect() {
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      console.log('Connected to SSE server');
      this.reconnectAttempts = 0;
    };

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleEvent(data);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      
      if (this.eventSource.readyState === EventSource.CLOSED) {
        this.reconnect();
      }
    };
  }

  handleEvent(data) {
    if (data.type === 'connected') {
      console.log('Client ID:', data.clientId);
    } else if (data.type === 'notification') {
      this.showNotification(data.message);
    }
  }

  showNotification(message) {
    // Display notification to user
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
  }

  reconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * this.reconnectAttempts, 10000);
    console.log(`Reconnecting in ${delay}ms...`);
    
    setTimeout(() => {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}

// Usage
const notifications = new NotificationClient('http://localhost:3000/events');
notifications.connect();
```

## WebSockets vs SSE: When to Use What

### Use WebSockets When:

1. **You need bidirectional communication**
   - Chat applications
   - Multiplayer games
   - Collaborative editing (Google Docs style)
   - Video calls with signaling

2. **Low latency is critical**
   - Trading platforms
   - Live gaming
   - Real-time dashboards with user interactions

3. **Binary data transfer**
   - File uploads with progress
   - Audio/video streaming
   - Protocol buffers

### Use SSE When:

1. **You only need server → client updates**
   - Notifications
   - News feeds
   - Stock tickers
   - Live sports scores
   - Server monitoring dashboards

2. **You want automatic reconnection**
   - SSE has built-in reconnection
   - WebSockets need manual implementation

3. **You're behind strict firewalls/proxies**
   - SSE is just HTTP
   - Some proxies block WebSocket upgrades

4. **You want simpler implementation**
   - SSE is much simpler to set up
   - No special protocol, just HTTP

## Real-World Example: Chat Application

I built a chat app using both. Here's what I learned.

### With WebSockets:

**Pros:**
- Instant message delivery both ways
- Lower overhead per message
- Perfect for typing indicators
- Can send binary data (file uploads)

**Cons:**
- More complex server code
- Need to handle reconnection manually
- Load balancing is trickier (need sticky sessions)

### With SSE:

**Pros:**
- Simple server code
- Automatic reconnection
- Works through proxies
- Easy to load balance (stateless)

**Cons:**
- Client needs separate HTTP requests to send messages
- Slightly higher latency
- No binary data support

I went with WebSockets because I wanted typing indicators and file uploads. But for a simpler notification system, SSE would've been perfect.

## Production Considerations

### Scaling WebSockets

WebSockets are stateful. Each connection lives on one server. To scale:

**Option 1: Redis Pub/Sub**

```javascript
import Redis from 'ioredis';

const pub = new Redis();
const sub = new Redis();

// Subscribe to broadcast channel
sub.subscribe('chat-messages');

sub.on('message', (channel, message) => {
  // Broadcast to local WebSocket clients
  const data = JSON.parse(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

// When receiving message from client
ws.on('message', (data) => {
  // Publish to Redis so all servers receive it
  pub.publish('chat-messages', data);
});
```

**Option 2: Sticky Sessions**

Use NGINX with `ip_hash`:

```nginx
upstream websocket_backend {
    ip_hash;
    server backend1:8080;
    server backend2:8080;
    server backend3:8080;
}
```

### Scaling SSE

SSE is easier to scale because it's stateless. Use a message queue:

```javascript
import { Queue } from 'bullmq';
import { createClient } from 'redis';

const redis = createClient();
const queue = new Queue('notifications', { connection: redis });

// Producer: Add notification to queue
app.post('/notify', async (req, res) => {
  await queue.add('send-notification', {
    message: req.body.message
  });
  res.json({ success: true });
});

// Consumer: Send to SSE clients
queue.process('send-notification', async (job) => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(job.data)}\n\n`);
  });
});
```

## Monitoring and Debugging

### WebSocket Monitoring

```javascript
wss.on('connection', (ws, req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  console.log(`Connection from ${ip}`);
  
  // Track metrics
  metrics.increment('websocket.connections');
  
  ws.on('close', () => {
    metrics.decrement('websocket.connections');
  });
  
  ws.on('message', (data) => {
    metrics.increment('websocket.messages.received');
    metrics.histogram('websocket.message.size', data.length);
  });
});
```

### SSE Monitoring

```javascript
app.get('/events', (req, res) => {
  // Track connection
  metrics.increment('sse.connections');
  
  req.on('close', () => {
    metrics.decrement('sse.connections');
    metrics.histogram('sse.connection.duration', Date.now() - startTime);
  });
});
```

## Security Considerations

### WebSocket Security

1. **Validate Origin:**
```javascript
wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    ws.close(1008, 'Origin not allowed');
    return;
  }
});
```

2. **Use Authentication:**
```javascript
wss.on('connection', (ws, req) => {
  const token = new URL(req.url, 'ws://localhost').searchParams.get('token');
  
  if (!verifyToken(token)) {
    ws.close(1008, 'Unauthorized');
    return;
  }
});
```

3. **Rate Limiting:**
```javascript
const rateLimiters = new Map();

ws.on('message', (data) => {
  const limiter = getRateLimiter(clientId);
  
  if (!limiter.tryConsume(1)) {
    ws.send(JSON.stringify({ error: 'Rate limit exceeded' }));
    return;
  }
  
  // Process message
});
```

### SSE Security

Same principles apply—validate origin, authenticate, rate limit.

## Conclusion

WebSockets and SSE both solve the real-time problem, but differently:

- **WebSockets**: Full bidirectional communication, more complex
- **SSE**: Simple server-to-client push, easier to implement

Choose based on your needs:
- Need two-way chat? → WebSockets
- Just pushing notifications? → SSE
- Binary data? → WebSockets
- Simple setup? → SSE

I've used both in production. Both work great when used for the right job.

Start with SSE if you're unsure. You can always upgrade to WebSockets later if needed.

Now go build something real-time.
