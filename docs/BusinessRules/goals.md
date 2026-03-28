---
title: "Project Goals"
description: "Foundational objectives for ADHD and Depression support. Strategic, Structural, and Operational layers."
workspace: "global"
tags:
  - mission
  - adhd
  - depression
  - psychology
priority: 1
---

## 🧩 Ecosystem Summary: "Purpose & Action"

The core objective is to **reduce cognitive load** (critical for ADHD) and **reinforce purpose** (critical for depression).

### 1. The Strategic Layer (The "Why")

* **Entity: `Meanings**`
* **Need:** Combat the "emptiness" and lack of motivation often found in depression.
* **Solution:** Every goal or habit is anchored to a Meaning. It serves as an emotional North Star.
* **Spec:** Title, Intrinsic Motivation (Why), Color Tag, and Category.


* **Entity: `Goals**`
* **Need:** Turn abstract desires into concrete targets.
* **Solution:** Visual progress tracking linked directly to a Meaning.
* **Spec:** Status, Deadline, and Parent ID (Meaning).



### 2. The Structural Layer (The "How")

* **Entity: `Activities` (The Catalog)**
* **Need:** Eliminate decision paralysis ("I don't know where to start").
* **Solution:** A library of "templates." You define "Exercise" or "Reading" once; the app automates the details.
* **Spec:** Icon, Default Units, and **Energy Cost** (Low/Medium/High).


* **Entity: `Frequencies**`
* **Need:** Flexibility for minds that don't operate in straight lines.
* **Solution:** Supports "Flexible Habits" (e.g., "3x per week") instead of rigid dates, reducing the "failure guilt" common in depression.



### 3. The Operational Layer (The "Now")

* **Entity: `Tasks` & `Habits**`
* **Need:** Break down overwhelming projects.
* **Solution:** **Self-referencing hierarchy** (subtasks) and "Requirement Inheritance" from Activities.
* **Spec:** Parent_ID for infinite nesting and Status tracking.


* **Entity: `Activity_Logs**`
* **Need:** Immediate dopamine hits and mood tracking.
* **Solution:** A historical record that includes a **Mood Rating** to correlate productivity with mental health.
* **Spec:** Timestamp, Amount Achieved, and Mood Score (1-5).



### 4. The Logistical Layer (The Support)

* **Entity: `Requirements` & `Assignments**`
* **Need:** Prevent "Flow Interruption" due to missing materials (the ADHD hyperfocus killer).
* **Solution:** Inventory management and automatic preparation checklists.
* **Spec:** Current balance, Minimum threshold, and a Polymorphic link to any action.

---

## 🛠 Solutions for Mental "Friction Points"

| Friction Point | App Solution | Technical Implementation |
| --- | --- | --- |
| **Overwhelmed by Choice** | **Focus Mode UI** | Displays only one Subtask and its immediate Requirements. |
| **"Out of Sight, Out of Mind"** | **Smart Inventory** | Alerts you if you lack materials *before* you start a task. |
| **Lack of Energy** | **Energy Filter** | Suggests "Low Energy" Activities during depressive episodes. |
| **"Time Blindness"** | **Estimated Time** | Adds a time-dimension to tasks to help visualize the day. |

---

## ✨ Final Database Architecture (Consolidated)

You now have a **normalized, relational schema** that supports:

1. **Polymorphism:** Requirements can belong to anything (Task, Goal, Event, etc.).
2. **Recursion:** Tasks can have infinite subtasks via `parent_id`.
3. **Audit Trails:** Logs track your activity and your mood independently.
4. **Resource Management:** A transaction-based system for money and materials.
