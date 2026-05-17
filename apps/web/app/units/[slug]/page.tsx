import { notFound } from "next/navigation";
import { getUnitBySlug } from "../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function UnitDetailPage({ params }: Props) {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{unit.raceName}</p>
        <h1 className="page-title">{unit.name}</h1>
        <p className="page-intro">{unit.description}</p>
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Role</h2>
          <p>{unit.unitType}</p>
        </article>
        <article className="detail-panel">
          <h2>Strengths</h2>
          <ul>
            {unit.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </article>
        <article className="detail-panel">
          <h2>Weaknesses</h2>
          <ul>
            {unit.weaknesses.map((weakness) => (
              <li key={weakness}>{weakness}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
