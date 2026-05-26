import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatBuildStepsInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listMatchups, listRaces } from "../../../../../lib/content";
import { ensureAdminBuildEditor, updateBuildAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";
import { MatchupSelect } from "../../../../../components/matchup-select";
import { DifficultySelect } from "../../../../../components/difficulty-select";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ status?: string; error?: string }>;
};

export default async function EditAdminBuildPage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Build editing requires backend configuration.</h1>
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
        </div>
      </div>
    );
  }

  const { slug } = await params;
  const { error, status } = (await searchParams) ?? {};
  const [build, raceResult, matchupResult] = await Promise.all([
    ensureAdminBuildEditor(slug),
    listRaces(1, 20),
    listMatchups(1, 50),
  ]);

  if (!build) {
    notFound();
  }

  const visibleRaces = raceResult.data.filter((r) => r.slug !== "neutral");

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Build Editor</p>
          <h1 className="page-title">Edit {build.title}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/builds" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>
      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Build {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
      <p className="page-intro">
        For <strong>Build Steps</strong> use one line per step:<br />
        <code>[12f, 1:30] Build barracks and queue footmen</code><br />
        <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
      </p>
      <form action={updateBuildAction} className="form-grid">
        <input type="hidden" name="buildId" value={build.id} />
        <input type="hidden" name="currentSlug" value={build.slug} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={visibleRaces} defaultValue={build.raceSlug} />
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <MatchupSelect matchups={matchupResult.data} defaultValue={build.matchupSlug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={build.title} />
          </div>
          <div className="field">
            <label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /builds/orc-grunt-raider-timing)</span></label>
            <input id="slug" name="slug" type="text" defaultValue={build.slug} />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <DifficultySelect defaultValue={build.difficulty} />
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input id="strategyType" name="strategyType" type="text" defaultValue={build.strategyType} />
          </div>
          <label className="field field--checkbox">
            <input name="isPublished" type="checkbox" defaultChecked={build.isPublished} />
            <span>Published</span>
          </label>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" defaultValue={build.summary} />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" defaultValue={build.body} />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea id="stepsInput" name="stepsInput" defaultValue={formatBuildStepsInput(build.steps)} />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Save Build</button>
          </div>
        </section>
      </form>
    </div>
  );
}

