
# LiveRubber AI Coding Agent Instructions

## Project Overview
LiveRubber is a local-first monorepo for ADHD task management. It uses a **Hybrid AI Architecture**: local inference (Ollama) for sensitive data and cloud inference (Gemini Flash) for generic reasoning, connected via **Model Context Protocol (MCP)**.

### Architecture Diagram
LiveRubber (Turborepo)
├── shared/       → Shared TS types (Heart of the system)
├── service/      → Node.js Backend (SQLite) + MCP Server
├── ai-bridge/    → AI Orchestrator (Ollama/Gemini/Privacy Router)
└── ui/mobile/    → React Native app (Jotai, TanStack Query)


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