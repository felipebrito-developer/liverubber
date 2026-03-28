import { webDb } from "../client.web";

export const rewardsRepository = {
  getAll: () => webDb.rewards.getAll(),
  getById: (id: string) => webDb.rewards.getAll().then(all => all.find(r => r.id === id)),
  create: (data: Parameters<typeof webDb.rewards.create>[0]) => webDb.rewards.create(data),
  update: (id: string, data: Record<string, unknown>) => webDb.rewards.update(id, data as never),
  delete: (id: string) => webDb.rewards.delete(id),
};
