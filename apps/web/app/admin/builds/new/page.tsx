import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { listMatchups, listRaces } from "../../../../lib/content";
import { getSessionUser } from "../../../../lib/auth";
import { NewBuildForm } from "../../../../components/new-build-form";

export default async function NewAdminBuildPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Build creation requires backend configuration.</h1>
          <p className="page-intro">Set <code>DATABASE_URL</code> and <code>JWT_SECRET</code> before using admin editors.</p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Admin access required.</h1>
          <p className="page-intro">Only authenticated admins can create builds from the web editor.</p>
        </div>
      </div>
    );
  }

  const [raceResult, matchupResult] = await Promise.all([listRaces(1, 20), listMatchups(1, 50)]);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Create a new build order</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/builds" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">
        For <strong>Build Steps</strong> use one line per step:<br />
        <code>[12f, 1:30] Build barracks and queue footmen</code><br />
        <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
      </p>
      <NewBuildForm races={visibleRaces} matchups={matchupResult.data} />
    </div>
  );
}
