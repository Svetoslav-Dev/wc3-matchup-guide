import { notFound } from "next/navigation";
import Link from "next/link";
import { getRaceBySlug, listBuilds } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { DifficultyBadge } from "../../../components/difficulty-badge";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function RaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [race, buildResult] = await Promise.all([
    getRaceBySlug(slug),
    slug === "neutral" ? Promise.resolve(null) : listBuilds({ race: slug, page: 1, pageSize: 4 }),
  ]);

  if (!race) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{race.badge}</p>
        <div className="title-row">
          {race.imageUrl ? (
            <GameImage
              src={race.imageUrl}
              alt={race.name}
              className="game-image--icon"
              width={64}
              height={64}
            />
          ) : null}
          <h1 className="page-title">{race.name}</h1>
        </div>
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
      {race.slug !== "neutral" && buildResult ? (
        <section className="section">
          <div className="section-head">
            <p className="section-label">Effective Builds</p>
            <h2>Most effective {race.name} builds in general.</h2>
          </div>
          {buildResult.data.length > 0 ? (
            <div className="list-grid">
              {buildResult.data.map((build) => (
                <article key={build.slug} className="card">
                  <div className="list-meta">
                    <p className="pill"><DifficultyBadge value={build.difficulty} /></p>
                    <p className="pill pill--race">{build.strategyType}</p>
                  </div>
                  <h3>{build.title}</h3>
                  <p>{build.summary}</p>
                  <div className="card__footer">
                    <div className="list-meta">
                      {build.bestAgainst ? <span>Best against: {build.bestAgainst}</span> : null}
                    </div>
                    <Link href={`/builds/${build.slug}`} className="button button--ghost">
                      Read Me
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className="detail-panel">
              <h2>No builds yet</h2>
              <p>No published builds are available for {race.name} yet.</p>
            </article>
          )}
        </section>
      ) : null}
    </div>
  );
}
