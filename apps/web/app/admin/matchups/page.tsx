import Link from "next/link";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminMatchups } from "../../../lib/content";
import { deleteMatchupAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminMatchupsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminMatchups(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Matchups</p>
        <h1 className="page-title">All Matchups</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/matchups/new" className="button button--ghost">New Matchup</Link>
      </div>
      <form className="admin-search" method="get">
        <input
          className="admin-search__input"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by title…"
          autoComplete="off"
        />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/matchups" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((matchup) => (
          <article key={matchup.slug} className="admin-card">
            <h3>{matchup.title}</h3>
            <p>{matchup.difficulty}</p>
            <p className="muted">{matchup.raceASlug} vs {matchup.raceBSlug}</p>
            <div className="inline-actions">
              <Link href={`/admin/matchups/${matchup.slug}/edit`} className="button button--edit">Edit</Link>
              <Link href={`/matchups/${matchup.slug}`} className="button button--view">View</Link>
              <form action={deleteMatchupAction}>
                <input type="hidden" name="matchupId" value={String(matchup.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
