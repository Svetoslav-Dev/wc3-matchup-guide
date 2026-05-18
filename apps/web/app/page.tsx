import Link from "next/link";
import { listMatchups, listRaces, getHomeStats } from "../lib/content";

export default async function HomePage() {
  const [stats, raceResult, matchupResult] = await Promise.all([
    getHomeStats(),
    listRaces(1, 20),
    listMatchups(1, 4),
  ]);
  const featuredRaceOrder = ["human", "orc", "undead", "night-elf"];
  const featuredRaces = featuredRaceOrder
    .map((slug) => raceResult.data.find((race) => race.slug === slug))
    .filter((race): race is NonNullable<typeof race> => Boolean(race));
  const worstMatchupReasons: Record<string, string> = {
    "orc-vs-human":
      "Human is difficult for Orc because militia creeping, safe expansions, and breaker-caster scaling punish Orc if the early pressure does not land cleanly.",
    "human-vs-undead":
      "Undead is difficult for Human because coil-nova pressure, statue sustain, and sharp tier-two timing attacks heavily punish loose positioning and greedy expansions.",
    "night-elf-vs-undead":
      "Undead is difficult for Night Elf because fiend-statue control, destroyer timing, and hero nuke threat punish fragile Elf armies when map control slips.",
    "undead-vs-orc":
      "Orc is difficult for Undead because Blademaster scouting, raider pressure, and hex catches make every fiend loss and statue misstep much more expensive.",
  };

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
            <Link href="/builds" className="button">
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
              <p className="pill">{race.badge}</p>
              <h3>{race.name}</h3>
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
          <h2>Races worst matchups</h2>
        </div>
        <div className="list-grid">
          {matchupResult.data.map((matchup) => (
            <article key={matchup.slug} className="card">
              <p className="pill">{matchup.difficulty}</p>
              <h3>{matchup.title}</h3>
              <p>{worstMatchupReasons[matchup.slug] ?? matchup.summary}</p>
              <div className="list-meta">
                <span>Why it is hard: {matchup.commonMistakes[0]}</span>
              </div>
              <Link href={`/matchups/${matchup.slug}`} className="button button--ghost">
                Open Matchup
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
