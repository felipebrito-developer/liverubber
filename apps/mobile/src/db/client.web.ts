/**
 * Web Mock for @op-engineering/op-sqlite
 * This allows the app to boot in a browser for UI/UX audits
 */

export const open = (options: { name: string }) => {
  console.log(`[WebDB] Mocking database open: ${options.name}`);
  
  return {
    execute: async (sql: string, params?: any[]) => {
      console.log(`[WebDB] Executing SQL: ${sql}`, params);
      // Return a minimal valid response for Drizzle
      return {
        rows: {
          _array: [],
          length: 0,
          item: (i: number) => null,
        },
        rowsAffected: 0,
      };
    },
    executeAsync: async (sql: string, params?: any[]) => {
      return {
        rows: {
          _array: [],
          length: 0,
          item: (i: number) => null,
        },
        rowsAffected: 0,
      };
    },
    transaction: (cb: (tx: any) => void) => {
      cb({
        execute: (sql: string, params: any[], internalCb: any) => {
           internalCb(null, { rows: { _array: [], length: 0 } });
        }
      });
    },
    close: () => {},
  };
};
