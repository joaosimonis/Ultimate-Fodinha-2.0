<template>
  <div v-if="roomCode" class="room-status">
    <div class="room-status__main">
      <span class="room-status__code" :class="`text-${color}`">#{{ roomCode }}</span>
      <span class="room-status__role">
        <v-icon :icon="isHost ? 'mdi-crown' : 'mdi-eye'" size="16" />
        {{ isHost ? "Host" : "Assistindo" }}
      </span>
    </div>

    <div class="room-status__online" :class="{ 'room-status__online--connected': status === 'connected' }">
      <v-icon icon="mdi-broadcast" size="16" />
      <span>{{ connectionLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RoomSocketStatus } from "@/modules/rooms/types/roomSocket.types";

const props = withDefaults(
  defineProps<{
    roomCode: string | null;
    isHost: boolean;
    status: RoomSocketStatus;
    viewerCount: number;
    color?: string;
  }>(),
  {
    color: "primary",
  }
);

const connectionLabel = computed(() => {
  if (props.status === "connecting") return "Conectando...";
  if (props.status === "reconnecting") return "Reconectando...";
  if (props.status === "error") return "Conexão perdida";

  return `${props.viewerCount} online`;
});
</script>

<style scoped>
.room-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
  padding: 0 2px;
}

.room-status__main,
.room-status__role,
.room-status__online {
  display: flex;
  align-items: center;
}

.room-status__main {
  min-width: 0;
  gap: 8px;
}

.room-status__code {
  font-weight: 700;
  white-space: nowrap;
}

.room-status__role {
  color: rgba(var(--v-theme-on-surface), 0.7);
  gap: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.room-status__online {
  color: rgba(var(--v-theme-on-surface), 0.55);
  gap: 4px;
  flex-shrink: 0;
  font-size: 0.8rem;
  white-space: nowrap;
}

.room-status__online--connected {
  color: rgb(var(--v-theme-success));
}
</style>
