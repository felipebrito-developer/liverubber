import { webDb } from "../client.web";

export const tasksRepository = {
  getAll: () => webDb.tasks.getAll(),
  getById: (id: string) => webDb.tasks.getAll().then(all => all.find(t => t.id === id)),
  create: (data: Parameters<typeof webDb.tasks.create>[0], _tagIds?: string[]) => webDb.tasks.create(data),
  update: (_id: string, _data: Record<string, unknown>) => Promise.resolve([]),
  delete: (_id: string) => Promise.resolve([]),
};
