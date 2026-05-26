import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { getAdminBuildingById } from "../../../../../lib/content";
import { updateBuildingAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";

type Props = { params: Promise<{ id: string }> };

const allRaces = [
  { slug: "human", name: "Human" },
  { slug: "orc", name: "Orc" },
  { slug: "undead", name: "Undead" },
  { slug: "night-elf", name: "Night Elf" },
  { slug: "neutral", name: "Neutral" },
];

export default async function EditAdminBuildingPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { id } = await params;
  const building = await getAdminBuildingById(Number(id));
  if (!building) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Buildings</p>
          <h1 className="page-title">Edit {building.name}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/buildings" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>

      <form action={updateBuildingAction} className="admin-edit-form">
        <input type="hidden" name="buildingId" value={building.id} />

        <div className="admin-edit-form__body">
          <div className="admin-edit-form__fields">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" defaultValue={building.name} />
            </div>
            <div className="field">
              <label htmlFor="race">Race</label>
              <RaceSelect races={allRaces} defaultValue={building.race} name="race" id="race" />
            </div>
            <div className="field">
              <label htmlFor="imageFile">Image filename <span className="admin-edit-form__hint">(without extension)</span></label>
              <input id="imageFile" name="imageFile" type="text" defaultValue={building.imageFile} placeholder="TownHall" />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={building.description} />
            </div>
          </div>

          <div className="admin-edit-form__sidebar">
            <div className="admin-edit-form__preview-card">
              <p className="section-label">Image Preview</p>
              {building.imageFile ? (
                <Image
                  src={`/images/Buildings/${building.imageFile}.png`}
                  alt={building.name}
                  width={120}
                  height={120}
                  style={{ objectFit: "contain" }}
                  className="admin-edit-form__preview-img"
                />
              ) : (
                <div className="admin-edit-form__preview-empty">No image set</div>
              )}
              <div className="field">
                <label htmlFor="imageUpload">Replace image</label>
                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-edit-form__footer">
          <button className="button button--ghost" type="submit">Save Building</button>
          <a href="/admin/buildings" className="button button--cancel">Cancel</a>
        </div>
      </form>
    </div>
  );
}
