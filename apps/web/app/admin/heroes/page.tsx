import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminHeroes } from "../../../lib/content";
import { deleteHeroAction } from "../actions";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminHeroesPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q } = (await searchParams) ?? {};
  const records = hasDatabaseUrl() ? await listAdminHeroes(9999, q) : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">God Panel · Heroes</p>
        <h1 className="page-title">All Heroes</h1>
      </div>
      <div className="inline-actions">
        <Link href="/admin" className="button button--ghost">← Back</Link>
        <Link href="/admin/heroes/new" className="button button--ghost">New Hero</Link>
      </div>
      <form className="admin-search" method="get">
        <input className="admin-search__input" name="q" defaultValue={q ?? ""} placeholder="Search by name…" autoComplete="off" />
        <button className="button button--ghost" type="submit">Search</button>
        {q ? <Link href="/admin/heroes" className="button button--ghost">Clear</Link> : null}
      </form>
      <p className="muted">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      <div className="page-stack">
        {records.map((hero) => (
          <article key={hero.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              {hero.imageUrl ? (
                <Image src={hero.imageUrl} alt={hero.name} width={48} height={48} style={{ objectFit: "contain" }} />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{hero.name}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{hero.raceName}</span>
                <span className="muted">{hero.primaryAttribute} · {hero.role}</span>
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/heroes/${hero.slug}/edit`} className="button button--edit">Edit</Link>
              <Link href={`/heroes/${hero.slug}`} className="button button--view">View</Link>
              <form action={deleteHeroAction}>
                <input type="hidden" name="heroId" value={String(hero.id)} />
                <button className="button button--danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
