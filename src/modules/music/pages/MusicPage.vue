<template>
  <div class="music-page d-flex flex-column">
    <SetupHeader title="Did You See" @back="goBack" />

    <!-- Hero da banda -->
    <div class="music-hero">
      <v-img src="@/assets/images/dys-logo.png" alt="Did You See" class="music-hero__img" cover />
      <div class="music-hero__overlay" />
      <div class="music-hero__content">
        <LottieAnimation :src="SpaceshipAnimation" :size="80" :autoplay="true" :loop="true" class="mb-2" />
        <p class="text-h4 font-weight-black text-white">Did You See</p>
        <p class="text-caption text-white" style="opacity: 0.7">Indie • Rock • Space Vibes</p>
      </div>
    </div>

    <!-- Tracklist -->
    <v-container class="py-4">
      <p class="text-caption text-uppercase font-weight-bold text-medium-emphasis mb-3 px-1">Músicas</p>

      <div class="d-flex flex-column ga-3">
        <v-card v-for="(track, index) in TRACKS" :key="track.id" rounded="lg" :color="musicStore.currentTrack?.id === track.id ? 'primary' : undefined" :variant="musicStore.currentTrack?.id === track.id ? 'tonal' : 'outlined'" class="track-card" @click="musicStore.play(track)">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-3">
              <!-- Número / playing indicator -->
              <div class="track-number">
                <v-icon v-if="musicStore.currentTrack?.id === track.id && musicStore.isPlaying" icon="mdi-volume-high" color="primary" size="20" />
                <span v-else class="text-body-2 text-medium-emphasis font-weight-bold">
                  {{ index + 1 }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <p class="text-body-1 font-weight-bold mb-0">{{ track.title }}</p>
                <p class="text-caption text-medium-emphasis">{{ track.artist }}</p>
              </div>

              <!-- Play icon -->
              <v-icon :icon="musicStore.currentTrack?.id === track.id && musicStore.isPlaying ? 'mdi-pause' : 'mdi-play'" :color="musicStore.currentTrack?.id === track.id ? 'primary' : undefined" />
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import LottieAnimation from "@/shared/components/LottieAnimation.vue";
import SpaceshipAnimation from "@/assets/animation/Spaceship.json";
import { useMusicStore } from "@/modules/music/store/useMusicStore";
import { TRACKS } from "@/modules/music/data/music.data";

const router = useRouter();
const musicStore = useMusicStore();

const goBack = () => router.back();
</script>

<style scoped>
.music-page {
  height: 100%;
}

.music-hero {
  position: relative;
  height: 260px;
  overflow: hidden;
}

.music-hero__img {
  width: 100%;
  height: 100%;
}

.music-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%);
}

.music-hero__content {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.track-number {
  width: 28px;
  text-align: center;
}

.track-card {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.track-card:active {
  transform: scale(0.98);
}
</style>
