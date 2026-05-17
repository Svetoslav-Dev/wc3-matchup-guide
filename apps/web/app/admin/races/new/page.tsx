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
      <div className="section-head">
        <p className="section-label">Admin Race Editor</p>
        <h1 className="page-title">Create a new race guide.</h1>
        <p className="page-intro">This editor manages the core race identity fields stored in the database.</p>
      </div>
      <form action={createRaceAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" /></div>
          <div className="field"><label htmlFor="identity">Identity</label><textarea id="identity" name="identity" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" /></div>
          <div className="field"><label htmlFor="ladderFocus">Ladder focus</label><textarea id="ladderFocus" name="ladderFocus" /></div>
          <div className="inline-actions"><button className="button" type="submit">Create Race</button></div>
        </section>
      </form>
    </div>
  );
}
