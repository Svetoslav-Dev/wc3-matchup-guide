import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { createUnitAction } from "../../actions";

export default async function NewAdminUnitPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Unit creation requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  const raceResult = await listRaces(1, 20);
  return (
    <div className="page-shell page-stack">
      <div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Create a new unit guide.</h1><p className="page-intro">Strengths and weaknesses format: one point per line.</p></div>
      <form action={createUnitAction} className="form-grid" encType="multipart/form-data">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="raceSlug">Race</label><select id="raceSlug" name="raceSlug" defaultValue={raceResult.data[0]?.slug}>{raceResult.data.map((race) => <option key={race.slug} value={race.slug}>{race.name}</option>)}</select></div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" /></div>
          <div className="field"><label htmlFor="unitType">Unit type</label><input id="unitType" name="unitType" type="text" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" /></div>
          <div className="field"><label htmlFor="strengthsInput">Strengths</label><textarea id="strengthsInput" name="strengthsInput" /></div>
          <div className="field"><label htmlFor="weaknessesInput">Weaknesses</label><textarea id="weaknessesInput" name="weaknessesInput" /></div>
          <div className="inline-actions"><button className="button" type="submit">Create Unit</button></div>
        </section>
      </form>
    </div>
  );
}
