import Link from "next/link";
import { mapCategories } from "./categories";

export default async function MapsPage() {
  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Map Library</p>
        <h1 className="page-title">Map shape changes every timing window.</h1>
        <p className="page-intro">
          Choose a format to browse the maps inside it. Each category separates solo, team, and
          free-for-all pools so the guide stays easier to scan.
        </p>
      </div>
      <div className="card-grid">
        {mapCategories.map((category) => (
          <article key={category.slug} className="card">
            <p className="pill">Map Category</p>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <Link href={`/maps/${category.slug}`} className="button button--ghost">
              View {category.name} Maps
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
