import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { getAdminItemById } from "../../../../../lib/content";
import { updateItemAction } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditAdminItemPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { id } = await params;
  const item = await getAdminItemById(Number(id));
  if (!item) notFound();

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Items</p>
        <h1 className="page-title">Edit {item.name}</h1>
      </div>
      <form action={updateItemAction} className="form-grid">
        <input type="hidden" name="itemId" value={item.id} />
        <section className="form-panel">
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={item.name} /></div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={item.category}>
              <option value="permanent">Permanent</option>
              <option value="consumable">Consumable</option>
              <option value="tome">Tome</option>
            </select>
          </div>
          <div className="field"><label htmlFor="imageFile">Image file (without extension)</label><input id="imageFile" name="imageFile" type="text" defaultValue={item.imageFile} placeholder="PotionOfHealing" /></div>
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Items/)</label>
            {item.imageFile ? <Image src={`/images/Items/${item.imageFile}.png`} alt={item.name} className="admin-img-preview" width={80} height={80} /> : null}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
          <div className="field"><label htmlFor="shopsInput">Shops (comma-separated)</label><input id="shopsInput" name="shopsInput" type="text" defaultValue={item.shops.join(", ")} placeholder="human,orc,undead,night-elf" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={item.description} /></div>
          <div className="inline-actions">
            <button className="button" type="submit">Save Item</button>
            <a href="/admin/items" className="button button--cancel">Cancel</a>
          </div>
        </section>
      </form>
    </div>
  );
}
