import { BuildsClient } from "../../components/builds-client";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../lib/auth";
import { listBuilds, listFavoriteBuildsForUser } from "../../lib/content";

type Props = {
  searchParams?: Promise<{
    race?: string;
    matchup?: string;
    search?: string;
    page?: string;
    difficulty?: string;
  }>;
};

export default async function BuildsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const page = params.page ? Number.parseInt(params.page, 10) : 1;

  // Start session lookup immediately; chain favorites off it so it starts
  // as soon as the session resolves rather than waiting for builds too.
  const sessionUserPromise = getSessionUser();
  const favoritesPromise = sessionUserPromise.then((user) =>
    user && hasDatabaseUrl()
      ? listFavoriteBuildsForUser(user.id).then((favs) => favs.map((f) => f.build.slug))
      : Promise.resolve([] as string[]),
  );

  const [result, favoriteSlugs, sessionUser] = await Promise.all([
    listBuilds({ race: params.race, matchup: params.matchup, search: params.search, difficulty: params.difficulty, page, pageSize: 20 }),
    favoritesPromise,
    sessionUserPromise,
  ]);

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
      <BuildsClient
        initialResult={result}
        initialRace={params.race}
        initialDifficulty={params.difficulty}
        initialSearch={params.search}
        favoriteSlugs={favoriteSlugs}
        isLoggedIn={!!sessionUser}
      />
    </div>
  );
}
