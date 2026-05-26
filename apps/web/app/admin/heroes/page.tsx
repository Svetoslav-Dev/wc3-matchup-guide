import Link from "next/link";
import { AdminSearchInput } from "../../../components/admin-search-input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminHeroes } from "../../../lib/content";
import { deleteHeroAction } from "../actions";
import { ConfirmDelete } from "../../../components/confirm-delete";

const RACE_FILTERS = [
  { label: "Human",     slug: "human" },
  { label: "Orc",       slug: "orc" },
  { label: "Undead",    slug: "undead" },
  { label: "Night Elf", slug: "night-elf" },
  { label: "Tavern",    slug: "neutral" },
] as const;

type Props = { searchParams?: Promise<{ q?: string; race?: string }> };

export default async function AdminHeroesPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, race } = (await searchParams) ?? {};
  const activeRace = RACE_FILTERS.find((r) => r.slug === race);
  const records = hasDatabaseUrl() ? await listAdminHeroes(9999, q, activeRace?.slug) : [];

  const filterHref = (slug?: string) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (slug) qs.set("race", slug);
    const str = qs.toString();
    return str ? `/admin/heroes?${str}` : "/admin/heroes";
  };

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Heroes</p>
          <h1 className="page-title">All Heroes</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/heroes/new" className="button button--ghost button--sm">+ New Hero</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <AdminSearchInput placeholder="Search heroes by name…" />
        <div className="admin-toolbar__filters">
          <Link href={filterHref()} className={`filter-chip${!activeRace ? " filter-chip--active" : ""}`}>All</Link>
          {RACE_FILTERS.map((r) => (
            <Link key={r.slug} href={filterHref(r.slug)} className={`filter-chip${activeRace?.slug === r.slug ? " filter-chip--active" : ""}`}>
              {r.label}
            </Link>
          ))}
        </div>
        <p className="admin-toolbar__count">{records.length} result{records.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="admin-list">
        {records.map((hero) => (
          <article key={hero.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              {hero.imageUrl ? (
                <Image src={hero.imageUrl} alt={hero.name} width={48} height={48} style={{ objectFit: "contain" }} unoptimized />
              ) : <div className="admin-list-row__img-placeholder" />}
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{hero.name}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{hero.raceSlug === "neutral" ? "Tavern" : hero.raceName}</span>
                <span className="muted" style={{ fontSize: "0.78rem" }}>{hero.primaryAttribute} · {hero.role}</span>
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/heroes/${hero.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/heroes/${hero.slug}`} className="button button--view button--sm">View</Link>
              <ConfirmDelete action={deleteHeroAction} itemName={hero.name} hiddenFields={{ heroId: String(hero.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
