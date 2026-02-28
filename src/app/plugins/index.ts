/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

// Plugins
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useThemeStore } from "@/app/stores/theme";
import router from '@/app/router'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(vuetify)
  app.use(pinia)
  app.use(router)

  const themeStore = useThemeStore()
  
  vuetify.theme.global.name.value = themeStore.isDark ? "dark" : "light"

  themeStore.$subscribe((_mutation, state) => {
    vuetify.theme.global.name.value = state.isDark ? "dark" : "light"
  })
}
