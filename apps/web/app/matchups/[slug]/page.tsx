import { notFound } from "next/navigation";
import { getMatchupBySlug } from "../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MatchupDetailPage({ params }: Props) {
  const { slug } = await params;
  const matchup = await getMatchupBySlug(slug);

  if (!matchup) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Difficulty: {matchup.difficulty}</p>
        <h1 className="page-title">{matchup.title}</h1>
        <p className="page-intro">{matchup.summary}</p>
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Game Plan</h2>
          <p>
            <strong>Early:</strong> {matchup.earlyGamePlan}
          </p>
          <p>
            <strong>Mid:</strong> {matchup.midGamePlan}
          </p>
          <p>
            <strong>Late:</strong> {matchup.lateGamePlan}
          </p>
        </article>
        <article className="detail-panel">
          <h2>Execution Notes</h2>
          <ul>
            {matchup.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
          <p>Hero choices: {matchup.heroChoices.join(", ")}</p>
        </article>
      </div>
    </div>
  );
}
