import { notFound } from "next/navigation";
import Link from "next/link";
import { getHeroBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { getItemInfo } from "../../../lib/item-lookup";
import type { HeroSpell } from "@warcraft3-guide-hub/shared";

const ATTR_COLOR: Record<string, string> = {
  Strength:     "#f87171",
  Agility:      "#4ade80",
  Intelligence: "#818cf8",
};

const ATTR_ICON: Record<string, string> = {
  Strength:     "⚔️",
  Agility:      "🏹",
  Intelligence: "🔮",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeroDetailPage({ params }: Props) {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);

  if (!hero) {
    notFound();
  }

  const attrColor = ATTR_COLOR[hero.primaryAttribute] ?? "var(--muted)";
  const attrIcon  = ATTR_ICON[hero.primaryAttribute]  ?? "◆";

  return (
    <div className="page-shell page-stack" style={{ paddingTop: "1.5rem" }}>
      <div className="flex justify-start">
        <Link href="/heroes" className="button button--ghost button--sm">← Heroes</Link>
      </div>

      {/* Hero header: portrait | name+desc | why pick */}
      <div className="flex items-stretch gap-6 flex-wrap">
        <div className="panel flex items-center justify-center shrink-0" style={{ width: 148, padding: "1.25rem" }}>
          <GameImage
            src={hero.imageUrl ?? `/images/heroes/${hero.slug}.jpg`}
            alt={hero.name}
            width={100}
            height={100}
            className="object-contain rounded-[8px]"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
          <span className="section-label m-0">{hero.raceName}</span>
          <h1 className="page-title m-0">{hero.name}</h1>
          <p className="page-intro m-0">{hero.description}</p>
        </div>
        <article className="detail-panel shrink-0" style={{ minWidth: 220, maxWidth: 320 }}>
          <h2 className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-80 shrink-0" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Why Pick This Hero
          </h2>
          <ul className="list-none pl-0 flex flex-col gap-1.5 mt-2">
            {hero.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-muted">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-70 shrink-0" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* detail-grid: Hero Stats (full-width), then Spells (left) | Best Items (right) */}
      <div className="detail-grid" style={{ alignItems: "stretch" }}>
        <article className="detail-panel" style={{ gridColumn: "1 / -1" }}>
          <h2>Hero Stats</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[160px] rounded-[12px] border border-line px-4 py-3" style={{ background: "rgba(201,163,91,0.06)", borderColor: "rgba(201,163,91,0.2)" }}>
              <span className="text-muted uppercase tracking-widest" style={{ fontSize: "0.65rem", fontWeight: 700 }}>Role</span>
              <span className="text-text font-bold" style={{ fontSize: "1rem" }}>{hero.role}</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-[160px] rounded-[12px] border px-4 py-3" style={{ background: `${attrColor}0f`, borderColor: `${attrColor}33`, color: attrColor }}>
              <span className="uppercase tracking-widest opacity-70" style={{ fontSize: "0.65rem", fontWeight: 700, color: attrColor }}>Primary Attribute</span>
              <span className="font-bold" style={{ fontSize: "1rem" }}>{attrIcon} {hero.primaryAttribute}</span>
            </div>
          </div>
        </article>
        {hero.spells.length > 0 ? (
          <article className="detail-panel">
            <h2 className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-80 shrink-0" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Spells
            </h2>
            <div className="spell-list" style={{ marginTop: "0.75rem" }}>
              {hero.spells.map((spell: HeroSpell) => (
                <div key={spell.name} className="spell-entry">
                  <div className="spell-entry__name">
                    {spell.name}
                    {spell.isUltimate ? <span className="pill pill--ultimate">Ultimate</span> : null}
                  </div>
                  <p className="spell-entry__desc">{spell.description}</p>
                </div>
              ))}
            </div>
          </article>
        ) : null}
        {hero.bestItems.length > 0 ? (
          <article className="detail-panel">
            <h2 className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-80 shrink-0" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Best Items
            </h2>
            <div className="item-list" style={{ marginTop: "0.75rem" }}>
              {hero.bestItems.map((item) => {
                const info = getItemInfo(item);
                return (
                  <div key={item} className="item-entry">
                    <GameImage
                      src={info.imageFile ? `/images/Items/${info.imageFile}.png` : "/placeholder.svg"}
                      alt={item}
                      width={32}
                      height={32}
                      className="game-image--item"
                    />
                    <span className="item-entry__name">{item}</span>
                    <span className={`item-entry__source item-entry__source--${info.source === "Shop" ? "shop" : info.source === "Drop" ? "drop" : "both"}`}>
                      {info.source}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
