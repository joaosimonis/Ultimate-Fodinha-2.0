export interface PlayerProfile {
  name: string;
  title: string;
  lore: string[];
  ultimate: {
    name: string;
    description: string;
  };
}

export const PLAYERS_DATA: Record<string, PlayerProfile> = {
  Leo: {
    name: "Leo",
    title: "Alquimista Culinário",
    lore: [
      "Léo é um alquimista incomum que domina a arte de transformar ingredientes raros em criações mágicas. Em sua cozinha-fornalha, especiarias arcanas, ervas místicas e essências elementais se combinam para produzir pratos capazes de fortalecer aliados e restaurar energias perdidas.",
      "Suas receitas são tão precisas quanto poderosas, cada prato carregando propriedades únicas. Guerreiros que provam de suas criações sentem suas forças renovadas como se tivessem sido abençoados pelos próprios deuses da abundância.",
    ],
    ultimate: {
      name: "Banquete dos Heróis",
      description: "Léo prepara um prato lendário que cura todos os aliados e concede força e resistência temporária para a equipe.",
    },
  },
  Messi: {
    name: "Messi",
    title: "Elfo Arcano",
    lore: ["Messi é um antigo elfo que domina os fluxos da magia arcana com precisão absoluta. Desde jovem demonstrou um talento raro para manipular energias invisíveis, tornando-se um dos magos mais refinados de sua era.", "Sua magia é elegante e rápida, quase impossível de prever. Cada gesto seu invoca runas arcanas que alteram o próprio tecido da realidade."],
    ultimate: {
      name: "Tempestade Arcana",
      description: "Messi libera uma explosão massiva de energia arcana que atinge todos os inimigos próximos.",
    },
  },
  Bruno: {
    name: "Bruno",
    title: "Mago de Gelo",
    lore: ["Bruno domina os segredos das geadas eternas, invocando tempestades congelantes e lanças de cristal puro. Onde ele caminha, o ar se torna frio e o solo se cobre de gelo.", "Sua mente é tão calma quanto o inverno profundo, e sua magia reflete esse controle absoluto sobre o elemento da geada."],
    ultimate: {
      name: "Prisão Glacial",
      description: "Uma tempestade congelante envolve o campo de batalha, prendendo inimigos em blocos de gelo.",
    },
  },
  Laura: {
    name: "Laura",
    title: "Feiticeira de Fogo",
    lore: ["Laura é uma manipuladora das chamas elementais, capaz de invocar labaredas que dançam ao seu redor como criaturas vivas. Seu poder nasce da intensidade de sua própria energia interior.", "Quando entra em combate, o campo de batalha se ilumina com o brilho das chamas que obedecem ao seu comando."],
    ultimate: {
      name: "Inferno Carmesim",
      description: "Uma explosão de fogo cobre o campo de batalha causando dano massivo em área.",
    },
  },
  Guto: {
    name: "Guto",
    title: "Druida",
    lore: ["Guto é um guardião da natureza que vive em harmonia com as forças da terra. Árvores, animais e ventos respondem ao seu chamado.", "Seu vínculo com a natureza é tão profundo que ele pode invocar raízes gigantes e criaturas da floresta para lutar ao seu lado."],
    ultimate: {
      name: "Ira da Floresta",
      description: "Raízes gigantes emergem do solo prendendo inimigos e causando dano contínuo.",
    },
  },
  Thiago: {
    name: "Thiago",
    title: "Monge",
    lore: ["Thiago alcançou a maestria do corpo e da mente através de anos de disciplina. Seus movimentos são precisos e harmoniosos.", "Cada golpe seu é executado com foco absoluto, transformando combate em arte marcial perfeita."],
    ultimate: {
      name: "Golpe do Dragão Interior",
      description: "Um poderoso ataque de energia espiritual atinge todos os inimigos à frente.",
    },
  },
  Grade: {
    name: "Grade",
    title: "Anti-herói Sombrio",
    lore: ["Grade vive nas sombras e segue apenas seu próprio código. Seu passado é envolto em mistério.", "Ele usa escuridão e estratégia para derrotar seus inimigos antes mesmo que percebam sua presença."],
    ultimate: {
      name: "Eclipse das Sombras",
      description: "O campo é envolto em escuridão enquanto Grade surge atacando inimigos múltiplas vezes.",
    },
  },
  Murilo: {
    name: "Murilo",
    title: "Guerreiro Lendário",
    lore: ["Murilo é um herói reconhecido por sua coragem e habilidade em batalha. Sua armadura carrega marcas de inúmeras guerras vencidas.", "Ele lidera seus aliados com determinação inabalável."],
    ultimate: {
      name: "Investida do Herói",
      description: "Murilo avança devastando inimigos em seu caminho.",
    },
  },
  Ângela: {
    name: "Ângela",
    title: "Guerreira Lendária",
    lore: ["Ângela combina força e estratégia com habilidade extraordinária. Sua presença inspira aliados e intimida inimigos.", "Seu nome ecoa em histórias de batalhas lendárias."],
    ultimate: {
      name: "Tempestade de Lâminas",
      description: "Ângela executa uma sequência devastadora de ataques rápidos.",
    },
  },
  Rogus: {
    name: "Rogus",
    title: "Berserker",
    lore: ["Rogus entra em batalha com uma fúria quase sobrenatural. Quanto mais luta, mais forte se torna.", "Seu estilo brutal de combate é temido em todos os campos de batalha."],
    ultimate: {
      name: "Fúria Incontrolável",
      description: "Rogus entra em estado de fúria causando dano massivo e ganhando resistência.",
    },
  },
  Thaís: {
    name: "Thaís",
    title: "Sacerdotista",
    lore: ["Thaís canaliza energias divinas para proteger e curar aliados. Sua fé é sua maior força.", "Sua presença traz esperança mesmo nas batalhas mais difíceis."],
    ultimate: {
      name: "Bênção Sagrada",
      description: "Todos os aliados são curados e recebem proteção divina.",
    },
  },
  Geladeira: {
    name: "Geladeira",
    title: "Engenheiro do Gelo",
    lore: ["Geladeira combina ciência e magia para criar estruturas congeladas complexas. Ele molda o gelo como um arquiteto molda pedra.", "Suas invenções transformam o campo de batalha."],
    ultimate: {
      name: "Fortaleza de Cristal",
      description: "Uma muralha gigante de gelo surge protegendo aliados.",
    },
  },
  Fabri: {
    name: "Fabri",
    title: "Maestro da Tempestade Sonora",
    lore: ["Fabri controla ondas sonoras como um verdadeiro maestro do caos. Cada movimento cria vibrações poderosas.", "Batalhas se tornam concertos de energia sonora sob seu comando."],
    ultimate: {
      name: "Sinfonia do Trovão",
      description: "Uma onda sonora massiva explode causando dano em área.",
    },
  },
  João: {
    name: "João",
    title: "Deus da Luz Celestial",
    lore: ["João canaliza o poder da luz divina. Sua presença ilumina até os lugares mais sombrios.", "Ele representa esperança e justiça."],
    ultimate: {
      name: "Julgamento Celestial",
      description: "Feixes de luz descem do céu atingindo todos os inimigos.",
    },
  },
  "Laura S.": {
    name: "Laura S.",
    title: "Feiticeira Arcana Sombria",
    lore: ["Laura S. domina energias arcanas ocultas que poucos ousam estudar.", "Sua magia mistura beleza e perigo."],
    ultimate: {
      name: "Abismo Arcano",
      description: "Uma explosão de energia sombria consome os inimigos próximos.",
    },
  },
  "Luís S.": {
    name: "Luís S.",
    title: "Caçador de Monstros Lendários",
    lore: ["Luís S. dedicou sua vida a caçar criaturas míticas. Seu conhecimento sobre monstros é incomparável.", "Ele enfrenta perigos que poucos sobreviveriam."],
    ultimate: {
      name: "Golpe do Caçador Supremo",
      description: "Um ataque devastador que causa dano extra em criaturas poderosas.",
    },
  },
  Kreutzer: {
    name: "Kreutzer",
    title: "Mestre das Marés",
    lore: ["Kreutzer controla correntes marítimas e tempestades oceânicas.", "O mar responde ao seu chamado."],
    ultimate: {
      name: "Tsunami Ancestral",
      description: "Uma onda gigantesca atravessa o campo causando dano massivo.",
    },
  },
  Lilly: {
    name: "Lilly",
    title: "Arquiteta de Atena",
    lore: ["Discípula da deusa da sabedoria, Lilly cria estruturas mágicas e fortalezas estratégicas.", "Seu conhecimento transforma o campo de batalha."],
    ultimate: {
      name: "Fortaleza de Atena",
      description: "Uma cidadela mágica surge protegendo aliados.",
    },
  },
  Duda: {
    name: "Duda",
    title: "Tecelã dos Sonhos",
    lore: ["Duda caminha entre sonhos e memórias.", "Ela transforma pesadelos em esperança."],
    ultimate: {
      name: "Reino dos Sonhos",
      description: "Inimigos ficam desorientados enquanto aliados recebem regeneração.",
    },
  },
  Fran: {
    name: "Fran",
    title: "Mestra dos Conhecimentos Antigos",
    lore: ["Fran é guardiã de saberes esquecidos e guia novas gerações.", "Seu conhecimento ilumina caminhos."],
    ultimate: {
      name: "Biblioteca Arcana",
      description: "Runas antigas surgem fortalecendo aliados e enfraquecendo inimigos.",
    },
  },
  Knak: {
    name: "Knak",
    title: "Mensageira Celestial",
    lore: ["Knak leva a palavra dos deuses aos mortais.", "Sua presença inspira esperança."],
    ultimate: {
      name: "Chamado Divino",
      description: "Aliados recebem velocidade e cura instantânea.",
    },
  },
  Habekost: {
    name: "Habekost",
    title: "Ferreiro dos Deuses",
    lore: ["Habekost forja armas capazes de rivalizar com relíquias divinas.", "Cada criação carrega poder ancestral."],
    ultimate: {
      name: "Arsenal Divino",
      description: "Armas lendárias surgem fortalecendo todos os aliados.",
    },
  },
  Vogt: {
    name: "Vogt",
    title: "Guardião do Tempo",
    lore: ["Vogt vigia o fluxo do tempo e protege o destino.", "Ele vê ecos do passado e vislumbres do futuro."],
    ultimate: {
      name: "Ruptura Temporal",
      description: "O tempo desacelera para inimigos enquanto aliados agem mais rápido.",
    },
  },
};
