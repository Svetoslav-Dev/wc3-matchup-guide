import Link from "next/link";
import { getMatchupsBySlugs, listRaces, getTopBuildPerRace, getHomeStats } from "../lib/content";
import { fetchMatchupWinRates } from "../lib/w3c-stats";

export const revalidate = 3600;
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
  const neededMatchupSlugs = [...Object.values(worstMatchupSlugs), ...Object.values(bestMatchupSlugs)];

  const [stats, raceResult, matchupList, topBuilds, winRates] = await Promise.all([
    getHomeStats(),
    listRaces(1, 20),
    getMatchupsBySlugs(neededMatchupSlugs),
    getTopBuildPerRace(raceOrder),
    fetchMatchupWinRates(),
  ]);
  const featuredRaces = raceOrder
    .map((slug) => raceResult.data.find((race) => race.slug === slug))
    .filter((race): race is NonNullable<typeof race> => Boolean(race));
  const matchupBySlug = new Map(matchupList.map((m) => [m.slug, m]));
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
          <div className="stat-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <strong>{stats.raceTotal}</strong>
            <span className="muted">Playable races</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <strong>{stats.heroTotal}</strong>
            <span className="muted">Featured heroes</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="7" y1="7" x2="11" y2="11"/>
            </svg>
          </div>
          <div>
            <strong>{stats.matchupTotal}</strong>
            <span className="muted">Matchup pages</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div>
            <strong>{stats.buildTotal}</strong>
            <span className="muted">Build orders</span>
          </div>
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
              <div className="flex items-center gap-3">
                <GameImage
                  src={race.imageUrl ?? raceImageSrc(race.slug)}
                  alt={race.name}
                  className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md"
                  width={40}
                  height={40}
                />
                <h3 className="text-[1rem] font-bold text-text m-0 leading-snug">{race.name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="pill">{race.badge}</span>
                {race.playDifficulty ? <DifficultyBadge value={race.playDifficulty} /> : null}
              </div>
              <p className="text-muted text-sm leading-relaxed m-0">{race.identity}</p>
              <div className="card__footer">
                <p className="text-muted m-0 leading-snug" style={{ fontSize: "0.8rem" }}>
                  {race.signatureHeroes.join(", ")}
                </p>
                <Link href={`/races/${race.slug}`} className="button button--ghost button--sm">
                  View Race
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GameImage src={raceImageSrc(slugA)} alt={nameA} className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md" width={40} height={40} />
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameA}</span>
                </div>
                <span className="text-[0.65rem] font-bold text-muted uppercase tracking-widest px-1 shrink-0 opacity-60">vs</span>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameB}</span>
                  <GameImage src={raceImageSrc(slugB)} alt={nameB} className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md" width={40} height={40} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                {diff ? <DifficultyBadge value={diff} /> : <span />}
                {wr !== undefined ? (
                  <span className={`winrate-badge ${wr < 45 ? "winrate-badge--low" : wr > 55 ? "winrate-badge--high" : "winrate-badge--even"}`}>
                    {wr}% win
                  </span>
                ) : null}
              </div>
              <p className="text-muted text-sm leading-relaxed m-0">{worstMatchupReasons[matchup.slug] ?? matchup.summary}</p>
              <div className="card__footer">
                <p className="text-muted m-0 leading-snug" style={{ fontSize: "0.8rem" }}>
                  Mistake: {matchup.commonMistakes[0]}
                </p>
                <Link href={`/matchups/${matchup.slug}`} className="button button--ghost button--sm">
                  Open Matchup
                </Link>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GameImage src={raceImageSrc(slugA)} alt={nameA} className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md" width={40} height={40} />
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameA}</span>
                </div>
                <span className="text-[0.65rem] font-bold text-muted uppercase tracking-widest px-1 shrink-0 opacity-60">vs</span>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-[0.88rem] font-bold text-text leading-none">{nameB}</span>
                  <GameImage src={raceImageSrc(slugB)} alt={nameB} className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md" width={40} height={40} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                {diff ? <DifficultyBadge value={diff} /> : <span />}
                {wr !== undefined ? (
                  <span className={`winrate-badge ${wr < 45 ? "winrate-badge--low" : wr > 55 ? "winrate-badge--high" : "winrate-badge--even"}`}>
                    {wr}% win
                  </span>
                ) : null}
              </div>
              <p className="text-muted text-sm leading-relaxed m-0">{bestMatchupReasons[matchup.slug] ?? matchup.summary}</p>
              <div className="card__footer">
                <p className="text-muted m-0 leading-snug" style={{ fontSize: "0.8rem" }}>
                  Key strength: {matchup.heroChoices[0]}
                </p>
                <Link href={`/matchups/${matchup.slug}`} className="button button--ghost button--sm">
                  Open Matchup
                </Link>
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
                <div className="flex items-center gap-3">
                  <GameImage
                    src={raceImageSrc(build.raceSlug)}
                    alt={build.raceName}
                    className="w-10 h-10 rounded-[8px] shrink-0 object-cover shadow-md"
                    width={40}
                    height={40}
                  />
                  <h3 className="text-[1rem] font-bold text-text m-0 leading-snug">{build.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <DifficultyBadge value={build.difficulty} />
                  {build.strategyType && <span className="pill">{build.strategyType}</span>}
                </div>
                <p className="text-muted text-sm leading-relaxed m-0">{build.summary}</p>
                <div className="card__footer">
                  <p className="text-muted m-0 leading-snug" style={{ fontSize: "0.8rem" }}>
                    {build.bestAgainst ? `Best against: ${build.bestAgainst}` : build.raceName}
                  </p>
                  <Link href={`/builds/${build.slug}`} className="button button--ghost button--sm">
                    Open Build
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
