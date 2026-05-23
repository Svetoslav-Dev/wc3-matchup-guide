import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuildings } from "../../../lib/content";
import { deleteBuildingAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

const RACES = ["Human", "Orc", "Undead", "Night Elf", "Neutral"] as const;

type Props = { searchParams?: Promise<{ q?: string; race?: string }> };

export default async function AdminBuildingsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, race } = (await searchParams) ?? {};
  const activeRace = RACES.find((r) => r.toLowerCase() === race?.toLowerCase());
  const records = hasDatabaseUrl() ? await listAdminBuildings(9999, q, activeRace?.toLowerCase().replace(" ", "-")) : [];

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Buildings</p>
          <h1 className="page-title">All Buildings</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/buildings/new" className="button button--ghost button--sm">+ New Building</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <form className="admin-toolbar__search" method="get">
          {activeRace ? <input type="hidden" name="race" value={race} /> : null}
          <input
            className="admin-toolbar__input"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search buildings by name…"
            autoComplete="off"
          />
          <button className="button button--ghost button--sm" type="submit">Search</button>
        </form>
        <div className="admin-toolbar__filters">
          <Link
            href={q ? `/admin/buildings?q=${encodeURIComponent(q)}` : "/admin/buildings"}
            className={`filter-chip${!activeRace ? " filter-chip--active" : ""}`}
          >
            All
          </Link>
          {RACES.map((r) => {
            const slug = r.toLowerCase().replace(" ", "-");
            const href = q ? `/admin/buildings?q=${encodeURIComponent(q)}&race=${slug}` : `/admin/buildings?race=${slug}`;
            return (
              <Link
                key={r}
                href={href}
                className={`filter-chip${activeRace === r ? " filter-chip--active" : ""}`}
              >
                {r}
              </Link>
            );
          })}
        </div>
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
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
              <Link href={`/admin/buildings/${building.id}/edit`} className="button button--edit button--sm">Edit</Link>
              <ConfirmDelete action={deleteBuildingAction} itemName={building.name} hiddenFields={{ buildingId: String(building.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
