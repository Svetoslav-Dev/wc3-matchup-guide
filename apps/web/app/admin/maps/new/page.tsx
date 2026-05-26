import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { createMapAction } from "../../actions";

export default async function NewAdminMapPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Map creation requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Map Editor</p>
          <h1 className="page-title">Create a new map guide</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/maps" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <form action={createMapAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Twisted Meadows" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" placeholder="twisted-meadows" /></div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="TwistedMeadows" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Maps/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="A classic 1v1 map with a central expansion and multiple creep camps guarding key resources." /></div>
          <div className="field"><label htmlFor="creepNotes">Creep notes</label><textarea id="creepNotes" name="creepNotes" placeholder="Two neutral camps guard the expansions; the green camp near the center drops a powerful item." /></div>
          <div className="field"><label htmlFor="expansionNotes">Expansion notes</label><textarea id="expansionNotes" name="expansionNotes" placeholder="Expansions are accessible early but heavily contested; timing your expo around the first creep run is key." /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Map</button>
          </div>
        </section>
      </form>
    </div>
  );
}
