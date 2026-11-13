import loadingAnimation from "@/assets/animation/gauderio-loading.json";
import emptyAnimation from "@/assets/animation/gauderio-vazio.json";
import errorAnimation from "@/assets/animation/gauderio-erro.json";
import staticAnimation from "@/assets/animation/gauderio-estatico.json";
import greetingAnimation from "@/assets/animation/gauderio-cumprimento.json";
import type { GauderioAnimationConfig, GauderioState } from "@/shared/types/gauderio.types";

export const GAUDERIO_ANIMATIONS = {
  loading: { src: loadingAnimation, autoplay: true, loop: true },
  empty: { src: emptyAnimation, autoplay: true, loop: false },
  error: { src: errorAnimation, autoplay: true, loop: false },
  static: { src: staticAnimation, autoplay: false, loop: false },
  greeting: { src: greetingAnimation, autoplay: true, loop: false, segment: [0, 54] },
} satisfies Record<GauderioState, GauderioAnimationConfig>;
