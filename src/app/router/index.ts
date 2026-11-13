import { createRouter, createWebHistory } from "vue-router";
import { adminAuthStorage } from "@/modules/auth/storage/adminAuthStorage";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";

const HomePage = () => import("@/modules/home/pages/HomePage.vue");
const TrucoSetupPage = () => import("@/modules/truco/pages/TrucoSetupPage.vue");
const TrucoGamePage = () => import("@/modules/truco/pages/TrucoGamePage.vue");
const FodinhaSetupPage = () => import("@/modules/fodinha/pages/FodinhaSetupPage.vue");
const FodinhaGamePage = () => import("@/modules/fodinha/pages/FodinhaGamePage.vue");
const RankingPage = () => import("@/modules/ranking/pages/RankingPage.vue");
const PlayersPage = () => import("@/modules/players/pages/PlayersPage.vue");
const PlayersProfilePage = () => import("@/modules/players/pages/PlayersProfilePage.vue");
const RoomsPage = () => import("@/modules/rooms/pages/RoomsPage.vue");
const RoomEntryPage = () => import("@/modules/rooms/pages/RoomEntryPage.vue");
const AdminPlayersPage = () => import("@/modules/auth/pages/AdminPlayersPage.vue");

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
