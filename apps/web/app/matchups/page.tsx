import Link from "next/link";
import { listMatchups } from "../../lib/content";
import { GameImage } from "../../components/game-image";
import { DifficultyBadge } from "../../components/difficulty-badge";

type Props = {
  searchParams?: Promise<{ race?: string }>;
};

const raceFilters = [
  { slug: "human",     label: "Human" },
  { slug: "orc",       label: "Orc" },
  { slug: "undead",    label: "Undead" },
  { slug: "night-elf", label: "Night Elf" },
];

const getPerspectiveRace = (title: string) => title.split(" vs ")[0]?.trim() ?? "";
const toRaceSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
const parseMatchup = (title: string) => {
  const [a = "", b = ""] = title.split(" vs ").map((s) => s.trim());
  return { nameA: a, nameB: b, slugA: toRaceSlug(a), slugB: toRaceSlug(b) };
};

const raceImages: Record<string, string> = {
  "human":     "/images/Races/Humans_Icon.png",
  "orc":       "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  "undead":    "/images/Races/Undead_Icon.png",
  "neutral":   "/images/Races/Neutral.png",
};
const raceImageSrc = (slug: string) => raceImages[slug] ?? "/placeholder.svg";

const matchupDifficulty: Record<string, string> = {
  "human-vs-human":           "Medium",
  "human-vs-orc":             "Medium",
  "human-vs-undead":          "Very Hard",
  "human-vs-night-elf":       "Hard",
  "orc-vs-human":             "Hard",
  "orc-vs-orc":               "Medium",
  "orc-vs-undead":            "Medium",
  "orc-vs-night-elf":         "Hard",
  "night-elf-vs-human":       "Easy",
  "night-elf-vs-orc":         "Hard",
  "night-elf-vs-night-elf":   "Medium",
  "night-elf-vs-undead":      "Very Hard",
  "undead-vs-human":          "Medium",
  "undead-vs-orc":            "Hard",
  "undead-vs-undead":         "Medium",
  "undead-vs-night-elf":      "Medium",
};

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

      <div className="filter-panel">
        <div className="filter-panel__group">
          <span className="filter-panel__label">Race</span>
          <div className="filter-chip-row">
            <Link href="/matchups" className={`filter-chip${!activeRace ? " filter-chip--active" : ""}`}>All</Link>
            {raceFilters.map((race) => (
              <Link
                key={race.slug}
                href={`/matchups?race=${race.slug}`}
                className={`filter-chip${activeRace?.slug === race.slug ? " filter-chip--active" : ""}`}
              >
                <GameImage
                  src={raceImageSrc(race.slug)}
                  alt={race.label}
                  className="admin-filter-icon"
                  width={16}
                  height={16}
                />
                {race.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="list-grid">
        {filteredMatchups.map((matchup) => {
          const { nameA, nameB, slugA, slugB } = parseMatchup(matchup.title);
          const diff = matchupDifficulty[matchup.slug];
          return (
            <article key={matchup.slug} className="card matchup-card">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GameImage
                    src={raceImageSrc(slugA)}
                    alt={nameA}
                    className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md"
                    width={40}
                    height={40}
                  />
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameA}</span>
                </div>
                <span className="text-[0.65rem] font-bold text-muted uppercase tracking-widest px-1 shrink-0 opacity-60">vs</span>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameB}</span>
                  <GameImage
                    src={raceImageSrc(slugB)}
                    alt={nameB}
                    className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md"
                    width={40}
                    height={40}
                  />
                </div>
              </div>

              {diff ? <div><DifficultyBadge value={diff} /></div> : null}

              <p className="matchup-card__summary">{matchup.summary}</p>

              <div className="card__footer">
                <p className="text-muted m-0 leading-snug" style={{ fontSize: "0.8rem" }}>
                  Hero focus: {matchup.heroChoices.join(", ")}
                </p>
                <Link href={`/matchups/${matchup.slug}`} className="button button--ghost button--sm">
                  View Plan
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
