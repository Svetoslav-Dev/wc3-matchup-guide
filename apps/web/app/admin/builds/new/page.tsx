import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { listMatchups, listRaces } from "../../../../lib/content";
import { getSessionUser } from "../../../../lib/auth";
import { createBuildAction } from "../../actions";
import { RaceSelect } from "../../../../components/race-select";
import { MatchupSelect } from "../../../../components/matchup-select";

export default async function NewAdminBuildPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Build creation requires backend configuration.</h1>
          <p className="page-intro">Set <code>DATABASE_URL</code> and <code>JWT_SECRET</code> before using admin editors.</p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Admin access required.</h1>
          <p className="page-intro">Only authenticated admins can create builds from the web editor.</p>
        </div>
      </div>
    );
  }

  const [raceResult, matchupResult] = await Promise.all([listRaces(1, 20), listMatchups(1, 50)]);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Create a new build order</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/builds" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">
        For <strong>Build Steps</strong> use one line per step:<br />
        <code>[12f, 1:30] Build barracks and queue footmen</code><br />
        <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
      </p>
      <form action={createBuildAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={visibleRaces} defaultValue={visibleRaces[0]?.slug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <MatchupSelect matchups={matchupResult.data} defaultValue="" />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" placeholder="Orc Grunt Raider Timing" />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" placeholder="orc-grunt-raider-timing" />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" name="difficulty" type="text" placeholder="Intermediate" />
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input id="strategyType" name="strategyType" type="text" placeholder="Tempo Midgame" />
          </div>
          <label className="field field--checkbox">
            <input name="isPublished" type="checkbox" />
            <span>Publish immediately</span>
          </label>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" placeholder="Explain when and why this build works." />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" placeholder="Write the full build guide body here." />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea
              id="stepsInput"
              name="stepsInput"
              placeholder={"[12f, 0:00] Queue peons and send one to scout\n[18f, 1:40] Creep the first camp efficiently"}
            />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Build</button>
          </div>
        </section>
      </form>
    </div>
  );
}

