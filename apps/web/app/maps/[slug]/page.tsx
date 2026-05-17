import { notFound } from "next/navigation";
import { getMapBySlug } from "../../../lib/content";

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
