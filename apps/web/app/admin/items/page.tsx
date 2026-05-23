import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminItems } from "../../../lib/content";
import { deleteItemAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminItemsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminItems(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Items</p>
          <h1 className="page-title">All Items</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/items/new" className="button button--ghost button--sm">+ New Item</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <form className="admin-toolbar__search" method="get">
          <input className="admin-toolbar__input" name="q" defaultValue={q ?? ""} placeholder="Search items by name…" autoComplete="off" />
          <button className="button button--ghost button--sm" type="submit">Search</button>
        </form>
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
        {records.map((item) => (
          <article key={item.id} className="admin-list-row">
            <div className="admin-list-row__img">
              {item.imageFile ? (
                <Image src={`/images/Items/${item.imageFile}.png`} alt={item.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{item.name}</p>
              <span className="muted" style={{ fontSize: "0.78rem" }}>{item.category}</span>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/items/${item.id}/edit`} className="button button--edit button--sm">Edit</Link>
              <ConfirmDelete action={deleteItemAction} itemName={item.name} hiddenFields={{ itemId: String(item.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
