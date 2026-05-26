import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { NewMatchupForm } from "../../../../components/new-matchup-form";

export default async function NewAdminMatchupPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Matchup creation requires backend configuration.</h1>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Admin access required.</h1>
        </div>
      </div>
    );
  }

  const raceResult = await listRaces(1, 20);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Create a new matchup</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/matchups" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">
        There are 16 matchups in total. New races must be created before a new matchup can be added.
      </p>
      <p className="page-intro">Common mistakes format: one note per line.</p>
      <NewMatchupForm races={visibleRaces} />
    </div>
  );
}
