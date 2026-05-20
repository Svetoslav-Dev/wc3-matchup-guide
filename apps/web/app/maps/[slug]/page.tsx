import { notFound } from "next/navigation";
import { getMapBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";

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
        {map.availableItems.length > 0 ? (
          <article className="detail-panel">
            <h2>Available Items</h2>
            <ul>
              {map.availableItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ) : null}
      </div>
    </div>
  );
}
