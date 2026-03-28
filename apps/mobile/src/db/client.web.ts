/**
 * Web-safe DB client — replaces db/client.ts on web platform.
 * Uses in-memory seed data instead of SQLite so all screens render realistically.
 * Drizzle ORM is not used here since op-sqlite is native-only.
 */
import type {
  Habit,
  Meaning,
  NewTask,
  Reward,
  TagType,
  Task,
} from "@liverubber/shared";
import { v4 as uuid } from "uuid";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_TAGS: TagType[] = [
  { id: "tag-low-energy", name: "Low Energy", colorHex: "#FFEB3B", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
  { id: "tag-balanced-energy", name: "Balanced Energy", colorHex: "#FF9800", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
  { id: "tag-high-energy", name: "High Energy", colorHex: "#F44336", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
];

const SEED_MEANINGS: Meaning[] = [
  {
    id: "m1", name: "Health & Vitality", description: "Feeling strong and energetic",
    category: { id: "cat-fitness", name: "Fitness", categoryColor: "#FF5722", description: "Physical health", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
    categoryId: "cat-fitness", externalLink: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null,
  },
  {
    id: "m2", name: "Creative Work", description: "Doing meaningful, focused work",
    category: { id: "cat-professional", name: "Professional", categoryColor: "#607D8B", description: "Work and career", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
    categoryId: "cat-professional", externalLink: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null,
  },
];

const SEED_HABITS: Habit[] = [
  {
    id: "h1", name: "Morning Walk", streakCount: 7, meaningId: "m1",
    startDate: new Date().toISOString(), lastUpdate: null,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null, frequencyId: null,
  },
  {
    id: "h2", name: "Deep Focus Session", streakCount: 14, meaningId: "m2",
    startDate: new Date().toISOString(), lastUpdate: null,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null, frequencyId: null,
  },
  {
    id: "h3", name: "Gratitude Journal", streakCount: 21, meaningId: "m1",
    startDate: new Date().toISOString(), lastUpdate: null,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null, frequencyId: null,
  },
];

const SEED_TASKS: Task[] = [
  {
    id: "t1", title: "Review quarterly goals", description: "Go through goals and adjust priorities",
    status: "pending", priority: "high", goalId: null, parentTaskId: null,
    dueDate: null, tags: [SEED_TAGS[1]],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null,
  },
  {
    id: "t2", title: "Send project update email", description: "Brief summary to stakeholders",
    status: "pending", priority: "urgent", goalId: null, parentTaskId: null,
    dueDate: null, tags: [SEED_TAGS[2]],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null,
  },
  {
    id: "t3", title: "Read 20 pages", description: "Continue current book",
    status: "pending", priority: "low", goalId: null, parentTaskId: null,
    dueDate: null, tags: [SEED_TAGS[0]],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    isSynced: false, lastSyncedAt: null,
  },
];

const SEED_REWARDS: Reward[] = [
  { id: "r1", name: "Coffee break", type: "break", description: "Take a proper coffee break", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
  { id: "r2", name: "Episode reward", type: "celebration", description: "Watch one episode", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
  { id: "r3", name: "New notebook", type: "item", description: "Buy that notebook", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: false, lastSyncedAt: null },
];

// ─── In-memory stores (mutable for CRUD operations during preview) ─────────────

let tasks: Task[] = [...SEED_TASKS];
let habits: Habit[] = [...SEED_HABITS];
let rewards: Reward[] = [...SEED_REWARDS];

// ─── Web-safe DB interface ────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
export const db: any = {}; // placeholder — web stores bypass Drizzle

// ─── Web-safe initialize (no-op) ─────────────────────────────────────────────

export async function initializeDatabase() {
  console.log("[web] Using in-memory seed database — SQLite not available on web");
}

// ─── Repository helpers used by stores ───────────────────────────────────────

export const webDb = {
  tasks: {
    getAll: () => Promise.resolve(tasks),
    create: (data: Omit<NewTask, "id">) => {
      const t = { ...data, id: uuid(), tags: [] } as Task;
      tasks = [...tasks, t];
      return Promise.resolve(t);
    },
  },
  habits: {
    getAll: () => Promise.resolve(habits),
    create: (data: Omit<Habit, "id">) => {
      const h = { ...data, id: uuid() } as Habit;
      habits = [...habits, h];
      return Promise.resolve(h);
    },
    update: (id: string, data: Partial<Habit>) => {
      habits = habits.map((h) => (h.id === id ? { ...h, ...data } : h));
      return Promise.resolve();
    },
    delete: (id: string) => {
      habits = habits.filter((h) => h.id !== id);
      return Promise.resolve();
    },
  },
  rewards: {
    getAll: () => Promise.resolve(rewards),
    create: (data: Omit<Reward, "id">) => {
      const r = { ...data, id: uuid() } as Reward;
      rewards = [...rewards, r];
      return Promise.resolve(r);
    },
    update: (id: string, data: Partial<Reward>) => {
      rewards = rewards.map((r) => (r.id === id ? { ...r, ...data } : r));
      return Promise.resolve();
    },
    delete: (id: string) => {
      rewards = rewards.filter((r) => r.id !== id);
      return Promise.resolve();
    },
  },
  meanings: { getAll: () => Promise.resolve(SEED_MEANINGS) },
  tags: { getAll: () => Promise.resolve(SEED_TAGS) },
  goals: { getAll: () => Promise.resolve([]) },
  categories: { getAll: () => Promise.resolve([]) },
};
