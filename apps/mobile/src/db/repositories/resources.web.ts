export const resourcesRepository = {
  getAllTypes: () => Promise.resolve([]),
  getAllStores: () => Promise.resolve([]),
  getAllAssignments: () => Promise.resolve([]),
  getAllLogs: () => Promise.resolve([]),
  create: (_data: Record<string, unknown>) => Promise.resolve(null),
  update: (_id: string, _data: Record<string, unknown>) => Promise.resolve(null),
  delete: (_id: string) => Promise.resolve(null),
};
