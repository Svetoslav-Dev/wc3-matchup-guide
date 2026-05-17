import { notFound } from "next/navigation";
import { getRaceBySlug } from "../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function RaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);

  if (!race) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{race.badge}</p>
        <h1 className="page-title">{race.name}</h1>
        <p className="page-intro">{race.description}</p>
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Strategic Identity</h2>
          <p>{race.identity}</p>
          <ul>
            {race.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </article>
        <article className="detail-panel">
          <h2>Signature Heroes</h2>
          <ul>
            {race.signatureHeroes.map((hero) => (
              <li key={hero}>{hero}</li>
            ))}
          </ul>
          <p>Preferred ladder focus: {race.ladderFocus}</p>
        </article>
      </div>
    </div>
  );
}
