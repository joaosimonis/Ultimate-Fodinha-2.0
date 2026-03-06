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
import knak from "@/assets/players/knak.png"
import kreutzer from "@/assets/players/kreutzer.png"
import laura from "@/assets/players/laura.png"
import lauraleoa from "@/assets/players/lauraleoa.png"
import leo from "@/assets/players/leo.png"
import lilly from "@/assets/players/lilly.png"
import luis from "@/assets/players/luis.png"
import messi from "@/assets/players/messi.png"
import murilo from "@/assets/players/murilo.png"
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
  knak,
  kreutzer,
  laura,
  lauraleoa,
  "laura s.": lauraleoa,
  "laura s": lauraleoa,
  leo,
  lilly,
  luis,
  "luis s.": luis,
  "luis s": luis,
  messi,
  murilo,
  rogus,
  thais,
  thiago,
  vogt,
}

export const getAvatarUrl = (name: string): string => {
  const key = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return avatarMap[key] ?? fallback
}
