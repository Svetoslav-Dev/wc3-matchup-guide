import Link from "next/link";
import { BuildFilterBar } from "../../components/build-filter-bar";
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
  const result = await listBuilds({
    race: params.race,
    matchup: params.matchup,
    search: params.search,
    page,
    pageSize: 20,
  });

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
      <div className="list-grid">
        {result.data.map((build) => (
          <article key={build.slug} className="card">
            <p className="pill">{build.strategyType}</p>
            <h2>{build.title}</h2>
            <p>{build.summary}</p>
            <div className="list-meta">
              <span>Difficulty: {build.difficulty}</span>
              <span>Race: {build.raceName}</span>
            </div>
            <Link href={`/builds/${build.slug}`} className="button button--ghost">
              Open Build
            </Link>
          </article>
        ))}
      </div>
      <p className="muted">
        Showing {result.data.length} of {result.total} builds. API equivalent:
        {" "}
        <code>/api/builds?page={result.page}&pageSize={result.pageSize}</code>
      </p>
    </div>
  );
}
