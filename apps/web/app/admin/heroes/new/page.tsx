import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { createHeroAction } from "../../actions";
import { RaceSelect } from "../../../../components/race-select";

export default async function NewAdminHeroPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Hero creation requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  const raceResult = await listRaces(1, 20);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

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
      <form action={createHeroAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={visibleRaces} defaultValue={visibleRaces[0]?.slug ?? ""} />
          </div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Archmage" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" placeholder="archmage" /></div>
          <div className="field"><label htmlFor="primaryAttribute">Primary attribute</label><input id="primaryAttribute" name="primaryAttribute" type="text" placeholder="Intelligence" /></div>
          <div className="field"><label htmlFor="role">Role</label><input id="role" name="role" type="text" placeholder="Spellcaster" /></div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="Archmage" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Heroes/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The Archmage is the pinnacle of Human magical warfare, capable of unleashing devastating area spells." /></div>
          <div className="field"><label htmlFor="highlightsInput">Highlights</label><textarea id="highlightsInput" name="highlightsInput" placeholder={"Strong first-hero scouting\nReliable mana pressure"} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Hero</button>
          </div>
        </section>
      </form>
    </div>
  );
}
