---
title: "UI Screens Blueprint"
description: "Visual and structural breakdown of all application screens, from the Global Drawer to the specialized Fitness Module."
workspace: "apps/mobile"
tags:
  - mobile
  - screens
  - blueprint
  - modular-ui
priority: 1
---

# 🏗️ Modular Blueprint: Purpose & Action

## 🧭 The Global Drawer (Navigation)
* **Header: User Identity Card**
    * Avatar Placeholder (Circle) + Name + Age.
    * *Neuro-Logic:* Reinforces self-identity and age-awareness (combats "time-blindness" regarding life stages).
* **Navigation List:** Focus, Goals Management, Store, Fitness, Settings.
* **Footer:** App Version + Logout (Secondary prominence to avoid accidental exits).

## 1. Focus Module (The "Daily Front-End")
* **Tab 1: User Progress (Entry Screen)**
    * **Visual:** Pizza Graphs (Pie Charts) for Overall Progress.
    * **Cards:** One for Goal progress, one for Fitness progress.
    * **Summary:** Today's events list (minimalist).
* **Tab 2: Now Screen**
    * Improved Focus Mode: Zero-distraction UI with the "Meaning Anchor".
* **Tab 3: Action Hub**
    * Energy-filtered task selection.

## 2. Goals Management (The "Strategic Layer")
* **Tab 1: Goals Dashboard**
    * Pizza Graphs for task completion per Goal.
* **Tab 2: Task Backlog**
    * Filterable list. **FAB:** Opens a **Full-Screen Modal** (better for complex input like resources/dates).
* **Tab 3: Goals Backlog**
    * Filterable list. **FAB:** Full-Screen Modal for new Goals + Meaning linking.
* **Tab 4: Reflection Log**
    * Mood vs. Activity correlation.

## 3. Store (The "Logistical Layer")
* **Tab 1: Resource Dashboard**
    * Categorized cards showing "Inventory Health."
* **Tab 2: Management Store**
    * Category filter + FAB for adding resources.
* **Tab 3: Resource Audit**
    * Log of additions/removals (Transaction history).

## 4. Fitness Module (The "Proprioception Layer")
* **Tab 1: Fitness Dashboard**
    * Weekly progress cards + Today's Exercise list.
* **Tab 2: Execution Screen (Neuro-Possibilities)**
    * *Option A: The Rhythmic Pacer:* Visual/Audio pulses to help with motor planning and focus.
    * *Option B: Mirror Mode:* Minimalist gif/video loops to ground the user in their body (Proprioception).
* **Tab 3: Planning**
    * Task-tree view for planning body-part-specific sessions.

## 6. Layout Wireframes
For detailed text-based visualizations of screen positions and structural layouts, refer to the following wireframes in `docs/UI/wireframes/`:

* **[Global Navigation Drawer](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Global_Nav_Drawer_Wireframe.txt)**: Identity card and module routing.
* **[Action Hub](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/ActionHub_Wireframe.txt)**: Daily execution and energy filtering.
* **[Now Screen](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/NowScreen_Wireframe.txt)**: Focus timer and pre-flight flow.
* **[Tasks Backlog](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/TasksBacklog_Wireframe.txt)**: Strategic planning and task elevation.
* **[Strategy Hub](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Goals_Strategic_Wireframes.txt)**: Goals dashboard (Pizza graphs) and backlog.
* **[Reflection Log](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Reflection_Log_Wireframe.txt)**: Mood vs. Activity analytics.
* **[Store Management](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Resource_Management_Wireframes.txt)**: Inventory (Assets) and audit history.
* **[Fitness Advanced](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Fitness_Advanced_Wireframes.txt)**: Bio-execution (Mirror/Pacer) and planning.
* **[Meaning & Identity](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Meaning_Identity_Wireframes.txt)**: Goal-anchoring dashboard and onboarding.
* **[Session Evolution](file:///home/felip/projects/LiveRubber/docs/UI/wireframes/Session_Evolution_Wireframes.txt)**: Break timer and pre-session mission briefing.