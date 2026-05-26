import Image from "next/image";
import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatLineItemsInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listRaces } from "../../../../../lib/content";
import { ensureAdminUnitEditor, updateUnitAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";

type Props = { params: Promise<{ slug: string }> };

export default async function EditAdminUnitPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Unit editing requires backend configuration.</h1></div></div>;
  }
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }
  const { slug } = await params;
  const [unit, raceResult] = await Promise.all([ensureAdminUnitEditor(slug), listRaces(1, 20)]);
  if (!unit) notFound();
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="section-head"><p className="section-label">Admin Unit Editor</p><h1 className="page-title">Edit {unit.name}</h1></div>
      <form action={updateUnitAction} className="form-grid">
        <input type="hidden" name="unitId" value={unit.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="raceSlug">Race</label><RaceSelect races={visibleRaces} defaultValue={unit.raceSlug} /></div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={unit.name} /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" defaultValue={unit.slug} /></div>
          <div className="field"><label htmlFor="unitType">Unit type</label><input id="unitType" name="unitType" type="text" defaultValue={unit.unitType} /></div>
          <input type="hidden" name="imageUrl" value={unit.imageUrl ?? ""} />
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Units/)</label>
            {unit.imageUrl ? <Image src={unit.imageUrl} alt={unit.name} className="admin-img-preview" width={80} height={80} /> : null}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={unit.description} /></div>
          <div className="field"><label htmlFor="strengthsInput">Strengths</label><textarea id="strengthsInput" name="strengthsInput" defaultValue={formatLineItemsInput(unit.strengths)} /></div>
          <div className="field"><label htmlFor="weaknessesInput">Weaknesses</label><textarea id="weaknessesInput" name="weaknessesInput" defaultValue={formatLineItemsInput(unit.weaknesses)} /></div>
          <div className="inline-actions"><button className="button" type="submit">Save Unit</button></div>
        </section>
      </form>
    </div>
  );
}
