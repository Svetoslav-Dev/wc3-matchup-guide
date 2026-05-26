import Image from "next/image";
import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { ensureAdminMapEditor, updateMapAction } from "../../../actions";

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ status?: string; error?: string }> };

export default async function EditAdminMapPage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Map editing requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Map Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  const { slug } = await params;
  const { error, status } = (await searchParams) ?? {};
  const map = await ensureAdminMapEditor(slug);
  if (!map) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Map Editor</p>
          <h1 className="page-title">Edit {map.name}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/maps" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Map {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
      <form action={updateMapAction} className="form-grid">
        <input type="hidden" name="mapId" value={map.id} />
        <input type="hidden" name="currentSlug" value={map.slug} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={map.name} /></div>
          <div className="field"><label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /maps/twisted-meadows)</span></label><input id="slug" name="slug" type="text" defaultValue={map.slug} /></div>
          <input type="hidden" name="imageUrl" value={map.imageUrl ?? ""} />
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Maps/)</label>
            {map.imageUrl ? <Image src={map.imageUrl} alt={map.name} className="admin-img-preview" width={80} height={80} /> : null}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={map.description} /></div>
          <div className="field"><label htmlFor="creepNotes">Creep notes</label><textarea id="creepNotes" name="creepNotes" defaultValue={map.creepNotes} /></div>
          <div className="field"><label htmlFor="expansionNotes">Expansion notes</label><textarea id="expansionNotes" name="expansionNotes" defaultValue={map.expansionNotes} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Save Map</button>
          </div>
        </section>
      </form>
    </div>
  );
}
