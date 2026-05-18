import Link from "next/link";
import { listMatchups } from "../../lib/content";

type Props = {
  searchParams?: Promise<{
    race?: string;
  }>;
};

const raceFilters = [
  { slug: "human", label: "Human" },
  { slug: "orc", label: "Orc" },
  { slug: "undead", label: "Undead" },
  { slug: "night-elf", label: "Night Elf" },
];

const getPerspectiveRace = (title: string) => title.split(" vs ")[0]?.trim() ?? "";

export default async function MatchupsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const result = await listMatchups(1, 20);
  const activeRace = raceFilters.find((race) => race.slug === params.race);
  const filteredMatchups = activeRace
    ? result.data.filter((matchup) => getPerspectiveRace(matchup.title) === activeRace.label)
    : result.data;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Matchup Study</p>
        <h1 className="page-title">Every mirror of strength has a crack.</h1>
        <p className="page-intro">
          These matchup briefs highlight initiative, timing windows, and the mistakes that most often
          lose otherwise playable games.
        </p>
      </div>
      <div className="chip-row">
        <Link
          href="/matchups"
          className={`button button--ghost${!activeRace ? " button--active" : ""}`}
        >
          All
        </Link>
        {raceFilters.map((race) => (
          <Link
            key={race.slug}
            href={`/matchups?race=${race.slug}`}
            className={`button button--ghost${activeRace?.slug === race.slug ? " button--active" : ""}`}
          >
            {race.label}
          </Link>
        ))}
      </div>
      <div className="list-grid">
        {filteredMatchups.map((matchup) => (
          <article key={matchup.slug} className="card">
            <div className="list-meta">
              <p className="pill pill--race">{getPerspectiveRace(matchup.title)}</p>
              <p className="pill">{matchup.difficulty}</p>
            </div>
            <h2>{matchup.title}</h2>
            <p>{matchup.summary}</p>
            <div className="list-meta">
              <span>Difficulty for {getPerspectiveRace(matchup.title)}: {matchup.difficulty}</span>
              <span>Hero focus: {matchup.heroChoices.join(", ")}</span>
            </div>
            <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
              View Matchup Plan
            </Link>
          </article>
        ))}
      </div>
      <p className="muted">Showing {filteredMatchups.length} of {result.total} matchups.</p>
    </div>
  );
}
