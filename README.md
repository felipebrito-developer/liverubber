# LiveRubber

## 📱 Project Overview

LiveRubber is a local-first monorepo designed for ADHD and neurodivergent task management. It uses a **Hybrid AI Architecture** to reduce cognitive load while maintaining absolute data privacy.

## 🏛️ Architecture

### Monorepo Structure
```
LiveRubber/
├── apps/
│   ├── mobile/           # React Native application (Jotai + SQLite)
│   ├── service/          # Node.js backend + MCP Server (Drizzle + SQLite)
│   └── ai-bridge/        # AI Orchestrator (Ollama / Gemini / Privacy Router)
├── packages/
│   ├── shared/           # Single Source of Truth for Types & Zod Schemas
│   └── security/         # PII Scrubbing & Local Encryption
├── docs/                 # Central Knowledge Base (See docs/index.md)
├── .agents/              # Agentic Protocols & Personas
└── skills-lock.json      # Modular Skill Manifest
```

### 🧠 Agentic Architecture

This repository uses a **Specialist Orchestrator Protocol** to manage complex development tasks:

1.  **Personas**: Specialist identities (Tech Lead, FE Architect, etc.) are versioned in `.agents/personas/`.
2.  **Skills-as-Dependencies**: Technical capabilities are treated as unversioned dependencies via `skills-lock.json`.
3.  **Master Index**: All documentation is indexed in **[docs/index.md](file:///home/felip/projects/LiveRubber/docs/index.md)**, allowing agents to route research without reading full files.

---

## ⚡ AI Onboarding (Seeds)

For new AI conversations, provide the following "Seeds" to establish immediate project context:

1.  **[Project Structure Seed](file:///home/felip/projects/LiveRubber/docs/Dev-AI/project-structure-seed.md)**: High-level mission, folder mapping, and strategic goals.
2.  **[AI Architecture Seed](file:///home/felip/projects/LiveRubber/docs/Dev-AI/ai-structure-seed.md)**: Details on the Specialist Orchestrator, Privacy Router, and MCP Tooling.

---

## 🚀 Development

### Prerequisites
- Bun 1.3+
- Node.js 22+
- Ollama (for local inference features)

### Quick Start
```bash
# Install dependencies across all workspaces
bun install

# Start development environment
bun run dev
```

### Available Scripts
```bash
bun run dev              # Start all services (Mobile + Service + Bridge)
bun run typecheck        # Run TypeScript checking across monorepo
bun run lint             # Run Biome linting and formatting
```

## 🔧 Development Philosophy

- **Privacy-First AI**: Sensitive data stays local (Ollama); generic reasoning uses Cloud (Gemini) via a Privacy Router.
- **Local-First Data**: Mobile and Service both use SQLite as the primary source of truth.
- **Type Safety**: End-to-end Zod schemas and TypeScript interfaces defined in `packages/shared/`.
- **Neuro-UI**: Hardcoded design constraints (Deep Slate, Soft Gold) and the "Rule of One" to prevent cognitive overload.

## 🛠️ Built With
- [React Native](https://reactnative.dev/) - Mobile framework
- [Turborepo](https://turbo.build/) - Monorepo build system
- [Bun](https://bun.sh/) - Package manager & runtime
- [SQLite](https://sqlite.org/) - Local database
- [Jotai](https://jotai.org/) - State management
- [TanStack Query](https://tanstack.com/query) - Data fetching & caching
- [Biome](https://biomejs.dev/) - Code formatting & linting

## 🤝 Contributing

This is a personal project focused on establishing a solid architecture foundation. The codebase is structured to be easily extensible for additional features and domains.
