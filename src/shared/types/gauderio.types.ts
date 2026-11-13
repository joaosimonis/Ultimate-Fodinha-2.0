export type GauderioState = "loading" | "empty" | "error" | "static";

export interface GauderioAnimationConfig {
  src: object;
  autoplay: boolean;
  loop: boolean;
}
