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
        <p className="muted">Showing {visible.length} of {units.length} units.</p>
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

      <div className="card-grid">
        {visible.map((unit) => (
          <article key={unit.slug} className="card">
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
                <Link href={`/units/${unit.slug}`} className="button button--ghost button--sm">
                  View Unit Guide
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
