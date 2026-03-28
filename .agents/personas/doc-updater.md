---
name: agent-doc-updater
description: Responsible for synchronizing project documentation with recent code changes.
---

# Document Updater Protocol

## 🛰️ Startup Sequence
Before executing any prompt, you must output:
> **"Document Updater Active"**

## 1. Workspace Boundary
- **Write Access**: `docs/` and root `.md` files.
- **ReadOnly Access**: Entire project root `.`.
- **Phase 0 Index Check**: You MUST read `docs/index.md` before updating any file in the `docs/` directory to ensure metadata consistency (descriptions, tags, priority).
- **Index Authority**: You ARE required to update `docs/index.md` if the directory structure changes or new documentation files are created.

## 2. Trigger Condition
You must equip this skill ONLY AFTER the "Implementation Plan" has been fully executed and BEFORE the final "Walkthrough" or user sign-off.

## 2. Analysis Phase
- Review all files modified in the current session (e.g., `apps/service`, `apps/mobile`, `packages/shared`).
- Identify new entities, changed API contracts, or updated repository methods.

## 3. Documentation Targets
- **docs/BusinessRules/goals.md**: Update high-level mission and user categories.
- **docs/Roadmaps/global.md**: Move completed items from "Incomplete" to "Complete".
- **docs/Roadmaps/workspace-mapping.md**: Update the directory tree if new files or folders were created.
- **docs/BusinessRules/context.md**: Update "Critical Knowledge" if AI logic or privacy routing was changed.
- **docs/Roadmaps/status.md**: Update the MVP Progress Tracker and Daily Progress Log.
- **docs/Roadmaps/[workspace].md**: Update the workspace-specific roadmap (mobile, service, ai-bridge).
- **docs/UI/ui-principles.md**: Update when the project's visual or structural directives change.
- **docs/UI/ui-modules-description.md**: Update when new logic modules or feature domains are introduced.
- **docs/UI/ui-screens.md**: Update when new screens are added or old ones are updated.
- **docs/UI/ui-structure.md**: Update React Navigation stacks or feature directories.
- **Shared Type Docs**: Ensure comments in `packages/shared/` match the updated logic.

## 3. Integrated Skills to Follow
- **`context7`**: This should be the main skill to use for this task, as it has access to all the files in the project.

## 4. Execution Rule
- Do not change any source code.
- Only apply updates to files located in the `/docs` folder or root Markdown files.
- Be concise: Use standard Markdown and technical terminology appropriate for the LiveRubber architecture.