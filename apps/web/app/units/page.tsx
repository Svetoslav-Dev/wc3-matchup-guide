import Link from "next/link";
import { listUnits } from "../../lib/content";

export default async function UnitsPage() {
  const result = await listUnits(1, 200);
  const categoryOrder = ["Human", "Orc", "Undead", "Night Elf", "Neutral"];
  const groupedUnits = categoryOrder
    .map((category) => ({
      category,
      units: result.data.filter((unit) => unit.raceName === category),
    }))
    .filter((group) => group.units.length > 0);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Unit Library</p>
        <h1 className="page-title">Core units define timing, control, and counters.</h1>
        <p className="page-intro">
          Unit notes focus on battlefield role, strengths, and the liabilities players need to
          account for when choosing a composition.
        </p>
      </div>
      {groupedUnits.map((group) => (
        <section key={group.category} className="page-stack">
          <div className="section-head">
            <p className="section-label">{group.category}</p>
            <h2>{group.category} Units</h2>
          </div>
          <div className="card-grid">
            {group.units.map((unit) => (
              <article key={unit.slug} className="card">
                <p className="pill">{unit.raceName}</p>
                <h3>{unit.name}</h3>
                <p>{unit.description}</p>
                <div className="list-meta">
                  <span>{unit.unitType}</span>
                </div>
                <Link href={`/units/${unit.slug}`} className="button button--ghost">
                  View Unit Guide
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
