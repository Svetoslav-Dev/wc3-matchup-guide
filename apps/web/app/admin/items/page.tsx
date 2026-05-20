import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminItems } from "../../../lib/content";
import { deleteItemAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminItemsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminItems(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Items</p>
        <h1 className="page-title">All Items</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/items/new" className="button button--ghost">New Item</Link>
      </div>
      <form className="admin-search" method="get">
        <input className="admin-search__input" name="q" defaultValue={q ?? ""} placeholder="Search by name…" autoComplete="off" />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/items" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((item) => (
          <article key={item.id} className="admin-list-row">
            <div className="admin-list-row__img">
              {item.imageFile ? (
                <Image src={`/images/Items/${item.imageFile}.png`} alt={item.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{item.name}</p>
              <span className="muted">{item.category}</span>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/items/${item.id}/edit`} className="button button--edit">Edit</Link>
              <form action={deleteItemAction}>
                <input type="hidden" name="itemId" value={String(item.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
