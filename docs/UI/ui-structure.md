---
title: "UI Folder Structure"
description: "Feature-based directory organization and React Navigation hierarchy for the mobile app."
workspace: "apps/mobile"
tags:
  - mobile
  - directory-map
  - navigation-stack
  - architecture
priority: 2
---

# UI Structure (MVP v2)

## 📁 Feature-Based Folder Structure

src/features/
├── drawer/              # Drawer & Profile Card
├── focus/               # Progress, Now Screen, Action Hub
├── goals/               # Dashboards, Backlogs, Reflection
├── store/               # Inventory & Audit
├── fitness/             # Dashboards, Execution, Planning
└── settings/            # User Profile & Theme

## 🛣️ UI CRUD & Navigation Roadmap
... [Previous Roadmap] ...
- **Navigation Drawer**: [ ] Profile Card [ ] Module List [ ] Footer
- **Focus Module**: [ ] Progress Graph [ ] Event Summary
- **Fitness Module**: [ ] Category Filter [ ] Execution View

### 🛠️ Navigation Setup (React Navigation)
- **Root**: DrawerNavigator
    - **FocusStack**: BottomTabNavigator
    - **GoalsStack**: BottomTabNavigator
    - **StoreStack**: BottomTabNavigator
    - **FitnessStack**: BottomTabNavigator
    - **SettingsScreen**: Single View

## 🧠 PhD Neuro-Recommendation: Fitness Execution
**[IMPLEMENTED]** The Fitness Execution Screen utilizes a **"Flow-State Timer"** approach. We've deployed a large, singular visual (expanding/contracting circle) that guides breathing and tempo. This is paired with a **Circular Rest Timer** to maintain neurological engagement during recovery, effectively reducing the "Executive Gap".