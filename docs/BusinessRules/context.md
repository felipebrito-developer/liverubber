---
title: "Project Context"
description: "Technical philosophy, AI architecture, and core monorepo constraints."
workspace: "global"
tags:
  - architecture
  - mcp
  - privacy
  - tdd
priority: 1
---

# LiveRubber AI Coding Agent Instructions

## Project Overview
LiveRubber is a local-first monorepo for ADHD task management. It uses a **Hybrid AI Architecture**: local inference (Ollama) for sensitive data and cloud inference (Gemini Flash) for generic reasoning, connected via **Model Context Protocol (MCP)**.

### Architecture Diagram
├── shared/       → Shared TS types (Heart of the system - packages/shared)
├── apps/
│   ├── service/    → Node.js Backend (SQLite) + MCP Server
│   ├── ai-bridge/  → AI Orchestrator (Ollama/Gemini/Privacy Router)
│   └── mobile/     → React Native app (Jotai, TanStack Query)
└── packages/
    └── security/   → Anonymization & Encryption Logic


## Critical Knowledge

### 1. AI & Privacy Logic
- **Local-First AI**: All user-generated content (tasks, diary) is processed by **Ollama (DeepSeek/Llama)** on WSL2/GPU.
- **Privacy Router**: Found in `ai-bridge/`, it intercepts prompts to decide if they need local processing or can be anonymized for **Gemini Flash**.
- **MCP Integration**: The `service/` workspace acts as an **MCP Server**, exposing SQLite data as "Tools" so the AI doesn't write raw SQL.

### 2. Shared Types
Types live in `shared/@types/`. **Important**: AI Agent types and MCP schemas must also be defined here to ensure the `ai-bridge` and `service` remain in sync.

### 3. Test-Driven Development (TDD)
**TDD is mandatory** across all layers of the monorepo. Tests must be written before implementation to ensure all features are well-tested from the ground up.

---

### 3. Backend (service/) Architecture
**Clean Architecture + MCP**:
- `internal/repository/sqlite/` → Persistence.
- `internal/mcp/` → **New Layer**. Exposes repository methods as MCP Tools.

---

### 4. AI-Bridge Architecture (New)
ai-bridge/src/
├── providers/    # Vercel AI SDK Config (Ollama/Google)
├── router/       # Privacy-aware prompt routing
└── tools/        # MCP Client connections to service/

---

### 5. Agent Personas & Skills
Managed in `.agents/`:
- **Personas (`personas/`)**: Single Source of Truth for specialist identities (e.g., `be-architect.md`). Defines boundaries and protocols.
- **Skills-as-Dependencies**: Modular technical skills (Zod, Drizzle) are treated as unversioned dependencies and managed via `skills-lock.json` in the project root.
- **Phase 0 Validation**: Every agent performs a mandatory dependency check against `skills-lock.json` before any task.
- **Registry Enforcement**: Rules are strictly enforced via `.agents/registry.json` and the `.agents/rules/orchestrator-rule.md`.