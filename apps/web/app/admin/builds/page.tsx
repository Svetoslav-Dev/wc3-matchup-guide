import Link from "next/link";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuilds } from "../../../lib/content";
import { deleteBuildAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminBuildsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminBuilds(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Builds</p>
        <h1 className="page-title">All Builds</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/builds/new" className="button button--ghost">New Build</Link>
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
        {q ? <Link href="/admin/builds" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((build) => (
          <article key={build.slug} className="admin-card">
            <h3>{build.title}</h3>
            <p>{build.raceName} · {build.difficulty} · {build.strategyType}</p>
            <p className="muted">{build.isPublished ? "Published" : "Draft"}</p>
            <div className="inline-actions">
              <Link href={`/admin/builds/${build.slug}/edit`} className="button button--edit">Edit</Link>
              <Link href={`/builds/${build.slug}`} className="button button--view">View</Link>
              <form action={deleteBuildAction}>
                <input type="hidden" name="buildId" value={String(build.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
