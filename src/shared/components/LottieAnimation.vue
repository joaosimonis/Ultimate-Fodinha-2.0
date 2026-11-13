<template>
  <Vue3Lottie ref="animation" :animation-data="src" :width="size" :height="size" :auto-play="autoplay && !segment" :loop="loop" @on-animation-loaded="handleLoaded" @on-complete="handleComplete" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Vue3Lottie } from "vue3-lottie";

const props = withDefaults(
  defineProps<{
    src: object;
    size?: number;
    autoplay?: boolean;
    loop?: boolean;
    segment?: [number, number];
  }>(),
  {
    size: 120,
    autoplay: true,
    loop: false,
  }
);
const emit = defineEmits<{
  complete: [];
}>();
const animation = ref<InstanceType<typeof Vue3Lottie> | null>(null);
let disposed = false;

const handleLoaded = () => {
  if (!disposed && props.segment && props.autoplay) {
    animation.value?.playSegments(props.segment, true);
  }
};

const handleComplete = () => {
  if (!disposed) emit("complete");
};

onBeforeUnmount(() => {
  disposed = true;
  animation.value?.destroy();
});
</script>
