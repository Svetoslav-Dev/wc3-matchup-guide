export const mapCategories = [
  {
    slug: "1v1",
    name: "1v1",
    description: "Classic solo ladder maps focused on clean creep routes, tight scouting, and precise expansion timing.",
  },
  {
    slug: "2v2",
    name: "2v2",
    description: "Duo maps built around shared pressure, coordinated creep pulls, and partner reinforcement timing.",
  },
  {
    slug: "3v3",
    name: "3v3",
    description: "Teamfight-heavy maps where lane overlap, shared creeps, and fast collapses shape the game.",
  },
  {
    slug: "4v4",
    name: "4v4",
    description: "Large team maps with wider economies, longer rotations, and huge late-game army clashes.",
  },
  {
    slug: "5v5",
    name: "5v5",
    description: "Massive team environments that reward coordinated tech paths and disciplined multi-front defense.",
  },
  {
    slug: "6v6",
    name: "6v6",
    description: "Oversized battles with long movement routes, layered support play, and chaotic reinforcement timing.",
  },
  {
    slug: "ffa",
    name: "FFA",
    description: "Free-for-all maps where survival, hidden economy, diplomacy reads, and late-game scaling matter most.",
  },
] as const;

export const mapSlugsByCategory: Record<string, string[]> = {
  "1v1": [
    "echo-isles",
    "terenas-stand",
    "turtle-rock",
    "twisted-meadows",
    "the-two-rivers",
    "floodplains-1v1",
    "secret-valley",
  ],
  "2v2": [
    "lost-temple",
    "twisted-meadows",
    "traversing-the-ruins",
    "tranquil-paths",
    "avalanche",
    "the-crucible",
  ],
  "3v3": [
    "gnoll-wood",
    "monsoon",
    "typhoon",
    "deadlands",
  ],
  "4v4": [
    "gold-rush",
    "market-square",
    "battleground",
    "murgul-oasis",
    "dustwallow-keys",
    "the-crucible",
    "deadlands",
  ],
  "5v5": [
    "dragon-falls",
    "dustwallow-keys",
  ],
  "6v6": [
    "ice-crown",
  ],
  ffa: [
    "lost-temple",
    "twisted-meadows",
    "gnoll-wood",
    "avalanche",
    "the-crucible",
    "ice-crown",
  ],
};

export const mapCategoryNameBySlug = Object.fromEntries(
  mapCategories.map((category) => [category.slug, category.name]),
) as Record<string, string>;
