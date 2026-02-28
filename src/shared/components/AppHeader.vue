<template>
  <v-app-bar flat density="comfortable" class="px-2">
    <v-container class="d-flex align-center justify-space-between py-0">
      <div class="d-flex align-center">
        <v-img :src="appLogo" alt="Logo do app" width="48" height="48" contain />
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
import { useThemeStore } from "@/app/stores/theme";
import appLogo from "@/assets/ultimate-fodinha-logo.svg";

const themeStore = useThemeStore();

const toggleTheme = () => themeStore.toggleTheme();
</script>

<style scoped>
</style>
