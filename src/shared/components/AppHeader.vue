<template>
  <v-app-bar flat density="comfortable" class="px-2">
    <v-container class="d-flex align-center justify-space-between py-0">
      <div class="d-flex align-center">
        <v-img :src="appLogo" alt="Logo do app" width="36" height="36" contain />
      </div>
      <div class="d-flex align-center justify-center flex-grow-1">
        <span class="text-subtitle-1 font-weight-bold text-center">
          Trago e Cagão (TC)
        </span>
      </div>
      <div class="d-flex align-center justify-end" style="width: 48px">
        <v-btn icon variant="text" aria-label="Alternar tema">
          <v-icon icon="mdi-weather-night" />
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import appLogo from "@/assets/ultimate-fodinha-logo.svg";
</script>

<style scoped>
</style>
