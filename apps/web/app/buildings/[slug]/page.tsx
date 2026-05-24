import { notFound } from "next/navigation";
import Link from "next/link";
import { buildings } from "../../../lib/static-content";
import { GameImage } from "../../../components/game-image";

const toSlug = (b: { race: string; imageFile: string }) =>
  `${b.race}-${b.imageFile.toLowerCase()}`;

const RACE_LABEL: Record<string, string> = {
  human: "Human", orc: "Orc", undead: "Undead", "night-elf": "Night Elf", neutral: "Neutral",
};

type Props = { params: Promise<{ slug: string }> };

export default async function BuildingDetailPage({ params }: Props) {
  const { slug } = await params;
  const building = buildings.find((b) => toSlug(b) === slug);

  if (!building) notFound();

  const isMapObject = building.gold === 0 && building.lumber === 0;
  const raceLabel = RACE_LABEL[building.race] ?? building.race;

  return (
    <div className="page-shell page-stack">

      {/* Top nav row */}
      <div className="flex justify-end pt-4">
        <Link href="/buildings" className="button button--ghost button--sm">
          ← Back to Buildings
        </Link>
      </div>

      {/* Hero */}
      <div className="flex items-stretch gap-6 flex-wrap">
        <div className="panel flex items-center justify-center shrink-0" style={{ width: 148, padding: "1.25rem" }}>
          <GameImage
            src={`/images/Buildings/${building.imageFile}.png`}
            alt={building.name}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
          <p className="section-label m-0">{raceLabel}</p>
          <h1 className="page-title m-0">{building.name}</h1>
          <p className="page-intro m-0">{building.description}</p>
        </div>
        <article className="detail-panel unit-stats-card shrink-0" style={{ minWidth: 180 }}>
          <p className="section-label">
            {isMapObject ? "Map Object" : "Build Cost"}
          </p>
          {isMapObject ? (
            <p className="text-muted" style={{ fontSize: "0.88rem" }}>
              Map object — cannot be constructed by players.
            </p>
          ) : (
            <div className="unit-stats-card__costs">
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-70" style={{ color: "#c9a35b" }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Gold
                </span>
                <span className="unit-stat-row__value">{building.gold}</span>
              </div>
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-70" style={{ color: "#7fa66b" }}>
                    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                  Lumber
                </span>
                <span className="unit-stat-row__value">{building.lumber}</span>
              </div>
            </div>
          )}
        </article>
      </div>

      {/* Detail panels */}
      <div className="detail-grid">
        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#c9a35b" }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Role &amp; Function
          </h2>
          <p>{building.description}</p>
        </article>

        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#60a5fa" }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Ladder Tip
          </h2>
          <p>{building.tip}</p>
        </article>
      </div>

    </div>
  );
}
