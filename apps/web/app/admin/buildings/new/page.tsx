import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { createBuildingAction } from "../../actions";
import { RaceSelect } from "../../../../components/race-select";

const allRaces = [
  { slug: "human", name: "Human" },
  { slug: "orc", name: "Orc" },
  { slug: "undead", name: "Undead" },
  { slug: "night-elf", name: "Night Elf" },
  { slug: "neutral", name: "Neutral" },
];

export default async function NewAdminBuildingPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <div>
          <p className="section-label">God Panel · Buildings</p>
          <h1 className="page-title">New Building</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/buildings" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <form action={createBuildingAction} style={{ display: "flex", justifyContent: "center" }}>
        <section className="form-panel" style={{ width: "100%", maxWidth: "560px" }}>
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Town Hall" /></div>
          <div className="field">
            <label htmlFor="race">Race</label>
            <RaceSelect races={allRaces} defaultValue="human" name="race" id="race" />
          </div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="TownHall" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Buildings/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The primary structure of the Human base, used to train Peasants and research key upgrades." /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Building</button>
          </div>
        </section>
      </form>
    </div>
  );
}
