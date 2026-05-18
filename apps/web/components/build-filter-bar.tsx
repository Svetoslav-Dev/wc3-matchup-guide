import Link from "next/link";
import { matchups, races } from "@warcraft3-guide-hub/shared";

type Props = {
  activeRace?: string;
  activeMatchup?: string;
};

const buildHref = (race?: string, matchup?: string) => {
  const params = new URLSearchParams();

  if (race) {
    params.set("race", race);
  }

  if (matchup) {
    params.set("matchup", matchup);
  }

  const query = params.toString();
  return query ? `/builds?${query}` : "/builds";
};

export function BuildFilterBar({ activeRace, activeMatchup }: Props) {
  const visibleRaces = races.filter((race) => race.slug !== "neutral");
  const hiddenMatchupSlugs = new Set([
    "orc-vs-human",
    "human-vs-undead",
    "night-elf-vs-undead",
    "undead-vs-orc",
  ]);
  const visibleMatchups = matchups.filter((matchup) => !hiddenMatchupSlugs.has(matchup.slug));

  return (
    <section className="panel panel--padded">
      <div className="section-head">
        <p className="section-label">Quick Filters</p>
        <h2>Browse openings by race or matchup.</h2>
      </div>
      <div className="chip-row">
        <Link
          className={`button button--ghost${!activeRace && !activeMatchup ? " button--active" : ""}`}
          href="/builds"
          aria-current={!activeRace && !activeMatchup ? "page" : undefined}
        >
          All Builds
        </Link>
        {visibleRaces.map((race) => (
          <Link
            key={race.slug}
            className={`button button--ghost${activeRace === race.slug ? " button--active" : ""}`}
            href={buildHref(race.slug, activeMatchup)}
            aria-current={activeRace === race.slug ? "page" : undefined}
          >
            {race.name}
          </Link>
        ))}
      </div>
      {visibleMatchups.length > 0 ? (
        <div className="chip-row">
          {visibleMatchups.map((matchup) => (
            <Link
              key={matchup.slug}
              className={`button button--ghost${activeMatchup === matchup.slug ? " button--active" : ""}`}
              href={buildHref(activeRace, matchup.slug)}
              aria-current={activeMatchup === matchup.slug ? "page" : undefined}
            >
              {matchup.title}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
