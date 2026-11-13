import { onBeforeUnmount, onMounted, readonly, ref } from "vue";

export function useReducedMotion() {
  const mediaQuery = typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const prefersReducedMotion = ref(mediaQuery?.matches ?? false);

  const updatePreference = () => {
    prefersReducedMotion.value = mediaQuery?.matches ?? false;
  };

  onMounted(() => {
    updatePreference();
    mediaQuery?.addEventListener("change", updatePreference);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", updatePreference);
  });

  return { prefersReducedMotion: readonly(prefersReducedMotion) };
}
