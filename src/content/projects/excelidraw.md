## Overview

A collaborative whiteboard application inspired by Excalidraw, built entirely from scratch using the Canvas API. ExceliDraw enables multiple users to draw, design, and brainstorm together in real-time with smooth 60fps rendering. Built as a Turborepo monorepo demonstrating advanced Canvas manipulation, WebSocket synchronization, and modern frontend architecture.

## Key Features

- **Canvas From Scratch** — Custom rendering engine built directly on CanvasRenderingContext2D without any drawing libraries
- **Real-Time Collaboration** — Live cursors, instant synchronization, and conflict-free multi-user drawing
- **Full Drawing Suite** — Rectangles, circles, lines, arrows, freehand drawing, and text with customizable styling
- **Advanced Interactions** — Pan, zoom (10%-500%), select, resize, rotate, and transform objects with handles
- **Turborepo Monorepo** — Shared packages for types, UI components, and configurations across frontend and backend

## Technical Architecture

Built as a Turborepo monorepo with two apps (Next.js frontend, Node.js WebSocket server) and shared packages for UI components, TypeScript configs, and ESLint rules. The custom Canvas engine renders at 60fps using requestAnimationFrame with dirty rectangle optimization.

### Technology Stack

**Frontend** — Next.js 14 with App Router, React 18, TypeScript, vanilla Canvas API, Socket.io Client

**Backend** — Node.js/Express, Socket.io for WebSockets, in-memory state management

**Monorepo** — Turborepo for caching and parallel builds, pnpm workspaces for dependency management

## Implementation Highlights

### Canvas Rendering Engine

Built the entire rendering pipeline from scratch: custom object model for shapes, manual transformation matrices for pan/zoom, hit detection algorithms for click events, and optimized rendering loop at 60fps. Implemented dirty rectangles to only redraw changed regions and object culling to skip off-screen elements.

### Real-Time Synchronization

WebSocket events broadcast drawing operations to all connected users. Events include draw-start, draw-move, draw-end for continuous drawing, plus object-update and object-delete for modifications. The server maintains canvas state and syncs new users on join.

### Hit Detection Algorithm

Custom point-in-object testing with coordinate transformation. For each mouse click, transform point to object's local space (accounting for rotation), then check if point falls within object bounds. This enables precise selection even with rotated and scaled objects.

### Transformation System

Implemented zoom and pan using transformation matrices applied to the canvas context. Mouse coordinates transform from screen space to canvas space using inverse transformations, enabling accurate interaction regardless of zoom level.

## Turborepo Workflow

The monorepo structure enables code sharing between frontend and backend. Shared packages include TypeScript types for canvas objects, UI components like ColorPicker and Toolbar, and configuration files for ESLint and TypeScript. Turborepo caches build outputs and runs tasks in parallel for fast builds.

## Performance Optimization

Achieved consistent 60fps with 1000+ objects through several optimizations: dirty rectangle rendering (only redraw changed regions), object culling (skip off-screen objects), debounced cursor updates (16ms intervals), and separate canvas layers for static vs dynamic content.
