import Image from "next/image";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { notFound, redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { getAdminBuildingById, listRaces } from "../../../../../lib/content";
import { updateBuildingAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";

async function resolveBuildingImageUrl(imageFile: string): Promise<string | null> {
  if (!imageFile) return null;
  if (imageFile.startsWith("http") || imageFile.startsWith("/")) return imageFile;
  if (imageFile.includes(".")) return `/images/Buildings/${imageFile}`;
  const dirs = [join(process.cwd(), "public"), join(process.cwd(), "apps", "web", "public")];
  for (const base of dirs) {
    try {
      const files = await readdir(join(base, "images", "Buildings"));
      const match = files.find((f) => f.replace(/\.[^.]+$/, "") === imageFile);
      if (match) return `/images/Buildings/${match}`;
    } catch { /* skip */ }
  }
  return null;
}

type Props = { params: Promise<{ id: string }>; searchParams?: Promise<{ status?: string; error?: string }> };

export default async function EditAdminBuildingPage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { id } = await params;
  const { error, status } = (await searchParams) ?? {};
  const [building, raceResult] = await Promise.all([getAdminBuildingById(Number(id)), listRaces(1, 100)]);
  if (!building) notFound();
  const races = raceResult.data;
  const imagePreviewUrl = await resolveBuildingImageUrl(building.imageFile);

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

      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Building {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
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
              <RaceSelect races={races} defaultValue={building.race} name="race" id="race" />
            </div>
            <input type="hidden" name="imageFile" value={building.imageFile} />
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={building.description} />
            </div>
          </div>

          <div className="admin-edit-form__sidebar">
            <div className="admin-edit-form__preview-card">
              <p className="section-label">Image Preview</p>
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt={building.name}
                  width={120}
                  height={120}
                  style={{ objectFit: "contain" }}
                  className="admin-edit-form__preview-img"
                  unoptimized
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
        </div>
      </form>
    </div>
  );
}
