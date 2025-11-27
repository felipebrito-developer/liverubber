# Project Structure

Here is describe the project structure, to help on LLM's prompts and overall project visibility.

## Project Overview

- Mobile app for file organization and better track of goals and finances.
- Only for Android, but IOS in future.
- Monorepo
- UI and logic separation.
- Local database.

## Architecture

### Architecture Summary

LiveRubber/
├── docs/
├── service/                        # Go backend
├── ui/                             # Multiple Ui folders (Future)
|   └─ mobile/                      # React Native app  
├── shared/                         # Shared resources
├── turbo.json
├── package.json
└── README.md

### Shared

This Folder contains all types structures and generation scripts in gRPC for proto

shared/
├── protos/
│   ├── base/                        # Proto base types
│   │   ├── pagination.proto
│   │   └── common.proto
│   ├── task/v1/                     # Domain version
│   │   ├── task.proto               # Task Entity protos
│   │   └── service.proto            # Task services
└── scripts/                         # Code gen scripts
    └── generate-proto.sh

### Backend

service/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   │   └── grpc/                   # gRPC handlers
│   │       └── task.go
│   ├── service/                    # Services
│   │   └── task/
│   ├── repository/
│   │   └── sqlite/
│   │       └── task.go
│   └── domain/                     # Domains
│       └── task.go
├── utils/
├── migrations/
├── gen/                            # Generated types in Go Lang
├── go.mod
└── go.sum

### Frontend (mobile)

ui
└── mobile/
    ├── src/
    │   ├── lib/
    │   │   ├── api/
    │   │   │   └── client.ts        # gRPC client
    │   │   ├── stores/              # Stores
    │   │   │   └── todo/
    │   │   └── utils/
    │   ├── features/                # App features
    │   │   ├── todo/
    │   │   │   ├── components/
    │   │   │   ├── screens/
    │   │   │   └── hooks/
    │   ├── app/                     # App Configuration
    │   │   ├── navigation/
    │   │   ├── providers/
    │   │   └── App.tsx
    │   └── shared/                  # Shared components
    │       ├── components/
    │       └── ui/
    └── gen/                         # Generated types in TypeScript

## Languages

- gRPC for data type schemas
- Golang
- Typescript
- kotlin for widgets and some native code.

## Main Packages

### Base

- Turborepo monorepo organization.
- Bun as package manager
- gRPC for shared types
- sqlite for local database

### Backend End (local service with logic)

- Golang as primary language
- gin for accessing local database
- Have all business logic about the application

### Front End

- Typescript as primary language
- React Native 0.81.4, only using for android development. But IOS in future
- Native code in Kotlin.
- Jotai as State management.
- TanStack Query for request and cache.
- Biome for Lint.
  