import loadingAnimation from "@/assets/animation/gauderio-loading.json";
import emptyAnimation from "@/assets/animation/gauderio-vazio.json";
import errorAnimation from "@/assets/animation/gauderio-erro.json";
import staticAnimation from "@/assets/animation/gauderio-estatico.json";
import type { GauderioAnimationConfig, GauderioState } from "@/shared/types/gauderio.types";

export const GAUDERIO_ANIMATIONS = {
  loading: { src: loadingAnimation, autoplay: true, loop: true },
  empty: { src: emptyAnimation, autoplay: true, loop: false },
  error: { src: errorAnimation, autoplay: true, loop: false },
  static: { src: staticAnimation, autoplay: false, loop: false },
} satisfies Record<GauderioState, GauderioAnimationConfig>;
