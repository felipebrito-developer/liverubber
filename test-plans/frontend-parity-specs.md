# 🧪 Test Specifications: Frontend Feature Parity

**Author**: `agent-qa-specialist`
**Status**: Specification Phase (Do NOT execute tests yet)
**Target Areas**: Focus Module, Preflight Checklist, Fitness Execution

## 1. Focus Module (Daily Progress & Mood Tracking)
### Feature: Trajectory Summary & Mood Entry
- **Scenario**: User views their daily trajectory
  - `Given` the user is on the Focus Module screen
  - `When` the daily trajectory data is loaded from the local database
  - `Then` the UI should render the `ProgressPizza` molecule with correct percentages
  - `And` the mood tracking card should be visible.
- **Scenario**: User inputs daily mood
  - `Given` the user has not logged their mood today
  - `When` the user taps a mood option on the Mood Tracking Card
  - `Then` the selection should be visually highlighted (Neuro-UI feedback)
  - `And` the state should update in the Jotai store asynchronously.

## 2. Logistical Gate / Preflight Checklist
### Feature: Unified Preflight Modal
- **Scenario**: Initiating a Focus Session
  - `Given` the user attempts to start a deep-work/focus session
  - `When` the `LogisticalGateOverlay` organism mounts
  - `Then` it should render as a single unified checklist
  - `And` it must enforce explicit tactile confirmation (e.g., toggles) rather than implicit gestures
  - `And` the "Start Session" button remains disabled until all mandatory items are toggled.

## 3. Fitness Execution
### Feature: Active Control Card & Rest Timer
- **Scenario**: Resting between sets
  - `Given` the user is in an active fitness session
  - `When` a set is marked as complete
  - `Then` the `RestTimer` component should appear
  - `And` the countdown should begin automatically based on user settings
- **Scenario**: Modifying the active exercise
  - `Given` the `ActiveControlCard` is visible
  - `When` the user taps the weight or rep adjustment buttons
  - `Then` the UI should provide immediate haptic and visual feedback
  - `And` the local state should reflect the new values instantly (optimistic UI).
