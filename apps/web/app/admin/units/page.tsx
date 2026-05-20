import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminUnits } from "../../../lib/content";
import { deleteUnitAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminUnitsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminUnits(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Units</p>
        <h1 className="page-title">All Units</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/units/new" className="button button--ghost">New Unit</Link>
      </div>
      <form className="admin-search" method="get">
        <input className="admin-search__input" name="q" defaultValue={q ?? ""} placeholder="Search by name…" autoComplete="off" />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/units" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((unit) => (
          <article key={unit.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              {unit.imageUrl ? (
                <Image src={unit.imageUrl} alt={unit.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{unit.name}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{unit.raceName}</span>
                <span className="muted">{unit.unitType}</span>
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/units/${unit.slug}/edit`} className="button button--edit">Edit</Link>
              <Link href={`/units/${unit.slug}`} className="button button--view">View</Link>
              <form action={deleteUnitAction}>
                <input type="hidden" name="unitId" value={String(unit.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
