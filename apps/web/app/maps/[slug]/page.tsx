import { notFound } from "next/navigation";
import { getMapBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { getItemInfo } from "../../../lib/item-lookup";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MapDetailPage({ params }: Props) {
  const { slug } = await params;
  const map = await getMapBySlug(slug);

  if (!map) {
    notFound();
  }

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
            <div className="shop-chip-row">
              {map.shops.map((shop) => (
                <span key={shop} className="pill">
                  {shop}
                </span>
              ))}
            </div>
          </article>
        ) : null}
        {map.availableItems.length > 0 ? (
          <article className="detail-panel">
            <h2>Available Items</h2>
            <ul className="map-item-list">
              {map.availableItems.map((item) => (
                <li key={item} className="map-item-list__item">
                  {getItemInfo(item).imageFile ? (
                    <GameImage
                      src={`/images/Items/${getItemInfo(item).imageFile}.png`}
                      alt=""
                      width={20}
                      height={20}
                      className="filter-btn__icon"
                    />
                  ) : (
                    <span className="gold-coin" aria-hidden="true" />
                  )}
                  <span>{item}</span>
                  <span className="map-item-source">{getItemInfo(item).source}</span>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
      </div>
    </div>
  );
}
