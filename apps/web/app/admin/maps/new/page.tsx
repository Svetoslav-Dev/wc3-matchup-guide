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
      <div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Create a new map guide.</h1></div>
      <form action={createMapAction} className="form-grid" encType="multipart/form-data">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" /></div>
          <div className="field"><label htmlFor="creepNotes">Creep notes</label><textarea id="creepNotes" name="creepNotes" /></div>
          <div className="field"><label htmlFor="expansionNotes">Expansion notes</label><textarea id="expansionNotes" name="expansionNotes" /></div>
          <div className="inline-actions"><button className="button" type="submit">Create Map</button></div>
        </section>
      </form>
    </div>
  );
}
