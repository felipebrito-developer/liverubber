# 🎨 Frontend Component Reuse Workflow

## 1. Discovery Phase (Mandatory)
- **Trigger**: Before creating any new UI component in `apps/mobile/`.
- **Persona**: `agent-fe-architect`
- **Action**:
    - Search `apps/mobile/src/components/` (atoms, molecules, organisms).
    - Search the specific feature's `components/` folder (e.g., `src/features/focus/components/`).
    - Use `grep` or `find` to check for similar naming patterns or logic.

## 2. Decision Logic
- **Reuse**: If a suitable component exists, extend or compose it.
- **Refactor**: If a component is 80% there, refactor it to be more generic rather than duplicating.
- **Create**: Only create a new component if no existing pattern satisfies the "Neuro-UI" requirements or atomic structure.

## 3. Documentation
- **Action**: If a new shared component is created, ensure it is exported in the relevant `index.ts` and mentioned in the UI documentation.
