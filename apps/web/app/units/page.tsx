import Link from "next/link";
import { listUnits } from "../../lib/content";

export default async function UnitsPage() {
  const result = await listUnits(1, 20);

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
      <div className="card-grid">
        {result.data.map((unit) => (
          <article key={unit.slug} className="card">
            <p className="pill">{unit.raceName}</p>
            <h2>{unit.name}</h2>
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
    </div>
  );
}
