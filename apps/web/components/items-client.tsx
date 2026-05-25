"use client";

import Link from "next/link";
import { GameImage } from "./game-image";
import type { Item } from "@warcraft3-guide-hub/shared";

function slugify(name: string): string {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type FilterDef = { slug: string; label: string };

const filters: FilterDef[] = [
  { slug: "all",             label: "All" },
  { slug: "creep-drop",      label: "Creep Drops" },
  { slug: "tome",            label: "Tomes" },
  { slug: "goblin-merchant", label: "Goblin Merchant" },
  { slug: "human",           label: "Arcane Vault" },
  { slug: "orc",             label: "Voodoo Lounge" },
  { slug: "undead",          label: "Tomb of Relics" },
  { slug: "night-elf",       label: "Ancient of Wonders" },
];

function getVisible(items: Item[], filter: string) {
  if (filter === "all")        return items;
  if (filter === "tome")       return items.filter((i) => i.category === "tome");
  if (filter === "creep-drop") return items.filter((i) => i.shops.includes("creep-drop"));
  return items.filter((i) => i.shops.includes(filter));
}

type Props = { items: Item[]; initialTab: string };

export function ItemsClient({ items, initialTab }: Props) {
  const activeTab = initialTab;
  const visible = getVisible(items, activeTab);
  return (
    <>
      <div className="builds-toolbar">
        <p className="filter-panel__label" style={{ gridColumn: 1, gridRow: 1, margin: 0 }}>Source</p>
        <p className="muted" style={{ gridColumn: 2, gridRow: "1 / 3", alignSelf: "center", margin: 0 }}>Showing {visible.length} of {items.length} items.</p>
        <div className="builds-page-size">
          {filters.map((f) => (
            <Link
              key={f.slug}
              href={f.slug === "all" ? "/items" : `/items?tab=${f.slug}`}
              className={`button button--ghost${activeTab === f.slug ? " button--active" : ""}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>


      <div className="icon-grid">
        {visible.map((item) => (
          <Link key={item.name} href={`/items/${slugify(item.name)}`} className="icon-card" style={{ textDecoration: "none" }}>
            <GameImage
              src={`/images/Items/${item.imageFile}.png`}
              alt={item.name}
              width={64}
              height={64}
              className="game-image--icon"
            />
            <div className="icon-card__body">
              <p className="icon-card__name">{item.name}</p>
              <p className="icon-card__type">
                {item.category === "tome" ? "Tome" : item.category === "permanent" ? "Permanent" : "Consumable"}
              </p>
              <p className="icon-card__desc">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
