import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { createRaceAction } from "../../actions";

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
      <form action={createRaceAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Human" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" placeholder="human" /></div>
          <div className="field"><label htmlFor="identity">Identity</label><textarea id="identity" name="identity" placeholder="The Human Alliance relies on versatile units, powerful spells, and fortified structures to outlast opponents." /></div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="Human" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Races/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="Humans excel at siege and tower-based strategies, with strong mid-game unit composition options." /></div>
          <div className="field"><label htmlFor="ladderFocus">Ladder focus</label><textarea id="ladderFocus" name="ladderFocus" placeholder="Focus on fast expansion into casters, leveraging the Archmage's Water Elementals for early map control." /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Race</button>
          </div>
        </section>
      </form>
    </div>
  );
}
