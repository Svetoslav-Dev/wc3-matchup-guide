import Link from "next/link";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { formatBuildStepsInput } from "../../../lib/admin-forms";
import { getUserBuildById, listMatchups, listRaces } from "../../../lib/content";
import { createUserBuildAction, updateUserBuildAction } from "../user-actions";

type Props = {
  searchParams?: Promise<{ status?: string; fields?: string; edit?: string }>;
};

export default async function SubmitBuildPage({ searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Build Submission</p>
          <h1 className="page-title">Build submissions require backend configuration.</h1>
          <p className="page-intro">Set <code>DATABASE_URL</code> and <code>JWT_SECRET</code> before using build submissions.</p>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Build Submission</p>
          <h1 className="page-title">Log in to submit your own build.</h1>
          <p className="page-intro">
            Signed-in users can submit builds for a race and remove their own submissions later from
            the same page.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="button">Log In</Link>
            <Link href="/register" className="button button--ghost">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const params = (await searchParams) ?? {};
  const editBuildId = params.edit ? Number.parseInt(params.edit, 10) : null;

  const [raceResult, matchupResult, editBuild] = await Promise.all([
    listRaces(1, 20),
    listMatchups(1, 50),
    editBuildId ? getUserBuildById(user.id, editBuildId) : Promise.resolve(null),
  ]);

  const visibleRaces = raceResult.data.filter((race) => race.slug !== "neutral");

  const FIELD_LABELS: Record<string, string> = {
    title: "Title", slug: "URL Identifier", summary: "Summary",
    difficulty: "Difficulty", strategyType: "Strategy Type", body: "Body",
    stepsInput: "Build Steps",
  };
  const missingFields = params.fields
    ? params.fields.split(",").map((f) => FIELD_LABELS[f.trim()] ?? f.trim()).join(", ")
    : null;

  const statusMessage =
    params.status === "submitted" ? { text: "Build submitted. It will appear on the public page once published by an admin.", isError: false }
    : params.status === "updated"  ? { text: "Build updated successfully.", isError: false }
    : params.status === "removed"  ? { text: "Your build submission was removed.", isError: false }
    : params.status === "validation-error" ? { text: `Please fill in all required fields${missingFields ? `: ${missingFields}` : ""}.`, isError: true }
    : params.status === "server-error"     ? { text: "Something went wrong saving your build. Please try again.", isError: true }
    : null;

  const isEditing = !!editBuild;
  const formAction = isEditing ? updateUserBuildAction : createUserBuildAction;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Build Submission</p>
        <h1 className="page-title">
          {isEditing ? `Editing: ${editBuild.title}` : "Submit your own build order."}
        </h1>
        {!isEditing && (
          <p className="page-intro">
            Fill in the metadata on the left and the guide content on the right. You can save as a draft or publish immediately.
          </p>
        )}
        <p className="page-intro">
          For <strong>Build Steps</strong> use one line per step:<br />
          <code>
            <span title="Step number">#</span>
            {" 1 | "}
            <span title="Food supply">🍖</span>
            {" 12 | "}
            <span title="Timestamp">⏱</span>
            {" 1:30 | Build barracks and queue footmen"}
          </code><br />
          <span style={{ fontSize: "0.85em" }}>( # step | 🍖 food | ⏱ time | instruction )</span>
        </p>
        {statusMessage ? (
          <p className={statusMessage.isError ? "submit-error-msg" : "muted"}>
            {statusMessage.text}
          </p>
        ) : null}
      </div>

      <form action={formAction} className="form-grid" id="submit-build">
        {isEditing && <input type="hidden" name="buildId" value={editBuild.id} />}
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <select id="raceSlug" name="raceSlug" defaultValue={editBuild?.raceSlug ?? visibleRaces[0]?.slug}>
              {visibleRaces.map((race) => (
                <option key={race.slug} value={race.slug}>{race.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <select id="matchupSlug" name="matchupSlug" defaultValue={editBuild?.matchupSlug ?? ""}>
              <option value="">None</option>
              {matchupResult.data.map((matchup) => (
                <option key={matchup.slug} value={matchup.slug}>{matchup.title}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={editBuild?.title ?? ""} placeholder="Human Fast Expand Into Casters" />
          </div>
          <div className="field">
            <label htmlFor="slug">URL Identifier (slug)</label>
            <input id="slug" name="slug" type="text" defaultValue={editBuild?.slug ?? ""} placeholder="human-fast-expand-into-casters" />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" defaultValue={editBuild?.difficulty ?? "Medium"}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Very Hard">Very Hard</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input id="strategyType" name="strategyType" type="text" defaultValue={editBuild?.strategyType ?? ""} placeholder="Macro Expansion" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" defaultValue={editBuild?.summary ?? ""} placeholder="Explain what the build is trying to achieve and when to use it." />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" defaultValue={editBuild?.body ?? ""} placeholder="Write the complete build guide body here." />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea
              id="stepsInput"
              name="stepsInput"
              defaultValue={editBuild ? formatBuildStepsInput(editBuild.steps) : ""}
              placeholder={"1 | 5 | 0:00 | Queue peasants and send the scout.\n2 | 18 | 1:35 | Start the expansion and secure the camp."}
            />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" name="publishMode" value="draft" type="submit">
              {isEditing ? "Save Changes" : "Save as Draft"}
            </button>
            <button className="button button--publish" name="publishMode" value="publish" type="submit">
              Publish Now
            </button>
            {isEditing && (
              <Link href="/builds/submit" className="button button--cancel">Cancel</Link>
            )}
          </div>
        </section>
      </form>

    </div>
  );
}
