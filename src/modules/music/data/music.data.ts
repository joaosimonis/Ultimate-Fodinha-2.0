import myspaceship from "@/assets/audios/music/myspaceship.mp3";
import aliens from "@/assets/audios//music/aliens.mp3";
import type { Track } from "../types/music.types";

export const TRACKS: Track[] = [
  {
    id: "myspaceship",
    title: "My Spaceship",
    artist: "Did You See",
    src: myspaceship,
  },
  {
    id: "aliens",
    title: "Aliens",
    artist: "Did You See",
    src: aliens,
  },
];
