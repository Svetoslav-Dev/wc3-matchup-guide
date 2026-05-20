import { BuildFilterBar } from "../../components/build-filter-bar";
import { BuildList } from "../../components/build-list";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../lib/auth";
import { listBuilds, listFavoriteBuildsForUser } from "../../lib/content";

type Props = {
  searchParams?: Promise<{
    race?: string;
    matchup?: string;
    search?: string;
    page?: string;
  }>;
};

export default async function BuildsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const page = params.page ? Number.parseInt(params.page, 10) : 1;
  const [result, sessionUser] = await Promise.all([
    listBuilds({ race: params.race, matchup: params.matchup, search: params.search, page, pageSize: 20 }),
    getSessionUser(),
  ]);
  const favoriteSlugs = sessionUser && hasDatabaseUrl()
    ? (await listFavoriteBuildsForUser(sessionUser.id)).map((f) => f.build.slug)
    : [];

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Build Orders</p>
        <h1 className="page-title">Openings that survive real pressure.</h1>
        <p className="page-intro">
          Build orders are framed around matchup purpose, execution pace, and transition logic so they
          read like plans instead of raw lists.
        </p>
      </div>
      <BuildFilterBar activeRace={params.race} activeMatchup={params.matchup} />
      <BuildList
        key={`${params.race ?? ""}-${params.matchup ?? ""}-${params.search ?? ""}`}
        initialResult={result}
        race={params.race}
        matchup={params.matchup}
        search={params.search}
        favoriteSlugs={favoriteSlugs}
      />
    </div>
  );
}
