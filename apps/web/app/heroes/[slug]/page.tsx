import { notFound } from "next/navigation";
import { getHeroBySlug } from "../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeroDetailPage({ params }: Props) {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);

  if (!hero) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{hero.raceName}</p>
        <h1 className="page-title">{hero.name}</h1>
        <p className="page-intro">{hero.description}</p>
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Role</h2>
          <p>{hero.role}</p>
          <p>Primary attribute: {hero.primaryAttribute}</p>
        </article>
        <article className="detail-panel">
          <h2>Why Players Pick This Hero</h2>
          <ul>
            {hero.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
