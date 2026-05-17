import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatCommonMistakesInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listRaces } from "../../../../../lib/content";
import { ensureAdminMatchupEditor, updateMatchupAction } from "../../../actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminMatchupPage({ params }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Matchup editing requires backend configuration.</h1>
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

  const { slug } = await params;
  const [matchup, raceResult] = await Promise.all([ensureAdminMatchupEditor(slug), listRaces(1, 20)]);

  if (!matchup) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Admin Matchup Editor</p>
        <h1 className="page-title">Edit {matchup.title}</h1>
        <p className="page-intro">Update race pairing, pacing notes, and common mistakes from the protected web editor.</p>
      </div>
      <form action={updateMatchupAction} className="form-grid">
        <input type="hidden" name="matchupId" value={matchup.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceASlug">Race A</label>
            <select id="raceASlug" name="raceASlug" defaultValue={matchup.raceASlug}>
              {raceResult.data.map((race) => (
                <option key={race.slug} value={race.slug}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="raceBSlug">Race B</label>
            <select id="raceBSlug" name="raceBSlug" defaultValue={matchup.raceBSlug}>
              {raceResult.data.map((race) => (
                <option key={race.slug} value={race.slug}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={matchup.title} />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" defaultValue={matchup.slug} />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" name="difficulty" type="text" defaultValue={matchup.difficulty} />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" defaultValue={matchup.summary} />
          </div>
          <div className="field">
            <label htmlFor="earlyGamePlan">Early game plan</label>
            <textarea id="earlyGamePlan" name="earlyGamePlan" defaultValue={matchup.earlyGamePlan} />
          </div>
          <div className="field">
            <label htmlFor="midGamePlan">Mid game plan</label>
            <textarea id="midGamePlan" name="midGamePlan" defaultValue={matchup.midGamePlan} />
          </div>
          <div className="field">
            <label htmlFor="lateGamePlan">Late game plan</label>
            <textarea id="lateGamePlan" name="lateGamePlan" defaultValue={matchup.lateGamePlan} />
          </div>
          <div className="field">
            <label htmlFor="commonMistakesInput">Common mistakes</label>
            <textarea id="commonMistakesInput" name="commonMistakesInput" defaultValue={formatCommonMistakesInput(matchup.commonMistakes)} />
          </div>
          <div className="inline-actions">
            <button className="button" type="submit">Save Matchup</button>
          </div>
        </section>
      </form>
    </div>
  );
}

