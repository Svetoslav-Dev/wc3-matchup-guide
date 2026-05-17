import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { ensureAdminMapEditor, updateMapAction } from "../../../actions";

type Props = { params: Promise<{ slug: string }> };

export default async function EditAdminMapPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Map editing requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  const { slug } = await params;
  const map = await ensureAdminMapEditor(slug);
  if (!map) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Edit {map.name}</h1></div>
      <form action={updateMapAction} className="form-grid">
        <input type="hidden" name="mapId" value={map.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={map.name} /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" defaultValue={map.slug} /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={map.description} /></div>
          <div className="field"><label htmlFor="creepNotes">Creep notes</label><textarea id="creepNotes" name="creepNotes" defaultValue={map.creepNotes} /></div>
          <div className="field"><label htmlFor="expansionNotes">Expansion notes</label><textarea id="expansionNotes" name="expansionNotes" defaultValue={map.expansionNotes} /></div>
          <div className="inline-actions"><button className="button" type="submit">Save Map</button></div>
        </section>
      </form>
    </div>
  );
}
