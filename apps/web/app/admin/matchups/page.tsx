import Link from "next/link";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminMatchups } from "../../../lib/content";
import { deleteMatchupAction } from "../actions";
import { DifficultyBadge } from "../../../components/difficulty-badge";
import { ConfirmDelete } from "../../../components/confirm-delete";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminMatchupsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminMatchups(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Matchups</p>
          <h1 className="page-title">All Matchups</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/matchups/new" className="button button--ghost button--sm">+ New Matchup</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <form className="admin-toolbar__search" method="get">
          <input className="admin-toolbar__input" name="q" defaultValue={q ?? ""} placeholder="Search matchups by title…" autoComplete="off" />
          <button className="button button--ghost button--sm" type="submit">Search</button>
        </form>
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
        {records.map((matchup) => (
          <article key={matchup.slug} className="admin-list-row">
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{matchup.title}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{matchup.raceASlug}</span>
                <span className="muted" style={{ fontSize: "0.78rem" }}>vs</span>
                <span className="pill pill--race">{matchup.raceBSlug}</span>
                <DifficultyBadge value={matchup.difficulty} />
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/matchups/${matchup.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/matchups/${matchup.slug}`} className="button button--view button--sm">View</Link>
              <ConfirmDelete action={deleteMatchupAction} itemName={matchup.title} hiddenFields={{ matchupId: String(matchup.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
