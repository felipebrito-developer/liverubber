---
title: "AI Structure Seed"
description: "Compact briefing for new AI sessions covering the Agentic Orchestrator and AI Bridge architecture."
workspace: "apps/ai-bridge"
tags:
  - ai-seed
  - context-package
  - orchestrator
  - privacy-router
priority: 0
---

# 🤖 AI Structure Seed (Prompt Ready)

*Copy the section below into a new AI session to establish immediate technical context.*

---

## 🛰️ LiveRubber AI Orchestration Protocol

LiveRubber uses a **Specialist Orchestrator Protocol**. Every task MUST follow this lifecycle:

1.  **Intent Analysis (`intent-router`)**: Routes requests via `[DEV-ROUTE]: FastPath` or `Planning`.
2.  **Contract Definition (`shared-type-architect`)**: Ensures Zod schemas and TS types are updated in `packages/shared/` before implementation.
3.  **Domain Implementation (`be-architect` / `fe-architect` / `ai-bridge-specialist`)**: Specialists are locked to their respective workspace boundaries (`apps/service`, `apps/mobile`, `apps/ai-bridge`).
4.  **Audit & Sync (`doc-updater` / `file-manager`)**: Synchronizes MVP progress logs and ensures filesystem integrity.

## 🌉 Hybrid AI Bridge & Privacy

- **Local Inference (Ollama)**: Handles PII and sensitive user data (DeepSeek-Coder/Llama 3).
- **Cloud Fallback (Gemini Flash)**: Handles generic reasoning and complex planning with anonymized context.
- **Privacy Router**: Intercepts prompts in `ai-bridge/` to scrub PII and decide on routing.
- **MCP (Model Context Protocol)**: 
    - **Server**: `apps/service/` exposes SQLite repositories as tools.
    - **Client**: `apps/ai-bridge/` consumes tools to prevent raw SQL execution from LLMs.

## 🔒 Mandatory Guardrails
- **Rule of One**: Every screen must have a singular, high-contrast primary action.
- **TDD First**: Tests MUST be written in `bun:test` before logic implementation.
- **Registry Compliance**: Agents must validate their registry permissions in `.agents/registry.json`.
