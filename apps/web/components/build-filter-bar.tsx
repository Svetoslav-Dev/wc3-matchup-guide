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
  return (
    <section className="panel panel--padded">
      <div className="section-head">
        <p className="section-label">Quick Filters</p>
        <h2>Browse openings by race or matchup.</h2>
      </div>
      <div className="chip-row">
        <Link className="button button--ghost" href="/builds">
          All Builds
        </Link>
        {races.map((race) => (
          <Link
            key={race.slug}
            className="button button--ghost"
            href={buildHref(race.slug, activeMatchup)}
            aria-current={activeRace === race.slug ? "page" : undefined}
          >
            {race.name}
          </Link>
        ))}
      </div>
      <div className="chip-row">
        {matchups.map((matchup) => (
          <Link
            key={matchup.slug}
            className="button button--ghost"
            href={buildHref(activeRace, matchup.slug)}
            aria-current={activeMatchup === matchup.slug ? "page" : undefined}
          >
            {matchup.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

