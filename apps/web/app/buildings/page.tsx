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
        <h1 className="page-title">Every structure, its role, and its unlock.</h1>
        <p className="page-intro">
          Browse the complete building roster for each race — from base tiers and production
          structures to defense towers and item shops.
        </p>
      </div>

      <div className="filter-panel">
        <div className="filter-panel__group">
          <span className="filter-panel__label">Race</span>
          <div className="filter-chip-row">
            {raceFilters.map((f) => (
              <Link
                key={f.slug}
                href={f.slug === "all" ? "/buildings" : `/buildings?race=${f.slug}`}
                className={`filter-chip${activeRace === f.slug ? " filter-chip--active" : ""}`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="icon-grid">
        {visible.map((building) => (
          <div key={building.imageFile} className="icon-card">
            <GameImage
              src={`/images/Buildings/${building.imageFile}.png`}
              alt={building.name}
              width={64}
              height={64}
              className="game-image--icon"
            />
            <div className="icon-card__body">
              <p className="icon-card__name">{building.name}</p>
              <p className="icon-card__desc">{building.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
