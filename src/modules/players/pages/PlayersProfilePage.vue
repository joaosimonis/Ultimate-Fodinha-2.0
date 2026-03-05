<template>
  <div class="profile-page d-flex flex-column">
    <SetupHeader :title="profile?.title ?? ''" @back="goBack" />

    <div v-if="profile" class="flex-grow-1 overflow-y-auto">
      <!-- Hero image -->
      <div class="profile-hero">
        <v-img :src="getAvatarUrl(player?.name ?? '')" :alt="player?.name" class="profile-hero__img" cover />
        <div class="profile-hero__overlay" />
        <div class="profile-hero__info">
          <p class="text-caption text-uppercase font-weight-bold profile-hero__title">
            {{ profile.title }}
          </p>
          <p class="text-h4 font-weight-black text-white">{{ player?.name }}</p>
        </div>
      </div>

      <v-container class="py-6">
        <!-- Lore -->
        <div class="mb-6">
          <p v-for="(paragraph, i) in profile.lore" :key="i" class="text-body-1 mb-3" style="line-height: 1.7">
            {{ paragraph }}
          </p>
        </div>

        <v-divider class="mb-6" />

        <!-- Ultimate -->
        <v-card rounded="lg" color="primary" variant="tonal">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="mdi-lightning-bolt" color="amber-darken-1" />
              <p class="text-caption font-weight-bold text-uppercase text-amber-darken-1">Ultimate</p>
            </div>
            <p class="text-h6 font-weight-bold mb-1">{{ profile.ultimate.name }}</p>
            <p class="text-body-2">{{ profile.ultimate.description }}</p>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <!-- Jogador não encontrado -->
    <div v-else class="d-flex flex-column align-center justify-center flex-grow-1">
      <v-icon icon="mdi-account-question" size="64" class="text-medium-emphasis mb-3" />
      <p class="text-medium-emphasis">Jogador não encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getAvatarUrl } from "@/shared/utils/avatar";
import { PLAYERS_DATA } from "@/modules/players/data/players.data";

const router = useRouter();
const route = useRoute();
const playersStore = usePlayersStore();

const player = computed(() => playersStore.players.find((p) => p.id === route.params.id));

const profile = computed(() => (player.value ? (PLAYERS_DATA[player.value.name] ?? null) : null));

const goBack = () => router.back();
</script>

<style scoped>
.profile-page {
  height: 100%;
}

.profile-hero {
  position: relative;
  height: 320px;
  overflow: hidden;
}

.profile-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.profile-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.85) 100%);
}

.profile-hero__info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}

.profile-hero__title {
  color: #f4c542;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}
</style>
