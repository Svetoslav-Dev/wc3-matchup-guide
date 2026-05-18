import Link from "next/link";
import { listRaces } from "../../lib/content";

export default async function UnitsPage() {
  const races = await listRaces(1, 20);
  const categoryOrder = ["human", "orc", "undead", "night-elf", "neutral"];
  const categoryDescriptions: Record<string, string> = {
    human: "Militia timings, sturdy frontlines, and layered spell support from the Human arsenal.",
    orc: "Aggressive melee, ensnare catches, and tempo-driven warbands from the Orc roster.",
    undead: "Fiend pressure, statue sustain, and devastating spell timing tools from Undead armies.",
    "night-elf": "Mobile skirmishers, bear frontlines, and anti-magic control from Night Elf tech paths.",
    neutral: "Mercenary camp hireables and neutral support options available to any race on the map.",
  };
  const categories = categoryOrder
    .map((slug) => races.data.find((race) => race.slug === slug))
    .filter((race): race is NonNullable<typeof race> => Boolean(race));

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Unit Library</p>
        <h1 className="page-title">Core units define timing, control, and counters.</h1>
        <p className="page-intro">
          Choose a faction to browse its full unit roster. Neutral covers mercenary camp hireables
          and other shared pickups available on specific maps.
        </p>
      </div>
      <div className="card-grid">
        {categories.map((category) => (
          <article key={category.slug} className="card">
            <p className="pill">{category.badge}</p>
            <h2>{category.name}</h2>
            <p>{categoryDescriptions[category.slug] ?? category.description}</p>
            <div className="card__footer">
              <div className="list-meta">
                <span>{category.identity}</span>
              </div>
              <div className="card__footer-action card__footer-action--center">
                <Link href={`/units/${category.slug}`} className="button button--ghost">
                  View {category.name} Units
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
