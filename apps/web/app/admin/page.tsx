import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import Link from "next/link";
import {
  deleteBuildAction,
  deleteHeroAction,
  deleteMapAction,
  deleteMatchupAction,
  deleteRaceAction,
  deleteUnitAction,
} from "./actions";
import { getSessionUser } from "../../lib/auth";
import {
  getHomeStats,
  listAdminBuilds,
  listAdminHeroes,
  listAdminMaps,
  listAdminMatchups,
  listAdminRaces,
  listAdminUnits,
} from "../../lib/content";

const adminSections = [
  {
    title: "Content Pipeline",
    description: "Admin-only REST endpoints now exist for creating, updating, and deleting builds and matchups.",
  },
  {
    title: "Data Integrity",
    description: "Server-side validation covers build steps, matchup structure, publication state, and slug-based relations.",
  },
  {
    title: "Seed Operations",
    description: "The seeded admin account can manage content once the database and JWT secret are configured.",
  },
  {
    title: "Role Controls",
    description: "Session checks now distinguish signed-out users, regular users, and admins at the server boundary.",
  },
];

const statusMessages: Record<string, string> = {
  "build-deleted": "Build deleted.",
  "hero-deleted": "Hero deleted.",
  "map-deleted": "Map deleted.",
  "matchup-deleted": "Matchup deleted.",
  "race-deleted": "Race deleted.",
  "unit-deleted": "Unit deleted.",
};

type Props = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Panel</p>
          <h1 className="page-title">Admin tools require full backend configuration.</h1>
          <p className="page-intro">
            Set both <code>DATABASE_URL</code> and <code>JWT_SECRET</code>, then run migrations and seed data to use protected admin endpoints.
          </p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Panel</p>
          <h1 className="page-title">Sign in as an admin to manage content.</h1>
          <p className="page-intro">
            This page mirrors the server-side admin guard used by the new <code>/api/admin/*</code> endpoints.
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Panel</p>
          <h1 className="page-title">This account does not have admin access.</h1>
          <p className="page-intro">
            Role-based access is now enforced server-side. Use the seeded admin account or an elevated user record to reach content management APIs.
          </p>
        </div>
      </div>
    );
  }

  const params = (await searchParams) ?? {};
  const [stats, buildRecords, matchupRecords, heroRecords, unitRecords, mapRecords, raceRecords] = await Promise.all([
    getHomeStats(),
    listAdminBuilds(8),
    listAdminMatchups(8),
    listAdminHeroes(8),
    listAdminUnits(8),
    listAdminMaps(8),
    listAdminRaces(8),
  ]);
  const statusMessage = params.status ? statusMessages[params.status] : undefined;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Admin Panel</p>
        <h1 className="page-title">Manage strategy content without losing structure.</h1>
        <p className="page-intro">
          Signed in as <strong>{user.username}</strong>. The API layer now supports protected build and matchup mutations under <code>/api/admin</code>.
        </p>
      </div>
      {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
      <div className="stat-grid">
        <article className="stat-card">
          <strong>{stats.buildTotal}</strong>
          <span className="muted">build records available to publish, edit, or remove</span>
        </article>
        <article className="stat-card">
          <strong>{stats.matchupTotal}</strong>
          <span className="muted">matchup guides currently tracked by the content system</span>
        </article>
        <article className="stat-card">
          <strong>{stats.raceTotal}</strong>
          <span className="muted">races available for relation validation in admin mutations</span>
        </article>
        <article className="stat-card">
          <strong>{stats.heroTotal}</strong>
          <span className="muted">hero records available as surrounding strategy reference data</span>
        </article>
        <article className="stat-card">
          <strong>{stats.unitTotal}</strong>
          <span className="muted">unit records available for counter and composition coverage</span>
        </article>
        <article className="stat-card">
          <strong>{stats.mapTotal}</strong>
          <span className="muted">maps tracked with creep and expansion notes</span>
        </article>
      </div>
      <div className="inline-actions">
        <Link href="/admin/builds/new" className="button">
          New Build
        </Link>
        <Link href="/admin/matchups/new" className="button button--ghost">
          New Matchup
        </Link>
        <Link href="/admin/heroes/new" className="button button--ghost">
          New Hero
        </Link>
        <Link href="/admin/units/new" className="button button--ghost">
          New Unit
        </Link>
        <Link href="/admin/maps/new" className="button button--ghost">
          New Map
        </Link>
        <Link href="/admin/races/new" className="button button--ghost">
          New Race
        </Link>
      </div>
      <div className="admin-grid">
        {adminSections.map((section) => (
          <article key={section.title} className="admin-card">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </article>
        ))}
      </div>
      <div className="detail-grid">
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Build Records</p>
            <h2>Recent and editable builds</h2>
          </div>
          <div className="page-stack">
            {buildRecords.map((build) => (
              <article key={build.slug} className="admin-card">
                <h3>{build.title}</h3>
                <p>{build.raceName} · {build.difficulty} · {build.strategyType}</p>
                <p className="muted">{build.isPublished ? "Published" : "Draft"}</p>
                <div className="inline-actions">
                  <Link href={`/admin/builds/${build.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/builds/${build.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteBuildAction}>
                    <input type="hidden" name="buildId" value={String(build.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Matchup Records</p>
            <h2>Recent and editable matchups</h2>
          </div>
          <div className="page-stack">
            {matchupRecords.map((matchup) => (
              <article key={matchup.slug} className="admin-card">
                <h3>{matchup.title}</h3>
                <p>{matchup.difficulty}</p>
                <p className="muted">{matchup.raceASlug} vs {matchup.raceBSlug}</p>
                <div className="inline-actions">
                  <Link href={`/admin/matchups/${matchup.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteMatchupAction}>
                    <input type="hidden" name="matchupId" value={String(matchup.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Race Records</p>
            <h2>Recent and editable races</h2>
          </div>
          <div className="page-stack">
            {raceRecords.map((race) => (
              <article key={race.slug} className="admin-card">
                <h3>{race.name}</h3>
                <div className="inline-actions">
                  <Link href={`/admin/races/${race.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/races/${race.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteRaceAction}>
                    <input type="hidden" name="raceId" value={String(race.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Hero Records</p>
            <h2>Recent and editable heroes</h2>
          </div>
          <div className="page-stack">
            {heroRecords.map((hero) => (
              <article key={hero.slug} className="admin-card">
                <h3>{hero.name}</h3>
                <p>{hero.raceName} · {hero.primaryAttribute} · {hero.role}</p>
                <div className="inline-actions">
                  <Link href={`/admin/heroes/${hero.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/heroes/${hero.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteHeroAction}>
                    <input type="hidden" name="heroId" value={String(hero.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Unit Records</p>
            <h2>Recent and editable units</h2>
          </div>
          <div className="page-stack">
            {unitRecords.map((unit) => (
              <article key={unit.slug} className="admin-card">
                <h3>{unit.name}</h3>
                <p>{unit.raceName} · {unit.unitType}</p>
                <div className="inline-actions">
                  <Link href={`/admin/units/${unit.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/units/${unit.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteUnitAction}>
                    <input type="hidden" name="unitId" value={String(unit.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <div className="section-head">
            <p className="section-label">Map Records</p>
            <h2>Recent and editable maps</h2>
          </div>
          <div className="page-stack">
            {mapRecords.map((map) => (
              <article key={map.slug} className="admin-card">
                <h3>{map.name}</h3>
                <div className="inline-actions">
                  <Link href={`/admin/maps/${map.slug}/edit`} className="button button--ghost">
                    Edit
                  </Link>
                  <Link href={`/maps/${map.slug}`} className="button button--ghost">
                    View
                  </Link>
                  <form action={deleteMapAction}>
                    <input type="hidden" name="mapId" value={String(map.id)} />
                    <button className="button button--ghost" type="submit">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
