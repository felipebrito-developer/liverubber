# 🧩 UI Component Knowledge Base

> **System Note for Mobile Architect**: Before creating any new UI component, SEARCH this index. Prefer **Compound Components** and existing Atoms/Molecules.

## ⚛️ Atoms (Fundamental Building Blocks)
- **`Button.tsx`** | Tags: `[action, interaction, compound-ready]` | Standard clickable element.
- **`FAB.tsx`** | Tags: `[floating, action, primary]` | Floating action button for main screen actions.
- **`Input.tsx`** | Tags: `[form, text, text-input]` | Standard text input field.
- **`Select.tsx`** | Tags: `[form, dropdown, choice]` | Dropdown selection component.
- **`Typography.tsx`** | Tags: `[text, heading, paragraph]` | All text rendering. Strict neuro-inclusive font scaling.

## 🧬 Molecules (Compound Building Blocks)
- **`Accordion.tsx`** | Tags: `[layout, expandable, compound]` | Expandable list section.
- **`Card.tsx`** | Tags: `[container, surface, compound-ready]` | Base surface for grouping related information.
- **`EmptyState.tsx`** | Tags: `[feedback, placeholder, neuro-ui]` | Visual feedback when lists/data are empty.
- **`FormField.tsx`** | Tags: `[form, compound]` | Composes `Input` or `Select` with labels and error messages.
- **`ProgressPizza.tsx`** | Tags: `[visualization, chart, adhd-friendly]` | Visual representation of task/goal completion.
- **`ScreenHeader.tsx`** | Tags: `[navigation, layout]` | Standardized top header for screens.
- **`UserIdentityCard.tsx`** | Tags: `[profile, user]` | Displays user avatar and high-level info.

## 🦠 Organisms (Complex Feature Components)
- **`GlobalDrawerContent.tsx`** | Tags: `[navigation, global]` | Side drawer navigation menu.
- **`GoalCreationModal.tsx`** | Tags: `[modal, form, meaning]` | Modal flow for creating a new Goal.
- **`LogisticalGateOverlay.tsx`** | Tags: `[overlay, adhd, preflight]` | Preflight checklist/barrier before starting a focus block.
- **`MeaningCreationModal.tsx`** | Tags: `[modal, form, meaning]` | Modal flow for creating new Meaning pillars.
- **`TaskCreationModal.tsx`** | Tags: `[modal, form, action]` | Modal flow for creating a new Task.
- **`WIPScreen.tsx`** | Tags: `[placeholder, dev]` | Work In Progress screen placeholder.
