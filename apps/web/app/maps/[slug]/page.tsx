import { notFound } from "next/navigation";
import Link from "next/link";
import { getMapBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { getItemInfo } from "../../../lib/item-lookup";
import { items, units, buildings } from "../../../lib/static-content";

type Props = {
  params: Promise<{ slug: string }>;
};

function slugifyItemName(name: string) {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const RACE_ICON: Record<string, string> = {
  Human:       "/images/Races/Humans_Icon.png",
  Orc:         "/images/Races/Orcs_Icon.png",
  Undead:      "/images/Races/Undead_Icon.png",
  "Night Elf": "/images/Races/Night_Elves_Icon.png",
};

export default async function MapDetailPage({ params }: Props) {
  const { slug } = await params;
  const map = await getMapBySlug(slug);

  if (!map) {
    notFound();
  }

  const mappedItems = map.availableItems
    .map((itemName) => items.find((item) => item.name === itemName))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const nonTomeDrops = mappedItems.filter(
    (item) => item.category !== "tome" && getItemInfo(item.name).source !== "Shop",
  );

  const mercenaries = (map.mercenaries ?? [])
    .map((mercName) => units.find((unit) => unit.name === mercName))
    .filter((unit): unit is NonNullable<typeof unit> => Boolean(unit));

  const mappedShops = map.shops
    .map((shopName) => buildings.find((b) => b.name === shopName))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <div className="page-shell page-stack" style={{ paddingTop: "1.5rem" }}>

      <div className="flex justify-start">
        <Link href="/maps" className="button button--ghost button--sm">← Back to Maps</Link>
      </div>

      <div className="section-head">
        <p className="section-label">Map Guide</p>
        <h1 className="page-title">{map.name}</h1>
        <p className="page-intro">{map.description}</p>
      </div>
      {map.imageUrl ? (
        <div className="image-panel image-panel--wide">
          <GameImage
            src={map.imageUrl}
            alt={map.name}
            className="game-image game-image--contain"
          />
        </div>
      ) : null}
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Creep Notes</h2>
          <p>{map.creepNotes}</p>
        </article>
        <article className="detail-panel">
          <h2>Expansion Notes</h2>
          <p>{map.expansionNotes}</p>
        </article>
        {mappedShops.length > 0 ? (
          <article className="detail-panel" style={{ alignSelf: "stretch" }}>
            <h2>Shops On This Map</h2>
            <div className="icon-grid">
              {mappedShops.map((shop) => (
                <Link
                  key={shop.name}
                  href={`/buildings/${shop.race}-${shop.imageFile.toLowerCase()}`}
                  className="icon-card icon-card--xs"
                >
                  <GameImage
                    src={`/images/Buildings/${shop.imageFile}.png`}
                    alt={shop.name}
                    width={28}
                    height={28}
                    className="game-image--icon-xs"
                  />
                  <div className="icon-card__body">
                    <p className="icon-card__name">{shop.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ) : null}
        <article className="detail-panel" style={{ alignSelf: "stretch" }}>
          <h2>Race Advantage</h2>
          {map.raceAdvantage ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <GameImage
                  src={RACE_ICON[map.raceAdvantage.race] ?? "/images/Races/Neutral.png"}
                  alt={map.raceAdvantage.race}
                  width={40}
                  height={40}
                  className="rounded-[8px] shrink-0 object-cover"
                />
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
                  {map.raceAdvantage.race}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                {map.raceAdvantage.reason}
              </p>
            </>
          ) : (
            <p className="text-muted" style={{ fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
              This map is considered balanced across all races with no significant inherent advantage for any faction.
            </p>
          )}
        </article>
        {mercenaries.length > 0 ? (
          <article className="detail-panel" style={{ gridColumn: "1 / -1" }}>
            <h2>Mercenaries</h2>
            <div className="icon-grid">
              {mercenaries.map((mercenary) => (
                <Link key={mercenary.slug} href={`/units/${mercenary.slug}`} className="icon-card icon-card--sm">
                  <GameImage
                    src={mercenary.imageUrl ?? `/images/Units/${mercenary.slug}.png`}
                    alt={mercenary.name}
                    width={64}
                    height={64}
                    className="game-image--icon"
                  />
                  <div className="icon-card__body">
                    <p className="icon-card__name">{mercenary.name}</p>
                    <p className="icon-card__type">{mercenary.unitType.replace("Neutral", "Mercenary")}</p>
                    <p className="icon-card__desc">{mercenary.description}</p>
                    <div className="list-meta" style={{ marginTop: "0.25rem" }}>
                      <span className="cost-chip" aria-label={`${mercenary.food} food`}>
                        <span className="cost-chip__icon" aria-hidden="true">🍖</span>
                        <span>{mercenary.food}</span>
                      </span>
                      <span className="cost-chip" aria-label={`${mercenary.gold} gold`}>
                        <span className="cost-chip__icon" aria-hidden="true">🪙</span>
                        <span>{mercenary.gold}</span>
                      </span>
                      {mercenary.lumber > 0 && (
                        <span className="cost-chip" aria-label={`${mercenary.lumber} lumber`}>
                          <span className="cost-chip__icon" aria-hidden="true">🪵</span>
                          <span>{mercenary.lumber}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ) : null}
        {nonTomeDrops.length > 0 ? (
          <article className="detail-panel" style={{ gridColumn: "1 / -1" }}>
            <h2>Creep Drops</h2>
            <div className="map-drop-grid">
              {nonTomeDrops.map((item) => {
                const source = getItemInfo(item.name).source;
                const isShop = source === "Drop / Shop";
                return (
                  <Link key={item.name} href={`/items/${slugifyItemName(item.name)}`} className="map-drop-card">
                    <GameImage
                      src={`/images/Items/${item.imageFile}.png`}
                      alt=""
                      width={28}
                      height={28}
                      className="shrink-0 object-contain rounded-[4px]"
                    />
                    <span className="map-drop-card__name">{item.name}</span>
                    {isShop ? (
                      <span className="map-drop-badge map-drop-badge--shop">Shop</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
