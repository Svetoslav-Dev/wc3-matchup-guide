"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { GameImage } from "./game-image";
import type { Item } from "@warcraft3-guide-hub/shared";

function slugify(name: string): string {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type BannerInfo = { label: string; sublabel: string; icon: string };

const SHOP_BANNERS: Partial<Record<string, BannerInfo>> = {
  "human":           { label: "Faction Shop", sublabel: "Arcane Vault",       icon: "/images/Buildings/ArcaneVault.png" },
  "orc":             { label: "Faction Shop", sublabel: "Voodoo Lounge",      icon: "/images/Buildings/VoodooLounge.png" },
  "undead":          { label: "Faction Shop", sublabel: "Tomb of Relics",     icon: "/images/Buildings/TombOfRelics.png" },
  "night-elf":       { label: "Faction Shop", sublabel: "Ancient of Wonders", icon: "/images/Buildings/AncientOfWonders.png" },
  "goblin-merchant": { label: "Neutral Shop", sublabel: "Goblin Merchant",    icon: "/images/Buildings/GoblinLaboratory.png" },
};

const SHOP_BUILDING_ICONS: Record<string, string> = {
  "human":           "/images/Buildings/ArcaneVault.png",
  "orc":             "/images/Buildings/VoodooLounge.png",
  "undead":          "/images/Buildings/TombOfRelics.png",
  "night-elf":       "/images/Buildings/AncientOfWonders.png",
  "goblin-merchant": "/images/Buildings/GoblinLaboratory.png",
  "tome":            "/images/Items/TomeOfStrength.png",
};

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
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const url = tab === "all" ? pathname : `${pathname}?tab=${tab}`;
    router.replace(url, { scroll: false });
  }, [router, pathname]);

  const visible = getVisible(items, activeTab);
  const banner = SHOP_BANNERS[activeTab] ?? null;

  return (
    <>
      <div className="builds-toolbar">
        <p className="filter-panel__label" style={{ gridColumn: 1, gridRow: 1, margin: 0 }}>Source</p>
        <p className="muted" style={{ gridColumn: 2, gridRow: "1 / 3", alignSelf: "center", margin: 0 }}>Showing {visible.length} of {items.length} items.</p>
        <div className="builds-page-size">
          {filters.map((f) => {
            const icon = SHOP_BUILDING_ICONS[f.slug];
            return (
              <button
                key={f.slug}
                type="button"
                className={`button button--ghost${activeTab === f.slug ? " button--active" : ""}`}
                onClick={() => handleTabChange(f.slug)}
              >
                {f.label}
              </button>
            );
          })}
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
