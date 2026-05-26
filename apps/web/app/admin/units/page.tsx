import Link from "next/link";
import { AdminSearchInput } from "../../../components/admin-search-input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminUnits } from "../../../lib/content";
import { deleteUnitAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminUnitsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminUnits(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Units</p>
          <h1 className="page-title">All Units</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/units/new" className="button button--ghost button--sm">+ New Unit</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <AdminSearchInput placeholder="Search units by name…" />
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
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
                <span className="muted" style={{ fontSize: "0.78rem" }}>{unit.unitType}</span>
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/units/${unit.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/units/${unit.slug}`} className="button button--view button--sm">View</Link>
              <ConfirmDelete action={deleteUnitAction} itemName={unit.name} hiddenFields={{ unitId: String(unit.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
