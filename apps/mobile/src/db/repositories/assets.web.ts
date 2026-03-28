export const assetsRepository = {
  getAll: () => Promise.resolve([]),
  getById: (_id: string) => Promise.resolve(null),
  create: (_data: Record<string, unknown>) => Promise.resolve(null),
};
