---
title: "Mobile Roadmap"
description: "Detailed progress and next steps for the React Native application."
workspace: "apps/mobile"
tags:
  - react-native
  - jotai
  - neuro-ui
priority: 1
---

# 📱 Mobile Roadmap

## ✅ Completed
- [x] Initial React Native 0.84.4 configuration.
- [x] Core Neuro-UI design system implementation.
- [x] StrategicTabs and AppDrawer navigation structure.
- [x] Jotai state management for tasks and goals.
- [x] Standardized ScreenHeader and FAB absolute positioning.
- [x] **Logistical Module**: Resources screen with quick adjustments and audit trail.
- [x] **Proprioception Module**: Fitness dashboard, rhythm pacer, and planning view.
- [x] **Focus (Now) Screen**: Integrated task picker, high-contrast timer, and trajectory summary cards.
- [x] **Daily Hub**: Task promotion from backlog to 'Today' list and sticky energy-cost filtering.
- [x] **Auth Layer**: Google Login implementation with local persistence. (Awaiting `google-services.json` for final release validation).
- [x] **Logistical Gate**: Unified pre-session ritual system.
- [x] **Full MVP UI Wireframes**: All screens documented in `docs/UI/wireframes/`.

## 🚧 In Progress
- [ ] **Google Sign-In Activation**: Awaiting Firebase configuration and `google-services.json` upload.
- [ ] Gesture handling refinement for task swipe actions.
- [ ] Dark Mode consistency check across all features.
- [ ] Refinement of the 'Mirror Mode' visual feedback placeholder.

## 📋 Backlog
- [ ] React Native Web support for visual previewing via `expo` or `react-native-web`.
- [ ] WatermelonDB integration for high-performance SQLite sync.
- [ ] **Release Configuration**: Add `google-services.json` to `apps/mobile/android/app/`.
    *   **Registered SHA-1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
