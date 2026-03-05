# UI Structure

## Architecture Summary
 
 - Only Android App with React Native (first MVP)
 - Lint Libs: TypeScript, Biome
 - Design Patterns: Atomic Design(only for reusable components), Feature-based for the rest.
 - State Management: Jotai (global state), TanStack Query (server state)
 - UI libs: React Native Paper, React Native Reanimated, React Native Gesture Handler
 - Navigation: React Navigation

## Folder Structure

```
src/
├── components/          # Reusable UI components (Atomic Design)
│   ├── atoms/           # Buttons, Inputs, Typography, etc.
│   ├── molecules/       # Compound components
│   └── organisms/       # Complex components
├── features/            # Feature-based modules
│   ├── auth/
│   ├── tasks/
├── navigation/          # Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── stores/              # Jotai atoms
│   ├── authStore.ts
│   └── tasksStore.ts
├── services/            # API clients and services
│   ├── api.ts
│   └── tasksService.ts
├── utils/               # Utility functions
├── theme/               # Theme configuration
└── App.tsx              # Root component
```

### Road Map
- [ ] Define component structure and templates.
- [ ] Use a simple design for the app screens.
- [ ] Create a simple Welcome page.
- [ ] Create a simple Login page.
- [ ] Create a simple Register page.
- [ ] Create a simple Home page.
- [ ] Create a simple Tasks page.
- [ ] Create a simple Tasks page.
- [ ] Integrate TanStack Query with `ai-bridge` endpoints.


