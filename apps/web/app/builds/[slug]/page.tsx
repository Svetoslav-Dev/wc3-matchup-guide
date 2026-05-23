import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { getBuildBySlug, findFavoriteForUserByBuildSlug } from "../../../lib/content";
import { removeFavoriteAction, saveFavoriteAction } from "./favorite-actions";
import { GameImage } from "../../../components/game-image";

const RACE_ICONS: Record<string, string> = {
  Human:       "/images/Races/Humans_Icon.png",
  Orc:         "/images/Races/Orcs_Icon.png",
  Undead:      "/images/Races/Undead_Icon.png",
  "Night Elf": "/images/Races/Night_Elves_Icon.png",
};

type Props = {
  params: Promise<{ slug: string }>;
};

const HeartSvg = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default async function BuildDetailPage({ params }: Props) {
  const { slug } = await params;

  const [build, sessionUser] = await Promise.all([getBuildBySlug(slug), getSessionUser()]);

  if (!build) {
    notFound();
  }

  // Variant builds have no steps — fall back to base build steps
  let steps = build.steps;
  if (steps.length === 0) {
    const baseSlug = slug.replace(/-variant-\d+$/, "");
    if (baseSlug !== slug) {
      const baseBuild = await getBuildBySlug(baseSlug);
      steps = baseBuild?.steps ?? [];
    }
  }

  const favoriteId =
    sessionUser && hasDatabaseUrl()
      ? await findFavoriteForUserByBuildSlug(sessionUser.id, slug)
      : null;

  const heartAction = favoriteId ? removeFavoriteAction : saveFavoriteAction;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <div className="build-race-badge">
          <GameImage
            src={build.raceImageUrl ?? RACE_ICONS[build.raceName] ?? null}
            alt={build.raceName}
            className="build-race-badge__icon"
            width={36}
            height={36}
          />
          <span className="build-race-badge__name">{build.raceName}</span>
          <span className="build-race-badge__sep" aria-hidden="true">·</span>
          <span className="build-race-badge__strategy">{build.strategyType}</span>
        </div>
        <h1 className="page-title">{build.title}</h1>
        <p className="page-intro">{build.summary}</p>
        <form action={heartAction} style={{ display: "contents" }}>
          <input type="hidden" name="buildSlug" value={build.slug} />
          <button
            className={`heart-btn heart-btn--detail${favoriteId ? " heart-btn--filled" : ""}`}
            type="submit"
            aria-label={favoriteId ? "Remove from favorites" : "Save to favorites"}
          >
            <HeartSvg filled={Boolean(favoriteId)} />
          </button>
        </form>
      </div>
      <div className="timeline">
        {steps.map((step) => (
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
