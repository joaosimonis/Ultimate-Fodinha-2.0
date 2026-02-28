<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="🂡 Truco" />

    <v-container class="flex-grow-1 py-6">
      <h1 class="text-h4">Pagina de configuracao do truco</h1>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import SetupPageHeader from "@/shared/components/SetupPageHeader.vue";
</script>

<style scoped>
.setup-page {
  height: 100%;
}
</style>
