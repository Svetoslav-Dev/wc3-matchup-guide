import Link from "next/link";
import { AdminSearchInput } from "../../../components/admin-search-input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminRaces } from "../../../lib/content";
import { deleteRaceAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

type Props = { searchParams?: Promise<{ q?: string; status?: string; error?: string }> };

export default async function AdminRacesPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, status, error } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminRaces(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Races</p>
          <h1 className="page-title">All Races</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/races/new" className="button button--ghost button--sm">+ New Race</Link>
        </div>
      </div>

      {status === "race-deleted" && (
        <div className="status-banner status-banner--success">Successfully deleted race.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}

      <div className="admin-toolbar">
        <AdminSearchInput placeholder="Search races by name…" />
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
        {records.map((race) => (
          <article key={race.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              {race.imageUrl ? (
                <Image src={race.imageUrl} alt={race.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{race.name}</p>
              <span className="muted" style={{ fontSize: "0.78rem" }}>{race.slug}</span>
            </div>
            <div className="inline-actions" style={{ flexWrap: "nowrap", alignItems: "center" }}>
              {race.slug === "neutral" && (
                <span className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>Tavern/mercenary placeholder — do not delete.</span>
              )}
              <Link href={`/admin/races/${race.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/races/${race.slug}`} className="button button--view button--sm">View</Link>
              {race.slug !== "neutral" && (
                <ConfirmDelete action={deleteRaceAction} itemName={race.name} hiddenFields={{ raceId: String(race.id) }} />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
