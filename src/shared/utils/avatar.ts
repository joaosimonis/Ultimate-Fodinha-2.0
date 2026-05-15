import angela from "@/assets/players/angela.png"
import bruno from "@/assets/players/bruno.png"
import duda from "@/assets/players/duda.png"
import fabri from "@/assets/players/fabri.png"
import fran from "@/assets/players/fran.png"
import geladeira from "@/assets/players/geladeira.png"
import grade from "@/assets/players/grade.png"
import guto from "@/assets/players/guto.png"
import habekost from "@/assets/players/habekost.png"
import joao from "@/assets/players/joao.png"
import kevin from "@/assets/players/kevin.png"
import knak from "@/assets/players/knak.png"
import kreutzer from "@/assets/players/kreutzer.png"
import laura from "@/assets/players/laura.png"
import lauraleoa from "@/assets/players/lauraleoa.png"
import leo from "@/assets/players/leo.png"
import lily from "@/assets/players/lilly.png"
import luis from "@/assets/players/luis.png"
import messi from "@/assets/players/messi.png"
import murilo from "@/assets/players/murilo.png"
import pelotas from "@/assets/players/pelotas.png"
import rogus from "@/assets/players/rogus.png"
import thais from "@/assets/players/thais.png"
import thiago from "@/assets/players/thiago.png"
import vogt from "@/assets/players/vogt.png"

import fallback from "@/assets/images/tc.png"

const avatarMap: Record<string, string> = {
  angela,
  bruno,
  duda,
  fabri,
  fran,
  geladeira,
  grade,
  guto,
  habekost,
  joao,
  kevin,
  knak,
  kreutzer,
  laura,
  lauraleoa,
  "laura s.": lauraleoa,
  "laura s": lauraleoa,
  leo,
  lily,
  lilly: lily,
  luis,
  "luis s.": luis,
  "luis s": luis,
  messi,
  murilo,
  pelotas,
  rogus,
  thais,
  thiago,
  vogt,
}

export const getPlayerAvatarUrl = (avatarKey: string): string => {
  const key = avatarKey.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return avatarMap[key] ?? fallback
}
