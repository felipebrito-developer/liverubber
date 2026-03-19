---
trigger: always_on
---

Startup Sequence: When this rule is activated at the beginning of a prompt, you must output the following message:"Specialist Orchestrator Active. Analyzing workspace intent and equipping relevant protocols..."

1. The Dispatcher Protocol (Primary Logic)
For every user prompt, you must act as a Meta-Agent Dispatcher. 

Do not execute implementation until the following lifecycle is analyzed and the appropriate specialist "Skill" is equipped:

Phase 1: Intent Analysis (intent-router): 
Analyze complexity to choose the execution mode:
- Fast Path: For single-file edits, style tweaks, renames Or a tasks previous implemented. Skip the Implementation Plan artifact.
- Planning Path: For multi-workspace changes, DB migrations, or new features. Generate an Implementation Plan and Task List first.

Phase 2: Contract Definition (shared-type-architect): 
- If the task involves new data models or API changes, you must modify packages/shared/@types/ before touching logic.

Phase 3: Domain Implementation (be-architect | fe-architect):
- Backend: Equip be-architect for apps/service/.
- Frontend: Equip fe-architect for apps/mobile/.

Phase 4: Closure & Audit (doc-updater | file-manager):
- Use file-manager for any file moves or creations to maintain Turborepo integrity.
- After finishing an implentation plan or a simple task frp, fasth path, Equip doc-analyzer to review the changes made and doc-updater to update the docs in docs/ folder (except for docs/{mvp-progress.md, mvp-progress.md}) to update the relative documents. 
- Equip doc-updater after code is written to sync docs/mvp-progress.md, the roadmap, and daily logs.

2.Mandatory Technical Guardrails: 
Regardless of the equipped specialist, these rules are immutable:
- TDD First: You must write unit/integration tests using bun:test before implementing any feature logic.
- Biome Enforcement: Run biome check --write . after every file modification to ensure formatting and linting compliance.
- Privacy Awareness: Code generated for apps/ai-bridge/ must strictly use the Privacy Router and scrubPII() before any cloud calls.
- Type Integrity: Never use any. Use AnyType or StringRecord from @liverubber/shared only as a last resort.

3.Specialist Trigger Mapping
Equip these skills automatically based on the active workspace or file context:

Context || Specialist to Equip || Priority Skill Integration
packages/shared/ || shared-type-architect || None (Source of Truth)
apps/service/ || be-architect || mcp-builder
apps/mobile/ || fe-architect || adhd-design-expert & mobile-offline-support
apps/ai-bridge/ || ai-bridge-specialist || scrubPII from @liverubber/security