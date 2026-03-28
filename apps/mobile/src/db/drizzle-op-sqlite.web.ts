/**
 * Web no-op for drizzle-orm/op-sqlite adapter.
 * On web we bypass Drizzle entirely — use client.web.ts webDb instead.
 */
export const drizzle = () => {
  return {}; // empty db object — stores use webDb on web
};
