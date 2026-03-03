<template>
  <div class="winner-hero" :style="heroStyle">
    <div class="winner-hero__stage">
      <div class="winner-hero__glow" />
      <div class="winner-hero__ring winner-hero__ring--inner" />
      <div class="winner-hero__ring winner-hero__ring--outer" />

      <span v-for="sparkle in sparkles" :key="sparkle.className" class="winner-hero__sparkle" :class="sparkle.className">
        {{ sparkle.symbol }}
      </span>

      <div class="winner-hero__trophy-shell">
        <v-icon class="winner-hero__trophy" icon="mdi-trophy" />
      </div>
    </div>

    <p class="text-h5 font-weight-bold mb-1 winner-hero__name">{{ winnerName }}</p>
    <p class="text-medium-emphasis">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface WinnerHeroProps {
  winnerName: string;
  subtitle?: string;
  tone?: "primary" | "secondary" | "error" | "success" | "warning" | "info";
}

const props = withDefaults(defineProps<WinnerHeroProps>(), {
  subtitle: "venceu a partida!",
  tone: "primary",
});

const heroStyle = computed(() => ({
  "--winner-accent": `var(--v-theme-${props.tone})`,
  "--winner-gold-rgb": "244, 197, 66",
}));

const sparkles = [
  { className: "winner-hero__sparkle--top-left", symbol: "✦" },
  { className: "winner-hero__sparkle--top-right", symbol: "✦" },
  { className: "winner-hero__sparkle--mid-left", symbol: "✦" },
  { className: "winner-hero__sparkle--mid-right", symbol: "✦" },
  { className: "winner-hero__sparkle--bottom", symbol: "✦" },
];
</script>

<style scoped>
.winner-hero {
  display: grid;
  justify-items: center;
  gap: 0;
}

.winner-hero__stage {
  position: relative;
  display: grid;
  place-items: center;
  width: 9rem;
  height: 6.75rem;
  margin-bottom: 0.1rem;
  isolation: isolate;
}

.winner-hero__glow {
  position: absolute;
  inset: 1rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(var(--winner-gold-rgb), 0.34) 0%, rgba(var(--winner-gold-rgb), 0.12) 42%, rgba(var(--winner-gold-rgb), 0) 72%);
  filter: blur(6px);
  animation: winner-glow-breathe 2.2s ease-in-out infinite;
}

.winner-hero__ring {
  position: absolute;
  border-radius: 999px;
  border: 2px solid rgba(var(--winner-gold-rgb), 0.26);
}

.winner-hero__ring--inner {
  inset: 0.85rem;
  animation: winner-ring-pulse 2s ease-out infinite;
}

.winner-hero__ring--outer {
  inset: 0.35rem;
  animation: winner-ring-pulse 2s ease-out infinite 0.45s;
}

.winner-hero__trophy-shell {
  position: relative;
  display: grid;
  place-items: center;
  width: 5.25rem;
  height: 5.25rem;
  border-radius: 1.5rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(var(--winner-accent), 0.18));
  box-shadow:
    0 0.75rem 1.75rem rgba(var(--winner-accent), 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: winner-shell-float 2.8s ease-in-out infinite;
}

.winner-hero__trophy-shell::before {
  content: "";
  position: absolute;
  inset: 0.3rem;
  border-radius: 1.2rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.14));
}

.winner-hero__trophy {
  position: relative;
  z-index: 1;
  font-size: 3.1rem;
  line-height: 1;
  color: #f4c542;
  filter: drop-shadow(0 0.4rem 0.5rem rgba(var(--winner-gold-rgb), 0.26));
  animation:
    winner-trophy-entrance 900ms cubic-bezier(0.2, 0.9, 0.22, 1.2),
    winner-trophy-sway 2.8s ease-in-out 900ms infinite;
}

.winner-hero__sparkle {
  position: absolute;
  z-index: 1;
  color: rgba(var(--winner-gold-rgb), 0.82);
  text-shadow: 0 0 12px rgba(var(--winner-gold-rgb), 0.3);
  animation: winner-sparkle 1.8s ease-in-out infinite;
}

.winner-hero__sparkle--top-left {
  top: 0.55rem;
  left: 0.85rem;
  font-size: 1.1rem;
}

.winner-hero__sparkle--top-right {
  top: 0.7rem;
  right: 0.75rem;
  font-size: 0.9rem;
  animation-delay: 0.35s;
}

.winner-hero__sparkle--mid-left {
  top: 2.35rem;
  left: 0.1rem;
  font-size: 0.85rem;
  animation-delay: 0.7s;
}

.winner-hero__sparkle--mid-right {
  top: 2.55rem;
  right: 0;
  font-size: 1rem;
  animation-delay: 1s;
}

.winner-hero__sparkle--bottom {
  bottom: 0.45rem;
  right: 1.65rem;
  font-size: 0.8rem;
  animation-delay: 1.3s;
}

.winner-hero__name {
  margin-bottom: 0.1rem !important;
  line-height: 1.15;
  animation: winner-name-glow 2s ease-in-out infinite;
}

.winner-hero :deep(.text-medium-emphasis) {
  margin-top: 0;
  line-height: 1.1;
}

@keyframes winner-trophy-entrance {
  0% {
    transform: translateY(1.4rem) scale(0.2) rotate(-18deg);
    opacity: 0;
  }
  55% {
    transform: translateY(-0.35rem) scale(1.16) rotate(6deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes winner-trophy-sway {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-0.35rem) rotate(4deg);
  }
}

@keyframes winner-shell-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-0.25rem) scale(1.02);
  }
}

@keyframes winner-ring-pulse {
  0% {
    transform: scale(0.78);
    opacity: 0;
  }
  30% {
    opacity: 0.85;
  }
  100% {
    transform: scale(1.08);
    opacity: 0;
  }
}

@keyframes winner-glow-breathe {
  0%,
  100% {
    transform: scale(0.96);
    opacity: 0.82;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes winner-sparkle {
  0%,
  100% {
    transform: translateY(0) scale(0.9);
    opacity: 0.35;
  }
  50% {
    transform: translateY(-0.45rem) scale(1.16);
    opacity: 1;
  }
}

@keyframes winner-name-glow {
  0%,
  100% {
    text-shadow: 0 0 0 rgba(var(--winner-gold-rgb), 0);
  }
  50% {
    text-shadow: 0 0 18px rgba(var(--winner-gold-rgb), 0.24);
  }
}
</style>
