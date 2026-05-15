export const routes = {
  list: "/players",
  getById: (id: string) => `/players/${id}`,
  create: "/players",
  remove: (id: string) => `/players/${id}`,
};
