import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../lib/auth";
import { getBuildBySlug, findFavoriteForUserByBuildSlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { FavoriteButton } from "../../../components/favorite-button";

const RACE_ICONS: Record<string, string> = {
  Human:       "/images/Races/Humans_Icon.png",
  Orc:         "/images/Races/Orcs_Icon.png",
  Undead:      "/images/Races/Undead_Icon.png",
  "Night Elf": "/images/Races/Night_Elves_Icon.png",
};

type Props = {
  params: Promise<{ slug: string }>;
};


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
        <FavoriteButton
          buildSlug={build.slug}
          isFavorite={Boolean(favoriteId)}
          isLoggedIn={Boolean(sessionUser)}
        />
      </div>
      <div className="timeline">
        {steps.map((step) => (
          <article key={step.stepNumber} className="timeline-step">
            <strong>
              Step {step.stepNumber} · <span aria-hidden="true">🍖</span> {step.supply} supply · <span aria-hidden="true">⏱️</span> {step.timing}
            </strong>
            <p>{step.instruction}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
