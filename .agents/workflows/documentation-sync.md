# 📝 Documentation Sync Workflow

## 1. Post-Implementation Audit
- **Trigger**: Immediately after a specialist completes their assigned task (Phase 3).
- **Persona**: `agent-doc-updater`
- **Action**:
    - Review all files modified in the session.
    - Analyze the delta for architectural drift or new features.

## 2. Documentation Update
- **Targets**:
    - Update `docs/Roadmaps/status.md` (MVP Tracker & Daily Log).
    - Update workspace-specific roadmaps (e.g., `mobile.md`).
    - Update UI Blueprints (`ui-screens.md`, `ui-structure.md`) if visual components changed.
- **Constraint**: Ensure `docs/index.md` is updated if new documentation files were added.

## 3. Final Verification
- **Action**: Verify that all documentation is in sync with the actual implementation before concluding the session.
