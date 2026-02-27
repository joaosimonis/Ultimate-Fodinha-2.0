<template>
  <div class="home-page d-flex flex-column">
    <AppHeader />
    <v-container class="content flex-grow-1 d-flex align-center justify-center">
      <div class="home-wrapper text-center">
        <h1 class="text-h4 font-weight-bold mb-2">Ultimate Fodinha 2.0</h1>
        <p class="mb-6 text-medium-emphasis">Contador rápido para Truco e Fodinha</p>
        <div class="d-flex flex-column ga-4">
          <v-btn block class="text-white" color="primary" rounded="lg" size="x-large">🎴 Truco</v-btn>
          <v-btn block class="text-white" color="secondary" rounded="lg" size="x-large">🂡 Fodinha</v-btn>
          <v-btn block class="text-white" color="amber-darken-1" rounded="lg" size="x-large">📊 Ranking</v-btn>
        </div>
        <div class="mt-8">
          <span class="text-caption text-medium-emphasis">Versão 1.0</span>
        </div>
      </div>
    </v-container>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/shared/components/AppHeader.vue";
import AppFooter from "@/shared/components/AppFooter.vue";
</script>

<style scoped>
.home-page {
  height: 100%;
}

.home-wrapper {
  max-width: 480px;
  width: 100%;
  padding: 16px;
}

.content {
  padding: 16px;
}
</style>
