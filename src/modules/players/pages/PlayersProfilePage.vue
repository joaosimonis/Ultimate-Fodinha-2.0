<template>
  <div class="profile-page d-flex flex-column">
    <SetupHeader :title="profile?.title ?? 'Perfil'" @back="goBack" />

    <div v-if="profile" class="flex-grow-1 overflow-y-auto">
      <div class="profile-hero">
        <v-img :src="getAvatarUrl(player?.name ?? '')" :alt="player?.name" class="profile-hero__img" cover />
        <div class="profile-hero__overlay" />
        <div class="profile-hero__glow" />
        <div class="profile-hero__info">
          <span class="profile-hero__badge">
            <v-icon icon="mdi-star" size="14" />
            Classe
          </span>
          <h1 class="profile-hero__name">{{ profile.title }}</h1>
          <p class="profile-hero__title">
            {{ player?.name }}
          </p>
        </div>
      </div>

      <v-container class="profile-content py-5">
        <div class="profile-lore mb-5">
          <p v-for="(paragraph, i) in profile.lore" :key="i" class="profile-lore__paragraph">
            {{ paragraph }}
          </p>
        </div>

        <v-divider class="mb-5 profile-divider" />

        <v-card rounded="xl" class="ultimate-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="ultimate-card__eyebrow mb-3">
              <v-icon icon="mdi-lightning-bolt" size="16" />
              <span>Ultimate</span>
            </div>
            <p class="ultimate-card__name mb-2">{{ profile.ultimate.name }}</p>
            <p class="ultimate-card__description">{{ profile.ultimate.description }}</p>
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
  background:
    radial-gradient(1200px 500px at 50% -240px, rgba(46, 83, 129, 0.2), transparent 65%),
    linear-gradient(180deg, #f6f7fb 0%, #eff1f6 100%);
}

.profile-hero {
  position: relative;
  height: 360px;
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
  background: linear-gradient(to bottom, rgba(4, 10, 22, 0.08) 20%, rgba(4, 10, 22, 0.9) 100%);
}

.profile-hero__glow {
  position: absolute;
  inset: auto 0 0 0;
  height: 170px;
  background: linear-gradient(180deg, transparent 0%, rgba(75, 131, 255, 0.22) 65%, rgba(110, 72, 196, 0.3) 100%);
}

.profile-hero__info {
  position: absolute;
  bottom: 22px;
  left: 20px;
  right: 20px;
}

.profile-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(244, 197, 66, 0.17);
  color: #ffd15c;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.profile-hero__name {
  margin: 0 0 4px;
  color: #ffffff;
  font-size: clamp(1.8rem, 5.2vw, 2.25rem);
  font-weight: 900;
  line-height: 1.05;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.profile-hero__title {
  margin: 0;
  color: #d2dbef;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.profile-content {
  max-width: 680px;
}

.profile-lore {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(34, 52, 84, 0.12);
  backdrop-filter: blur(3px);
}

.profile-lore__paragraph {
  margin-bottom: 14px;
  color: #1e2433;
  font-size: 1.02rem;
  line-height: 1.75;
}

.profile-lore__paragraph:last-child {
  margin-bottom: 0;
}

.profile-divider {
  opacity: 0.45;
}

.ultimate-card {
  border: 1px solid rgba(39, 82, 149, 0.22);
  background:
    linear-gradient(160deg, rgba(26, 42, 74, 0.94) 0%, rgba(20, 35, 63, 0.96) 55%, rgba(42, 69, 112, 0.96) 100%);
  color: #e9f0ff;
}

.ultimate-card__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 201, 68, 0.16);
  color: #ffcf5d;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.ultimate-card__name {
  margin: 0;
  color: #ffffff;
  font-size: 1.45rem;
  font-weight: 800;
}

.ultimate-card__description {
  margin: 0;
  color: #c6d5f2;
  font-size: 1rem;
  line-height: 1.55;
}

@media (max-width: 600px) {
  .profile-hero {
    height: 320px;
  }

  .profile-lore {
    padding: 16px;
  }

  .ultimate-card__name {
    font-size: 1.25rem;
  }
}
</style>
