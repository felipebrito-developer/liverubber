---
title: "Service Roadmap"
description: "Detailed progress and next steps for the Node.js backend and MCP services."
workspace: "apps/service"
tags:
  - nodejs
  - drizzle
  - sqlite
  - mcp
priority: 2
---

# ⚙️ Service Roadmap

## ✅ Completed
- [x] Node.js 22+ initialization via Bun.
- [x] SQLite schema design and migrations.
- [x] MCP Server setup for tool exposure.
- [x] Standard Drizzle ORM integration for type-safe queries.

## 🚧 In Progress
- [ ] Implement remaining repositories: `habit`, `activity_log`, `resource`.
- [ ] Expose all repositories as MCP Tools.
- [ ] Batch sync logic for high-latency mobile environments.

## 📋 Backlog
- [ ] Redis caching layer for frequent AI-Bridge requests.
- [ ] Automated integration testing for the MCP tool layer.
