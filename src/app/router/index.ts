import { createRouter, createWebHistory } from "vue-router";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";

import HomePage from "@/modules/home/pages/HomePage.vue";
import TrucoSetupPage from "@/modules/truco/pages/TrucoSetupPage.vue";
import TrucoGamePage from '@/modules/truco/pages/TrucoGamePage.vue'
import FodinhaSetupPage from "@/modules/fodinha/pages/FodinhaSetupPage.vue";
import FodinhaGamePage from "@/modules/fodinha/pages/FodinhaGamePage.vue";
import RankingPage from "@/modules/ranking/pages/RankingPage.vue";
import PlayersPage from "@/modules/players/pages/PlayersPage.vue";
import PlayersProfilePage from "@/modules/players/pages/PlayersProfilePage.vue";
import RoomsPage from "@/modules/rooms/pages/RoomsPage.vue";
import RoomEntryPage from "@/modules/rooms/pages/RoomEntryPage.vue";
import AdminPlayersPage from "@/modules/auth/pages/AdminPlayersPage.vue";
import { adminAuthStorage } from "@/modules/auth/storage/adminAuthStorage";

const getRouteParam = (param: string | string[] | undefined) => (Array.isArray(param) ? param[0] : param);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },

    { path: "/truco/setup", name: "truco-setup", component: TrucoSetupPage },
    {
      path: "/truco/game/:roomCode?",
      name: "truco-game",
      component: TrucoGamePage,
      beforeEnter: (to) => {
        const trucoStore = useTrucoStore();

        if (!trucoStore.hasGame) {
          const roomCode = getRouteParam(to.params.roomCode);

          if (roomCode) {
            return { name: "room-entry", params: { roomCode } };
          }

          return { name: "truco-setup" };
        }
      },
    },

    { path: "/fodinha/setup", name: "fodinha-setup", component: FodinhaSetupPage },
    {
      path: "/fodinha/game/:roomCode?",
      name: "fodinha-game",
      component: FodinhaGamePage,
      beforeEnter: (to) => {
        const fodinhaStore = useFodinhaStore();

        if (!fodinhaStore.hasGame) {
          const roomCode = getRouteParam(to.params.roomCode);

          if (roomCode) {
            return { name: "room-entry", params: { roomCode } };
          }

          return { name: "fodinha-setup" };
        }
      },
    },

    { path: "/ranking", name: "ranking", component: RankingPage },
    { path: "/rooms", name: "rooms", component: RoomsPage },
    { path: "/rooms/:roomCode", name: "room-entry", component: RoomEntryPage },

    { path: "/players", name: "players", component: PlayersPage },
    { path: "/players/:id", name: "player-profile", component: PlayersProfilePage },

    {
      path: "/admin/players",
      name: "admin-players",
      component: AdminPlayersPage,
      beforeEnter: () => {
        if (!adminAuthStorage.hasToken()) {
          return { name: "home" };
        }
      },
    },

    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
