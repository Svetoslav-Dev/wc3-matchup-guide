import Link from "next/link";
import { AdminSearchInput } from "../../../components/admin-search-input";
import { AdminPerPageSelect } from "../../../components/admin-per-page-select";
import { AdminBuildsList } from "../../../components/admin-builds-list";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listAdminBuilds } from "../../../lib/content";
import { deleteBuildAction } from "../actions";
import { GameImage } from "../../../components/game-image";

const RACES = [
  { label: "Human",     slug: "human" },
  { label: "Orc",       slug: "orc" },
  { label: "Undead",    slug: "undead" },
  { label: "Night Elf", slug: "night-elf" },
] as const;

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const;

const RACE_ICONS: Record<string, string> = {
  human:       "/images/Races/Humans_Icon.png",
  orc:         "/images/Races/Orcs_Icon.png",
  undead:      "/images/Races/Undead_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:        "#4ade80",
  Medium:      "#facc15",
  Hard:        "#f97316",
  "Very Hard": "#ef4444",
};

type Props = { searchParams?: Promise<{ q?: string; race?: string; difficulty?: string; perPage?: string }> };

export default async function AdminBuildsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin");

  const { q, race, difficulty, perPage: perPageParam } = (await searchParams) ?? {};

  const perPage = Math.min(100, Math.max(20, Number(perPageParam) || 20));

  const activeRace = RACES.find((r) => r.slug === race);
  const activeDifficulty = DIFFICULTIES.find((d) => d.toLowerCase().replace(" ", "-") === difficulty?.toLowerCase().replace(" ", "-"));

  const records = hasDatabaseUrl()
    ? await listAdminBuilds(perPage + 1, q, activeRace?.slug, activeDifficulty)
    : [];

  const hasMore = records.length > perPage;
  const visible = records.slice(0, perPage);

  const buildFilterHref = (params: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    if (params.q ?? q) qs.set("q", params.q ?? q ?? "");
    if (params.race !== undefined ? params.race : race) qs.set("race", params.race !== undefined ? params.race : race!);
    if (params.difficulty !== undefined ? params.difficulty : difficulty) qs.set("difficulty", params.difficulty !== undefined ? params.difficulty : difficulty!);
    if (perPageParam) qs.set("perPage", perPageParam);
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
        <AdminSearchInput placeholder="Search builds by title…" />

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

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <p className="admin-toolbar__count" style={{ margin: 0, flex: 1 }}>
            Showing {visible.length}{hasMore ? "+" : ""} result{visible.length !== 1 ? "s" : ""}
          </p>
          <AdminPerPageSelect />
        </div>
      </div>

      <AdminBuildsList
        key={`${q}-${race}-${difficulty}-${perPage}`}
        initialBuilds={visible}
        initialHasMore={hasMore}
        perPage={perPage}
        q={q}
        race={race}
        difficulty={difficulty}
        deleteBuildAction={deleteBuildAction}
      />
    </div>
  );
}
