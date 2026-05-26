"use client";

import { useState } from "react";
import Link from "next/link";
import type { Unit } from "@warcraft3-guide-hub/shared";
import { GameImage } from "./game-image";

const FILTERS = [
  { label: "All",       value: "all"      },
  { label: "Human",     value: "Human"    },
  { label: "Orc",       value: "Orc"      },
  { label: "Undead",    value: "Undead"   },
  { label: "Night Elf", value: "Night Elf"},
  { label: "Mercenary", value: "Neutral"  },
] as const;

const tierRank: Record<string, number> = {
  "Tier 1": 1, "Tier 2": 2, "Tier 3": 3, Neutral: 4,
};

type Props = { units: Unit[] };

const displayUnitType = (unit: Unit, activeFilter: string) => {
  if (activeFilter !== "Neutral" || unit.raceName !== "Neutral") {
    return unit.unitType;
  }

  if (unit.unitType === "Neutral") {
    return "Mercenary";
  }

  return unit.unitType.replace(/^Neutral\b/, "Mercenary");
};

const displayTier = (unit: Unit, activeFilter: string) => {
  if (activeFilter === "Neutral" && unit.raceName === "Neutral" && unit.tier === "Neutral") {
    return null;
  }

  return unit.tier;
};

export function UnitsFilterClient({ units }: Props) {
  const [active, setActive] = useState<string>("all");

  const sorted = [...units].sort(
    (a, b) =>
      (tierRank[a.tier] ?? 99) - (tierRank[b.tier] ?? 99) ||
      a.gold - b.gold || a.lumber - b.lumber || a.food - b.food ||
      a.name.localeCompare(b.name),
  );

  const visible = active === "all" ? sorted : sorted.filter((u) => u.raceName === active);

  return (
    <>
      <div className="builds-toolbar">
        <p className="filter-panel__label" style={{ gridColumn: 1, gridRow: 1, margin: 0 }}>Units</p>
        <p className="muted" style={{ gridColumn: 2, gridRow: "1 / 3", alignSelf: "center", margin: 0 }}>Showing {visible.length} of {units.length} units.</p>
        <div className="builds-page-size">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              className={`button button--ghost${active === value ? " button--active" : ""}`}
              onClick={() => setActive(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        {visible.map((unit) => (
          <Link key={unit.slug} href={`/units/${unit.slug}`} className="card" style={{ textDecoration: "none" }}>
            <p className="pill">{unit.raceName === "Neutral" ? "Mercenary" : unit.raceName}</p>
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
                  {displayTier(unit, active) ? <span>{displayTier(unit, active)}</span> : null}
                  <span>{displayUnitType(unit, active)}</span>
                </div>
              </div>
            </div>
            <p>{unit.description}</p>
            <div className="list-meta justify-center mt-auto">
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
          </Link>
        ))}
      </div>
    </>
  );
}
