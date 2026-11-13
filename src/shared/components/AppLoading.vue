<template>
  <div class="app-loading" role="status" aria-live="polite" aria-atomic="true">
    <GauderioAnimation state="loading" />

    <p v-if="message" class="app-loading__message">
      {{ message }}
    </p>
    <span v-else class="app-loading__accessible-message">Carregando...</span>
  </div>
</template>

<script setup lang="ts">
import GauderioAnimation from "@/shared/components/GauderioAnimation.vue";

withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "",
  }
);
</script>

<style scoped>
.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 16px;
  text-align: center;
}

.app-loading__message {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.875rem;
  line-height: 1.4;
}

.app-loading__accessible-message {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
