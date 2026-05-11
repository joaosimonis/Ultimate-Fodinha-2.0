export const routes = {
  list: "/api/v1/matches",
  getById: (id: string) => `/api/v1/matches/${id}`,
  create: "/api/v1/matches",
  addPlayers: (id: string) => `/api/v1/matches/${id}/players`,
  finish: (id: string) => `/api/v1/matches/${id}/finish`,
  getRoomByCode: (roomCode: string) => `/api/v1/rooms/${roomCode}`,
};
