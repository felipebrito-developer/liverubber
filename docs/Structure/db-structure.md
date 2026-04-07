---
title: "Database Structure & Schema"
description: "Reference for table entities, relationships, and data seeding patterns in the LiveRubber monorepo."
tags:
  - db
  - schema
  - architecture
  - mapping
priority: 1
---

# 🏛️ Database Structure & Schema Reference

This document provides a high-density reference for the database schema used in **LiveRubber**. Use this to feed an AI when you need to generate new data, seed scripts, or modify logic.

## 🚀 Key Architectural Concepts
1. **Strategic Hierarchy**: Everything is grounded in `meanings` via `categories`. Goals (`goal`) link to those categories, and `tasks` link to goals.
2. **Tagging (Neuro-UI)**: Tasks are filtered by `tags` (especially energy levels like `tag-low-energy`) to reduce cognitive load.
3. **Auditing**: Every record contains `isSynced` and `lastSyncedAt` for local-first synchronization.

---

## 🛠️ Core Entities

### 🏷️ 1. Taxonomy & Filtering
| Table      | Description                                   | Key Columns                   | Relationships                         |
| :--------- | :-------------------------------------------- | :---------------------------- | :------------------------------------ |
| `category` | High-level pillars (e.g., Strategic, Health). | `id`, `name`, `categoryColor` | Root for goals/meanings.              |
| `tag`      | Semantic labels (e.g., #urgent, #low-energy). | `id`, `name`, `color`         | Associated with tasks via `task_tag`. |
| `meaning`  | Purpose-driven values (e.g., Family, Wealth). | `id`, `name`, `categoryId`    | Belongs to a **category**.            |

### 🧭 2. Strategy & Goals
| Table     | Description                               | Key Columns                           | Relationships                        |
| :-------- | :---------------------------------------- | :------------------------------------ | :----------------------------------- |
| `goal`    | High-level objectives to be achieved.     | `id`, `title`, `categoryId`, `status` | Contains **outcomes** and **tasks**. |
| `outcome` | Quantifiable results expected for a goal. | `id`, `goalId`, `title`, `isAchieved` | Belongs to a **goal**.               |

### ✅ 3. Execution & Progress
| Table    | Description                                      | Key Columns                                       | Relationships                                       |
| :------- | :----------------------------------------------- | :------------------------------------------------ | :-------------------------------------------------- |
| `task`   | Individual units of work.                        | `id`, `goalId`, `is_for_today`, `title`, `status` | Optionally nested (subtasks) or linked to **goal**. |
| `habit`  | Recurring actions for behavioral conditioning.   | `id`, `name`, `meaningId`, `streakCount`          | Linked to **meaning** for purpose alignment.        |
| `reward` | Dopamine-driven incentives for completing tasks. | `id`, `name`, `type`, `description`               | System-wide engagement layer.                       |

### 💎 4. Resource Logistics
| Table            | Description                                   | Key Columns                                | Relationships                          |
| :--------------- | :-------------------------------------------- | :----------------------------------------- | :------------------------------------- |
| `resource_type`  | Definitions for resources (Money, Health).    | `id`, `name`, `categoryId`, `amountType`   | Linked to **category** for strategy.   |
| `resource_store` | The actual numeric reserve of a resource.     | `id`, `resourceTypeId`, `amount`           | Associated with a specific **type**.   |
| `resource_log`   | Individual transactions/shifts in resources. | `id`, `resourceId`, `amountChange`, `type` | Historical ledger of **store** shifts. |

---

## 🧪 AI Seeding Prompt Example
Feed this to the AI: *"Using the LiveRubber schema, generate 5 new tasks linked to a 'Wealth' goal, including energy tags and parent task nesting for sub-tasks."*

```json
{
  "tasks": [
    { 
      "id": "task-001", 
      "goalId": "goal-wealth-01", 
      "is_for_today": true,
      "title": "Quarterly Portfolio Review", 
      "priority": "high",
      "tags": ["tag-high-energy"]
    },
    { 
      "id": "task-002", 
      "parentTaskId": "task-001", 
      "title": "Check asset allocation", 
      "status": "todo"
    }
  ]
}
```

## 🛰️ System Ledger
- **`audit_log`**: Tracks row-level synchronization status.
- **`user_log`**: Aggregates daily mood and energy metadata.
- **`habit_log`**: Tracks completion history for individual habits.
- **`resource_log`**: Detailed historical audit trail of all resource fluctuations.
