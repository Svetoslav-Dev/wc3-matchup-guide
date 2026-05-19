import Link from "next/link";

type Props = {
  activeRace?: string;
  activeMatchup?: string;
};

const raceFilters = [
  { slug: "human", name: "Human" },
  { slug: "orc", name: "Orc" },
  { slug: "undead", name: "Undead" },
  { slug: "night-elf", name: "Night Elf" },
];

export function BuildFilterBar({ activeRace, activeMatchup }: Props) {
  return (
    <section className="panel panel--padded">
      <div className="section-head">
        <p className="section-label">Quick Filters</p>
        <h2>Browse openings by race.</h2>
      </div>
      <div className="chip-row">
        <Link
          className={`button button--ghost${!activeRace && !activeMatchup ? " button--active" : ""}`}
          href="/builds"
          aria-current={!activeRace && !activeMatchup ? "page" : undefined}
        >
          All Builds
        </Link>
        {raceFilters.map((race) => (
          <Link
            key={race.slug}
            className={`button button--ghost${activeRace === race.slug ? " button--active" : ""}`}
            href={`/builds?race=${race.slug}`}
            aria-current={activeRace === race.slug ? "page" : undefined}
          >
            {race.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
