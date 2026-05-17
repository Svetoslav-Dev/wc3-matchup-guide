import Link from "next/link";
import { listMatchups } from "../../lib/content";

export default async function MatchupsPage() {
  const result = await listMatchups(1, 20);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Matchup Study</p>
        <h1 className="page-title">Every mirror of strength has a crack.</h1>
        <p className="page-intro">
          These matchup briefs highlight initiative, timing windows, and the mistakes that most often
          lose otherwise playable games.
        </p>
      </div>
      <div className="list-grid">
        {result.data.map((matchup) => (
          <article key={matchup.slug} className="card">
            <p className="pill">{matchup.difficulty}</p>
            <h2>{matchup.title}</h2>
            <p>{matchup.summary}</p>
            <div className="list-meta">
              <span>Hero focus: {matchup.heroChoices.join(", ")}</span>
            </div>
            <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
              View Matchup Plan
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
