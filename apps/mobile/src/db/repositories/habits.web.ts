import { webDb } from "../client.web";

export const habitsRepository = {
  getAll: () => webDb.habits.getAll(),
  getById: (id: string) => webDb.habits.getAll().then(all => all.find(h => h.id === id)),
  create: (data: Parameters<typeof webDb.habits.create>[0]) => webDb.habits.create(data),
  update: (id: string, data: Record<string, unknown>) => webDb.habits.update(id, data as never),
  delete: (id: string) => webDb.habits.delete(id),
};
