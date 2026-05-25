import { notFound } from "next/navigation";
import { getMapBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { getItemInfo } from "../../../lib/item-lookup";
import { items, units } from "../../../lib/static-content";

type Props = {
  params: Promise<{ slug: string }>;
};

const SHOP_ICON: Record<string, string> = {
  "Goblin Merchant": "/images/Buildings/GoblinLaboratory.png",
  Tavern: "/images/Buildings/Tavern.png",
  "Goblin Laboratory": "/images/Buildings/GoblinLaboratory.png",
  "Mercenary Camp": "/images/Buildings/MercenaryCamp.png",
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

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Map Guide</p>
        <h1 className="page-title">{map.name}</h1>
        <p className="page-intro">{map.description}</p>
      </div>
      <div className="image-panel image-panel--wide">
        <GameImage
          src={map.imageUrl ?? `/images/maps/${map.slug}.jpg`}
          alt={map.name}
          className="game-image game-image--contain"
        />
      </div>
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Creep Notes</h2>
          <p>{map.creepNotes}</p>
        </article>
        <article className="detail-panel">
          <h2>Expansion Notes</h2>
          <p>{map.expansionNotes}</p>
        </article>
        {map.shops.length > 0 ? (
          <article className="detail-panel">
            <h2>Shops On This Map</h2>
            <div className="flex flex-col gap-3">
              {map.shops.map((shop) => (
                <div key={shop} className="flex items-center gap-3 rounded-[12px] border border-line bg-white/[0.02] px-3 py-2.5">
                  {SHOP_ICON[shop] ? (
                    <GameImage
                      src={SHOP_ICON[shop]}
                      alt={shop}
                      width={28}
                      height={28}
                      className="rounded-[6px] shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="text-text text-[0.92rem] font-semibold">{shop}</span>
                </div>
              ))}
            </div>
          </article>
        ) : null}
        {nonTomeDrops.length > 0 ? (
          <article className="detail-panel">
            <h2>Creep Drops</h2>
            <ul className="map-item-list">
              {nonTomeDrops.map((item) => (
                <li key={item.name} className="map-item-list__item">
                  <GameImage
                    src={`/images/Items/${item.imageFile}.png`}
                    alt=""
                    width={20}
                    height={20}
                    className="filter-btn__icon"
                  />
                  <span>{item.name}</span>
                  <span className="map-item-source">{getItemInfo(item.name).source}</span>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
        {mercenaries.length > 0 ? (
          <article className="detail-panel">
            <h2>Mercenaries</h2>
            <div className="icon-grid">
              {mercenaries.map((mercenary) => (
                <div key={mercenary.slug} className="icon-card">
                  <GameImage
                    src={mercenary.imageUrl ?? `/images/Units/${mercenary.slug}.png`}
                    alt={mercenary.name}
                    width={52}
                    height={52}
                    className="game-image--icon"
                  />
                  <div className="icon-card__body">
                    <p className="icon-card__name">{mercenary.name}</p>
                    <p className="icon-card__type">{mercenary.unitType}</p>
                    <p className="icon-card__desc">{mercenary.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
