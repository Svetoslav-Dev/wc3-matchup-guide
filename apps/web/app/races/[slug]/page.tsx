import { notFound } from "next/navigation";
import Link from "next/link";
import { getRaceBySlug, listBuilds } from "../../../lib/content";
import { heroes } from "../../../lib/static-content";
import { GameImage } from "../../../components/game-image";
import { DifficultyBadge } from "../../../components/difficulty-badge";

const heroImages: Record<string, string> = {
  "Archmage":              "/images/Heroes/HeroArchMage.png",
  "Mountain King":         "/images/Heroes/HeroMountainKing.png",
  "Paladin":               "/images/Heroes/HeroPaladin.png",
  "Blood Mage":            "/images/Heroes/HeroBloodElfPrince.png",
  "Blademaster":           "/images/Heroes/HeroBlademaster.png",
  "Far Seer":              "/images/Heroes/HeroFarseer.png",
  "Shadow Hunter":         "/images/Heroes/ShadowHunter.png",
  "Tauren Chieftain":      "/images/Heroes/HeroTaurenChieftain.png",
  "Demon Hunter":          "/images/Heroes/HeroDemonHunter.png",
  "Keeper of the Grove":   "/images/Heroes/KeeperOfTheGrove.png",
  "Warden":                "/images/Heroes/HeroWarden.png",
  "Priestess of the Moon": "/images/Heroes/PriestessOfTheMoon.png",
  "Death Knight":          "/images/Heroes/HeroDeathKnight.png",
  "Lich":                  "/images/Heroes/LichVersion2.png",
  "Crypt Lord":            "/images/Heroes/HeroCryptLord.png",
  "Dreadlord":             "/images/Heroes/HeroDreadLord.png",
  "Dark Ranger":           "/images/Heroes/BansheeRanger.png",
  "Naga Sea Witch":        "/images/Heroes/NagaSeaWitch.png",
  "Panda Brewmaster":      "/images/Heroes/PandarenBrewmaster.png",
  "Pandaren Brewmaster":   "/images/Heroes/PandarenBrewmaster.png",
  "Beast Master":          "/images/Heroes/BeastMaster.png",
  "Beastmaster":           "/images/Heroes/BeastMaster.png",
  "Tinker":                "/images/Heroes/HeroTinker.png",
  "Alchemist":             "/images/Heroes/HeroAlchemist.png",
  "Pit Lord":              "/images/Heroes/PitLord.png",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function RaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [race, buildResult] = await Promise.all([
    getRaceBySlug(slug),
    slug === "neutral" ? Promise.resolve(null) : listBuilds({ race: slug, page: 1, pageSize: 4 }),
  ]);

  if (!race) {
    notFound();
  }

  const heroSlugByName = new Map(heroes.map((hero) => [hero.name, hero.slug]));

  return (
    <div className="page-shell page-stack">
      <div className="flex justify-start pt-4">
        <Link href="/races" className="button button--ghost button--sm">
          ← All Races
        </Link>
      </div>
      <div className="section-head">
        <p className="section-label">{race.badge}</p>
        <div className="title-row">
          {race.imageUrl ? (
            <GameImage
              src={race.imageUrl}
              alt={race.name}
              className="game-image--icon"
              width={64}
              height={64}
            />
          ) : null}
          <h1 className="page-title">{race.name}</h1>
        </div>
        <p className="page-intro">{race.description}</p>
      </div>
      <div className="detail-grid" style={{ alignItems: "stretch" }}>
        <article className="detail-panel" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
          <h2 className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-80 shrink-0" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Strategic Identity
          </h2>
          <p>{race.identity}</p>
          <ul className="list-none pl-0 flex flex-col gap-1.5">
            {race.strengths.map((strength) => (
              <li key={strength} className="flex items-center gap-2 text-muted">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-70 shrink-0" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {strength}
              </li>
            ))}
          </ul>
        </article>
        <article className="detail-panel" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
          <h2 className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold opacity-80 shrink-0" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Signature Heroes
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-3">
            {race.signatureHeroes.map((hero) => (
              <Link
                key={hero}
                href={heroSlugByName.get(hero) ? `/heroes/${heroSlugByName.get(hero)}` : "/heroes"}
                className="signature-hero-link"
              >
                <GameImage
                  src={heroImages[hero] ?? "/placeholder.svg"}
                  alt={hero}
                  className="w-9 h-9 rounded-[8px] object-cover shrink-0 border border-line"
                  width={36}
                  height={36}
                />
                <span className="text-muted leading-snug text-sm truncate">{hero}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
      {race.slug !== "neutral" && buildResult ? (
        <section className="section">
          <div className="section-head">
            <p className="section-label">Effective Builds</p>
            <h2>Most effective {race.name} builds in general.</h2>
          </div>
          {buildResult.data.length > 0 ? (
            <div className="list-grid">
              {buildResult.data.map((build) => (
                <article key={build.slug} className="card">
                  <div className="list-meta">
                    <p className="pill"><DifficultyBadge value={build.difficulty} /></p>
                    <p className="pill pill--race">{build.strategyType}</p>
                  </div>
                  <h3>{build.title}</h3>
                  <p>{build.summary}</p>
                  <div className="card__footer flex justify-center">
                    <Link href={`/builds/${build.slug}`} className="button button--ghost button--sm">
                      Read Me
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className="detail-panel">
              <h2>No builds yet</h2>
              <p>No published builds are available for {race.name} yet.</p>
            </article>
          )}
        </section>
      ) : null}
    </div>
  );
}
