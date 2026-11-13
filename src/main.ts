import { createApp } from "vue";
import { registerPlugins } from "@/app/plugins";
import router from "@/app/router";
import App from "./App.vue";
import "unfonts.css";

const app = createApp(App);
registerPlugins(app);

void router.isReady().then(() => {
  app.mount("#app");
}).catch((error: unknown) => {
  console.error("Não foi possível iniciar o aplicativo:", error);
  const message = document.querySelector("[data-app-boot-message]");
  if (message) {
    message.textContent = "Não foi possível abrir o aplicativo. Atualize a página para tentar novamente.";
  }
});
