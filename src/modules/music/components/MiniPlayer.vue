<template>
  <Transition name="player-slide">
    <div v-if="musicStore.currentTrack" class="mini-player">
      <!-- Progress bar -->
      <div class="mini-player__progress" @click="onProgressClick">
        <div class="mini-player__progress-fill" :style="{ width: musicStore.progress + '%' }" />
      </div>

      <div class="mini-player__content">
        <!-- Info -->
        <div class="mini-player__info">
          <p class="text-body-2 font-weight-bold text-truncate mb-0">{{ musicStore.currentTrack.title }}</p>
          <p class="text-caption text-medium-emphasis">{{ musicStore.currentTrack.artist }}</p>
        </div>

        <!-- Tempo -->
        <p class="text-caption text-medium-emphasis mini-player__time">{{ musicStore.currentTimeFormatted }} / {{ musicStore.durationFormatted }}</p>

        <!-- Controles -->
        <div class="d-flex align-center ga-1">
          <v-btn icon variant="text" size="small" @click="musicStore.togglePlay">
            <v-icon :icon="musicStore.isPlaying ? 'mdi-pause' : 'mdi-play'" size="24" />
          </v-btn>
          <v-btn icon variant="text" size="small" @click="musicStore.stop">
            <v-icon icon="mdi-close" size="20" />
          </v-btn>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useMusicStore } from "@/modules/music/store/useMusicStore";

const musicStore = useMusicStore();

const onProgressClick = (event: MouseEvent) => {
  const bar = event.currentTarget as HTMLElement;
  const percent = (event.offsetX / bar.clientWidth) * 100;
  musicStore.seek(percent);
};
</script>

<style scoped>
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.mini-player__progress {
  height: 3px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  cursor: pointer;
}

.mini-player__progress-fill {
  height: 100%;
  background: rgb(var(--v-theme-primary));
  transition: width 0.5s linear;
}

.mini-player__content {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
}

.mini-player__info {
  flex: 1;
  min-width: 0;
}

.mini-player__time {
  white-space: nowrap;
  flex-shrink: 0;
}

.player-slide-enter-active,
.player-slide-leave-active {
  transition: transform 0.3s ease;
}

.player-slide-enter-from,
.player-slide-leave-to {
  transform: translateY(100%);
}
</style>
