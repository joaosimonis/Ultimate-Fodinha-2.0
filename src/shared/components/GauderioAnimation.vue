<template>
  <div class="gauderio-animation" aria-hidden="true" :style="{ width: `${size}px`, height: `${size}px` }">
    <LottieAnimation :key="effectiveState" :src="animation.src" :size="size" :autoplay="animation.autoplay" :loop="animation.loop" :segment="animation.segment" @complete="$emit('complete')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LottieAnimation from "@/shared/components/LottieAnimation.vue";
import { useReducedMotion } from "@/shared/composables/useReducedMotion";
import { GAUDERIO_ANIMATIONS } from "@/shared/constants/gauderio.constants";
import type { GauderioAnimationConfig, GauderioState } from "@/shared/types/gauderio.types";

const props = withDefaults(
  defineProps<{
    state: GauderioState;
    size?: number;
  }>(),
  { size: 160 }
);

defineEmits<{
  complete: [];
}>();

const { prefersReducedMotion } = useReducedMotion();
const effectiveState = computed<GauderioState>(() => (prefersReducedMotion.value ? "static" : props.state));
const animation = computed<GauderioAnimationConfig>(() => GAUDERIO_ANIMATIONS[effectiveState.value]);
</script>

<style scoped>
.gauderio-animation {
  flex: 0 0 auto;
}
</style>
