import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuildings } from "../../../lib/content";
import { deleteBuildingAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminBuildingsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminBuildings(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Buildings</p>
        <h1 className="page-title">All Buildings</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/buildings/new" className="button button--ghost">New Building</Link>
      </div>
      <form className="admin-search" method="get">
        <input className="admin-search__input" name="q" defaultValue={q ?? ""} placeholder="Search by name…" autoComplete="off" />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/buildings" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((building) => (
          <article key={building.id} className="admin-list-row">
            <div className="admin-list-row__img">
              {building.imageFile ? (
                <Image src={`/images/Buildings/${building.imageFile}.png`} alt={building.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{building.name}</p>
              <span className="pill pill--race">{building.race}</span>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/buildings/${building.id}/edit`} className="button button--edit">Edit</Link>
              <form action={deleteBuildingAction}>
                <input type="hidden" name="buildingId" value={String(building.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
