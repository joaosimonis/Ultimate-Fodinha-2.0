export const routes = {
  list: "/api/v1/players",
  getById: (id: string) => `/api/v1/players/${id}`,
  create: "/api/v1/players",
  remove: (id: string) => `/api/v1/players/${id}`,
};