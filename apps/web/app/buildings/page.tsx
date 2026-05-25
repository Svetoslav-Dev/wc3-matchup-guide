import Link from "next/link";
import { GameImage } from "../../components/game-image";
import { buildings } from "../../lib/static-content";

const raceFilters = [
  { slug: "all",       label: "All" },
  { slug: "human",     label: "Human" },
  { slug: "orc",       label: "Orc" },
  { slug: "undead",    label: "Undead" },
  { slug: "night-elf", label: "Night Elf" },
  { slug: "neutral",   label: "Neutral" },
];

const toSlug = (b: { race: string; imageFile: string }) =>
  `${b.race}-${b.imageFile.toLowerCase()}`;

type Props = {
  searchParams?: Promise<{ race?: string }>;
};

export default async function BuildingsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const activeRace = params.race ?? "all";
  const visible = activeRace === "all" ? buildings : buildings.filter((b) => b.race === activeRace);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Building Reference</p>
        <h1 className="page-title">Every structure, its role, and its unlock</h1>
        <p className="page-intro">
          Browse the complete building roster for each race — from base tiers and production
          structures to defense towers and item shops.
        </p>
      </div>

      <div className="builds-toolbar">
        <p className="filter-panel__label" style={{ gridColumn: 1, gridRow: 1, margin: 0 }}>Buildings</p>
        <div className="builds-page-size">
          {raceFilters.map((f) => (
            <Link
              key={f.slug}
              href={f.slug === "all" ? "/buildings" : `/buildings?race=${f.slug}`}
              className={`button button--ghost${activeRace === f.slug ? " button--active" : ""}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <p className="muted">Showing {visible.length} of {buildings.length} buildings.</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {visible.map((building) => (
          <Link key={toSlug(building)} href={`/buildings/${toSlug(building)}`} className="card" style={{ textDecoration: "none" }}>
            <div className="flex items-center gap-3">
              <GameImage
                src={`/images/Buildings/${building.imageFile}.png`}
                alt={building.name}
                width={48}
                height={48}
                className="rounded-[8px] object-cover shrink-0"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-bold text-text text-[0.95rem] leading-snug m-0">{building.name}</p>
                <p className="pill w-fit" style={{ fontSize: "0.65rem", padding: "0.1rem 0.55rem" }}>
                  {building.race === "night-elf" ? "Night Elf" : building.race.charAt(0).toUpperCase() + building.race.slice(1)}
                </p>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed m-0 line-clamp-2">{building.description}</p>
            {building.gold > 0 || building.lumber > 0 ? (
              <div className="flex items-center gap-2 mt-auto">
                <span className="cost-chip" aria-label={`${building.gold} gold`}>
                  <span className="cost-chip__icon" aria-hidden="true">🪙</span>
                  <span>{building.gold}</span>
                </span>
                <span className="cost-chip" aria-label={`${building.lumber} lumber`}>
                  <span className="cost-chip__icon" aria-hidden="true">🪵</span>
                  <span>{building.lumber}</span>
                </span>
              </div>
            ) : (
              <p className="text-muted mt-auto" style={{ fontSize: "0.75rem", opacity: 0.5 }}>Map object — no build cost</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
