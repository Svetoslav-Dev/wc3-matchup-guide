import Link from "next/link";
import { listMatchups, listRaces, listBuilds, getHomeStats } from "../lib/content";
import { fetchMatchupWinRates } from "../lib/w3c-stats";
import { GameImage } from "../components/game-image";
import { DifficultyBadge } from "../components/difficulty-badge";

const toRaceSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
const parseMatchupTitle = (title: string) => {
  const [a = "", b = ""] = title.split(" vs ").map((s) => s.trim());
  return { nameA: a, nameB: b, slugA: toRaceSlug(a), slugB: toRaceSlug(b) };
};
const raceImages: Record<string, string> = {
  "human": "/images/Races/Humans_Icon.png",
  "orc": "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  "undead": "/images/Races/Undead_Icon.png",
  "neutral": "/images/Races/Neutral.png",
};
const raceImageSrc = (slug: string) => raceImages[slug] ?? "/placeholder.svg";

const raceOrder = ["human", "orc", "undead", "night-elf"];

const worstMatchupSlugs: Record<string, string> = {
  human: "human-vs-undead",
  orc: "orc-vs-human",
  undead: "undead-vs-orc",
  "night-elf": "night-elf-vs-undead",
};

const bestMatchupSlugs: Record<string, string> = {
  human: "human-vs-orc",
  orc: "orc-vs-undead",
  undead: "undead-vs-night-elf",
  "night-elf": "night-elf-vs-human",
};

const worstMatchupDifficulty: Record<string, string> = {
  "human-vs-undead":        "Very Hard",
  "orc-vs-human":           "Hard",
  "undead-vs-orc":          "Hard",
  "night-elf-vs-undead":    "Very Hard",
};

const bestMatchupDifficulty: Record<string, string> = {
  "human-vs-orc":           "Medium",
  "orc-vs-undead":          "Easy",
  "undead-vs-night-elf":    "Medium",
  "night-elf-vs-human":     "Easy",
};

const worstMatchupReasons: Record<string, string> = {
  "human-vs-undead":
    "Undead is difficult for Human because coil-nova pressure, statue sustain, and sharp tier-two timing attacks heavily punish loose positioning and greedy expansions.",
  "orc-vs-human":
    "Human is difficult for Orc because militia creeping, safe expansions, and breaker-caster scaling punish Orc if the early pressure does not land cleanly.",
  "undead-vs-orc":
    "Orc is difficult for Undead because Blademaster scouting, raider pressure, and hex catches make every fiend loss and statue misstep much more expensive.",
  "night-elf-vs-undead":
    "Undead is difficult for Night Elf because fiend-statue control, destroyer timing, and hero nuke threat punish fragile Elf armies when map control slips.",
};

const bestMatchupReasons: Record<string, string> = {
  "human-vs-orc":
    "Orc is a strong matchup for Human because rifles, bolt, and slow directly answer raider dives, and disciplined caster control punishes every Orc overextension.",
  "orc-vs-undead":
    "Undead is a strong matchup for Orc because raider mobility, ensnare catches, and hex control disrupt the fragile fiend-statue timing Undead needs to win.",
  "undead-vs-night-elf":
    "Night Elf is a strong matchup for Undead because mass fiend pressure, nova timing, and destroyer conversion punish thin Elf armies before moonwells reset the map.",
  "night-elf-vs-human":
    "Human is a strong matchup for Night Elf because mana burn, entangle, and map mobility undermine Human's economy and prevent the caster backbone from forming.",
};

export default async function HomePage() {
  const [stats, raceResult, allMatchups, humanBuilds, orcBuilds, undeadBuilds, nightElfBuilds, winRates] = await Promise.all([
    getHomeStats(),
    listRaces(1, 20),
    listMatchups(1, 50),
    listBuilds({ race: "human", pageSize: 1 }),
    listBuilds({ race: "orc", pageSize: 1 }),
    listBuilds({ race: "undead", pageSize: 1 }),
    listBuilds({ race: "night-elf", pageSize: 1 }),
    fetchMatchupWinRates(),
  ]);
  const topBuilds = [humanBuilds, orcBuilds, undeadBuilds, nightElfBuilds]
    .map((result) => result.data[0])
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const featuredRaces = raceOrder
    .map((slug) => raceResult.data.find((race) => race.slug === slug))
    .filter((race): race is NonNullable<typeof race> => Boolean(race));
  const matchupBySlug = new Map(allMatchups.data.map((m) => [m.slug, m]));
  const worstMatchups = raceOrder
    .map((race) => matchupBySlug.get(worstMatchupSlugs[race]))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const bestMatchups = raceOrder
    .map((race) => matchupBySlug.get(bestMatchupSlugs[race]))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="page-shell">
      <section className="hero hero--split">
        <div>
          <p className="section-label">Capstone Website MVP</p>
          <h1>Sharpen your Warcraft III decision making.</h1>
          <p>
            Browse race identities, study matchup pressure points, follow polished build orders, and
            track your favorite plans from one dark fantasy strategy hub.
          </p>
          <div className="hero-actions">
            <Link href="/builds" className="button button--ghost">
              Explore Builds
            </Link>
            <Link href="/matchups" className="button button--ghost">
              Study Matchups
            </Link>
          </div>
        </div>
        <aside className="panel hero-aside">
          <p className="pill">Current Focus</p>
          <h2>Orc tempo, Undead pressure, Human scaling, Night Elf map control.</h2>
          <p>
            This first website pass ships with polished mock content so the browsing experience is
            usable before the database, auth, and admin APIs are wired in.
          </p>
        </aside>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <strong>{stats.raceTotal}</strong>
          <span className="muted">playable races with strengths, hero cores, and macro themes</span>
        </article>
        <article className="stat-card">
          <strong>{stats.heroTotal}</strong>
          <span className="muted">featured heroes grouped by role and primary battlefield use</span>
        </article>
        <article className="stat-card">
          <strong>{stats.matchupTotal}</strong>
          <span className="muted">matchup pages outlining early, mid, and late game priorities</span>
        </article>
        <article className="stat-card">
          <strong>{stats.buildTotal}</strong>
          <span className="muted">curated build orders with timings, supply, and transition notes</span>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="section-label">Featured Races</p>
          <h2>Four identities, four different win conditions.</h2>
        </div>
        <div className="card-grid">
          {featuredRaces.map((race) => (
            <article key={race.slug} className="card">
              <div className="list-meta">
                <p className="pill">{race.badge}</p>
                {race.playDifficulty ? (
                  <p className="pill"><DifficultyBadge value={race.playDifficulty} /></p>
                ) : null}
              </div>
              <div className="title-row">
                <GameImage
                  src={race.imageUrl ?? raceImageSrc(race.slug)}
                  alt={race.name}
                  className="game-image--icon"
                  width={64}
                  height={64}
                />
                <h3>{race.name}</h3>
              </div>
              <p>{race.identity}</p>
              <div className="card__footer">
                <div className="list-meta">
                  <span>Signature: {race.signatureHeroes.join(", ")}</span>
                </div>
                <Link href={`/races/${race.slug}`} className="button button--ghost">
                  View Race Guide
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="section-label">Worst Matchups</p>
          <h2>Every race has a wall they have to climb.</h2>
        </div>
        <div className="list-grid">
          {worstMatchups.map((matchup) => {
            const { nameA, nameB, slugA, slugB } = parseMatchupTitle(matchup.title);
            const wr = winRates[matchup.slug];
            const diff = worstMatchupDifficulty[matchup.slug];
            return (
            <article key={matchup.slug} className="card">
              <div className="matchup-header">
                {diff ? <p className="pill"><DifficultyBadge value={diff} /></p> : null}
                {wr !== undefined ? (
                  <span className={`winrate-badge ${wr < 45 ? "winrate-badge--low" : wr > 55 ? "winrate-badge--high" : "winrate-badge--even"}`}>
                    {wr}% win
                  </span>
                ) : null}
              </div>
              <div className="matchup-vs">
                <GameImage src={raceImageSrc(slugA)} alt={nameA} className="game-image--icon" width={64} height={64} />
                <span className="matchup-vs__race">{nameA}</span>
                <span className="matchup-vs__label">vs</span>
                <GameImage src={raceImageSrc(slugB)} alt={nameB} className="game-image--icon" width={64} height={64} />
                <span className="matchup-vs__race">{nameB}</span>
              </div>
              <p>{worstMatchupReasons[matchup.slug] ?? matchup.summary}</p>
              <div className="card__footer">
                <div className="list-meta">
                  <span>Common mistake: {matchup.commonMistakes[0]}</span>
                </div>
                <div className="card__footer-action card__footer-action--center">
                  <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
                    Open Matchup
                  </Link>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="section-label">Best Matchups</p>
          <h2>And every race has a lane where they thrive.</h2>
        </div>
        <div className="list-grid">
          {bestMatchups.map((matchup) => {
            const { nameA, nameB, slugA, slugB } = parseMatchupTitle(matchup.title);
            const wr = winRates[matchup.slug];
            const diff = bestMatchupDifficulty[matchup.slug];
            return (
            <article key={matchup.slug} className="card">
              <div className="matchup-header">
                {diff ? <p className="pill"><DifficultyBadge value={diff} /></p> : null}
                {wr !== undefined ? (
                  <span className={`winrate-badge ${wr < 45 ? "winrate-badge--low" : wr > 55 ? "winrate-badge--high" : "winrate-badge--even"}`}>
                    {wr}% win
                  </span>
                ) : null}
              </div>
              <div className="matchup-vs">
                <GameImage src={raceImageSrc(slugA)} alt={nameA} className="game-image--icon" width={64} height={64} />
                <span className="matchup-vs__race">{nameA}</span>
                <span className="matchup-vs__label">vs</span>
                <GameImage src={raceImageSrc(slugB)} alt={nameB} className="game-image--icon" width={64} height={64} />
                <span className="matchup-vs__race">{nameB}</span>
              </div>
              <p>{bestMatchupReasons[matchup.slug] ?? matchup.summary}</p>
              <div className="card__footer">
                <div className="list-meta">
                  <span>🗝️ Key strength: {matchup.heroChoices[0]}</span>
                </div>
                <div className="card__footer-action card__footer-action--center">
                  <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
                    Open Matchup
                  </Link>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      {topBuilds.length > 0 ? (
        <section className="section">
          <div className="section-head">
            <p className="section-label">Top Builds by Race</p>
            <h2>Most popular opening for each race.</h2>
            <p className="page-intro">
              One featured build order per race — the most commonly played general opener based on
              current submissions.
            </p>
          </div>
          <div className="list-grid">
            {topBuilds.map((build) => (
              <article key={build.slug} className="card">
                <div className="list-meta">
                  <p className="pill">{build.strategyType}</p>
                </div>
                <div className="title-row">
                  <GameImage
                    src={raceImageSrc(build.raceSlug)}
                    alt={build.raceName}
                    className="game-image--icon"
                    width={64}
                    height={64}
                  />
                  <h3>{build.title}</h3>
                </div>
                <p>{build.summary}</p>
                <div className="card__footer">
                  <div className="list-meta">
                    <span>Difficulty: <DifficultyBadge value={build.difficulty} /></span>
                    {build.bestAgainst ? <span>Best against: {build.bestAgainst}</span> : null}
                  </div>
                  <div className="card__footer-action card__footer-action--center">
                    <Link href={`/builds/${build.slug}`} className="button button--ghost">
                      Open Build
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
