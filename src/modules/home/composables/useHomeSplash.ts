import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { homeSplashStorage } from "@/modules/home/storage/homeSplashStorage";
import { useReducedMotion } from "@/shared/composables/useReducedMotion";

type HomeSplashPhase = "splash" | "revealing" | "ready";
const MAX_SPLASH_DURATION_MS = 2500;

export function useHomeSplash() {
  const { prefersReducedMotion } = useReducedMotion();
  const hasShown = homeSplashStorage.hasShown();
  const didShowSplash = !hasShown && !prefersReducedMotion.value;
  const phase = ref<HomeSplashPhase>(didShowSplash ? "splash" : "ready");
  let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  let mounted = false;

  if (!hasShown) homeSplashStorage.markShown();

  const clearFallback = () => {
    if (fallbackTimeout !== null) {
      clearTimeout(fallbackTimeout);
      fallbackTimeout = null;
    }
  };

  const finishSplash = () => {
    if (disposed || phase.value !== "splash") return;

    clearFallback();
    phase.value = !mounted || prefersReducedMotion.value ? "ready" : "revealing";
  };

  const revealHome = () => {
    if (!disposed && phase.value === "revealing") {
      phase.value = "ready";
    }
  };

  watch(prefersReducedMotion, (reduced) => {
    if (reduced && !disposed && phase.value !== "ready") {
      clearFallback();
      phase.value = "ready";
    }
  });

  onMounted(() => {
    mounted = true;
    if (phase.value === "splash") {
      fallbackTimeout = setTimeout(finishSplash, MAX_SPLASH_DURATION_MS);
    }
  });

  onBeforeUnmount(() => {
    disposed = true;
    clearFallback();
  });

  return {
    isSplashVisible: computed(() => phase.value === "splash"),
    isHomeReady: computed(() => phase.value === "ready"),
    didShowSplash,
    finishSplash,
    revealHome,
  };
}
