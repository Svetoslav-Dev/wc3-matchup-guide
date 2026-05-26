import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { NewHeroForm } from "../../../../components/new-hero-form";

export default async function NewAdminHeroPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Hero creation requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  const raceResult = await listRaces(1, 20);
  const visibleRaces = raceResult.data.map((r) => r.slug === "neutral" ? { ...r, name: "Tavern" } : r);

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Hero Editor</p>
          <h1 className="page-title">Create a new hero guide</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/heroes" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">Highlights format: one point per line.</p>
      <NewHeroForm races={visibleRaces} />
    </div>
  );
}
