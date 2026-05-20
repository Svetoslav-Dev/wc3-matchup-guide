import Link from "next/link";
import { listMaps } from "../../lib/content";
import { GameImage } from "../../components/game-image";
import { mapCategories, mapCategoryNameBySlug, mapSlugsByCategory } from "./categories";

type Props = {
  searchParams?: Promise<{ mode?: string }>;
};

const buildMapHref = (mode?: string) => (mode ? `/maps?mode=${mode}` : "/maps");

export default async function MapsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const activeMode = params.mode;
  const allMaps = (await listMaps(1, 200)).data;
  const visibleMaps = activeMode
    ? allMaps.filter((map) => (mapSlugsByCategory[activeMode] ?? []).includes(map.slug))
    : allMaps;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Map Library</p>
        <h1 className="page-title">Map shape changes every timing window.</h1>
        <p className="page-intro">
          Toggle between classic solo, team, and free-for-all pools from one page. Each map still
          opens its own guide with creep and expansion notes.
        </p>
      </div>
      <section className="panel panel--padded">
        <div className="section-head">
          <p className="section-label">Map Filters</p>
          <h2>Browse maps by classic game mode.</h2>
        </div>
        <div className="chip-row">
          <Link
            className={`button button--ghost${!activeMode ? " button--active" : ""}`}
            href="/maps"
            aria-current={!activeMode ? "page" : undefined}
          >
            All
          </Link>
          {mapCategories.map((category) => (
            <Link
              key={category.slug}
              className={`button button--ghost${activeMode === category.slug ? " button--active" : ""}`}
              href={buildMapHref(category.slug)}
              aria-current={activeMode === category.slug ? "page" : undefined}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
      <div className="card-grid">
        {visibleMaps.map((map) => {
          const categories = mapCategories
            .filter((category) => (mapSlugsByCategory[category.slug] ?? []).includes(map.slug))
            .map((category) => mapCategoryNameBySlug[category.slug]);

          return (
            <article key={map.slug} className="card">
              <p className="pill">{categories.join(" · ")}</p>
              <div className="title-row">
                <GameImage
                  src={map.imageUrl ?? `/images/maps/${map.slug}.jpg`}
                  alt={map.name}
                  className="game-image--icon"
                  width={64}
                  height={64}
                />
                <div className="title-stack">
                  <h2>{map.name}</h2>
                </div>
              </div>
              <p>{map.description}</p>
              <div className="card__footer">
                <div className="list-meta">
                  <span>{map.creepNotes}</span>
                </div>
                <div className="card__footer-action card__footer-action--center">
                  <Link href={`/maps/${map.slug}`} className="button button--ghost">
                    View Map Guide
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visibleMaps.length === 0 ? (
        <article className="detail-panel">
          <h2>No maps found</h2>
          <p>
            There are no maps assigned to this category yet.
          </p>
        </article>
      ) : null}
    </div>
  );
}
