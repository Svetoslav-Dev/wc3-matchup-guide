import Link from "next/link";
import { listRaces } from "../../lib/content";
import { GameImage } from "../../components/game-image";

export const revalidate = 3600;

export default async function RacesPage() {
  const result = await listRaces(1, 20);
  const playableRaces = result.data.filter((race) => race.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Race Archive</p>
        <h1 className="page-title">Choose your battlefield language</h1>
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
            <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
              {race.strengths.map((s) => (
                <li key={s} className="flex items-center gap-1.5 text-muted" style={{ fontSize: "0.85rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-70 shrink-0" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
            <div className="card__footer">
              <div className="card__footer-action card__footer-action--center">
                <Link href={`/races/${race.slug}`} className="button button--ghost button--sm">
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
