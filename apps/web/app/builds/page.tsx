import Link from "next/link";
import { BuildFilterBar } from "../../components/build-filter-bar";
import { BuildList } from "../../components/build-list";
import { getSessionUser } from "../../lib/auth";
import { listBuilds } from "../../lib/content";

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
    listBuilds({
      race: params.race,
      matchup: params.matchup,
      search: params.search,
      page,
      pageSize: 20,
    }),
    getSessionUser(),
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
      {sessionUser ? (
        <div className="panel panel--padded">
          <div className="section-head">
            <p className="section-label">Your Build Ideas</p>
            <h2>Submit a build for your race and manage it later.</h2>
            <p className="page-intro">
              Logged-in users can submit their own builds as drafts and remove their own submissions
              from the submission page.
            </p>
          </div>
          <div className="hero-actions">
            <Link href="/builds/submit" className="button">Submit a Build</Link>
          </div>
        </div>
      ) : null}
      <BuildFilterBar activeRace={params.race} activeMatchup={params.matchup} />
      <BuildList
        key={`${params.race ?? ""}-${params.matchup ?? ""}-${params.search ?? ""}`}
        initialResult={result}
        race={params.race}
        matchup={params.matchup}
        search={params.search}
      />
    </div>
  );
}
