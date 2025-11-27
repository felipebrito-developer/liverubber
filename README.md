# LiveRubber

## 📱 Project Overview

LiveRubber is a mobile application designed for ADHD or other neurodivergent people overall organization.

## 🏗️ Architecture

### Monorepo Structure
```
LiveRubber/
├── service/               # Go backend service
├── ui/mobile/             # React Native application
├── shared/                # Shared resources & protobuf schemas
├── turbo.json             # Turborepo configuration
└── package.json           # Root package configuration
```

### Tech Stack
- **Backend**: Go with gRPC, SQLite database
- **Frontend**: React Native 0.81.4, TypeScript, Jotai state management
- **Build System**: Turborepo with Bun package manager
- **Code Quality**: Biome for linting and formatting
- **Communication**: gRPC with Protocol Buffers for type-safe API contracts

## 🎯 Core Features

### Current Focus (MVP)
- **Task Management**: Create, organize, and track tasks with priorities and due dates
- **Local Database**: SQLite for fast, offline-first data persistence
- **Type Safety**: End-to-end type sharing between frontend and backend

### Planned Features
- Goal tracking with progress monitoring
- Financial transaction management
- Routine and habit tracking
- Cross-platform support (Android & iOS)

## 🚀 Development

### Prerequisites
- Bun 1.0+
- Go 1.21+
- React Native development environment

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

## 📁 Project Structure Details

### Shared Resources (`/shared`)
- Protocol Buffer schemas for type definitions
- Code generation scripts
- Shared configuration

### Backend Service (`/service`)
- Clean architecture with domain-driven design
- gRPC handlers for API endpoints
- SQLite repository layer
- Business logic services

### Mobile Application (`/ui/mobile`)
- Feature-based organization
- Jotai for state management
- TanStack Query for data fetching and caching
- Type-safe gRPC client

## 🔧 Development Philosophy

- **Type Safety First**: gRPC and Protocol Buffers ensure consistent types across stack
- **Local-First**: SQLite database for offline capability and fast performance
- **Monorepo Efficiency**: Shared tooling and dependencies managed by Turborepo
- **Clean Architecture**: Separation of concerns with clear boundaries

## 🛠️ Built With

- [Go](https://golang.org/) - Backend language
- [React Native](https://reactnative.dev/) - Mobile framework
- [gRPC](https://grpc.io/) - RPC framework
- [Protocol Buffers](https://protobuf.dev/) - Interface definition language
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
