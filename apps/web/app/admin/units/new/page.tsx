import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { NewUnitForm } from "../../../../components/new-unit-form";

export default async function NewAdminUnitPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Unit creation requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  const raceResult = await listRaces(1, 20);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");
  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Unit Editor</p>
          <h1 className="page-title">Create a new unit guide</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/units" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">Strengths and weaknesses format: one point per line.</p>
      <NewUnitForm races={visibleRaces} />
    </div>
  );
}
