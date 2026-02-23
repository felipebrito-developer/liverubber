# Project Steps

## Incomplete Steps

### AI & PRIVACY (Priority)
- [ ] Configure `ai-bridge` service with Vercel AI SDK.
- [ ] Implement Privacy Router (Local vs Cloud decision logic).
- [ ] Setup MCP Server in `service/` to expose SQLite safely.
- [ ] Implement data anonymization utility in `packages/security`.

### BACKEND
- [ ] Create database migrations for `meaning`, `goal`, `task`.
- [ ] Implement CRUD for entities.
- [ ] Create repository layer for database access.

### FRONTEND
- [ ] Define component structure and templates.
- [ ] Create tasks view and welcome page.
- [ ] Integrate TanStack Query with `ai-bridge` endpoints.

## Complete Steps
- [x] Activate CUDA (GPU) in WSL2 for local inference.
- [x] Clean/Remove legacy Antigravity installations in WSL.
- [x] Configure Antigravity Windows-to-WSL remote connection.
- [x] Define Shared Type structure under `shared/@types/`.
- [x] Monorepo structure configuration (Turbo.js + Bun).