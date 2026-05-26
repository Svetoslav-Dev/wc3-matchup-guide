import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { createItemAction } from "../../actions";

export default async function NewAdminItemPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <div>
          <p className="section-label">God Panel · Items</p>
          <h1 className="page-title">New Item</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/items" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <form action={createItemAction} style={{ display: "flex", justifyContent: "center" }}>
        <section className="form-panel" style={{ width: "100%", maxWidth: "560px" }}>
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Potion of Healing" /></div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category">
              <option value="permanent">Permanent</option>
              <option value="consumable">Consumable</option>
              <option value="tome">Tome</option>
            </select>
          </div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" placeholder="PotionOfHealing" /></div>
          <div className="field"><label htmlFor="imageUpload">Upload image (saves to /images/Items/)</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
          <div className="field"><label htmlFor="shopsInput">Shops (comma-separated, e.g. human,orc)</label><input id="shopsInput" name="shopsInput" type="text" placeholder="human,orc,undead,night-elf" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="Restores 500 hit points to a friendly non-mechanical unit over time." /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Item</button>
          </div>
        </section>
      </form>
    </div>
  );
}
