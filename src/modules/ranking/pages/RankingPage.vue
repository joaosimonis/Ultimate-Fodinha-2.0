<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="Ranking" title-icon="mdi-trophy" />

    <v-container class="flex-grow-1 py-6">
      <h1 class="text-h4">Pagina do ranking</h1>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import SetupPageHeader from "@/shared/components/SetupHeader.vue";
import audioMuriloPuto from "@/assets/audio-murilo-puto.ogg";

onMounted(() => {
  const audio = new Audio(audioMuriloPuto);
  audio.volume = 1;
  void audio.play().catch(() => {
    // Ignore autoplay blocking errors until user interaction.
  });
});
</script>

<style scoped>
.setup-page {
  height: 100%;
}
</style>
