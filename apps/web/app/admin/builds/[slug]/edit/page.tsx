import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { formatBuildStepsInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listMatchups, listRaces } from "../../../../../lib/content";
import { ensureAdminBuildEditor, updateBuildAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminBuildPage({ params }: Props) {
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
      <p className="page-intro">
        For <strong>Build Steps</strong> use one line per step:<br />
        <code>[12f, 1:30] Build barracks and queue footmen</code><br />
        <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
      </p>
      <form action={updateBuildAction} className="form-grid">
        <input type="hidden" name="buildId" value={build.id} />
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={visibleRaces} defaultValue={build.raceSlug} />
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <select id="matchupSlug" name="matchupSlug" defaultValue={build.matchupSlug ?? ""}>
              <option value="">None</option>
              {matchupResult.data.map((matchup) => (
                <option key={matchup.slug} value={matchup.slug}>
                  {matchup.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={build.title} />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" defaultValue={build.slug} />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" name="difficulty" type="text" defaultValue={build.difficulty} />
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
          <div className="inline-actions">
            <button className="button button--ghost" type="submit">Save Build</button>
          </div>
        </section>
      </form>
    </div>
  );
}

