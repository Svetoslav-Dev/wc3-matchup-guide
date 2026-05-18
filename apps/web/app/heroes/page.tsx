import Link from "next/link";
import { listHeroes } from "../../lib/content";

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
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Hero Library</p>
        <h1 className="page-title">Every hero path, from race staples to tavern pivots.</h1>
        <p className="page-intro">
          Browse all race heroes and the full tavern roster on one page. Each card links into the
          detailed guide for that hero.
        </p>
      </div>
      {heroGroups.map((group) => (
        <section key={group.category} className="page-stack">
          <div className="section-head">
            <h2>{group.category} Heroes:</h2>
            <p className="page-intro">{categoryDescriptions[group.category]}</p>
          </div>
          <div className="card-grid">
            {group.heroes.map((hero) => (
              <article key={hero.slug} className="card">
                <div className="title-row">
                  <p className="pill pill--race">{hero.raceName}</p>
                  <h3>{hero.name}</h3>
                  <div className="list-meta">
                    <span>{hero.role}</span>
                  </div>
                </div>
                <p>{hero.description}</p>
                <div className="card__footer">
                  <div className="list-meta">
                    <span>{hero.primaryAttribute}</span>
                  </div>
                  <Link href={`/heroes/${hero.slug}`} className="button button--ghost">
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
