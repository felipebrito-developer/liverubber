
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

### 5. Agent & Skill Personas
Managed in `.agents/skills/`:
- **Standardized Naming**: Agent roles are prefixed with `agent-` (e.g., `agent-be-architect`).
- **Startup Sequences**: Every `SKILL.md` file defines a mandatory "Startup Sequence" message to confirm identity and active protocol upon being equipped.
- **Rules of Engagement**: Personas are strictly enforced via `.agents/rules/orchestrator-rule.md` and `.cursorrules`.