# Project Structure

## Architecture Summary
LiveRubber/
├── docs/                           # General project documentation
├── service/                        # Node.js + SQLite + MCP Server
├── ai-bridge/                      # AI Orchestrator (Ollama & Gemini)
├── ui/
│   └── mobile/                     # React Native App
├── shared/                         # Shared TS Types
├── packages/
│   └── security/                   # Anonymization & Encryption Logic
├── turbo.json
└── package.json


## Workspace Details

### AI-Bridge (`apps/ai-bridge`)
The "Brain" of the application. It handles all LLM interactions.
- Uses **Ollama** via the `ollama` provider for local privacy.
- Uses **Gemini Flash** for high-reasoning tasks.
- Connects to `service` via **MCP** to read/write to the database.

### Backend (`apps/service`)
Acts as the **Source of Truth** and **Data Provider**.
- `src/internal/mcp/server.ts`: The entry point for the MCP protocol.
- `src/internal/repository/sqlite/`: Standard repository pattern for SQLite.

### Security (`packages/security`)
- **Scrubber**: Utility to remove names/IDs from strings before cloud transmission.
- **Crypto**: Handles local data encryption.

## Tech Stack (Updated)
- **Local AI**: Ollama (DeepSeek-Coder / Llama 3).
- **Cloud AI**: Gemini 1.5 Flash (via Vercel AI SDK).
- **Protocol**: Model Context Protocol (MCP).
- **Runtime**: Bun 1.3+ (WSL2 with CUDA/GPU support).