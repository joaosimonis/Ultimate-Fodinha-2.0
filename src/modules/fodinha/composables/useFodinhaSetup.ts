import { ref } from "vue";
import { FODINHA_DEFAULT_LIVES, FODINHA_LIVES_OPTIONS } from "@/modules/fodinha/constants/fodinha.constants";

export function useFodinhaSetup() {
  const selectedLives = ref(FODINHA_DEFAULT_LIVES);

  return {
    selectedLives,
    livesOptions: FODINHA_LIVES_OPTIONS,
  };
}
