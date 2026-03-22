# 🤖 LiveRubber AI System Architecture
> **Current Version:** Antigravity v1.3.10 (Mar 2026)
> **Goal:** Provide a comprehensive map of the agentic orchestration protocols for AI-to-AI handoffs and refinement.

## 🛰️ 1. Orchestration Engine: The Dispatcher Protocol
LiveRubber uses a **Meta-Agent Dispatcher** model. Instead of a generic prompt-response cycle, every task must be processed through a deterministic multi-agent lifecycle.

### Core Lifecycle (Phase 1-4)
| Phase           | Agent Role                                  | Primary Tool / Skill   | Output                                      |
| :-------------- | :------------------------------------------ | :--------------------- | :------------------------------------------ |
| **1. Intent**   | `agent-intent-router`                       | Intent analysis        | **[DEV-ROUTE]** decision (Fast vs Planning) |
| **2. Contract** | `agent-shared-type-architect`               | Zod / TS               | Updated `packages/shared/@types/`           |
| **3. Impl**     | `agent-be-architect` / `agent-fe-architect` | Drizzle / React Native / AI SDK | Workspace code + AI Routing + Bun tests     |
| **4. Audit**    | `agent-doc-updater` / `agent-file-manager`  | MVP Log Sync           | Updated `docs/mvp-progress.md`              |

---

## 🧩 2. Agent Persona Registry
The system equips these specialized personas based on the directory context and phase requirement.

| Agent Persona                     | 🏷️ Associated Skills                                                                                                                  | 🪐 Primary Context (Files/Workspaces)              |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| **`agent-intent-router`**         | `agent-intent-router`                                                                                                                | Global (Entry Point for all prompts)              |
| **`agent-be-architect`**          | `agent-be-architect`, `mcp-builder`, `sqlite-database-expert`, `claude-api`                                                           | `apps/service/`, `apps/ai-bridge/`, Privacy Routing, SQL |
| **`agent-fe-architect`**          | `agent-fe-architect`, `adhd-design-expert`, `jotai-expert`, `mobile-offline-support`, `react-native-design`, `ui-component-patterns` | `apps/mobile/src/features/`, UI creation          |
| **`agent-doc-updater`**           | `agent-doc-updater`, `agent-doc-analyst`                                                                                             | `docs/`, `mvp-progress.md`, daily logs            |
| **`agent-file-manager`**          | (Internal FS Tools)                                                                                                                  | Monorepo filesystem operations (Turborepo)        |

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
