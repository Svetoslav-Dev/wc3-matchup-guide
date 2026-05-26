import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { createUnitAction } from "../../actions";
import { RaceSelect } from "../../../../components/race-select";

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
      <form action={createUnitAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="raceSlug">Race</label><RaceSelect races={visibleRaces} defaultValue={visibleRaces[0]?.slug ?? ""} /></div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Footman" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" placeholder="footman" /></div>
          <div className="field"><label htmlFor="unitType">Unit type</label><input id="unitType" name="unitType" type="text" placeholder="Melee" /></div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="Footman" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Units/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The Footman is the core frontline unit of the Human Alliance, offering solid armor and a defensive ability." /></div>
          <div className="field"><label htmlFor="strengthsInput">Strengths</label><textarea id="strengthsInput" name="strengthsInput" placeholder={"Strong armor against physical attacks\nExcellent meatshield for ranged units"} /></div>
          <div className="field"><label htmlFor="weaknessesInput">Weaknesses</label><textarea id="weaknessesInput" name="weaknessesInput" placeholder={"Vulnerable to magic damage\nSlow movement speed"} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Unit</button>
          </div>
        </section>
      </form>
    </div>
  );
}
