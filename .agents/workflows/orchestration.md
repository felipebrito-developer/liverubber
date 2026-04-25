# 🧭 Orchestration & Delegation Workflow

## 1. Intent Analysis
- **Trigger**: Every new user request or complex task.
- **Persona**: `agent-intent-router`
- **Action**: Use `intent-router.md` to identify the scope and required specialists.

## 2. Contextual Research (Mandatory)
- **Trigger**: Before any specialist begins work.
- **Persona**: `agent-doc-analyst`
- **Action**:
    - Consult `docs/index.md` to find relevant architectural context.
    - Research the project structure and existing rules for the target workspace.
    - **Constraint**: Return ONLY relevant information for the specific features or files being updated to minimize noise.

## 3. Specialist Dispatch
- **Action**: Hand off the task to the specific specialist identified in the Trigger Map.
- **Constraint**: The specialist MUST receive the distilled context from `agent-doc-analyst` before proceeding.
