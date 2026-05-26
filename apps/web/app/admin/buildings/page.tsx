import Link from "next/link";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { AdminSearchInput } from "../../../components/admin-search-input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuildings } from "../../../lib/content";
import { deleteBuildingAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

async function buildImageIndex(): Promise<Map<string, string>> {
  const dirs = [join(process.cwd(), "public"), join(process.cwd(), "apps", "web", "public")];
  for (const base of dirs) {
    try {
      const files = await readdir(join(base, "images", "Buildings"));
      const map = new Map<string, string>();
      for (const f of files) map.set(f.replace(/\.[^.]+$/, ""), f);
      return map;
    } catch { /* try next */ }
  }
  return new Map();
}

const RACES = ["Human", "Orc", "Undead", "Night Elf", "Neutral"] as const;

type Props = { searchParams?: Promise<{ q?: string; race?: string }> };

export default async function AdminBuildingsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, race } = (await searchParams) ?? {};
  const activeRace = RACES.find((r) => r.toLowerCase() === race?.toLowerCase());
  const [records, imageIndex] = await Promise.all([
    hasDatabaseUrl() ? listAdminBuildings(9999, q, activeRace?.toLowerCase().replace(" ", "-")) : Promise.resolve([]),
    buildImageIndex(),
  ]);

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
        <AdminSearchInput placeholder="Search buildings by name…" />
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
              {(() => {
                const base = building.imageFile.replace(/\.[^.]+$/, "");
                const filename = building.imageFile.includes(".") ? building.imageFile : (imageIndex.get(base) ?? `${base}.png`);
                return building.imageFile ? (
                  <Image src={`/images/Buildings/${filename}`} alt={building.name} width={48} height={48} style={{ objectFit: "contain" }} />
                ) : <div className="admin-list-row__img-placeholder" />;
              })()}
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
