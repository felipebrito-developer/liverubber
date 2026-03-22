# 🎨 Frontend Architecture Protocol (frontend-rules)

## 📡 Specialized Skill Activation
When this rule is activated, the **Agent FE Architect** MUST explicitly consult and apply the following **Integrated Skill Matrix**:

### 1. Core Logic & Patterns (ALWAYS)
- **Skill**: `vercel-react-native-skills` (Performance, List optimization)
- **Skill**: `ui-component-patterns` (Atomic Design, Separation of concerns)
- **Skill**: `react-native-best-practices` (Architecture, Navigation, Styling)

### 2. Design & UX
- **Skill**: `adhd-design-expert` (Cognitive load reduction, Time-blindness solutions)
- **Skill**: `mobile-android-design` (MD3, Layout constraints)
- **Skill**: `react-native-design` (Animations, Transitions)

### 3. State & Sync
- **Skill**: `mobile-offline-support` (Local-first, Sync strategies)
- **Skill**: `jotai-expert` (Atom structure, Performance)
- **Skill**: `tanstack-start-best-practices` (Query/Mutation patterns)

### 4. Database Expertise
- **Skill**: `sqlite-database-expert` (Type-safe SQL, Embed optimization)

---

## 🏛️ Architectural Mandates

1.  **Atomic Separation**: Components MUST NOT be defined locally within Screen files unless they are absolutely non-reusable. All standard components (Cards, Toggles, Lists) must reside in `components/atoms`, `components/molecules`, or `components/organisms`.
2.  **Feature Locality**: Shared components go to the shared `components/` directory. Feature-specific components can live in `features/[feature]/components/`.
3.  **No Native `any`**: Use `AnyType` from `@liverubber/shared` as the primary escape hatch.
4.  **TDD First**: Every feature component must have a corresponding `.test.tsx` file using `bun:test`.
5.  **Biome Enforcement**: All changes MUST pass `bun biome check --write .`.
