import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import Link from "next/link";
import { DifficultyBadge } from "../../components/difficulty-badge";
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
  listAdminBuildings,
  listAdminBuilds,
  listAdminHeroes,
  listAdminItems,
  listAdminMaps,
  listAdminMatchups,
  listAdminRaces,
  listAdminUnits,
} from "../../lib/content";
import { deleteBuildingAction, deleteItemAction } from "./actions";
import { ConfirmDelete } from "../../components/confirm-delete";

const RECENT_LIMIT = 6;

const statusMessages: Record<string, string> = {
  "build-deleted":    "Build deleted.",
  "hero-deleted":     "Hero deleted.",
  "map-deleted":      "Map deleted.",
  "matchup-deleted":  "Matchup deleted.",
  "race-deleted":     "Race deleted.",
  "unit-deleted":     "Unit deleted.",
  "building-deleted": "Building deleted.",
  "item-deleted":     "Item deleted.",
};

const buildingViewHref = (race: string) => `/buildings?race=${race}`;

const itemViewHref = (shops: string[], category: string) => {
  const preferredShop = shops.find((shop) =>
    ["human", "orc", "undead", "night-elf", "goblin-merchant", "creep-drop", "tome"].includes(shop),
  );

  if (preferredShop) {
    return `/items?tab=${preferredShop}`;
  }

  return category === "tome" ? "/items?tab=tome" : "/items";
};

type Props = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">God Panel</p>
          <h1 className="page-title">Admin tools require full backend configuration.</h1>
          <p className="page-intro">Set both <code>DATABASE_URL</code> and <code>JWT_SECRET</code>, then run migrations and seed data.</p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">God Panel</p>
          <h1 className="page-title">Sign in as an admin to manage content.</h1>
        </div>
      </div>
    );
  }
  if (user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">God Panel</p>
          <h1 className="page-title">This account does not have admin access.</h1>
        </div>
      </div>
    );
  }

  const params = (await searchParams) ?? {};
  const [stats, buildRecords, matchupRecords, heroRecords, unitRecords, mapRecords, raceRecords, buildingRecords, itemRecords] =
    await Promise.all([
      getHomeStats(),
      listAdminBuilds(RECENT_LIMIT),
      listAdminMatchups(RECENT_LIMIT),
      listAdminHeroes(RECENT_LIMIT),
      listAdminUnits(RECENT_LIMIT),
      listAdminMaps(RECENT_LIMIT),
      listAdminRaces(RECENT_LIMIT),
      listAdminBuildings(RECENT_LIMIT),
      listAdminItems(RECENT_LIMIT),
    ]);

  const statusMessage = params.status ? statusMessages[params.status] : undefined;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <h1 className="page-title admin-chosen-title">You have the power</h1>
      </div>

      {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}

      {/* ── Content management table ── */}
      <div className="admin-mgmt-list">
        {[
          { label: "Build Orders", count: stats.buildTotal,    viewAll: "/admin/builds",    newHref: "/admin/builds/new" },
          { label: "Matchups",   count: stats.matchupTotal,  viewAll: "/admin/matchups",  newHref: "/admin/matchups/new" },
          { label: "Heroes",     count: stats.heroTotal,     viewAll: "/admin/heroes",    newHref: "/admin/heroes/new" },
          { label: "Units",      count: stats.unitTotal,     viewAll: "/admin/units",     newHref: "/admin/units/new" },
          { label: "Maps",       count: stats.mapTotal,      viewAll: "/admin/maps",      newHref: "/admin/maps/new" },
          { label: "Races",      count: stats.raceTotal,     viewAll: "/admin/races",     newHref: "/admin/races/new" },
          { label: "Buildings",  count: stats.buildingTotal, viewAll: "/admin/buildings", newHref: "/admin/buildings/new" },
          { label: "Items",      count: stats.itemTotal,     viewAll: "/admin/items",     newHref: "/admin/items/new" },
        ].map(({ label, count, viewAll, newHref }) => (
          <div key={label} className="admin-mgmt-row">
            <span className="admin-mgmt-row__label">{label}</span>
            <span className="admin-mgmt-row__count">{count}</span>
            <div className="inline-actions">
              <Link href={viewAll} className="button button--ghost admin-view-btn">View All</Link>
              <Link href={newHref} className="button button--ghost">+ New</Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent records ── */}
      <div className="admin-recent-grid">

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Builds</p>
            <Link href="/admin/builds" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {buildRecords.map((build) => (
            <div key={build.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{build.title}</p>
                <div className="admin-card-meta">
                  <span className="pill pill--race">{build.raceName}</span>
                  <DifficultyBadge value={build.difficulty} />
                  <span className="muted">{build.isPublished ? "Published" : "Draft"}</span>
                </div>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/builds/${build.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/builds/${build.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteBuildAction} itemName={build.title} hiddenFields={{ buildId: String(build.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Matchups</p>
            <Link href="/admin/matchups" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {matchupRecords.map((matchup) => (
            <div key={matchup.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{matchup.title}</p>
                <div className="admin-card-meta">
                  <DifficultyBadge value={matchup.difficulty} />
                  <span className="muted">{matchup.raceASlug} vs {matchup.raceBSlug}</span>
                </div>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/matchups/${matchup.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/matchups/${matchup.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteMatchupAction} itemName={matchup.title} hiddenFields={{ matchupId: String(matchup.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Heroes</p>
            <Link href="/admin/heroes" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {heroRecords.map((hero) => (
            <div key={hero.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{hero.name}</p>
                <div className="admin-card-meta">
                  <span className="pill pill--race">{hero.raceName}</span>
                  <span className="muted">{hero.role}</span>
                </div>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/heroes/${hero.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/heroes/${hero.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteHeroAction} itemName={hero.name} hiddenFields={{ heroId: String(hero.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Units</p>
            <Link href="/admin/units" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {unitRecords.map((unit) => (
            <div key={unit.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{unit.name}</p>
                <div className="admin-card-meta">
                  <span className="pill pill--race">{unit.raceName}</span>
                  <span className="muted">{unit.unitType}</span>
                </div>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/units/${unit.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/units/${unit.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteUnitAction} itemName={unit.name} hiddenFields={{ unitId: String(unit.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Maps</p>
            <Link href="/admin/maps" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {mapRecords.map((map) => (
            <div key={map.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{map.name}</p>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/maps/${map.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/maps/${map.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteMapAction} itemName={map.name} hiddenFields={{ mapId: String(map.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Races</p>
            <Link href="/admin/races" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {raceRecords.map((race) => (
            <div key={race.slug} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{race.name}</p>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/races/${race.slug}/edit`} className="button button--edit">Edit</Link>
                <Link href={`/races/${race.slug}`} className="button button--view">View</Link>
                <ConfirmDelete action={deleteRaceAction} itemName={race.name} hiddenFields={{ raceId: String(race.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Buildings</p>
            <Link href="/admin/buildings" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {buildingRecords.map((building) => (
            <div key={building.id} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{building.name}</p>
                <span className="pill pill--race">{building.race}</span>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/buildings/${building.id}/edit`} className="button button--edit">Edit</Link>
                <Link href={buildingViewHref(building.race)} className="button button--view">View</Link>
                <ConfirmDelete action={deleteBuildingAction} itemName={building.name} hiddenFields={{ buildingId: String(building.id) }} />
              </div>
            </div>
          ))}
        </section>

        <section className="admin-recent-panel">
          <div className="admin-recent-panel__head">
            <p className="section-label">Items</p>
            <Link href="/admin/items" className="muted" style={{ fontSize: "0.8rem" }}>See all →</Link>
          </div>
          {itemRecords.map((item) => (
            <div key={item.id} className="admin-row">
              <div className="admin-row__info">
                <p className="admin-row__title">{item.name}</p>
                <span className="muted">{item.category}</span>
              </div>
              <div className="inline-actions">
                <Link href={`/admin/items/${item.id}/edit`} className="button button--edit">Edit</Link>
                <Link href={itemViewHref(item.shops, item.category)} className="button button--view">View</Link>
                <ConfirmDelete action={deleteItemAction} itemName={item.name} hiddenFields={{ itemId: String(item.id) }} />
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
