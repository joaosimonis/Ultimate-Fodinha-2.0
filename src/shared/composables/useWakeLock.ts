import { computed, onMounted, onUnmounted, ref } from "vue";

export const useWakeLock = () => {
  const wakeLock = ref<WakeLockSentinel | null>(null);
  const isSupported = computed(() => typeof navigator !== "undefined" && "wakeLock" in navigator);
  const isActive = computed(() => wakeLock.value !== null && !wakeLock.value.released);

  const handleWakeLockRelease = () => {
    wakeLock.value = null;
  };

  const request = async () => {
    try {
      if (!isSupported.value || document.visibilityState !== "visible" || isActive.value) return;

      const sentinel = await navigator.wakeLock.request("screen");
      sentinel.addEventListener("release", handleWakeLockRelease, { once: true });
      wakeLock.value = sentinel;
    } catch (err) {
      console.warn("Wake Lock não suportado ou negado:", err);
    }
  };

  const release = async () => {
    try {
      await wakeLock.value?.release();
      wakeLock.value = null;
    } catch (err) {
      console.warn("Erro ao liberar Wake Lock:", err);
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      void request();
    }
  };

  onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    void release();
  });

  return { request, release, isSupported, isActive };
};
