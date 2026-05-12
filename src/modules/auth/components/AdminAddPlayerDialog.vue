<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="updateDialog">
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-5">Novo jogador</v-card-title>

      <v-card-text class="px-5 pb-2">
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-text-field v-model="name" label="Nome do jogador" variant="outlined" density="comfortable" autofocus hide-details="auto" class="mb-3" :maxlength="PLAYER_NAME_MAX_LENGTH" counter />
        <v-text-field v-model="avatarKey" label="Chave do avatar" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_AVATAR_KEY_MAX_LENGTH" counter />
        <v-text-field v-model="title" label="Classe do personagem" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_TITLE_MAX_LENGTH" counter />
        <v-textarea v-model="lore" label="Lore" variant="outlined" density="comfortable" rows="3" auto-grow hide-details="auto" class="mb-3" :maxlength="PLAYER_LORE_MAX_LENGTH" counter />
        <v-text-field v-model="ultimateName" label="Nome da ultimate" variant="outlined" density="comfortable" hide-details="auto" class="mb-3" :maxlength="PLAYER_ULTIMATE_NAME_MAX_LENGTH" counter />
        <v-textarea v-model="ultimateDescription" label="Descrição da ultimate" variant="outlined" density="comfortable" rows="2" auto-grow hide-details="auto" :maxlength="PLAYER_ULTIMATE_DESCRIPTION_MAX_LENGTH" counter />

        <div v-if="avatarPreviewKey" class="d-flex align-center ga-3 mt-4">
          <v-avatar size="40">
            <v-img :src="getPlayerAvatarUrl(avatarPreviewKey)" />
          </v-avatar>
          <span class="text-caption text-medium-emphasis">Preview do avatar</span>
        </div>
      </v-card-text>

      <v-card-actions class="px-5 pb-5 ga-2">
        <v-btn variant="tonal" rounded="lg" :disabled="isCreating" @click="close">Cancelar</v-btn>
        <v-btn color="secondary" variant="flat" rounded="lg" :disabled="!canCreatePlayer" :loading="isCreating" @click="createPlayer">Adicionar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getApiErrorMessage } from "@/api/error";
import {
  PLAYER_AVATAR_KEY_MAX_LENGTH,
  PLAYER_LORE_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  PLAYER_TITLE_MAX_LENGTH,
  PLAYER_ULTIMATE_DESCRIPTION_MAX_LENGTH,
  PLAYER_ULTIMATE_NAME_MAX_LENGTH,
} from "@/modules/players/constants/players.constants";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const playersStore = usePlayersStore();

const name = ref("");
const avatarKey = ref("");
const title = ref("");
const lore = ref("");
const ultimateName = ref("");
const ultimateDescription = ref("");
const error = ref("");
const isCreating = ref(false);

const normalizeAvatarKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const avatarPreviewKey = computed(() => avatarKey.value.trim() || name.value.trim());

const canCreatePlayer = computed(
  () =>
    name.value.trim().length > 0 &&
    avatarKey.value.trim().length > 0 &&
    title.value.trim().length > 0 &&
    lore.value.trim().length > 0 &&
    ultimateName.value.trim().length > 0 &&
    ultimateDescription.value.trim().length > 0 &&
    !isCreating.value
);

const reset = () => {
  name.value = "";
  avatarKey.value = "";
  title.value = "";
  lore.value = "";
  ultimateName.value = "";
  ultimateDescription.value = "";
  error.value = "";
};

const close = () => {
  emit("update:modelValue", false);
};

const updateDialog = (value: boolean) => {
  emit("update:modelValue", value);
};

const createPlayer = async () => {
  const playerName = name.value.trim();

  if (!canCreatePlayer.value) return;

  if (playersStore.players.some((player) => player.name.toLowerCase() === playerName.toLowerCase())) {
    error.value = "Já existe um jogador com esse nome.";
    return;
  }

  isCreating.value = true;
  error.value = "";

  try {
    await playersStore.createPlayer({
      name: playerName,
      avatar_key: avatarKey.value.trim(),
      title: title.value.trim(),
      lore: lore.value.trim(),
      ultimate: {
        name: ultimateName.value.trim(),
        description: ultimateDescription.value.trim(),
      },
    });

    close();
  } catch (err) {
    error.value = getApiErrorMessage(err);
  } finally {
    isCreating.value = false;
  }
};

watch(name, (currentName, previousName) => {
  const previousGeneratedKey = normalizeAvatarKey(previousName ?? "");

  if (!avatarKey.value.trim() || avatarKey.value === previousGeneratedKey) {
    avatarKey.value = normalizeAvatarKey(currentName);
  }
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      reset();
    }
  }
);
</script>
