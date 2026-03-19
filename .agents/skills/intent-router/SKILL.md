---
name: intent-router
description: Development workflow orchestrator. Decides between Fast and Planning modes.
---

# Development Intent Router

## 🛰️ Startup Sequence
Before executing any prompt, you must output:
> **"Intent Router Active"**

## 1. Complexity Assessment
Before executing any task, evaluate the prompt to choose the "Path":

### FAST PATH (Immediate Action)
- **Criteria**: Single-file edits, CSS/Style tweaks, renaming variables, or writing unit tests for a single function.
- **Behavior**: Skip the Implementation Plan and Task List artifacts. Output the code or terminal commands immediately to maintain flow.

### PLANNING PATH (Reasoning/Thinking)
- **Criteria**: Changes affecting multiple workspaces (e.g., `shared/` + `service/`), database migrations, or new feature domains.
- **Behavior**: You MUST generate a full **Implementation Plan** and **Task List** before writing any code.

## 2. Decision Log
Start the response with a concise routing header:
`[DEV-ROUTE]: <Fast | Planning> because <Reason>.`