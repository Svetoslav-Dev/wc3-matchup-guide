import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../lib/auth";
import { listRaces } from "../../../../lib/content";
import { createMatchupAction } from "../../actions";

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

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Admin Matchup Editor</p>
        <h1 className="page-title">Create a new matchup guide.</h1>
        <p className="page-intro">Common mistakes format: one note per line.</p>
      </div>
      <form action={createMatchupAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceASlug">Race A</label>
            <select id="raceASlug" name="raceASlug" defaultValue={raceResult.data[0]?.slug}>
              {raceResult.data.map((race) => (
                <option key={race.slug} value={race.slug}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="raceBSlug">Race B</label>
            <select id="raceBSlug" name="raceBSlug" defaultValue={raceResult.data[1]?.slug ?? raceResult.data[0]?.slug}>
              {raceResult.data.map((race) => (
                <option key={race.slug} value={race.slug}>
                  {race.name}
                </option>
              ))}
            </select>
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
            <textarea id="earlyGamePlan" name="earlyGamePlan" />
          </div>
          <div className="field">
            <label htmlFor="midGamePlan">Mid game plan</label>
            <textarea id="midGamePlan" name="midGamePlan" />
          </div>
          <div className="field">
            <label htmlFor="lateGamePlan">Late game plan</label>
            <textarea id="lateGamePlan" name="lateGamePlan" />
          </div>
          <div className="field">
            <label htmlFor="commonMistakesInput">Common mistakes</label>
            <textarea id="commonMistakesInput" name="commonMistakesInput" placeholder={"Over-chasing during the first push.\nSkipping key scouting before expansion timing."} />
          </div>
          <div className="inline-actions">
            <button className="button" type="submit">Create Matchup</button>
          </div>
        </section>
      </form>
    </div>
  );
}

