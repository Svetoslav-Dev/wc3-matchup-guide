import Image from "next/image";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { notFound, redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { getAdminItemById } from "../../../../../lib/content";
import { updateItemAction } from "../../../actions";

async function resolveItemImageUrl(imageFile: string): Promise<string | null> {
  if (!imageFile) return null;
  if (imageFile.startsWith("http") || imageFile.startsWith("/")) return imageFile;
  if (imageFile.includes(".")) return `/images/Items/${imageFile}`;
  const dirs = [join(process.cwd(), "public"), join(process.cwd(), "apps", "web", "public")];
  for (const base of dirs) {
    try {
      const files = await readdir(join(base, "images", "Items"));
      const match = files.find((f) => f.replace(/\.[^.]+$/, "") === imageFile);
      if (match) return `/images/Items/${match}`;
    } catch { /* skip */ }
  }
  return null;
}

type Props = { params: Promise<{ id: string }>; searchParams?: Promise<{ status?: string; error?: string }> };

export default async function EditAdminItemPage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) redirect("/admin");
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { id } = await params;
  const { error, status } = (await searchParams) ?? {};
  const item = await getAdminItemById(Number(id));
  if (!item) notFound();
  const imagePreviewUrl = await resolveItemImageUrl(item.imageFile);

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <div>
          <p className="section-label">God Panel · Items</p>
          <h1 className="page-title">Edit {item.name}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/items" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      {(status === "updated" || status === "created") && (
        <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto" }}>
          <div className="status-banner status-banner--success">Item {status === "created" ? "created" : "updated"}.</div>
        </div>
      )}
      {error && (
        <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto" }}>
          <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
        </div>
      )}
      <form action={updateItemAction} style={{ display: "flex", justifyContent: "center" }}>
        <input type="hidden" name="itemId" value={item.id} />
        <section className="form-panel" style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <h2 style={{ color: "var(--color-gold)" }}>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" defaultValue={item.name} /></div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={item.category}>
              <option value="permanent">Permanent</option>
              <option value="consumable">Consumable</option>
              <option value="tome">Tome</option>
            </select>
          </div>
          <input type="hidden" name="imageFile" value={item.imageFile} />
          <div className="field">
            <label htmlFor="imageUpload">Image (saves to /images/Items/)</label>
            {imagePreviewUrl ? (
              <Image src={imagePreviewUrl} alt={item.name} className="admin-img-preview" width={80} height={80} style={{ objectFit: "contain" }} />
            ) : (
              <div className="admin-edit-form__preview-empty">No image set</div>
            )}
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
          </div>
          <div className="field"><label htmlFor="shopsInput">Shops (comma-separated)</label><input id="shopsInput" name="shopsInput" type="text" defaultValue={item.shops.join(", ")} placeholder="human,orc,undead,night-elf" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={item.description} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Save Item</button>
          </div>
        </section>
      </form>
    </div>
  );
}
