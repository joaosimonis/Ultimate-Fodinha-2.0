export const TRUCO_MAX_SCORE_DEFAULT = 15;
export const TRUCO_MAX_SCORE_OPTIONS = [15, 24, 30] as const;
export const TRUCO_MODES = ["dupla", "trio"] as const;
export const TRUCO_PLAYERS_PER_MODE = {
  dupla: 2,
  trio: 3,
} as const;
