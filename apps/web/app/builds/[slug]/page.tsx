import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { getBuildBySlug } from "../../../lib/content";
import { findFavoriteForUserByBuildSlug } from "../../../lib/content";
import { removeFavoriteAction, saveFavoriteAction } from "./favorite-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BuildDetailPage({ params }: Props) {
  const { slug } = await params;
  const [build, sessionUser] = await Promise.all([getBuildBySlug(slug), getSessionUser()]);

  if (!build) {
    notFound();
  }

  const favoriteId =
    sessionUser && hasDatabaseUrl()
      ? await findFavoriteForUserByBuildSlug(sessionUser.id, slug)
      : null;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">{build.strategyType}</p>
        <h1 className="page-title">{build.title}</h1>
        <p className="page-intro">{build.summary}</p>
        {sessionUser ? (
          <form action={favoriteId ? removeFavoriteAction : saveFavoriteAction}>
            <input type="hidden" name="buildSlug" value={build.slug} />
            <button className="button" type="submit">
              {favoriteId ? "Remove Favorite" : "Save to Favorites"}
            </button>
          </form>
        ) : (
          <p className="muted">Log in to save this build to your favorites.</p>
        )}
      </div>
      <div className="timeline">
        {build.steps.map((step) => (
          <article key={step.stepNumber} className="timeline-step">
            <strong>
              Step {step.stepNumber} · {step.supply} supply · {step.timing}
            </strong>
            <p>{step.instruction}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
