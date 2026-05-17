import Link from "next/link";
import { listMaps } from "../../lib/content";

export default async function MapsPage() {
  const result = await listMaps(1, 20);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Map Library</p>
        <h1 className="page-title">Map shape changes every timing window.</h1>
        <p className="page-intro">
          Map notes summarize creeping patterns, expansion risk, and the movement rules that shape
          strong game plans.
        </p>
      </div>
      <div className="card-grid">
        {result.data.map((map) => (
          <article key={map.slug} className="card">
            <p className="pill">Ladder Map</p>
            <h2>{map.name}</h2>
            <p>{map.description}</p>
            <Link href={`/maps/${map.slug}`} className="button button--ghost">
              View Map Guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
