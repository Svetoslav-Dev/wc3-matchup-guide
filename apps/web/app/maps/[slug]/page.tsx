import Link from "next/link";
import { notFound } from "next/navigation";
import { getMapBySlug, listMaps } from "../../../lib/content";
import { mapCategories, mapCategoryNameBySlug, mapSlugsByCategory } from "../categories";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MapDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = mapCategories.find((entry) => entry.slug === slug);

  if (category) {
    const maps = (await listMaps(1, 100)).data.filter((map) =>
      (mapSlugsByCategory[category.slug] ?? []).includes(map.slug),
    );

    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Map Category</p>
          <h1 className="page-title">{category.name} Maps</h1>
          <p className="page-intro">{category.description}</p>
        </div>
        {maps.length > 0 ? (
          <div className="card-grid">
            {maps.map((map) => (
              <article key={map.slug} className="card">
                <p className="pill">{mapCategoryNameBySlug[category.slug]}</p>
                <h2>{map.name}</h2>
                <p>{map.description}</p>
                <div className="list-meta">
                  <span>{map.creepNotes}</span>
                </div>
                <Link href={`/maps/${map.slug}`} className="button button--ghost">
                  View Map Guide
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <article className="detail-panel">
            <h2>No maps added yet</h2>
            <p>
              This category exists now, but its map pool has not been added to the guide yet.
            </p>
          </article>
        )}
      </div>
    );
  }

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
      <div className="detail-grid">
        <article className="detail-panel">
          <h2>Creep Notes</h2>
          <p>{map.creepNotes}</p>
        </article>
        <article className="detail-panel">
          <h2>Expansion Notes</h2>
          <p>{map.expansionNotes}</p>
        </article>
      </div>
    </div>
  );
}
