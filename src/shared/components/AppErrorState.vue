<template>
  <div class="app-error-state" role="alert" aria-atomic="true">
    <GauderioAnimation state="error" />

    <h2 v-if="title" class="app-error-state__title text-subtitle-1 font-weight-bold">
      {{ title }}
    </h2>
    <p class="app-error-state__message">
      {{ message }}
    </p>

    <v-btn v-if="actionLabel" color="secondary" variant="flat" rounded="lg" @click="$emit('action')">
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import GauderioAnimation from "@/shared/components/GauderioAnimation.vue";

withDefaults(
  defineProps<{
    message: string;
    title?: string;
    actionLabel?: string;
  }>(),
  {
    title: "",
    actionLabel: "",
  }
);

defineEmits<{
  action: [];
}>();
</script>

<style scoped>
.app-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 16px;
  text-align: center;
}

.app-error-state__title {
  margin: 0;
}

.app-error-state__message {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.95rem;
  line-height: 1.4;
  max-width: 280px;
}
</style>
