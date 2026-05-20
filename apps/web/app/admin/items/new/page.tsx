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
      <div className="section-head">
        <p className="section-label">God Panel · Items</p>
        <h1 className="page-title">New Item</h1>
      </div>
      <form action={createItemAction} className="form-grid" encType="multipart/form-data">
        <section className="form-panel">
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" /></div>
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
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" /></div>
          <div className="inline-actions">
            <button className="button" type="submit">Create Item</button>
            <a href="/admin/items" className="button button--ghost">Cancel</a>
          </div>
        </section>
      </form>
    </div>
  );
}
