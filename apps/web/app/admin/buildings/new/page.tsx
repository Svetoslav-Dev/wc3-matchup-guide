import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { createBuildingAction } from "../../actions";

const raceOptions = ["human", "orc", "undead", "night-elf", "neutral"];

export default async function NewAdminBuildingPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Buildings</p>
        <h1 className="page-title">New Building</h1>
      </div>
      <form action={createBuildingAction} className="form-grid" encType="multipart/form-data">
        <section className="form-panel">
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" /></div>
          <div className="field">
            <label htmlFor="race">Race</label>
            <select id="race" name="race">
              {raceOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="TownHall" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Buildings/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" /></div>
          <div className="inline-actions">
            <button className="button" type="submit">Create Building</button>
            <a href="/admin/buildings" className="button button--ghost">Cancel</a>
          </div>
        </section>
      </form>
    </div>
  );
}
