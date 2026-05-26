import Link from "next/link";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { getUserBuildById, listMatchups, listRaces } from "../../../lib/content";
import { createUserBuildAction, updateUserBuildAction } from "../user-actions";
import { SubmitBuildForm } from "./submit-form";

type Props = {
  searchParams?: Promise<{ edit?: string }>;
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

  const isEditing = !!editBuild;
  const formAction = isEditing ? updateUserBuildAction : createUserBuildAction;

  return (
    <div className="page-shell page-stack">
      {isEditing ? (
        <>
          <div className="admin-page-head">
            <div>
              <p className="section-label">Build Submission</p>
              <h1 className="page-title">Edit {editBuild.title}</h1>
            </div>
            <div className="admin-page-head__actions">
              <Link href="/builds/my-builds" className="button button--ghost button--sm">← Back</Link>
            </div>
          </div>
          <p className="page-intro">
            For <strong>Build Steps</strong> use one line per step:<br />
            <code>[12f, 1:30] Build barracks and queue footmen</code><br />
            <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
          </p>
        </>
      ) : (
        <div className="section-head">
          <p className="section-label">Build Submission</p>
          <h1 className="page-title">Submit your own build order.</h1>
          <p className="page-intro">
            Fill in the metadata on the left and the guide content on the right. You can save as a draft or publish immediately.
          </p>
          <p className="page-intro">
            For <strong>Build Steps</strong> use one line per step:<br />
            <code>[12f, 1:30] Build barracks and queue footmen</code><br />
            <span style={{ fontSize: "0.85em" }}>( 🍖 food · ⏱ time · instruction ) — step number is inferred from line order</span>
          </p>
        </div>
      )}

      <SubmitBuildForm
        visibleRaces={visibleRaces}
        matchups={matchupResult.data}
        editBuild={editBuild}
        action={formAction}
      />
    </div>
  );
}
