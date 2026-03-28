---
title: "Workspace Mapping"
description: "Detailed monorepo directory tree and workspace-specific responsibilities."
workspace: "global"
tags:
  - structure
  - directory-map
  - organization
priority: 1
---

# Project Structure

## Architecture Summary
LiveRubber/
├── apps/
│   ├── mobile/            # React Native App (0.84)
│   ├── service/           # Node.js + SQLite Data Provider
│   └── ai-bridge/         # AI Router & Privacy Gateway
├── packages/
│   ├── shared/            # Shared Types & Zod Schemas
│   └── security/          # PII Scrubbing & Encryption
├── .agents/               # Agnostic Agent Configuration (Lean)
│   ├── personas/          # Specialist Protocols (SOT)
│   ├── rules/             # Global Orchestrator Laws
│   ├── tools/             # High-level tool descriptors
│   └── registry.json      # RBAC & Boundary Locks
├── docs/                  # Documentation & Roadmaps
├── skills-lock.json       # Skill dependency manifest
├── turbo.json
└── package.json


## Workspace Details

### AI-Bridge (`apps/ai-bridge`)
The "Brain" of the application. It handles all LLM interactions.
- Uses **Ollama** via the `ollama` provider for local privacy.
- Uses **Gemini Flash** for high-reasoning tasks.
- Connects to `service` via **MCP** to read/write to the database.

### Backend (`apps/service`)
Acts as the **Source of Truth** and **Data Provider**.
- `src/internal/mcp/server.ts`: The entry point for the MCP protocol.
- `src/internal/repository/sqlite/`: Standard repository pattern for SQLite.

### Security (`packages/security`)
- **Scrubber**: Utility to remove names/IDs from strings before cloud transmission.
- **Crypto**: Handles local data encryption.

## Tech Stack (Updated)
- **Local AI**: Ollama (DeepSeek-Coder / Llama 3).
- **Cloud AI**: Gemini 1.5 Flash (via Vercel AI SDK).
- **Protocol**: Model Context Protocol (MCP).
- **Runtime**: Bun 1.3+ (WSL2 with CUDA/GPU support).