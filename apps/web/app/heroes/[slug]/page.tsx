import { notFound } from "next/navigation";
import { getHeroBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { getItemInfo } from "../../../lib/item-lookup";
import type { HeroSpell } from "@warcraft3-guide-hub/shared";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeroDetailPage({ params }: Props) {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);

  if (!hero) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{hero.raceName}</p>
        <div className="title-row">
          <GameImage
            src={hero.imageUrl ?? `/images/heroes/${hero.slug}.jpg`}
            alt={hero.name}
            className="game-image--icon"
            width={64}
            height={64}
          />
          <h1 className="page-title">{hero.name}</h1>
        </div>
        <p className="page-intro">{hero.description}</p>
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Role</h2>
          <p>{hero.role}</p>
          <p>Primary attribute: {hero.primaryAttribute}</p>
        </article>
        <article className="detail-panel">
          <h2>Why Players Pick This Hero</h2>
          <ul>
            {hero.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
        {hero.bestItems.length > 0 ? (
          <article className="detail-panel">
            <h2>Best Items</h2>
            <div className="item-list">
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
        {hero.spells.length > 0 ? (
          <article className="detail-panel">
            <h2>Spells</h2>
            <div className="spell-list">
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
      </div>
    </div>
  );
}
