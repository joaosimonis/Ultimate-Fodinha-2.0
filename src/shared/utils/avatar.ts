import angela from "@/assets/players/angela.png"
import bruno from "@/assets/players/bruno.png"
import fabri from "@/assets/players/fabri.png"
import geladeira from "@/assets/players/geladeira.png"
import grade from "@/assets/players/grade.png"
import guto from "@/assets/players/guto.png"
import joao from "@/assets/players/joao.png"
import laura from "@/assets/players/laura.png"
import leo from "@/assets/players/leo.png"
import messi from "@/assets/players/messi.png"
import murilo from "@/assets/players/murilo.png"
import rogus from "@/assets/players/rogus.png"
import thais from "@/assets/players/thais.png"
import thiago from "@/assets/players/thiago.png"

import fallback from "@/assets/ultimate-fodinha-logo.svg"

const avatarMap: Record<string, string> = {
  angela,
  bruno,
  fabri,
  geladeira,
  grade,
  guto,
  joao,
  laura,
  leo,
  messi,
  murilo,
  rogus,
  thais,
  thiago,
}

export const getAvatarUrl = (name: string): string => {
  const key = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return avatarMap[key] ?? fallback
}