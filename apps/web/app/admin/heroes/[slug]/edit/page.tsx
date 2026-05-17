import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatLineItemsInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listRaces } from "../../../../../lib/content";
import { ensureAdminHeroEditor, updateHeroAction } from "../../../actions";

type Props = { params: Promise<{ slug: string }> };

export default async function EditAdminHeroPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Hero editing requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  const { slug } = await params;
  const [hero, raceResult] = await Promise.all([ensureAdminHeroEditor(slug), listRaces(1, 20)]);
  if (!hero) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="section-head"><p className="section-label">Admin Hero Editor</p><h1 className="page-title">Edit {hero.name}</h1></div>
      <form action={updateHeroAction} className="form-grid">
        <input type="hidden" name="heroId" value={hero.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="raceSlug">Race</label><select id="raceSlug" name="raceSlug" defaultValue={hero.raceSlug}>{raceResult.data.map((race) => <option key={race.slug} value={race.slug}>{race.name}</option>)}</select></div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={hero.name} /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" defaultValue={hero.slug} /></div>
          <div className="field"><label htmlFor="primaryAttribute">Primary attribute</label><input id="primaryAttribute" name="primaryAttribute" type="text" defaultValue={hero.primaryAttribute} /></div>
          <div className="field"><label htmlFor="role">Role</label><input id="role" name="role" type="text" defaultValue={hero.role} /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={hero.description} /></div>
          <div className="field"><label htmlFor="highlightsInput">Highlights</label><textarea id="highlightsInput" name="highlightsInput" defaultValue={formatLineItemsInput(hero.highlights)} /></div>
          <div className="inline-actions"><button className="button" type="submit">Save Hero</button></div>
        </section>
      </form>
    </div>
  );
}
