# LiveRubber AI Coding Agent Instructions

## Project Overview

LiveRubber is a monorepo mobile application for ADHD/neurodivergent people's task and goal management. It uses a **local-first architecture** with a Go backend (gRPC) and React Native frontend, connected via Protocol Buffers for type-safe communication.

### Architecture Diagram
```
LiveRubber (Turborepo)
├── shared/          → Json schemas + code types generation
├── service/         → Go backend (SQLite)
└── ui/mobile/       → React Native app (Jotai stores, TanStack Query)
```

## Critical Knowledge for Productivity

### 1. Type Generation Pipeline (Heart of the System)

**The Problem**: Frontend (TypeScript) and backend (Go) must share types without duplication.

**The Solution**: Schemas → Generated Types
- **Source of Truth**: JSON Schemas in `shared/schemas/entities/`
- **Type Generation Tool**: Quicktype (via Bun script)
- **Outputs**:
  - TypeScript types in `shared/ts-types/gen/`
  - Go types in `service/go-types/gen/`

**Critical Commands**:
- `bun run generate:types` - Regenerate all types from schemas
- `bun run validate:schemas` - Validate schema correctness before generation

**Key Files**:
- `shared/schemas/entities/` - JSON Schema definitions (source of truth)
- `shared/scripts/generate-types.ts` - Bun script that orchestrates generation
- `shared/scripts/constant.ts` - Defines paths and config for generation

**Pattern to Remember**: Always modify `shared/schemas/*.json` first, then run generation. Directly editing generated files (`gen/`) is overwritten next generation.

### 2. Monorepo Build & Development Workflow

**Package Manager**: Bun 1.0+ 

**Root-level Scripts** (`bun run` from project root):
```bash
bun run dev              # Start all services parallel (backend + mobile)
bun run setup            # Install dependencies + generate types (run once)
bun run generate:types   # Regenerate TypeScript + Go types
bun run validate:schemas # Validate JSON schemas before generation
bun run clean            # Clean all workspaces cache and build outputs
```

**Workspace Structure** (in `package.json`):
```json
"workspaces": ["service", "ui/mobile", "shared"]
```

Each workspace has independent `package.json` but shares root dependencies (Turbo, Biome).

**Build System**: Turborepo (`turbo.json`)
- Caches build outputs in `node_modules/.turbo`
- Tasks have inputs/outputs defined (e.g., proto generation outputs to `gen/**`)
- Run `turbo run <task> --parallel` for parallel execution

### 3. Backend Architecture (Go Service)

**Structure**:
```
service/
├── cmd/                # Entry points
├── cmd/                # Entry points
│   └── server/       
│       └── main.go    # Initializes gRPC server
├── internal/          # Application code
    ├── domain/            # Entity definitions (pure data)
    │   └── task.go        # Task domain model
    ├── service/task/      # Business logic layer
    │   └── service.go     # Task service with CRUD logic
    ├── handler/grpc/      # gRPC handler (translates proto → service)
    │   └── task_handler.go
    └── repository/sqlite/ # Data access layer
        └── task_repo.go   # SQLite CRUD operations
```

**Clean Architecture Principle**: `handler → service → repository → domain`
- Handlers receive gRPC requests, delegate to services
- Services contain business logic
- Repositories handle database persistence
- Domain contains data models and validation

**Entry Point**: `service/cmd/server/main.go`
- Initializes gRPC server on port `:50051`
- Registers service handlers

**Generated Code**: `service/gen/`
- Contains `github.com/felipebrito-developer/liverubber/gen/` package paths
- Auto-generated from Protocol Buffers (DON'T EDIT)
- Import example: `taskv1 "github.com/felipebrito-developer/liverubber/gen/task/v1"`

### 4. Frontend Architecture (React Native + Jotai)

**Structure**:
```
ui/mobile/src/
├── app/              # App-level setup
│   ├── App.tsx       # Root component
│   ├── navigation/   # React Navigation setup
│   └── providers/    # Context providers (Jotai, React Query)
├── features/         # Feature modules (domain-driven)
│   ├── task/         # Task feature
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/    # Custom hooks for this feature
│   │   └── utils/
│   ├── goal/
│   └── finance/
├── lib/              # Shared utilities
│   ├── api/          # gRPC client (currently empty, will be generated)
│   ├── stores/       # Jotai atoms
│   └── utils/
└── shared/           # App-wide UI components
    ├── components/
    └── ui/
```

**State Management Pattern**:
- **Jotai** (`atom()`, `useAtom()`) for local/global state
- **TanStack Query** for server state (data fetching + caching)
- Feature-level atoms in `features/*/` directories
- Shared atoms in `lib/stores/`

**Data Flow**: API Client → TanStack Query → Jotai atoms → Components

### 5. Type Safety: End-to-End

**TypeScript Configuration** (`shared/tsconfig.json`):
- Strict mode enabled
- Path aliases configured for monorepo
- Include both desktop and mobile TS files

**Biome Configuration** (`shared/biome.json`):
- Line width: 100 characters
- 2-space indentation
- Linting enabled with `noImplicitAny: error`
- Run: `bun run lint` (applies to all workspaces)

**Schema Validation**:
- JSON Schemas in `shared/schemas/` define all types
- Base types (`base/common.json`): Entity (id, createdAt, updatedAt)
- Entity schemas extend base types
- Example: Task requires title (string, 1-255 chars), priority (enum), status (enum)

### 6. Workspace Dependencies

**Backend (service/)**:
- Go 1.21+
- `google.golang.org/grpc` v1.59.0
- `google.golang.org/protobuf` v1.31.0

**Frontend (ui/mobile/)**:
- React 19.1.1
- React Native 0.82.1
- Jotai 2.15.1 (state management)
- TanStack Query 5.90.11 (data fetching)
- React Navigation 7.x (routing)
- Biome for linting

**Shared (shared/)**:
- Turbo 2.5.8
- TypeScript 5.9.3
- Biome 2.3.7

### 7. Code Style & Conventions

**TypeScript**:
- Feature-based organization (NOT by file type)
- Strict type checking enabled
- Use Biome formatter: `biome check --write .`
- Max line width: 100

**Go**:
- Follow standard Go conventions (CamelCase public, snake_case private)
- Clean architecture (domain → service → repository pattern)
- Each handler registers with gRPC server

**Protocol Buffers** (future):
- Package versioning: `task.v1`, `goal.v1` (NOT `v1.task`)
- Service names: PascalCase (e.g., `TaskService`)
- Message names: PascalCase

### 8. Common Development Tasks

**Adding a New Feature Domain** (e.g., `Goal`):
1. Create JSON schema: `shared/schemas/entities/goal/goal.json`
2. Extend base Entity type in schema
3. Run `bun run generate:types` (generates Go + TS types)
4. Create backend handler: `service/internal/handler/grpc/goal_handler.go`
5. Create service layer: `service/internal/service/goal/service.go`
6. Register in `service/cmd/server/main.go`
7. Create mobile feature: `ui/mobile/src/features/goal/`

**Modifying Shared Types**:
1. Edit JSON schema in `shared/schemas/`
2. Run `bun run validate:schemas` to validate
3. Run `bun run generate:types` to regenerate
4. Commit generated files (they're part of source control)

**Running the App**:
```bash
bun install              # First time setup
bun run setup            # Generate types
bun run dev              # Start backend + Metro bundler
# In separate terminal:
cd ui/mobile && bun android  # Run on Android device/emulator
```

### 9. Important Non-Obvious Patterns

**JSON Schema Reusability**:
- `$ref` references other schema files
- Base types in `base/common.json` are reused via `"$ref": "base/common.json#/definitions/Entity"`
- Task schema extends Entity type, adding domain-specific fields

**Type Generation Caching**:
- Turbo caches `gen/` directories
- Modify a schema → must run `bun run generate:types`
- Rebuild fails if generated types are stale

**gRPC Port**:
- Backend listens on `:50051` (standard gRPC port)
- Mobile client connects to `localhost:50051` (Android: `10.0.2.2:50051`)
- Configured once in `lib/api/client.ts` (when created)

**Local-First Database**:
- SQLite DB lives on device (not synced yet)
- Repository layer abstracts database access
- No cloud sync in current MVP (future feature)

### 10. File Location Reference

| Purpose | Location | Key Files |
|---------|----------|-----------|
| Type definitions | `shared/schemas/entities/` | `*.json` |
| Type generation config | `shared/` | `quicktype-config.json` |
| Backend handlers | `service/internal/handler/grpc/` | `*_handler.go` |
| Business logic | `service/internal/service/` | `*/service.go` |
| Database access | `service/internal/repository/sqlite/` | `*_repo.go` |
| Mobile features | `ui/mobile/src/features/` | `*/screens/`, `*/hooks/` |
| Shared stores | `ui/mobile/src/lib/stores/` | `*/index.ts` |
| Generated types (TS) | `ui/mobile/gen/` | `types.ts` |
| Generated types (Go) | `service/gen/` | `types.go` |

## Workflow for AI Agents

When implementing features:
1. **Understand data model** → Check `shared/schemas/`
2. **Implement backend** → Add handler, service, repository (Go)
3. **Implement frontend** → Add feature screens, hooks, stores (React Native)
4. **Regenerate types** → `bun run generate:types` after schema changes
5. **Test locally** → `bun run dev` (backend) + `bun android` (app)
6. **Format & lint** → `bun run lint`

## Known Limitations & TODOs

- **MVP Focus**: Task management only; Goal, Finance features are structure placeholders
- **Empty Implementations**: `service/internal/domain/task.go`, `service/internal/service/task/service.go`, `service/internal/repository/sqlite/task_repo.go` are stubs
- **Mobile State**: `ui/mobile/src/lib/api/` and `ui/mobile/src/lib/stores/` folders are empty (gRPC client not yet implemented)
- **No Cloud Sync**: Database is local-only (SQLite); future feature
- **Android Only**: iOS support planned but not implemented
