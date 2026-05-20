import Link from "next/link";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { listBuildSubmissionsForUser, listMatchups, listRaces } from "../../../lib/content";
import { createUserBuildAction, deleteUserBuildAction } from "../user-actions";
import { DifficultyBadge } from "../../../components/difficulty-badge";

type Props = {
  searchParams?: Promise<{ status?: string }>;
};

const statusMessages: Record<string, string> = {
  submitted: "Build submitted as a draft. You can remove it at any time from this page.",
  removed: "Your build submission was removed.",
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
  const [raceResult, matchupResult, submissions] = await Promise.all([
    listRaces(1, 20),
    listMatchups(1, 50),
    listBuildSubmissionsForUser(user.id),
  ]);
  const visibleRaces = raceResult.data.filter((race) => race.slug !== "neutral");
  const statusMessage = params.status ? statusMessages[params.status] : undefined;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Build Submission</p>
        <h1 className="page-title">Submit your own build order.</h1>
        <p className="page-intro">
          Submissions are saved as drafts under your account. Steps format: <code>step | supply | timing | instruction</code>.
        </p>
        {statusMessage ? <p className="muted">{statusMessage}</p> : null}
      </div>
      <form action={createUserBuildAction} className="form-grid" id="submit-build">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <select id="raceSlug" name="raceSlug" defaultValue={visibleRaces[0]?.slug}>
              {visibleRaces.map((race) => (
                <option key={race.slug} value={race.slug}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <select id="matchupSlug" name="matchupSlug" defaultValue="">
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
            <input id="title" name="title" type="text" placeholder="Human Fast Expand Into Casters" />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" placeholder="human-fast-expand-into-casters" />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" name="difficulty" type="text" placeholder="Intermediate" />
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input id="strategyType" name="strategyType" type="text" placeholder="Macro Expansion" />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" placeholder="Explain what the build is trying to achieve and when to use it." />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" placeholder="Write the complete build guide body here." />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea
              id="stepsInput"
              name="stepsInput"
              placeholder={"1 | 5 | 0:00 | Queue peasants and send the scout.\n2 | 18 | 1:35 | Start the expansion and secure the camp."}
            />
          </div>
          <div className="inline-actions">
            <button className="button" type="submit">Submit Build</button>
          </div>
        </section>
      </form>

      <section className="section" id="submitted-builds">
        {submissions.length > 0 ? (
          <div className="list-grid">
            {submissions.map((build) => (
              <article key={build.id} className="card">
                <p className="pill">{build.isPublished ? "Published" : "Draft"}</p>
                <h3>{build.title}</h3>
                <p>{build.summary}</p>
                <div className="list-meta">
                  <span>{build.raceName}</span>
                  <DifficultyBadge value={build.difficulty} />
                  <span>{build.strategyType}</span>
                </div>
                <div className="card__footer">
                  {build.isPublished ? (
                    <Link href={`/builds/${build.slug}`} className="button button--ghost">
                      View Build
                    </Link>
                  ) : (
                    <span className="muted">Draft builds stay off the public builds page until published by an admin.</span>
                  )}
                  <form action={deleteUserBuildAction}>
                    <input type="hidden" name="buildId" value={String(build.id)} />
                    <button className="button button--ghost" type="submit">Remove Build</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
