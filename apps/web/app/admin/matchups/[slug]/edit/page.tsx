import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatCommonMistakesInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listRaces } from "../../../../../lib/content";
import { ensureAdminMatchupEditor, updateMatchupAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ status?: string; error?: string }>;
};

export default async function EditAdminMatchupPage({ params, searchParams }: Props) {
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
  const { error, status } = (await searchParams) ?? {};
  const [matchup, raceResult] = await Promise.all([ensureAdminMatchupEditor(slug), listRaces(1, 20)]);
  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  if (!matchup) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Matchup Editor</p>
          <h1 className="page-title">Edit {matchup.title}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/matchups" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Matchup {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
      <p className="page-intro">Update race pairing, pacing notes, and common mistakes from the protected web editor.</p>
      <form action={updateMatchupAction} className="form-grid">
        <input type="hidden" name="matchupId" value={matchup.id} />
        <input type="hidden" name="currentSlug" value={matchup.slug} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceASlug">Race A</label>
            <RaceSelect races={visibleRaces} defaultValue={matchup.raceASlug} name="raceASlug" id="raceASlug" />
          </div>
          <div className="field">
            <label htmlFor="raceBSlug">Race B</label>
            <RaceSelect races={visibleRaces} defaultValue={matchup.raceBSlug} name="raceBSlug" id="raceBSlug" />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={matchup.title} />
          </div>
          <div className="field">
            <label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /matchups/human-vs-orc)</span></label>
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
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Save Matchup</button>
          </div>
        </section>
      </form>
    </div>
  );
}

