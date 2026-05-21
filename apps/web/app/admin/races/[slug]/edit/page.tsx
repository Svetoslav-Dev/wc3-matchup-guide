import Image from "next/image";
import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { ensureAdminRaceEditor, updateRaceAction } from "../../../actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminRacePage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Race editing requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  const { slug } = await params;
  const race = await ensureAdminRaceEditor(slug);

  if (!race) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Admin Race Editor</p>
        <h1 className="page-title">Edit {race.name}</h1>
      </div>
      <form action={updateRaceAction} className="form-grid" encType="multipart/form-data">
        <input type="hidden" name="raceId" value={race.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={race.name} /></div>
          <div className="field"><label htmlFor="slug">Slug</label><input id="slug" name="slug" type="text" defaultValue={race.slug} /></div>
          <div className="field"><label htmlFor="identity">Identity</label><textarea id="identity" name="identity" defaultValue={race.identity} /></div>
          <input type="hidden" name="imageUrl" value={race.imageUrl ?? ""} />
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Races/)</label>
            {race.imageUrl ? <Image src={race.imageUrl} alt={race.name} className="admin-img-preview" width={80} height={80} /> : null}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={race.description} /></div>
          <div className="field"><label htmlFor="ladderFocus">Ladder focus</label><textarea id="ladderFocus" name="ladderFocus" defaultValue={race.ladderFocus} /></div>
          <div className="inline-actions"><button className="button" type="submit">Save Race</button></div>
        </section>
      </form>
    </div>
  );
}
