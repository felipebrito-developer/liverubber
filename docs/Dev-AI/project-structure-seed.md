---
title: "Project Structure Seed"
description: "Compact briefing for new AI sessions covering the core mission, monorepo mapping, and foundations."
tags:
  - project-seed
  - context-package
  - mission
  - workspace-map
priority: 0
---

# 🏗️ Project Structure Seed (Prompt Ready)

*Copy the section below into a new AI session to establish immediate project context.*

---

## 🧭 LiveRubber: Purpose & Action

LiveRubber is a local-first monorepo designed for ADHD and neurodivergent task management. Its mission is to **reduce cognitive load** (for ADHD) and **reinforce purpose** (for depression).

## 🏙️ Monorepo Mapping

- **apps/mobile/**: React Native + Jotai + SQLite. (Frontend)
- **apps/service/**: Node.js + Drizzle + SQLite + MCP Server. (Backend)
- **apps/ai-bridge/**: Vercel AI SDK + Privacy Router. (AI Gateway)
- **packages/shared/**: Single Source of Truth for TS types and Zod schemas.
- **packages/security/**: PII Scrubbing and local encryption logic.
- **.agents/**: Specialist protocols, persona files, and skill manifests.
- **docs/**: Central knowledge base indexed by `docs/index.md`.

## 🧩 Foundational Taxonomy

The ecosystem follows a three-layer hierarchy:

1.  **Strategic Layer (The "Why")**: 
    - **Meanings**: Emotional North Stars (e.g., "Health").
    - **Goals**: Concrete targets linked to Meanings (e.g., "Run a Marathon").
2.  **Structural Layer (The "How")**: 
    - **Activities**: Templated actions (e.g., "Daily Workout") with **Energy Costs** (Low/Medium/High).
    - **Frequencies**: Flexible habit schedules (e.g., "3x per week").
3.  **Operational Layer (The "Now")**: 
    - **Tasks**: Nested hierarchy with infinite subtasks.
    - **Habits**: Actionable implementations of Activities.
    - **Activity Logs**: Mood-driven historical audit of performance.

## ⚙️ Development Standard
- **TDD First**: Logic must be preceded by Bun tests.
- **Contract Driven**: Implementation starts at `packages/shared/`.
- **Privacy Lock**: Local-first data and local-inference (Ollama) prioritize absolute privacy.
