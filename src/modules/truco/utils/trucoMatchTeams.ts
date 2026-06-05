import type { MatchResponse } from "@/modules/matches/types/matches.types";
import type { TrucoSetupPayload } from "@/modules/truco/types/truco.types";

const buildPlayerSetKey = (playerIds: string[]) => [...playerIds].sort((a, b) => a.localeCompare(b)).join("|");

export const applyMatchTeamIds = (match: MatchResponse, teams: TrucoSetupPayload["teams"]): TrucoSetupPayload["teams"] => {
  const playerIdsByTeamId = new Map<string, string[]>();
  const matchTeamsByName = new Map(match.teams?.map((team) => [team.team_name, team.id]) ?? []);

  match.players?.forEach((player) => {
    if (!player.team_id) return;

    const playerIds = playerIdsByTeamId.get(player.team_id) ?? [];
    playerIdsByTeamId.set(player.team_id, [...playerIds, player.player_id]);
  });

  const matchTeamIdsByPlayerSet = new Map(
    Array.from(playerIdsByTeamId.entries()).map(([teamId, playerIds]) => [buildPlayerSetKey(playerIds), teamId])
  );

  return teams.map((team) => {
    const playerSetKey = buildPlayerSetKey(team.players.map((player) => player.id));

    return {
      ...team,
      id: matchTeamIdsByPlayerSet.get(playerSetKey) ?? matchTeamsByName.get(team.name),
    };
  });
};
