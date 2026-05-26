import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { NewItemForm } from "../../../../components/new-item-form";

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
      <NewItemForm />
    </div>
  );
}
