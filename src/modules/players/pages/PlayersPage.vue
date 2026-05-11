<template>
  <div class="players-page d-flex flex-column">
    <SetupHeader title="Jogadores" title-icon="mdi-account-group" @back="goBack">
      <template #actions>
        <v-btn icon variant="text" size="large" @click="openAddDialog">
          <v-icon icon="mdi-plus" size="28" />
        </v-btn>
      </template>
    </SetupHeader>

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
          <p class="text-subtitle-1 font-weight-bold mb-1">Nenhum jogador cadastrado</p>
          <p class="text-caption text-medium-emphasis mb-6">Adicione jogadores para usar no Ultimate Fodinha 2.0</p>
          <v-btn color="secondary" rounded="lg" @click="openAddDialog"> <v-icon start icon="mdi-plus" /> Adicionar jogador </v-btn>
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
                  <v-btn icon variant="flat" color="error" size="x-small" class="delete-btn" :disabled="isDeleting" @click.stop="confirmDelete(player)">
                    <v-icon icon="mdi-close" size="10" />
                  </v-btn>
                </div>
                <p class="text-caption font-weight-bold mt-1 text-truncate">{{ player.name }}</p>
              </div>
            </div>
          </v-slide-y-transition>
        </div>
      </div>
    </v-container>

    <!-- Dialog: Adicionar jogador -->
    <v-dialog v-model="addDialog" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Novo jogador</v-card-title>
        <v-card-text class="px-5 pb-2">
          <v-alert v-if="addError" type="error" variant="tonal" density="compact" class="mb-4">
            {{ addError }}
          </v-alert>

          <v-text-field v-model="newPlayerName" label="Nome do jogador" variant="outlined" density="comfortable" autofocus hide-details="auto" class="mb-3" :maxlength="PLAYER_NAME_MAX_LENGTH" counter />
          <v-text-field v-model="newPlayerAvatarKey" label="Chave do avatar" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_AVATAR_KEY_MAX_LENGTH" counter />
          <v-text-field v-model="newPlayerTitle" label="Classe do personagem" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_TITLE_MAX_LENGTH" counter />
          <v-textarea v-model="newPlayerLore" label="Lore" variant="outlined" density="comfortable" rows="3" auto-grow hide-details="auto" class="mb-3" :maxlength="PLAYER_LORE_MAX_LENGTH" counter />
          <v-text-field v-model="newPlayerUltimateName" label="Nome da ultimate" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_ULTIMATE_NAME_MAX_LENGTH" counter />
          <v-textarea v-model="newPlayerUltimateDescription" label="Descrição da ultimate" variant="outlined" density="comfortable" rows="2" auto-grow hide-details="auto" :maxlength="PLAYER_ULTIMATE_DESCRIPTION_MAX_LENGTH" counter />

          <!-- Preview do avatar -->
          <div v-if="avatarPreviewKey" class="d-flex align-center ga-3 mt-4">
            <v-avatar size="40">
              <v-img :src="getPlayerAvatarUrl(avatarPreviewKey)" />
            </v-avatar>
            <span class="text-caption text-medium-emphasis">Preview do avatar</span>
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" :disabled="isCreating" @click="closeAddDialog">Cancelar</v-btn>
          <v-btn color="secondary" variant="flat" rounded="lg" :disabled="!canCreatePlayer" :loading="isCreating" @click="addPlayer">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Confirmar exclusão -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Remover jogador?</v-card-title>
        <v-card-text class="px-5">
          <span class="font-weight-bold">{{ playerToDelete?.name }}</span> será removido da lista.
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" :disabled="isDeleting" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" :loading="isDeleting" @click="deletePlayer">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import {
  PLAYER_AVATAR_KEY_MAX_LENGTH,
  PLAYER_LORE_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  PLAYER_TITLE_MAX_LENGTH,
  PLAYER_ULTIMATE_DESCRIPTION_MAX_LENGTH,
  PLAYER_ULTIMATE_NAME_MAX_LENGTH,
} from "@/modules/players/constants/players.constants";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";

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

// --- Adicionar ---
const addDialog = ref(false);
const newPlayerName = ref("");
const newPlayerAvatarKey = ref("");
const newPlayerTitle = ref("");
const newPlayerLore = ref("");
const newPlayerUltimateName = ref("");
const newPlayerUltimateDescription = ref("");
const addError = ref("");
const isCreating = ref(false);

const normalizeAvatarKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const avatarPreviewKey = computed(() => newPlayerAvatarKey.value.trim() || newPlayerName.value.trim());

const canCreatePlayer = computed(
  () =>
    newPlayerName.value.trim().length > 0 &&
    newPlayerAvatarKey.value.trim().length > 0 &&
    newPlayerTitle.value.trim().length > 0 &&
    newPlayerLore.value.trim().length > 0 &&
    newPlayerUltimateName.value.trim().length > 0 &&
    newPlayerUltimateDescription.value.trim().length > 0
);

watch(newPlayerName, (name, oldName) => {
  const previousGeneratedKey = normalizeAvatarKey(oldName ?? "");
  if (!newPlayerAvatarKey.value.trim() || newPlayerAvatarKey.value === previousGeneratedKey) {
    newPlayerAvatarKey.value = normalizeAvatarKey(name);
  }
});

const openAddDialog = () => {
  newPlayerName.value = "";
  newPlayerAvatarKey.value = "";
  newPlayerTitle.value = "";
  newPlayerLore.value = "";
  newPlayerUltimateName.value = "";
  newPlayerUltimateDescription.value = "";
  addError.value = "";
  addDialog.value = true;
};

const closeAddDialog = () => {
  addDialog.value = false;
};

const addPlayer = async () => {
  const name = newPlayerName.value.trim();

  if (!canCreatePlayer.value || isCreating.value) return;

  if (playersStore.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    addError.value = "Já existe um jogador com esse nome.";
    return;
  }

  isCreating.value = true;
  addError.value = "";

  try {
    await playersStore.createPlayer({
      name,
      avatar_key: newPlayerAvatarKey.value.trim(),
      title: newPlayerTitle.value.trim(),
      lore: newPlayerLore.value.trim(),
      ultimate: {
        name: newPlayerUltimateName.value.trim(),
        description: newPlayerUltimateDescription.value.trim(),
      },
    });
    closeAddDialog();
  } catch (err) {
    addError.value = getApiErrorMessage(err);
  } finally {
    isCreating.value = false;
  }
};

// --- Remover ---
const deleteDialog = ref(false);
const playerToDelete = ref<RegisteredPlayer | null>(null);
const isDeleting = ref(false);

const confirmDelete = (player: RegisteredPlayer) => {
  playerToDelete.value = player;
  deleteDialog.value = true;
};

const deletePlayer = async () => {
  if (!playerToDelete.value || isDeleting.value) return;

  isDeleting.value = true;

  try {
    await playersStore.removePlayer(playerToDelete.value.id);
  } catch {
    // Error state is already exposed by the store.
  } finally {
    deleteDialog.value = false;
    playerToDelete.value = null;
    isDeleting.value = false;
  }
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

.delete-btn {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px !important;
  height: 18px !important;
}

.player-card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
