<template>
  <Vue3Lottie :animation-data="src" :width="size" :height="size" :autoplay="autoplay" :loop="loop" />
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";

withDefaults(
  defineProps<{
    src: object;
    size?: number;
    autoplay?: boolean;
    loop?: boolean;
  }>(),
  {
    size: 120,
    autoplay: true,
    loop: false,
  }
);
</script>
