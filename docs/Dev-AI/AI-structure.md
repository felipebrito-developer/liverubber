---
title: "AI System Architecture"
description: "Orchestration Engine, Persona Registry, and Mandatory AI Guardrails."
workspace: "apps/ai-bridge"
tags:
  - ai-bridge
  - personas
  - orchestrator
  - lifecycle
priority: 1
---

# 🤖 LiveRubber AI System Architecture
> **Current Version:** Antigravity v1.3.10 (Mar 2026)
> **Goal:** Provide a comprehensive map of the agentic orchestration protocols for AI-to-AI handoffs and refinement.

## 🛰️ 1. Orchestration Engine: The Dispatcher Protocol
LiveRubber uses a **Meta-Agent Dispatcher** model. Instead of a generic prompt-response cycle, every task must be processed through a deterministic multi-agent lifecycle.

### Core Lifecycle (Phase 1-4)
| Phase           | Agent Role                                  | Primary Tool / Skill   | Output                                      |
| :-------------- | :------------------------------------------ | :--------------------- | :------------------------------------------ |
| **1. Intent**   | `intent-router`                             | Intent analysis        | **[DEV-ROUTE]** decision (Fast vs Planning) |
| **2. Contract** | `shared-type-architect`                     | Zod / TS               | Updated `packages/shared/`                  |
| **3. Impl**     | `be-architect` / `fe-architect`             | Vercel AI SDK / Bun tests | Clean Architecture + AI Routing            |
| **4. Audit**    | `doc-updater` / `file-manager`              | MVP Log Sync           | Updated `docs/mvp-progress.md`              |

---

## 🧩 2. Agent Persona Registry
Specialist profiles are managed in `.agents/personas/` as the single source of truth for identities and protocols. Modular technical skills (e.g., `zod`, `drizzle`) are unversioned dependencies in `.agents/skills/`.

| Agent Persona                     | 🧪 Associated Skills (Modular)                                                                                                              | 🪐 Workspace Boundary (Locks)                          |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| **`intent-router`**               | tech-lead-protocol                                                                                                                         | Project Root `.`                                  |
| **`be-architect`**                | `nodejs-backend-patterns`, `sqlite-database-expert`, `drizzle-orm`, `claud-api`                                                           | `apps/service/`                                   |
| **`fe-architect`**                | `adhd-design-expert`, `jotai-expert`, `react-native-design`, `ui-component-patterns`                                                       | `apps/mobile/src/features/`                       |
| **`ai-bridge-specialist`**        | `mcp-builder`, `scrub-pii`, `vercel-ai-sdk`                                                                                                | `apps/ai-bridge/`                                 |
| **`doc-updater`**                 | `doc-analyst`                                                                                                                              | `docs/`, Root `.md`, Full Read Access             |
| **`file-manager`**                | `validate-skills`                                                                                                                          | Project Root `.`                                  |

---

## 🔒 3. Mandatory AI Guardrails (Developer Rules)
These rules are enforced via `.cursorrules` and must be followed by any agent refining this system:

1.  **Rule of One (Neuro-UI)**: Every screen must have ONE clear primary action (FAB) to prevent decision paralysis.
2.  **TDD Protocol**: All logic changes MUST have a corresponding `*.test.tsx` or `*.test.ts` file written *before* implementation.
3.  **Clean-Code Escape Hatch**: Native `any` is strictly prohibited. Use `AnyType` or `StringRecord` from `@liverubber/shared` if type resolution is blocked.
4.  **Monorepo Build Verification**: After every implementation, agents must run:
    - `bun run type-check` (Across all workspaces)
    - `bun run build` (In the modified workspace)

---

## 🔍 4. System Gaps & Refinement Areas (For Next AI Agent)
Current known gaps where we need logic/flow refinement:

- **Monorepo Type Resolution**: Intermittent `@tanstack/react-query` resolution issues in global `tsc` checks.
- **Sync Logic Complexity**: The `ai-bridge` is maturing. We need to define clearer boundaries between "Local Inference" (Ollama) and "Cloud Generic" (Gemini) routing.
- **Tool Discovery**: MCP server implementation in `apps/service/` needs more robust automated testing for tool exposing.
- **Habit-Reward Loop**: The logical coupling between `Habit` completion and `Reward` granting via the bridge table needs a dedicated "Economic Specialist" agent refinement.

---

## 📡 5. AI Startup Sequence (Mandatory)
Every assigned specialist must signal its activation with the following confirmation:
> **"Specialist Orchestrator Active. Analyzing workspace intent and equipping relevant protocols..."**
