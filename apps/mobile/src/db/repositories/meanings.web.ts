import { webDb } from "../client.web";

export const meaningsRepository = {
  getAll: () => webDb.meanings.getAll(),
  getById: (id: string) => webDb.meanings.getAll().then(all => all.find(m => m.id === id)),
  create: (_data: Record<string, unknown>) => Promise.resolve(null),
  update: (_id: string, _data: Record<string, unknown>) => Promise.resolve(null),
  delete: (_id: string) => Promise.resolve(null),
};
