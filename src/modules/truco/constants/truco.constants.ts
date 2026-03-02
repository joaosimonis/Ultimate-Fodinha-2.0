export const TRUCO_MAX_SCORE_DEFAULT = 24;
export const TRUCO_MAX_SCORE_OPTIONS = [12, 24, 30] as const;
export const TRUCO_MODES = ["dupla", "trio"] as const;
export const TRUCO_PLAYERS_PER_MODE = {
  dupla: 2,
  trio: 3,
} as const;
