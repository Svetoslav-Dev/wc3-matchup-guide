import Link from "next/link";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuilds } from "../../../lib/content";
import { deleteBuildAction } from "../actions";
import { GameImage } from "../../../components/game-image";
import { ConfirmDelete } from "../../../components/confirm-delete";

const RACES = [
  { label: "Human",     slug: "human" },
  { label: "Orc",       slug: "orc" },
  { label: "Undead",    slug: "undead" },
  { label: "Night Elf", slug: "night-elf" },
] as const;

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const;

const RACE_ICONS: Record<string, string> = {
  human:      "/images/Races/Humans_Icon.png",
  orc:        "/images/Races/Orcs_Icon.png",
  undead:     "/images/Races/Undead_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:      "#4ade80",
  Medium:    "#facc15",
  Hard:      "#f97316",
  "Very Hard": "#ef4444",
};

type Props = { searchParams?: Promise<{ q?: string; race?: string; difficulty?: string }> };

const LIMIT = 200;

export default async function AdminBuildsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, race, difficulty } = (await searchParams) ?? {};

  const activeRace = RACES.find((r) => r.slug === race);
  const activeDifficulty = DIFFICULTIES.find((d) => d.toLowerCase().replace(" ", "-") === difficulty?.toLowerCase().replace(" ", "-"));

  const records = hasDatabaseUrl()
    ? await listAdminBuilds(LIMIT, q, activeRace?.slug, activeDifficulty)
    : [];

  const buildFilterHref = (params: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    if (params.q ?? q) qs.set("q", params.q ?? q ?? "");
    if (params.race !== undefined ? params.race : race) qs.set("race", params.race !== undefined ? params.race : race!);
    if (params.difficulty !== undefined ? params.difficulty : difficulty) qs.set("difficulty", params.difficulty !== undefined ? params.difficulty : difficulty!);
    const str = qs.toString();
    return str ? `/admin/builds?${str}` : "/admin/builds";
  };

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">God Panel · Builds</p>
          <h1 className="page-title">All Builds</h1>
        </div>
        <div className="admin-page-head__actions">
          <Link href="/admin" className="button button--ghost button--sm">← Back</Link>
          <Link href="/admin/builds/new" className="button button--ghost button--sm">+ New Build</Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <form className="admin-toolbar__search" method="get">
          {activeRace     ? <input type="hidden" name="race"       value={activeRace.slug} /> : null}
          {activeDifficulty ? <input type="hidden" name="difficulty" value={activeDifficulty.toLowerCase().replace(" ", "-")} /> : null}
          <input
            className="admin-toolbar__input"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search builds by title…"
            autoComplete="off"
          />
          <button className="button button--ghost button--sm" type="submit">Search</button>
        </form>

        <div className="admin-toolbar__filters">
          <Link href={buildFilterHref({ race: undefined })} className={`filter-chip${!activeRace ? " filter-chip--active" : ""}`}>All races</Link>
          {RACES.map((r) => (
            <Link
              key={r.slug}
              href={buildFilterHref({ race: r.slug })}
              className={`filter-chip${activeRace?.slug === r.slug ? " filter-chip--active" : ""}`}
            >
              <GameImage src={RACE_ICONS[r.slug] ?? null} alt={r.label} className="admin-filter-icon" width={16} height={16} />
              {r.label}
            </Link>
          ))}
        </div>

        <div className="admin-toolbar__filters">
          <Link href={buildFilterHref({ difficulty: undefined })} className={`filter-chip${!activeDifficulty ? " filter-chip--active" : ""}`}>All difficulties</Link>
          {DIFFICULTIES.map((d) => {
            const dslug = d.toLowerCase().replace(" ", "-");
            const color = DIFFICULTY_COLORS[d];
            const isActive = activeDifficulty === d;
            return (
              <Link
                key={d}
                href={buildFilterHref({ difficulty: dslug })}
                className={`filter-chip${isActive ? " filter-chip--active" : ""}`}
                style={isActive ? { borderColor: color, color, background: `${color}18` } : { borderColor: `${color}55`, color }}
              >
                <span className="filter-chip__dot" style={{ backgroundColor: color }} />
                {d}
              </Link>
            );
          })}
        </div>

        <p className="admin-toolbar__count">
          {records.length === LIMIT ? `${LIMIT}+ results (use filters to narrow)` : `${records.length} result${records.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="admin-list">
        {records.map((build) => (
          <article key={build.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              <GameImage
                src={RACE_ICONS[build.raceSlug] ?? null}
                alt={build.raceName}
                width={40}
                height={40}
                className="admin-build-race-icon"
              />
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{build.title}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{build.raceName}</span>
                <span
                  className="admin-difficulty-badge"
                  style={{ color: DIFFICULTY_COLORS[build.difficulty] ?? "var(--color-muted)", borderColor: `${DIFFICULTY_COLORS[build.difficulty] ?? "var(--color-line)"}55`, background: `${DIFFICULTY_COLORS[build.difficulty] ?? "transparent"}12` }}
                >
                  {build.difficulty}
                </span>
                <span className="muted" style={{ fontSize: "0.78rem" }}>{build.strategyType}</span>
                {!build.isPublished && <span className="pill pill--draft">Draft</span>}
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/builds/${build.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/builds/${build.slug}`} className="button button--view button--sm">View</Link>
              <ConfirmDelete action={deleteBuildAction} itemName={build.title} hiddenFields={{ buildId: String(build.id) }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
