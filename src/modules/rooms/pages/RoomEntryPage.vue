<template>
  <div class="room-entry-page d-flex flex-column">
    <SetupHeader title="Sala" title-icon="mdi-lan-connect" />

    <v-container class="flex-grow-1 d-flex align-center justify-center py-6">
      <div class="room-entry-wrapper text-center">
        <AppLoading v-if="isLoading" message="Entrando na sala..." />

        <AppErrorState v-else :message="errorMessage" action-label="Ver salas" @action="goToRooms" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import { useJoinRoom } from "@/modules/rooms/composables/useJoinRoom";
import AppErrorState from "@/shared/components/AppErrorState.vue";
import AppLoading from "@/shared/components/AppLoading.vue";
import SetupHeader from "@/shared/components/SetupHeader.vue";

const route = useRoute();
const router = useRouter();
const { joinRoom } = useJoinRoom();

const isLoading = ref(true);
const errorMessage = ref("");

const roomCode = computed(() => String(route.params.roomCode ?? "").trim().toUpperCase());

const goToRooms = () => {
  router.push({ name: "rooms" });
};

onMounted(async () => {
  if (!roomCode.value) {
    errorMessage.value = "Código da sala não informado.";
    isLoading.value = false;
    return;
  }

  try {
    await joinRoom(roomCode.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : getApiErrorMessage(error);
    isLoading.value = false;
  }
});
</script>

<style scoped>
.room-entry-page {
  height: 100%;
}

.room-entry-wrapper {
  max-width: 360px;
  width: 100%;
  padding: 16px;
}
</style>
