import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import Link from "next/link";
import { getSessionUser } from "../../lib/auth";
import { listFavoriteBuildsForUser } from "../../lib/content";
import { removeFavoriteAction } from "../builds/[slug]/favorite-actions";
import { DifficultyBadge } from "../../components/difficulty-badge";
import { GameImage } from "../../components/game-image";

const HeartSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default async function FavoritesPage() {
  const user = await getSessionUser();

  if (!hasDatabaseUrl()) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Favorites</p>
          <h1 className="page-title">Saved plans for your next ladder set.</h1>
          <p className="page-intro">Favorites become available after <code>DATABASE_URL</code> is configured.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Favorites</p>
          <h1 className="page-title">Sign in to access saved builds.</h1>
        </div>
      </div>
    );
  }

  const favorites = await listFavoriteBuildsForUser(user.id);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Favorites</p>
        <h1 className="page-title">Saved plans for your next ladder set.</h1>
        <p className="page-intro">Your saved build order library.</p>
      </div>
      {favorites.length === 0 ? (
        <p className="muted">You have not saved any builds yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => {
            const { build } = favorite;
            return (
              <article key={favorite.id} className="favorite-card">
                <form action={removeFavoriteAction} style={{ display: "contents" }}>
                  <input type="hidden" name="buildSlug" value={build.slug} />
                  <button
                    className="heart-btn heart-btn--filled heart-btn--detail"
                    type="submit"
                    aria-label="Remove from favorites"
                  >
                    <HeartSvg />
                  </button>
                </form>
                <div className="list-meta">
                  <GameImage
                    src={build.raceImageUrl ?? `/images/Races/${build.raceSlug}.jpg`}
                    alt={build.raceName}
                    className="game-image--icon"
                    width={48}
                    height={48}
                  />
                  <p className="pill pill--race">{build.raceName}</p>
                  <p className="pill">{build.strategyType}</p>
                </div>
                <h2>{build.title}</h2>
                <p>{build.summary}</p>
                <div className="card__footer">
                  <span>Difficulty: <DifficultyBadge value={build.difficulty} /></span>
                  <Link href={`/builds/${build.slug}`} className="button button--ghost">
                    Open Build
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
