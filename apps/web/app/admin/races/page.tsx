import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminRaces } from "../../../lib/content";
import { deleteRaceAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminRacesPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminRaces(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Races</p>
        <h1 className="page-title">All Races</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/races/new" className="button button--ghost">New Race</Link>
      </div>
      <form className="admin-search" method="get">
        <input className="admin-search__input" name="q" defaultValue={q ?? ""} placeholder="Search by name…" autoComplete="off" />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/races" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((race) => (
          <article key={race.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              {race.imageUrl ? (
                <Image src={race.imageUrl} alt={race.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{race.name}</p>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/races/${race.slug}/edit`} className="button button--edit">Edit</Link>
              <Link href={`/races/${race.slug}`} className="button button--view">View</Link>
              <form action={deleteRaceAction}>
                <input type="hidden" name="raceId" value={String(race.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
