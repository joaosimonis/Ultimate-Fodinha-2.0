import { createRouter, createWebHistory } from 'vue-router'
import { useFodinhaStore } from '@/modules/fodinha/store/useFodinhaStore'

import HomePage from '@/modules/home/pages/HomePage.vue'
import TrucoSetupPage from '@/modules/truco/pages/TrucoSetupPage.vue'
// import TrucoGamePage from '@/modules/truco/pages/TrucoGamePage.vue'
// import TrucoResultPage from '@/modules/truco/pages/TrucoResultPage.vue'
import FodinhaSetupPage from '@/modules/fodinha/pages/FodinhaSetupPage.vue'
import FodinhaGamePage from '@/modules/fodinha/pages/FodinhaGamePage.vue'
// import FodinhaResultPage from '@/modules/fodinha/pages/FodinhaResultPage.vue'
import RankingPage from '@/modules/ranking/pages/RankingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },

    { path: '/truco/setup', name: 'truco-setup', component: TrucoSetupPage },
    // { path: '/truco/game', name: 'truco-game', component: TrucoGamePage },
    // { path: '/truco/result', name: 'truco-result', component: TrucoResultPage },

    { path: '/fodinha/setup', name: 'fodinha-setup', component: FodinhaSetupPage },
    { path: '/fodinha/game', name: 'fodinha-game', component: FodinhaGamePage },
    // { path: '/fodinha/result', name: 'fodinha-result', component: FodinhaResultPage },

    { path: '/ranking', name: 'ranking', component: RankingPage },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
})

router.beforeEach((to) => {
  const fodinhaStore = useFodinhaStore()

  if (to.name === 'fodinha-game' && fodinhaStore.players.length === 0) {
    return { name: 'fodinha-setup' }
  }

  return true
})

export default router
