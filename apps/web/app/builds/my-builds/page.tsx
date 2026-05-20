import Link from "next/link";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listBuildSubmissionsForUser } from "../../../lib/content";
import { deleteUserBuildAction } from "../user-actions";
import { DifficultyBadge } from "../../../components/difficulty-badge";

export default async function MyBuildsPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">My Builds</p>
          <h1 className="page-title">Backend configuration required.</h1>
          <p className="page-intro">
            Set <code>DATABASE_URL</code> and <code>JWT_SECRET</code> to use build submissions.
          </p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">My Builds</p>
          <h1 className="page-title">Log in to view your submitted builds.</h1>
          <div className="hero-actions">
            <Link href="/login" className="button">Log In</Link>
            <Link href="/register" className="button button--ghost">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const submissions = await listBuildSubmissionsForUser(user.id);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">My Builds</p>
        <h1 className="page-title">Your submitted build orders.</h1>
        <p className="page-intro">
          Drafts stay off the public builds page until published by an admin. Published builds are
          visible to everyone.
        </p>
        <div className="hero-actions">
          <Link href="/builds/submit" className="button">Submit a New Build</Link>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="panel panel--padded">
          <p className="muted">You have no submitted builds yet.</p>
        </div>
      ) : (
        <div className="list-grid">
          {submissions.map((build) => (
            <article key={build.id} className="card">
              <div className="list-meta">
                <span className={`pill${build.isPublished ? "" : " pill--draft"}`}>
                  {build.isPublished ? "Published" : "Draft"}
                </span>
                <span className="pill pill--race">{build.raceName}</span>
              </div>
              <h3>{build.title}</h3>
              <p>{build.summary}</p>
              <div className="list-meta">
                <DifficultyBadge value={build.difficulty} />
                <span>{build.strategyType}</span>
              </div>
              <div className="card__footer">
                <div className="card__footer-action">
                  {build.isPublished ? (
                    <Link href={`/builds/${build.slug}`} className="button button--ghost">
                      View Build
                    </Link>
                  ) : (
                    <span className="muted">Pending admin review</span>
                  )}
                </div>
                <form action={deleteUserBuildAction}>
                  <input type="hidden" name="buildId" value={String(build.id)} />
                  <button className="button button--ghost" type="submit">Remove</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
