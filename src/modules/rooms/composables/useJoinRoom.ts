import { useRouter } from "vue-router";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { matchesApi } from "@/modules/matches/api";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";
import { usePlayersStore } from "@/shared/store/usePlayersStore";

export function useJoinRoom() {
  const router = useRouter();
  const fodinhaStore = useFodinhaStore();
  const playersStore = usePlayersStore();

  const joinRoom = async (roomCode: string) => {
    const room = await matchesApi.getRoomByCode(roomCode);

    if (room.mode !== "fodinha") {
      throw new Error("Entrada em salas de Truco será feita na próxima etapa.");
    }

    if (room.status !== "ongoing") {
      throw new Error("Essa partida já foi finalizada.");
    }

    if (!room.players?.length || !room.lives) {
      throw new Error("Não foi possível carregar os dados da sala.");
    }

    await playersStore.loadPlayers();

    const selectedPlayers = room.players.map((matchPlayer) => {
      const player = playersStore.players.find((p) => p.id === matchPlayer.player_id);

      if (!player) {
        return null;
      }

      return player;
    });

    if (selectedPlayers.some((player) => player === null)) {
      throw new Error("Não foi possível encontrar todos os jogadores da sala.");
    }

    const roomPlayers = selectedPlayers.filter((player): player is RegisteredPlayer => player !== null);

    fodinhaStore.setup({
      matchId: room.id,
      roomCode: room.room_code,
      hostToken: room.host_token ?? "",
      players: roomPlayers,
      initialLives: room.lives,
    });

    room.live_state?.lives && fodinhaStore.syncLives(room.live_state.lives);

    router.push({ name: "fodinha-game" });
  };

  return { joinRoom };
}
