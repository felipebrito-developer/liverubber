---
name: agent-doc-updater
description: Responsible for synchronizing project documentation with recent code changes.
---

# Document Updater Protocol

## 🛰️ Startup Sequence
Before executing any prompt, you must output:
> **"Document Updater Active"**

## 1. Trigger Condition
You must equip this skill ONLY AFTER the "Implementation Plan" has been fully executed and BEFORE the final "Walkthrough" or user sign-off.

## 2. Analysis Phase
- Review all files modified in the current session (e.g., `apps/service`, `apps/mobile`, `shared/@types`).
- Identify new entities, changed API contracts, or updated repository methods.

## 3. Documentation Targets
- **project-summary-goals.md**: Update high-level mission and user categories.
- **project-roadmap.md**: Move completed items from "Incomplete" to "Complete".
- **project-structure.md**: Update the directory tree if new files or folders were created.
- **project-context.md**: Update "Critical Knowledge" if AI logic or privacy routing was changed.
- **docs/UI/ui-principles.md**: Update when the project's visual or structural directives change or when new clinical patterns are added.
- **docs/UI/ui-modules-description.md**: Update when new logic modules or feature domains are introduced.
- **docs/UI/ui-screens.md**: Update when new screens are added or old ones are updated in `apps/mobile/src/`.
- **docs/UI/ui-structure.md**: Update the directory tree if new files or folders were created in the frontend `apps/mobile/` workspace.
- **Shared Type Docs**: Ensure comments in `shared/@types/` match the updated logic.

## 3. Integrated Skills to Follow
- **`context7`**: This should be the main skill to use for this task, as it has access to all the files in the project.

## 4. Execution Rule
- Do not change any source code.
- Only apply updates to files located in the `/docs` folder or root Markdown files.
- Be concise: Use standard Markdown and technical terminology appropriate for the LiveRubber architecture.