import { notFound } from "next/navigation";
import Link from "next/link";
import { getUnitBySlug, listHeroes, listUnits } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";

const unitCategories = {
  human: "Human",
  orc: "Orc",
  undead: "Undead",
  "night-elf": "Night Elf",
  neutral: "Neutral",
} as const;

const tierRank: Record<string, number> = {
  "Tier 1": 1,
  "Tier 2": 2,
  "Tier 3": 3,
  Neutral: 4,
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function UnitDetailPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = unitCategories[slug as keyof typeof unitCategories];

  if (categoryName) {
    const units = await listUnits(1, 200);
    const categoryUnits = units.data
      .filter((unit) => unit.raceName === categoryName)
      .sort(
        (left, right) =>
          (tierRank[left.tier] ?? 99) - (tierRank[right.tier] ?? 99) ||
          left.gold - right.gold ||
          left.lumber - right.lumber ||
          left.food - right.food ||
          left.name.localeCompare(right.name),
      );
    const heroes = categoryName === "Neutral" ? [] : (await listHeroes(1, 50)).data.filter((hero) => hero.raceName === categoryName);

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
                <div className="title-row">
                  <GameImage
                    src={unit.imageUrl ?? `/images/units/${unit.slug}.jpg`}
                    alt={unit.name}
                    className="game-image--icon"
                    width={64}
                    height={64}
                  />
                  <div className="title-stack">
                    <h2>{unit.name}</h2>
                    <div className="list-meta">
                      <span>{unit.tier}</span>
                      <span>{unit.unitType}</span>
                    </div>
                  </div>
                </div>
                <p>{unit.description}</p>
                <div className="card__footer">
                  <div className="list-meta">
                  <span className="cost-chip" aria-label={`${unit.food} food`}>
                    <span className="cost-chip__icon" aria-hidden="true">🍖</span>
                    <span>{unit.food}</span>
                  </span>
                  <span className="cost-chip" aria-label={`${unit.gold} gold`}>
                    <span className="cost-chip__icon" aria-hidden="true">🪙</span>
                    <span>{unit.gold}</span>
                  </span>
                  <span className="cost-chip" aria-label={`${unit.lumber} lumber`}>
                    <span className="cost-chip__icon" aria-hidden="true">🪵</span>
                    <span>{unit.lumber}</span>
                  </span>
                  </div>
                  <div className="card__footer-action card__footer-action--center">
                    <Link href={`/units/${unit.slug}`} className="button button--ghost">
                      View Unit Guide
                    </Link>
                  </div>
                </div>
            </article>
          ))}
        </div>
        {heroes.length > 0 ? (
          <section className="page-stack">
            <div className="section-head">
              <p className="section-label">{categoryName} Heroes</p>
              <h2>{categoryName} Hero Roster</h2>
            </div>
            <div className="card-grid">
              {heroes.map((hero) => (
                <article key={hero.slug} className="card">
                  <p className="pill">{hero.primaryAttribute}</p>
                  <div className="title-row">
                    <h3>{hero.name}</h3>
                    <div className="list-meta">
                      <span>{hero.role}</span>
                    </div>
                  </div>
                  <p>{hero.description}</p>
                  <div className="card__footer">
                    <div className="card__footer-action card__footer-action--center">
                      <Link href={`/heroes/${hero.slug}`} className="button button--ghost">
                        View Hero Guide
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  const unit = await getUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="unit-hero">
        <div className="image-panel image-panel--unit">
          <GameImage
            src={unit.imageUrl ?? `/images/units/${unit.slug}.jpg`}
            alt={unit.name}
            width={160}
            height={160}
          />
        </div>
        <div className="unit-hero__text">
          <p className="section-label">{unit.raceName}</p>
          <h1 className="page-title">{unit.name}</h1>
          <p className="page-intro">{unit.description}</p>
        </div>
      </div>
      <div className="unit-detail-grid">
        <article className="detail-panel unit-stats-card">
          <p className="section-label">Stats</p>
          <div className="unit-stats-card__badges">
            <span className="pill">{unit.unitType}</span>
            <span className="pill">{unit.tier}</span>
          </div>
          <div className="unit-stats-card__costs">
            <div className="unit-stat-row">
              <span className="unit-stat-row__label flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-60">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
                Food
              </span>
              <span className="unit-stat-row__value">{unit.food}</span>
            </div>
            <div className="unit-stat-row">
              <span className="unit-stat-row__label flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-60" style={{ color: "#c9a35b" }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Gold
              </span>
              <span className="unit-stat-row__value">{unit.gold}</span>
            </div>
            <div className="unit-stat-row">
              <span className="unit-stat-row__label flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-60" style={{ color: "#7fa66b" }}>
                  <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                </svg>
                Lumber
              </span>
              <span className="unit-stat-row__value">{unit.lumber}</span>
            </div>
          </div>
        </article>
        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#4ade80" }} className="opacity-80 shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Strengths
          </h2>
          <ul className="list-none pl-0 flex flex-col gap-1.5">
            {unit.strengths.map((strength) => (
              <li key={strength} className="flex items-center gap-2 text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#4ade80" }} className="opacity-70 shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {strength}
              </li>
            ))}
          </ul>
        </article>
        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#f87171" }} className="opacity-80 shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Weaknesses
          </h2>
          <ul className="list-none pl-0 flex flex-col gap-1.5">
            {unit.weaknesses.map((weakness) => (
              <li key={weakness} className="flex items-center gap-2 text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#f87171" }} className="opacity-70 shrink-0">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                {weakness}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
