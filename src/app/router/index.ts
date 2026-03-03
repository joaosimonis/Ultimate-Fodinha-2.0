import { createRouter, createWebHistory } from "vue-router";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";

import HomePage from "@/modules/home/pages/HomePage.vue";
import TrucoSetupPage from "@/modules/truco/pages/TrucoSetupPage.vue";
import TrucoGamePage from '@/modules/truco/pages/TrucoGamePage.vue'
import FodinhaSetupPage from "@/modules/fodinha/pages/FodinhaSetupPage.vue";
import FodinhaGamePage from "@/modules/fodinha/pages/FodinhaGamePage.vue";
import RankingPage from "@/modules/ranking/pages/RankingPage.vue";
import PlayersPage from "@/modules/players/PlayersPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },

    { path: "/truco/setup", name: "truco-setup", component: TrucoSetupPage },
    {
      path: "/truco/game",
      name: "truco-game",
      component: TrucoGamePage,
      beforeEnter: () => {
        const trucoStore = useTrucoStore();

        if (!trucoStore.hasGame) {
          return { name: "truco-setup" };
        }
      },
    },

    { path: "/fodinha/setup", name: "fodinha-setup", component: FodinhaSetupPage },
    {
      path: "/fodinha/game",
      name: "fodinha-game",
      component: FodinhaGamePage,
      beforeEnter: () => {
        const fodinhaStore = useFodinhaStore();

        if (!fodinhaStore.hasGame) {
          return { name: "fodinha-setup" };
        }
      },
    },

    { path: "/ranking", name: "ranking", component: RankingPage },
    { path: "/players", name: "players", component: PlayersPage },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
