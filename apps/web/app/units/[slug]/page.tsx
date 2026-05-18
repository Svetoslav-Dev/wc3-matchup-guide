import { notFound } from "next/navigation";
import Link from "next/link";
import { getUnitBySlug, listUnits } from "../../../lib/content";

const unitCategories = {
  human: "Human",
  orc: "Orc",
  undead: "Undead",
  "night-elf": "Night Elf",
  neutral: "Neutral",
} as const;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function UnitDetailPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = unitCategories[slug as keyof typeof unitCategories];

  if (categoryName) {
    const units = await listUnits(1, 200);
    const categoryUnits = units.data.filter((unit) => unit.raceName === categoryName);

    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">{categoryName}</p>
          <h1 className="page-title">{categoryName} Units</h1>
          <p className="page-intro">
            Browse the full {categoryName === "Neutral" ? "mercenary and neutral" : categoryName.toLowerCase()} unit roster and open any unit guide for strengths, weaknesses, and role notes.
          </p>
        </div>
        <div className="card-grid">
          {categoryUnits.map((unit) => (
            <article key={unit.slug} className="card">
              <p className="pill">{unit.raceName}</p>
              <h2>{unit.name}</h2>
              <p>{unit.description}</p>
              <div className="list-meta">
                <span>{unit.unitType}</span>
              </div>
              <Link href={`/units/${unit.slug}`} className="button button--ghost">
                View Unit Guide
              </Link>
            </article>
          ))}
        </div>
      </div>
    );
  }

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
