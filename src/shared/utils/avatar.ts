export const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&radius=50`
}