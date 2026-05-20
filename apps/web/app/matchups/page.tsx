import Link from "next/link";
import { listMatchups } from "../../lib/content";
import { GameImage } from "../../components/game-image";

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
const toRaceSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
const parseMatchup = (title: string) => {
  const [a = "", b = ""] = title.split(" vs ").map((s) => s.trim());
  return { nameA: a, nameB: b, slugA: toRaceSlug(a), slugB: toRaceSlug(b) };
};
const raceImages: Record<string, string> = {
  "human": "/images/Races/Humans_Icon.png",
  "orc": "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  "undead": "/images/Races/Undead_Icon.png",
};
const raceImageSrc = (slug: string) => raceImages[slug] ?? "/placeholder.svg";

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
            {(() => {
              const { nameA, nameB, slugA, slugB } = parseMatchup(matchup.title);
              return (
                <div className="matchup-vs">
                  <GameImage src={raceImageSrc(slugA)} alt={nameA} className="game-image--icon" width={64} height={64} />
                  <span className="matchup-vs__race">{nameA}</span>
                  <span className="matchup-vs__label">vs</span>
                  <GameImage src={raceImageSrc(slugB)} alt={nameB} className="game-image--icon" width={64} height={64} />
                  <span className="matchup-vs__race">{nameB}</span>
                </div>
              );
            })()}
            <p>{matchup.summary}</p>
            <div className="card__footer">
              <div className="list-meta">
                <span>Difficulty for {getPerspectiveRace(matchup.title)}: {matchup.difficulty}</span>
                <span>Hero focus: {matchup.heroChoices.join(", ")}</span>
              </div>
              <div className="card__footer-action card__footer-action--center">
                <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
                  View Matchup Plan
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
