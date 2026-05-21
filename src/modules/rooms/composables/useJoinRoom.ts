import { useRouter } from "vue-router";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { matchesApi } from "@/modules/matches/api";
import type { MatchPlayerResponse, MatchResponse } from "@/modules/matches/types/matches.types";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";
import type { TrucoMode } from "@/modules/truco/types/truco.types";
import { usePlayersStore } from "@/shared/store/usePlayersStore";

export function useJoinRoom() {
  const router = useRouter();
  const fodinhaStore = useFodinhaStore();
  const trucoStore = useTrucoStore();
  const playersStore = usePlayersStore();

  const getRegisteredPlayer = (playerId: string) => {
    const player = playersStore.players.find((p) => p.id === playerId);

    if (!player) {
      throw new Error("Não foi possível encontrar todos os jogadores da sala.");
    }

    return player;
  };

  const assertOngoingRoom = (room: MatchResponse) => {
    if (room.status === "cancelled") {
      throw new Error("Essa partida foi cancelada pelo admin.");
    }

    if (room.status !== "ongoing") {
      throw new Error("Essa partida já foi finalizada.");
    }
  };

  const joinFodinhaRoom = async (room: MatchResponse) => {
    if (!room.players?.length || !room.lives) {
      throw new Error("Não foi possível carregar os dados da sala.");
    }

    const roomPlayers = room.players.map((matchPlayer) => getRegisteredPlayer(matchPlayer.player_id));

    fodinhaStore.setup({
      matchId: room.id,
      roomCode: room.room_code,
      hostToken: room.host_token ?? "",
      players: roomPlayers,
      initialLives: room.lives,
    });

    room.live_state?.lives && fodinhaStore.syncLives(room.live_state.lives);

    router.push({ name: "fodinha-game", params: { roomCode: room.room_code } });
  };

  const groupPlayersByTeam = (matchPlayers: MatchPlayerResponse[]) => {
    const teams = new Map<string, RegisteredPlayer[]>();

    matchPlayers.forEach((matchPlayer) => {
      if (!matchPlayer.team_name) {
        throw new Error("Não foi possível carregar os times da sala.");
      }

      const teamPlayers = teams.get(matchPlayer.team_name) ?? [];
      teams.set(matchPlayer.team_name, [...teamPlayers, getRegisteredPlayer(matchPlayer.player_id)]);
    });

    return Array.from(teams.entries()).map(([name, players]) => ({
      name,
      players,
    }));
  };

  const getTrucoModeByTeams = (teams: Array<{ players: RegisteredPlayer[] }>): TrucoMode => {
    const playersPerTeam = teams[0]?.players.length;

    if (playersPerTeam === 3) {
      return "trio";
    }

    return "dupla";
  };

  const joinTrucoRoom = async (room: MatchResponse) => {
    if (!room.players?.length || !room.max_score) {
      throw new Error("Não foi possível carregar os dados da sala.");
    }

    const teams = groupPlayersByTeam(room.players);

    if (teams.length !== 2 || teams.some((team) => team.players.length < 2)) {
      throw new Error("Não foi possível carregar os times da sala.");
    }

    trucoStore.setup({
      teams,
      maxScore: room.max_score,
      mode: getTrucoModeByTeams(teams),
      matchId: room.id,
      roomCode: room.room_code,
      hostToken: room.host_token ?? "",
    });

    room.live_state?.scores && trucoStore.syncScores(room.live_state.scores);

    router.push({ name: "truco-game", params: { roomCode: room.room_code } });
  };

  const joinRoom = async (roomCode: string) => {
    const room = await matchesApi.getRoomByCode(roomCode);

    assertOngoingRoom(room);
    await playersStore.loadPlayers();

    if (room.mode === "fodinha") {
      await joinFodinhaRoom(room);
      return;
    }

    await joinTrucoRoom(room);
  };

  return { joinRoom };
}
