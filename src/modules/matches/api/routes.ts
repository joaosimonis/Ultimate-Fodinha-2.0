export const routes = {
  list: "/matches",
  getById: (id: string) => `/matches/${id}`,
  create: "/matches",
  addPlayers: (id: string) => `/matches/${id}/players`,
  finish: (id: string) => `/matches/${id}/finish`,
  getRoomByCode: (roomCode: string) => `/rooms/${roomCode}`,
  cancelByRoomCode: (roomCode: string) => `/admin/matches/room/${roomCode}/cancel`,
};
