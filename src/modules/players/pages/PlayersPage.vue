<template>
  <div class="players-page d-flex flex-column">
    <SetupHeader title="Jogadores" title-icon="mdi-account-group" @back="goBack" />

    <v-container class="flex-grow-1 py-6">
      <div class="players-wrapper mx-auto">
        <AppLoading v-if="isInitialLoading || playersStore.isLoading" message="Carregando jogadores..." />

        <AppErrorState v-else-if="playersStore.error" title="Não foi possível carregar jogadores" :message="playersStore.error" action-label="Tentar novamente" @action="loadPlayers" />

        <AppEmptyState v-else-if="playersStore.hasLoaded && playersStore.players.length === 0" title="Nenhum jogador encontrado" message="Os personagens cadastrados aparecerão aqui." />

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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppEmptyState from "@/shared/components/AppEmptyState.vue";
import AppErrorState from "@/shared/components/AppErrorState.vue";
import AppLoading from "@/shared/components/AppLoading.vue";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";

const router = useRouter();
const playersStore = usePlayersStore();

const isInitialLoading = ref(true);

const loadPlayers = async () => {
  try {
    await playersStore.loadPlayers();
  } catch {
    // Error state is already exposed by the store.
  } finally {
    isInitialLoading.value = false;
  }
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
