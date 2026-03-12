# LiveRubber

## 📱 Project Overview

LiveRubber is a mobile application designed for ADHD or other neurodivergent people overall organization.

## 🏗️ Architecture

### Monorepo Structure
```
LiveRubber/
├── app/service/           # Node.js backend service
├── app/ai-bridge/         # MCP server for AI integration
├── app/mobile/            # React Native application (android only for now)
├── docs/                  # Documentation for AI agents
├── env/                   # Environment variables
├── packages/shared/       # Shared resources
├── packages/security/     # Security related packages
├── turbo.json             # Turborepo configuration
├── .cursorrules           # Agent AI rules
└── package.json           # Root package configuration
```

### Tech Stack
- **Backend**: Node.js, SQLite database
- **Frontend**: React Native 0.84.4, TypeScript, Jotai state management, TanStack Query for data fetching and caching, local SQLite database with WatermellonDB
- **Build System**: Turborepo with Bun package manager
- **Code Quality**: Biome for linting and formatting

## 🎯 Core Features

### Current Focus (MVP)
- **Task Management**: Create, organize, and track tasks with priorities and due dates
- **Local Database**: SQLite for fast, offline-first data persistence
- **Type Safety**: End-to-end type sharing between frontend and backend

### MVP Planned Features
- Routine and habit tracking
- Goal tracking with progress monitoring
- Android platform support

### Future Features
- Exercises and physical activities management
- Financial transaction management

## 🚀 Development

### Prerequisites
- Bun 1.3+
- Node.js 22+
- React Native 0.84+

### Quick Start
```bash
# Clone and setup
git clone <repository>
cd LiveRubber

# Install dependencies and generate code
bun run setup

# Start development servers
bun run dev
```

### Available Scripts
```bash
bun run dev              # Start all services
bun run dev:server       # Start Go backend only
bun run dev:mobile       # Start React Native development server
bun run proto:generate   # Regenerate protobuf types
bun run typecheck        # Run TypeScript type checking
bun run lint             # Run Biome linting
```
## 🔧 Development Philosophy

- **Type Safety First**: gRPC and Protocol Buffers ensure consistent types across stack
- **Local-First**: Local SQLite database with WatermellonDB for offline capability and fast performance
- **Monorepo Efficiency**: Shared tooling and dependencies managed by Turborepo
- **DRY**: Don't repeat yourself, utilities and shared code in packages/
- **KISS**: Keep it simple, stupid, keep the code simple and easy to understand

## 🛠️ Built With
- [React Native](https://reactnative.dev/) - Mobile framework
- [Turborepo](https://turbo.build/) - Monorepo build system
- [Bun](https://bun.sh/) - Package manager & runtime
- [SQLite](https://sqlite.org/) - Local database
- [Jotai](https://jotai.org/) - State management
- [TanStack Query](https://tanstack.com/query) - Data fetching & caching
- [Biome](https://biomejs.dev/) - Code formatting & linting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

This is a personal project focused on establishing a solid architecture foundation. The codebase is structured to be easily extensible for additional features and domains.
