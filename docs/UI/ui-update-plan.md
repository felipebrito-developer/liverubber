---
title: "UI Update Plan"
description: "Implementation strategy for integrating seed data, refining Neuro-UI components, and updating screen-specific logic."
workspace: "apps/mobile"
tags:
  - mobile
  - implementation-log
  - refactor
  - design-system
priority: 2
---

# UI Update Plan - Integrating Seed Data & Neuro-UI Refinement

## Objective
Update the mobile application's UI to utilize the newly seeded Categories, Tags, and Frequencies, ensuring a more dynamic and personalized experience for the user while adhering to Neuro-UI principles.

## 🏁 Phase 1: Data Integration (Frontend Logic)
- **Goal:** Replace hardcoded mock data with the `INITIAL_CATEGORIES`, `INITIAL_TAGS`, and `INITIAL_FREQUENCIES` from `@liverubber/shared`.
- **Tasks:**
    - Update `tasksStore`, `habitsStore`, and `resourcesStore` to fetch types from the database on initialization.
    - Create a `dbConstantsAtom` that holds the available Categories, Tags, and Frequencies for easy access across screens.

## 🎨 Phase 2: Design & Color Sync
- **Goal:** Use the brand-approved hex colors for categories and tags consistently.
- **Tasks:**
    - Update `Card` components to dynamically display the `category_color` or `color_hex` associated with its linked entities.
    - Implement a "Tag Badge" molecule that uses the `color_hex` from the `tag_type` table.

## 🧭 Phase 3: Screen-Specific Updates
### 🧩 Action Hub
- **Energy Filtering:** Implement a robust filter that selects tasks tagged with `Low Energy`, `Balanced Energy`, or `High Energy` based on the user's current selection.
- **Habit Frequency:** Update the Habit creation modal to use the seeded Frequencies (Daily, Work Days, Weekend).

### 📋 Tasks & Goals Screens
- **Modal Refactoring:** Create standalone `TaskCreationModal` and `GoalCreationModal` organisms that include:
    - Multi-select Tag support.
    - Category dropdown (with color indicators).
- **Navigation Drawer:** Ensure the Navigation Drawer's "Header" displays the user's identity card as defined in `ui-screens.md`.

### 📦 Resources Module
- **Category Filter:** Update the resource listing to filter by the new `Resources Management` category by default, but allow cross-searching.

## 🚀 Priority Checklist
1. [ ] Connect `TaskModal` to DB Tags (Urgent, Low Energy, etc.).
2. [ ] Implement "Low Energy" logic in `ActionHubScreen.tsx`.
3. [ ] Sync Category colors in `CategoryItem` components.
4. [ ] Standardize FAB (Floating Action Button) behavior across all screens.

## 🛡️ Clinical Guardrails
- **Rule of One:** Each modal must have one clearly high-contrast "Confirm" button.
- **Time-Blindness:** Frequencies must clearly state when the next occurrence is (e.g., "Daily - Happens Every Day").
