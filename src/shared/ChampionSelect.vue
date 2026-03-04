<template>
  <div>
    <!-- Estado vazio: nenhum jogador cadastrado -->
    <div v-if="playersStore.players.length === 0" class="text-center py-6">
      <v-icon icon="mdi-account-group-outline" size="48" class="text-medium-emphasis mb-3" />
      <p class="text-body-2 text-medium-emphasis mb-4">Nenhum jogador cadastrado ainda.</p>
      <v-btn variant="tonal" rounded="lg" @click="goToPlayers"> <v-icon start icon="mdi-plus" /> Cadastrar jogadores </v-btn>
    </div>

    <!-- Grid de seleção -->
    <div v-else>
      <div class="champion-grid mb-3">
        <div
          v-for="player in availablePlayers"
          :key="player.id"
          class="champion-card"
          :class="{
            'champion-selected': isSelected(player.id),
            'champion-disabled': isDisabled(player.id),
          }"
          @click="togglePlayer(player)"
        >
          <div class="champion-avatar-wrapper">
            <v-avatar size="64">
              <v-img :src="getAvatarUrl(player.name)" :alt="player.name" />
            </v-avatar>
            <div v-if="isSelected(player.id)" class="champion-check">
              <v-icon icon="mdi-check" size="12" color="white" />
            </div>
          </div>
          <p class="champion-name text-caption font-weight-bold text-truncate mt-1">
            {{ player.name }}
          </p>
        </div>
      </div>

      <p class="text-caption text-medium-emphasis text-center">{{ modelValue.length }}{{ max ? `/${max}` : "" }} jogador{{ modelValue.length !== 1 ? "es" : "" }} selecionado{{ modelValue.length !== 1 ? "s" : "" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getAvatarUrl } from "@/shared/utils/avatar";
import type { RegisteredPlayer } from "@/shared/types/players.types";

const props = defineProps<{
  modelValue: RegisteredPlayer[];
  max?: number;
  exclude?: RegisteredPlayer[];
}>();

const emit = defineEmits<{
  "update:modelValue": [players: RegisteredPlayer[]];
}>();

const router = useRouter();
const playersStore = usePlayersStore();

// Filtra jogadores excluídos (ex: já selecionados na outra equipe)
const availablePlayers = computed(() => playersStore.players);

const isSelected = (id: string) => props.modelValue.some((p) => p.id === id);

// Desabilita se atingiu o max e o jogador não está selecionado
const isDisabled = (id: string) => {
  const excludedIds = new Set(props.exclude?.map((p) => p.id) ?? []);
  if (excludedIds.has(id)) return true;
  return !!props.max && props.modelValue.length >= props.max && !isSelected(id);
};

const togglePlayer = (player: RegisteredPlayer) => {
  if (isDisabled(player.id)) return;

  const already = isSelected(player.id);
  if (already) {
    emit(
      "update:modelValue",
      props.modelValue.filter((p) => p.id !== player.id)
    );
  } else {
    emit("update:modelValue", [...props.modelValue, player]);
  }
};

const goToPlayers = () => router.push({ name: "players" });
</script>

<style scoped>
.champion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.champion-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  opacity: 0.6;
  padding: 4px;
}

.champion-card:active {
  transform: scale(0.95);
}

.champion-selected {
  opacity: 1;
}

.champion-selected .champion-avatar-wrapper {
  outline: 2px solid rgb(var(--v-theme-secondary));
  outline-offset: 2px;
  border-radius: 50%;
}

.champion-disabled {
  opacity: 0.25;
  cursor: not-allowed;
  pointer-events: none;
}

.champion-avatar-wrapper {
  position: relative;
}

.champion-check {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgb(var(--v-theme-secondary));
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.champion-name {
  width: 100%;
  text-align: center;
}
</style>
