## 🏗️ The 4-Screen Blueprint

### 1. Screen: The "Meaning" Dashboard (The Strategy)

* **Purpose:** To combat the "emptiness" of depression. This is the only place you see the "Big Picture."
* **UI Layout:** A vertical card stack of **Meanings**.
* **Key Interaction:** Tapping a Meaning Card reveals the **Goals** attached to it via an "Accordion" (Progressive Disclosure).
* **Why it works:** It keeps the "North Star" visible. If you feel lost, this screen reminds you *why* you are trying.

### 2. Screen: The "Action Hub" (The Operational)

* **Purpose:** To solve decision paralysis.
* **UI Layout:** Divided into two sections: **"Habits for Today"** and **"Next Tasks."**
* **Energy Filter (Crucial):** At the top, a 3-button toggle: **[Low Energy] [Balanced] [Hyperfocus]**.
* *Logic:* Clicking "Low Energy" hides all high-difficulty activities and only shows the "Small Wins" (e.g., "5 min stretch").


* **Why it works:** It prevents the "Wall of Awful." It only shows what is relevant to your current capacity.

### 3. Screen: The "Now" View (The Execution)

* **Purpose:** Focus. This is the screen we generated in the mockup.
* **UI Layout:** Immersive mode. One Task. One Timer.
* **Inventory Check:** Before this screen opens, a **"Pre-flight Checklist"** modal pops up: *"Do you have [Requirement X] and [Requirement Y]?"*
* **Why it works:** It stops the "Flow Interruption" (ADHD killer) of starting a task and realizing you don't have the materials.

### 4. Screen: The "Reflection Log" (The Audit)

* **Purpose:** To correlate productivity with mental health.
* **UI Layout:** A calendar or list view of `Activity_Logs`.
* **Visual Integration:** A graph showing the correlation between **Tasks Completed** and **Mood Score**.
* **Why it works:** It provides objective proof that "Action leads to better Mood," which is vital for treating depression.

---

## 🚦 Best Placement for Key Features

| Feature | Best Placement | Neuro-Logic |
| --- | --- | --- |
| **Energy Filter** | Fixed at the top of the **Action Hub**. | Must be the first thing you decide so the list feels "doable." |
| **Inventory Alerts** | As a **Blocking Modal** before "Focus Mode" starts. | Prevents the frustration of forgetting items halfway through. |
| **Meaning Tags** | Small badges on **every** Task card. | Constant dopamine reinforcement of "The Why." |
| **Subtask Slicing** | Inside the **Task Detail** drawer. | Uses `parent_id` to show only the *next* step, not the whole list. |

---

## 🛠️ The "Neuro-Flow" (User Journey)

1. **Entry:** App opens to the **Action Hub**.
2. **Filter:** User selects **"Low Energy"** because they are feeling depressed.
3. **Selection:** User picks a task. The app checks **Requirements** (Materials).
4. **Transition:** User enters **Focus Mode** (The "Now" Screen).
5. **Completion:** User logs **Mood (1-5)**.
6. **Reward:** The app shows the **Meaning Anchor** ("You just moved closer to: [Meaning Name]").

---

## 📋 Screen Implementation Status

| Screen | Status | Role |
| --- | --- | --- |
| **Meaning Dashboard** | ✅ Done | Strategy & Big Picture |
| **Action Hub** | 🔄 In Progress | Operational (Needs Habits/Rewards) |
| **Now Screen** | ✅ Done | Execution (Focus Mode) |
| **Reflection Log** | ✅ Done | Audit & Celebration |
| **Resources** | ✅ Done | Asset Management |
| **Habits Manager** | ⏳ Missing | Recurrence & Consistency |
| **Rewards Gallery** | ⏳ Missing | Dopamine Hub |
