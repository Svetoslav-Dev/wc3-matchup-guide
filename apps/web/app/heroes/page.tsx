import Link from "next/link";
import { listHeroes } from "../../lib/content";

export default async function HeroesPage() {
  const result = await listHeroes(1, 20);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Hero Library</p>
        <h1 className="page-title">Power spikes begin with the first tavern choice.</h1>
        <p className="page-intro">
          Hero notes emphasize battlefield role, skill identity, and the kind of plan each hero
          naturally supports.
        </p>
      </div>
      <div className="card-grid">
        {result.data.map((hero) => (
          <article key={hero.slug} className="card">
            <p className="pill">{hero.raceName}</p>
            <h2>{hero.name}</h2>
            <p>{hero.description}</p>
            <div className="list-meta">
              <span>{hero.primaryAttribute}</span>
              <span>{hero.role}</span>
            </div>
            <Link href={`/heroes/${hero.slug}`} className="button button--ghost">
              View Hero Guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
