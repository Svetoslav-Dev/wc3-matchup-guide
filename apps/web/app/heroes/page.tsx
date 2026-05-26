import Link from "next/link";
import { listHeroes } from "../../lib/content";
import { GameImage } from "../../components/game-image";

const ATTR_ICON: Record<string, string> = {
  Strength:     "⚔️",
  Agility:      "🏹",
  Intelligence: "🔮",
};

const ATTR_COLOR: Record<string, string> = {
  Strength:     "#f87171",
  Agility:      "#4ade80",
  Intelligence: "#818cf8",
};

function PrimaryAttribute({ value }: { value: string }) {
  const icon  = ATTR_ICON[value]  ?? "◆";
  const color = ATTR_COLOR[value] ?? "var(--muted)";
  return (
    <span className="attr-badge" style={{ color, borderColor: color }}>
      {icon} {value}
    </span>
  );
}

const CATEGORY_ICON: Record<string, string> = {
  Human:      "/images/Races/Humans_Icon.png",
  Orc:        "/images/Races/Orcs_Icon.png",
  Undead:     "/images/Races/Undead_Icon.png",
  "Night Elf":"/images/Races/Night_Elves_Icon.png",
  Tavern:     "/images/Buildings/Tavern.png",
};

export default async function HeroesPage() {
  const result = await listHeroes(1, 64);
  const categoryOrder = ["Human", "Orc", "Undead", "Night Elf", "Tavern"];
  const categoryDescriptions: Record<string, string> = {
    Human: "Human heroes emphasize mana efficiency, healing support, and reliable control for disciplined macro games.",
    Orc: "Orc heroes reward tempo, scouting, and decisive focus fire backed by durable frontline units.",
    Undead: "Undead heroes revolve around sustain, burst nukes, and punishing timing windows once levels come online.",
    "Night Elf":
      "Night Elf heroes excel at map mobility, mana pressure, and punishing exposed units or greedy expansions.",
    Tavern:
      "Tavern heroes offer cross-race second-hero spikes, chase tools, sustain, summons, and specialist timing pressure.",
  };
  const heroGroups = categoryOrder
    .map((category) => ({
      category,
      heroes: result.data.filter((hero) => hero.raceName === category),
    }))
    .filter((group) => group.heroes.length > 0);

  return (
    <div className="page-shell page-stack" style={{ paddingTop: "1.5rem" }}>
      <div className="section-head">
        <p className="section-label">Hero Library</p>
        <h1 className="page-title">Every hero path, from race staples to tavern pivots</h1>
        <p className="page-intro">
          Browse all race heroes and the full tavern roster on one page. Each card links into the
          detailed guide for that hero.
        </p>
      </div>
      {heroGroups.map((group) => (
        <section key={group.category} className="grid gap-4 pt-6">
          <div className="section-head">
            <h2 className="flex items-center gap-3">
              {CATEGORY_ICON[group.category] ? (
                <GameImage
                  src={CATEGORY_ICON[group.category]}
                  alt={group.category}
                  width={32}
                  height={32}
                  className="rounded-[6px] shrink-0"
                />
              ) : null}
              {group.category} Heroes
            </h2>
            <p className="page-intro">{categoryDescriptions[group.category]}</p>
          </div>
          <div className="card-grid">
            {group.heroes.map((hero) => (
              <article key={hero.slug} className="card">
                <p className="pill pill--race">{hero.raceName}</p>
                <div className="title-row">
                  <GameImage
                    src={hero.imageUrl ?? `/images/heroes/${hero.slug}.jpg`}
                    alt={hero.name}
                    className="game-image--icon"
                    width={64}
                    height={64}
                  />
                  <div className="title-stack">
                    <h3>{hero.name}</h3>
                    <div className="list-meta">
                      <span>{hero.role}</span>
                    </div>
                  </div>
                </div>
                <p>{hero.description}</p>
                <div className="card__footer">
                  <div className="list-meta">
                    <span className="muted" style={{ fontSize: "0.8rem" }}>Primary attribute:</span>
                    <PrimaryAttribute value={hero.primaryAttribute} />
                  </div>
                  <Link href={`/heroes/${hero.slug}`} className="button button--ghost button--sm">
                    View Hero Guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
