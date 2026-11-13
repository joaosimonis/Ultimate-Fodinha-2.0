import { onBeforeUnmount, onMounted, watch } from "vue";
import type { Ref, WatchStopHandle } from "vue";
import messiIntroducaoAudio from "@/assets/audios/messi/messi-introducao.ogg";

const INTRO_AUDIO_DELAY_MS = 1000;

export function useHomeIntroAudio(isHomeReady: Readonly<Ref<boolean>>) {
  let introAudio: HTMLAudioElement | null = null;
  let introTimeout: ReturnType<typeof setTimeout> | null = null;
  let stopWatching: WatchStopHandle | undefined;
  let scheduled = false;
  let disposed = false;

  const removeInteractionFallback = () => {
    window.removeEventListener("pointerdown", handleFirstInteraction);
    window.removeEventListener("keydown", handleFirstInteraction);
  };

  const handleFirstInteraction = () => {
    removeInteractionFallback();
    if (disposed || !isHomeReady.value) return;

    void introAudio?.play().catch(() => {
      // A rejected audio request must not interrupt navigation.
    });
  };

  const tryAutoplay = async () => {
    if (disposed || !isHomeReady.value || !introAudio) return;

    try {
      await introAudio.play();
    } catch {
      if (!disposed && isHomeReady.value) {
        window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
        window.addEventListener("keydown", handleFirstInteraction, { once: true });
      }
    }
  };

  const scheduleIntro = () => {
    if (disposed || scheduled || !isHomeReady.value) return;

    scheduled = true;
    introAudio = new Audio(messiIntroducaoAudio);
    introAudio.volume = 1;
    introTimeout = setTimeout(() => {
      introTimeout = null;
      void tryAutoplay();
    }, INTRO_AUDIO_DELAY_MS);
  };

  onMounted(() => {
    stopWatching = watch(isHomeReady, (ready) => {
      if (ready) scheduleIntro();
    }, { immediate: true, flush: "post" });
  });

  onBeforeUnmount(() => {
    disposed = true;
    stopWatching?.();
    if (introTimeout !== null) clearTimeout(introTimeout);
    removeInteractionFallback();
    introAudio?.pause();
    if (introAudio) introAudio.currentTime = 0;
  });
}
