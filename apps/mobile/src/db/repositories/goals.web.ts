import { webDb } from "../client.web";

export const goalsRepository = {
  getAll: () => webDb.goals.getAll(),
  getById: (_id: string) => Promise.resolve(null),
  create: (_data: Record<string, unknown>) => Promise.resolve(null),
  update: (_id: string, _data: Record<string, unknown>) => Promise.resolve(null),
  delete: (_id: string) => Promise.resolve(null),
};
