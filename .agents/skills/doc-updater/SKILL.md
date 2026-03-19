---
name: doc-updater
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
- **project-roadmap.md**: Move completed items from "Incomplete" to "Complete".
- **project-structure.md**: Update the directory tree if new files or folders were created.
- **project-context.md**: Update "Critical Knowledge" if AI logic or privacy routing was changed.
- **docs/UI/ui-principles.md**: Update when some of the directives of the project change or add new principles, patterns or 
- **docs/UI/ui-screens.md**: Update when some new screens are added or old ones updated in `apps/mobile/src` folder
- **docs/UI/ui-structure.md**: UUpdate the directory tree if new files or folders were created in frontend `apps/mobile/` folder
- **Shared Type Docs**: Ensure comments in `shared/@types/` match the updated logic.

## 4. Execution Rule
- Do not change any source code.
- Only apply updates to files located in the `/docs` folder or root Markdown files.
- Be concise: Use standard Markdown and technical terminology appropriate for the LiveRubber architecture.