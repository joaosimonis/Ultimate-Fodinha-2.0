<template>
  <div class="players-page d-flex flex-column">
    <SetupHeader title="Jogadores" title-icon="mdi-account-group" @back="goBack" />

    <v-container class="flex-grow-1 py-6">
      <div class="players-wrapper mx-auto">
        <div v-if="playersStore.error" class="text-center py-12">
          <v-icon icon="mdi-alert-circle-outline" size="64" class="text-error mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Não foi possível carregar jogadores</p>
          <p class="text-caption text-medium-emphasis mb-6">{{ playersStore.error }}</p>
          <v-btn color="secondary" rounded="lg" @click="loadPlayers">
            <v-icon start icon="mdi-refresh" />
            Tentar novamente
          </v-btn>
        </div>

        <!-- Estado vazio -->
        <div v-else-if="playersStore.players.length === 0" class="text-center py-12">
          <v-icon icon="mdi-account-group-outline" size="64" class="text-medium-emphasis mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Nenhum jogador encontrado</p>
          <p class="text-caption text-medium-emphasis mb-6">Os personagens cadastrados aparecerão aqui.</p>
        </div>

        <!-- Grid de jogadores -->
        <div v-else class="players-grid">
          <v-slide-y-transition group>
            <div v-for="player in playersStore.players" :key="player.id" class="player-card-wrapper">
              <div class="player-card text-center" @click="goToProfile(player.id)">
                <div class="avatar-wrapper">
                  <v-avatar size="72">
                    <v-img :src="getPlayerAvatarUrl(player.avatarKey)" :alt="player.name" />
                  </v-avatar>
                </div>
                <p class="text-caption font-weight-bold mt-1 text-truncate">{{ player.name }}</p>
              </div>
            </div>
          </v-slide-y-transition>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";

const router = useRouter();
const playersStore = usePlayersStore();

const loadPlayers = () => {
  void playersStore.loadPlayers().catch(() => {
    // Error state is already exposed by the store.
  });
};

onMounted(loadPlayers);

// --- Navegação ---
const goBack = () => router.push({ name: "home" });

const goToProfile = (playerId: string) => {
  router.push({ name: "player-profile", params: { id: playerId } });
};
</script>

<style scoped>
.players-page {
  height: 100%;
}

.players-wrapper {
  max-width: 480px;
  width: 100%;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
}

.player-card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
