import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { createMatchupAction } from "../../actions";
import { RaceSelect } from "../../../../components/race-select";

export default async function NewAdminMatchupPage() {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Matchup creation requires backend configuration.</h1>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Admin access required.</h1>
        </div>
      </div>
    );
  }

  const raceResult = await listRaces(1, 20);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Create a new matchup guide</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/matchups" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      <p className="page-intro">Common mistakes format: one note per line.</p>
      <form action={createMatchupAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceASlug">Race A</label>
            <RaceSelect races={visibleRaces} defaultValue={visibleRaces[0]?.slug ?? ""} name="raceASlug" id="raceASlug" />
          </div>
          <div className="field">
            <label htmlFor="raceBSlug">Race B</label>
            <RaceSelect races={visibleRaces} defaultValue={visibleRaces[1]?.slug ?? visibleRaces[0]?.slug ?? ""} name="raceBSlug" id="raceBSlug" />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" placeholder="Orc vs Human" />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" placeholder="orc-vs-human" />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" name="difficulty" type="text" placeholder="Demanding" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" placeholder="Summarize the matchup in one compact paragraph." />
          </div>
          <div className="field">
            <label htmlFor="earlyGamePlan">Early game plan</label>
            <textarea id="earlyGamePlan" name="earlyGamePlan" placeholder="Harass with your hero, deny creep camps, and scout the opponent's opening strategy." />
          </div>
          <div className="field">
            <label htmlFor="midGamePlan">Mid game plan</label>
            <textarea id="midGamePlan" name="midGamePlan" placeholder="Secure an expansion and transition into your core unit composition at tier 2." />
          </div>
          <div className="field">
            <label htmlFor="lateGamePlan">Late game plan</label>
            <textarea id="lateGamePlan" name="lateGamePlan" placeholder="Dominate with a fully upgraded army; focus down heroes and avoid prolonged sieges." />
          </div>
          <div className="field">
            <label htmlFor="commonMistakesInput">Common mistakes</label>
            <textarea id="commonMistakesInput" name="commonMistakesInput" placeholder={"Over-chasing during the first push.\nSkipping key scouting before expansion timing."} />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Matchup</button>
          </div>
        </section>
      </form>
    </div>
  );
}

