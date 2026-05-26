import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { NewRaceForm } from "../../../../components/new-race-form";

export default async function NewAdminRacePage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Race creation requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Race Editor</p>
          <h1 className="page-title">Create a new race guide</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/races" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">This editor manages the core race identity fields stored in the database.</p>
      <NewRaceForm />
    </div>
  );
}
