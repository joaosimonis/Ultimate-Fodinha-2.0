<template>
  <v-dialog :model-value="modelValue" max-width="380" @update:model-value="updateDialog">
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-5">Acesso admin</v-card-title>

      <v-card-text class="px-5 pb-2">
        <v-text-field
          v-model="username"
          label="Usuário"
          type="text"
          variant="outlined"
          density="comfortable"
          autocomplete="username"
          autofocus
          hide-details="auto"
          class="mb-3"
          @keydown.enter="login"
        />

        <v-text-field
          v-model="password"
          label="Senha"
          type="password"
          variant="outlined"
          density="comfortable"
          autocomplete="current-password"
          hide-details="auto"
          :error-messages="error"
          @keydown.enter="login"
        />
      </v-card-text>

      <v-card-actions class="px-5 pb-5 ga-2">
        <v-btn variant="tonal" rounded="lg" :disabled="isLoading" @click="close">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" rounded="lg" :disabled="!canLogin" :loading="isLoading" @click="login">Entrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getApiErrorMessage } from "@/api/error";
import { authApi } from "@/modules/auth/api";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  authenticated: [];
}>();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const canLogin = computed(() => username.value.trim().length > 0 && password.value.length > 0 && !isLoading.value);

const reset = () => {
  username.value = "";
  password.value = "";
  error.value = "";
};

const close = () => {
  emit("update:modelValue", false);
};

const updateDialog = (value: boolean) => {
  emit("update:modelValue", value);
};

const login = async () => {
  if (!canLogin.value) return;

  isLoading.value = true;
  error.value = "";

  try {
    await authApi.login({
      username: username.value.trim(),
      password: password.value,
    });

    emit("authenticated");
    close();
  } catch (err) {
    error.value = getApiErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      reset();
    }
  }
);
</script>

<style scoped>

</style>
