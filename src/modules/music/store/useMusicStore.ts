import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Track } from "../types/music.types";

export const useMusicStore = defineStore("music", () => {
  const currentTrack = ref<Track | null>(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const audio = ref<HTMLAudioElement | null>(null);

  const progress = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0));

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTimeFormatted = computed(() => formatTime(currentTime.value));
  const durationFormatted = computed(() => formatTime(duration.value));

  const play = (track: Track) => {
    if (audio.value) {
      audio.value.pause();
      audio.value.removeEventListener("timeupdate", onTimeUpdate);
      audio.value.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.value.removeEventListener("ended", onEnded);
    }

    currentTrack.value = track;
    audio.value = new Audio(track.src);
    audio.value.addEventListener("timeupdate", onTimeUpdate);
    audio.value.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.value.addEventListener("ended", onEnded);
    void audio.value.play();
    isPlaying.value = true;
  };

  const togglePlay = () => {
    if (!audio.value) return;
    if (isPlaying.value) {
      audio.value.pause();
      isPlaying.value = false;
    } else {
      void audio.value.play();
      isPlaying.value = true;
    }
  };

  const seek = (percent: number) => {
    if (!audio.value || !duration.value) return;
    audio.value.currentTime = (percent / 100) * duration.value;
  };

  const stop = () => {
    audio.value?.pause();
    audio.value = null;
    currentTrack.value = null;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
  };

  const onTimeUpdate = () => {
    currentTime.value = audio.value?.currentTime ?? 0;
  };

  const onLoadedMetadata = () => {
    duration.value = audio.value?.duration ?? 0;
  };

  const onEnded = () => {
    isPlaying.value = false;
    currentTime.value = 0;
  };

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    currentTimeFormatted,
    durationFormatted,
    play,
    togglePlay,
    seek,
    stop,
  };
});
