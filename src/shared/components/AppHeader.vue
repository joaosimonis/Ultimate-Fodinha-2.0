<template>
  <v-app-bar flat density="comfortable" class="px-2">
    <v-container class="d-flex align-center justify-space-between py-0">
      <div class="d-flex align-center">
        <v-btn icon variant="text" size="large" aria-label="Baixar aplicativo" @click="handleInstallClick">
          <v-img :src="appLogo" alt="Logo do app" width="48" height="48" contain />
        </v-btn>
      </div>
      <div class="d-flex align-center justify-center flex-grow-1">
        <h3 class="font-weight-bold text-center">Trago e Cagão (TC)</h3>
      </div>
      <div class="d-flex align-center justify-end" style="width: 56px">
        <v-btn icon variant="text" size="large" aria-label="Alternar tema" @click="toggleTheme">
          <v-icon :icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="32" />
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useThemeStore } from "@/app/stores/theme";
import appLogo from "@/assets/ultimate-fodinha-logo.svg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const themeStore = useThemeStore();

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

const toggleTheme = () => themeStore.toggleTheme();

const handleBeforeInstallPrompt = (event: Event) => {
  event.preventDefault();
  deferredInstallPrompt = event as BeforeInstallPromptEvent;
};

const handleInstallClick = async () => {
  if (deferredInstallPrompt) {
    await deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }

  window.alert("Para instalar o app, use o menu do navegador e escolha 'Instalar app' ou 'Adicionar à tela inicial'.");
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});
</script>

<style scoped></style>
