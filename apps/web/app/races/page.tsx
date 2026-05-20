import Link from "next/link";
import { listRaces } from "../../lib/content";
import { GameImage } from "../../components/game-image";

export default async function RacesPage() {
  const result = await listRaces(1, 20);
  const playableRaces = result.data.filter((race) => race.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Race Archive</p>
        <h1 className="page-title">Choose your battlefield language.</h1>
        <p className="page-intro">
          Each race page captures identity, strategic posture, core heroes, and the macro habits that
          define strong Warcraft III fundamentals.
        </p>
      </div>
      <div className="card-grid">
        {playableRaces.map((race) => (
          <article key={race.slug} className="card">
            <p className="pill">{race.badge}</p>
            <div className="title-row">
              <GameImage
                src={race.imageUrl ?? `/images/races/${race.slug}.jpg`}
                alt={race.name}
                className="game-image--icon"
                width={64}
                height={64}
              />
              <h2>{race.name}</h2>
            </div>
            <p>{race.identity}</p>
            <div className="card__footer">
              <div className="list-meta">
                <span>Strengths: {race.strengths.join(", ")}</span>
              </div>
              <div className="card__footer-action">
                <Link href={`/races/${race.slug}`} className="button button--ghost">
                  Read Guide
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
