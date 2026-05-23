import Link from "next/link";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listBuildSubmissionsForUser } from "../../../lib/content";
import { deleteUserBuildAction } from "../user-actions";
import { DifficultyBadge } from "../../../components/difficulty-badge";
import { ConfirmDelete } from "../../../components/confirm-delete";

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
          <Link href="/builds/submit" className="button button--ghost">Submit a New Build</Link>
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
              {/* Top row: difficulty + race + strategy | status */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <DifficultyBadge value={build.difficulty} />
                  <span className="pill pill--race">{build.raceName}</span>
                  {build.strategyType && <span className="pill">{build.strategyType}</span>}
                </div>
                {!build.isPublished && (
                  <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-muted shrink-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#f97316", boxShadow: "0 0 5px rgba(249,115,22,0.6)" }} />
                    Pending review
                  </span>
                )}
              </div>

              {/* Title + summary */}
              <div className="flex flex-col gap-1">
                <h3 className="text-[1rem] font-bold text-text m-0 leading-snug">{build.title}</h3>
                <p className="text-muted text-sm leading-relaxed m-0">{build.summary}</p>
              </div>

              {/* Footer */}
              <div className="build-card__footer">
                {build.isPublished ? (
                  <Link href={`/builds/${build.slug}`} className="button button--ghost button--sm">
                    View Build
                  </Link>
                ) : <span />}
                <div className="flex items-center gap-2">
                  <Link href={`/builds/submit?edit=${build.id}`} className="button button--edit button--sm">
                    Edit
                  </Link>
                  <ConfirmDelete action={deleteUserBuildAction} itemName={build.title} hiddenFields={{ buildId: String(build.id) }} label="Remove" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
