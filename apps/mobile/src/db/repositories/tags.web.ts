import { webDb } from "../client.web";

export const tagsRepository = {
  getAll: () => webDb.tags.getAll(),
  getById: (id: string) => webDb.tags.getAll().then(all => all.find(t => t.id === id)),
  create: (_data: Record<string, unknown>) => Promise.resolve(null),
  update: (_id: string, _data: Record<string, unknown>) => Promise.resolve(null),
  delete: (_id: string) => Promise.resolve(null),
};
