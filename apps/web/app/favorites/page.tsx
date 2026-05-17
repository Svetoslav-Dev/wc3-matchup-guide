import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import Link from "next/link";
import { getSessionUser } from "../../lib/auth";
import { listFavoriteBuildsForUser } from "../../lib/content";

export default async function FavoritesPage() {
  const user = await getSessionUser();

  if (!hasDatabaseUrl()) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Favorites</p>
          <h1 className="page-title">Saved plans for your next ladder set.</h1>
          <p className="page-intro">Favorites become available after `DATABASE_URL` is configured and the database is migrated.</p>
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
          <p className="page-intro">This page is now protected by the session cookie. Use the login API or the seeded demo user after the database is ready.</p>
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
        <p className="page-intro">Your saved build order library is tied to the authenticated account on the server.</p>
      </div>
      {favorites.length === 0 ? (
        <p className="muted">You have not saved any builds yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <article key={favorite.id} className="favorite-card">
              <p className="pill">{favorite.build.raceName}</p>
              <h2>{favorite.build.title}</h2>
              <p>{favorite.build.summary}</p>
              <Link href={`/builds/${favorite.build.slug}`} className="button button--ghost">
                Open Build
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
