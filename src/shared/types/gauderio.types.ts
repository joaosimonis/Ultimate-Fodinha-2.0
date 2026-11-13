export type GauderioState = "loading" | "empty" | "error" | "static" | "greeting";

export interface GauderioAnimationConfig {
  src: object;
  autoplay: boolean;
  loop: boolean;
  segment?: [number, number];
}
