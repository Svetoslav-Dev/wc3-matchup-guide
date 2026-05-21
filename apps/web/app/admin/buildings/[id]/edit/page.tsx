import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { getAdminBuildingById } from "../../../../../lib/content";
import { updateBuildingAction } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

const raceOptions = ["human", "orc", "undead", "night-elf", "neutral"];

export default async function EditAdminBuildingPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { id } = await params;
  const building = await getAdminBuildingById(Number(id));
  if (!building) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Buildings</p>
        <h1 className="page-title">Edit {building.name}</h1>
      </div>
      <form action={updateBuildingAction} className="form-grid" encType="multipart/form-data">
        <input type="hidden" name="buildingId" value={building.id} />
        <section className="form-panel">
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={building.name} /></div>
          <div className="field">
            <label htmlFor="race">Race</label>
            <select id="race" name="race" defaultValue={building.race}>
              {raceOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" defaultValue={building.imageFile} placeholder="TownHall" /></div>
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Buildings/)</label>
            {building.imageFile ? <Image src={`/images/Buildings/${building.imageFile}.png`} alt={building.name} className="admin-img-preview" width={80} height={80} /> : null}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={building.description} /></div>
          <div className="inline-actions">
            <button className="button" type="submit">Save Building</button>
            <a href="/admin/buildings" className="button button--ghost">Cancel</a>
          </div>
        </section>
      </form>
    </div>
  );
}
