<template>
  <Vue3Lottie ref="animation" :animation-data="src" :width="size" :height="size" :auto-play="autoplay" :loop="loop" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Vue3Lottie } from "vue3-lottie";

const animation = ref<InstanceType<typeof Vue3Lottie> | null>(null);

onBeforeUnmount(() => {
  animation.value?.destroy();
});

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
