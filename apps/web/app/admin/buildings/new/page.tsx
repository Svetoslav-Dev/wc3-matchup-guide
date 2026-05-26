import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { NewBuildingForm } from "../../../../components/new-building-form";

export default async function NewAdminBuildingPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const raceResult = await listRaces(1, 100);

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <div>
          <p className="section-label">God Panel · Buildings</p>
          <h1 className="page-title">New Building</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/buildings" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <NewBuildingForm races={raceResult.data} />
    </div>
  );
}
