This Markdown file is designed to be fed directly into an AI UI Agent (like Antigravityy). It acts as the "Cognitive Operating System" for the application, ensuring every design choice serves a clinical purpose for ADHD and Depression recovery.

---

### `neuro_ui_principles.md`

# 🧠 Neuro-Emancipatory UI: Executive Function Blueprint

**Role:** AI UI Architect for Neurodivergent Brains (ADHD & Depression)

**Objective:** Externalize the Prefrontal Cortex (PFC) through low-friction, meaning-driven Android design.

---

## 1. Core Neuro-Principles (The "Why")

Before generating any screen, the Agent must adhere to these three biological constraints:

1. **The Rule of One (Cognitive Load):** A brain with executive dysfunction cannot prioritize multiple competing stimuli. **Rule:** One primary CTA (Call to Action) per screen.
2. **Dopamine Quality Control:** Replace "Cheap Dopamine" (endless scrolling/streaks) with "High-Quality Dopamine" (Values-based achievement). **Rule:** Every task must be linked to a "Meaning" or "Value."
3. **The 10-Minute Slicing Law:** Large tasks trigger the "Freeze" response (Amygdala hijack). **Rule:** Any task estimated over 15 minutes must be visually broken into "Micro-steps."

---

## 2. Visual & Sensory Standards (Android Material 3)

* **Color Palette:** Use "Low-Arousal" tones.
* *Background:* `#121212` (Deep Slate) to reduce light sensitivity.
* *Primary:* `#A8B5A2` (Muted Sage) for calmness.
* *Accent:* `#D4AF37` (Soft Gold) for "Meaning" highlights.
* *Avoid:* Neon red or high-vibrancy blues that trigger anxiety.


* **Typography:** * Minimum `16sp` for body text.
* Line-height: `1.5x` standard to prevent "text swimming" during brain fog.


* **Haptics:** Short, subtle vibrations on task completion (positive reinforcement) and no vibration for errors (to avoid RSD - Rejection Sensitive Dysphoria).

---

## 3. The Three Essential Screens: Architecture

### Screen A: The "Brain Dump" (Task Capture)

* **Input Type:** Single, centered text field.
* **Agent Logic:** If the user types a "Vague Task" (e.g., "Study"), the AI must prompt: *"That's a big one. What is the very first page you'll open?"*
* **Pattern:** **Linear Expansion.** As the user types, sub-tasks appear below in a "faded" state to show progress without overwhelming.

### Screen B: The "Meaning Hub" (Goal Setting)

* **Layout:** Vertical Card Stack.
* **Card Components:** 1.  **Value Icon:** (e.g., A heart for 'Relationships').
2.  **Meaning Statement:** "I am doing this because [Personal Value]."
3.  **Active Tasks:** Only the top 2 tasks associated with this goal.
* **Pattern:** **Contextual Anchoring.** The "Why" must always be physically placed above the "What."

### Screen C: The "Now" View (Focus Mode)

* **Layout:** Full-screen immersive mode.
* **Visuals:** * Center: The current Micro-step in Bold.
* Bottom: A "Visual Progress Bar" (Horizontal, slowly filling) to combat **Time Blindness**.
* **The "Recalibrate" Button:** Replace "Delete" or "Cancel" with "Recalibrate." This opens a menu to snooze the task without the "Failure" stigma.

---

## 4. UI Patterns & Behavior Rules

| Pattern Name | Trigger | UI Action | Clinical Goal |
| --- | --- | --- | --- |
| **The Friction Gate** | High-cost financial tasks | 3-second "Hold to Confirm" with a breathing animation. | Dampen Impulsivity. |
| **The Ghost List** | >5 tasks on screen | Blur or hide tasks 4-5. Only show the top 3. | Prevent Choice Paralysis. |
| **Meaning-Linker** | Creating a new goal | AI suggests: "How does this make your life better?" | Activate the Reward System. |
| **The Win Loop** | Task Completion | A non-intrusive modal: "Your future self is proud." | Combat Anedonia/Depression. |

---

## 5. Implementation Instructions for AI Agent

1. **Always** use `FloatingActionButton` for the "Capture" phase, but hide it during "Focus Mode."
2. **Never** use "Red" for overdue tasks; use "Muted Orange" and change the text to "Let's try again?"
3. **Implement** "Progressive Disclosure": Hide complex settings or data behind a "More Info" icon to keep the main interface "clean."
4. **Android Specific:** Ensure all navigation uses the **Bottom Navigation Bar** for one-handed use (reducing motor effort).
