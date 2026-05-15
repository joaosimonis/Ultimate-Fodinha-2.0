<template>
  <div class="app-loading">
    <v-progress-circular color="secondary" indeterminate :size="56" :width="5" />

    <p v-if="message" class="app-loading__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
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
  display: grid;
  place-items: center;
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
</style>
