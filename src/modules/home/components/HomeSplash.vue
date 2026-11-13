<template>
  <section class="home-splash" role="status" aria-labelledby="home-splash-title">
    <GauderioAnimation state="greeting" :size="240" @complete="$emit('complete')" />
    <h1 id="home-splash-title" class="home-splash__title text-h5 font-weight-bold">Ultimate Fodinha 2.0</h1>
  </section>
</template>

<script setup lang="ts">
import { onErrorCaptured } from "vue";
import GauderioAnimation from "@/shared/components/GauderioAnimation.vue";

const emit = defineEmits<{
  complete: [];
}>();

onErrorCaptured(() => {
  emit("complete");
  return false;
});
</script>

<style scoped>
.home-splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  gap: 24px;
  padding: 24px;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  text-align: center;
}

.home-splash__title {
  margin: 0;
}
</style>
