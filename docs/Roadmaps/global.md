---
title: "Global Roadmap"
description: "High-level project milestones, completed steps, and upcoming priorities across all workspaces."
workspace: "global"
tags:
  - roadmap
  - progress
  - backlog
priority: 1
---

# Project Steps

## Incomplete Steps

### AI & PRIVACY (Priority)
- [ ] Integrate MCP Tools into the LLM streaming responses in `ai-bridge`.
- [ ] Refine Privacy Router logic for more complex sensitivity cases.
- [ ] Implement E2E integration tests for AI-to-Service tool calling.

### BACKEND
- [ ] Implement remaining Repositories: `habit`, `activity`, `activity_log`, `resource`.
- [ ] Expose all repositories as MCP Tools.

### FRONTEND
- [ ] Polish UI animations and gesture handling with Reanimated.
- [ ] Implement low-energy filter UI in Action Hub.

## Complete Steps
- [x] Configure `ai-bridge` service with Vercel AI SDK (Ollama + Gemini).
- [x] Implement Privacy Router (Local vs Cloud decision logic).
- [x] Implement PII Scrubbing in `packages/security`.
- [x] Setup MCP Server in `apps/service/` to expose SQLite safely.
- [x] Implement core repository layer (Goal, Meaning, Task).
- [x] Define component structure and Neuro-UI templates.
- [x] Implement all core mobile screens and creation flows.
- [x] Activate CUDA (GPU) in WSL2 for local inference.
- [x] Clean/Remove legacy Antigravity installations in WSL.
- [x] Configure Antigravity Windows-to-WSL remote connection.
- [x] Seed database with initial Categories, Tags, and Frequencies.
- [x] **Lean Architecture Migration**: Decoupled Personas/Skills and unified specialist protocols in `.agents/personas/`.
- [x] Define Shared Type structure under `packages/shared/`.
- [x] Monorepo structure configuration (Turbo.js + Bun).

## Future Improvements
- [ ] Configure `expo` or `react-native-web` to allow the AI to visually test UI changes via browser preview.