import { onBeforeUnmount, watch } from "vue";
import confetti from "canvas-confetti";
import { useReducedMotion } from "@/shared/composables/useReducedMotion";

export const useConfetti = () => {
  const { prefersReducedMotion } = useReducedMotion();
  const emitConfetti = confetti.create(undefined, { resize: true });
  let delayedBurst: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  const stopConfetti = () => {
    if (delayedBurst !== null) {
      clearTimeout(delayedBurst);
      delayedBurst = null;
    }
    emitConfetti.reset();
  };

  const fireConfetti = () => {
    if (disposed || prefersReducedMotion.value) return;
    stopConfetti();

    void emitConfetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.8 } });
    void emitConfetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.8 } });
    delayedBurst = setTimeout(() => {
      delayedBurst = null;
      if (!disposed && !prefersReducedMotion.value) {
        void emitConfetti({ particleCount: 60, spread: 100, origin: { x: 0.5, y: 0.6 } });
      }
    }, 300);
  };

  watch(prefersReducedMotion, (reduced) => {
    if (reduced) stopConfetti();
  }, { flush: "sync" });

  onBeforeUnmount(() => {
    disposed = true;
    stopConfetti();
  });

  return { fireConfetti, stopConfetti };
};
