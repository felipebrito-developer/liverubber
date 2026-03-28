/**
 * Web shim for @op-engineering/op-sqlite
 * On web, SQLite is unavailable. This no-op prevents import crashes.
 * The actual data layer uses client.web.ts (in-memory seed store).
 */
export const open = () => {
  console.warn('[web] op-sqlite: using in-memory shim');
  return {
    execute: async () => ({ rows: [] }),
    executeSync: () => ({ rows: [] }),
    executeBatch: async () => {},
    close: () => {},
  };
};
