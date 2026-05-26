import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchupBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import { DifficultyBadge } from "../../../components/difficulty-badge";
import { heroes } from "../../../lib/static-content";

type Props = {
  params: Promise<{ slug: string }>;
};

const raceImages: Record<string, string> = {
  "human":     "/images/Races/Humans_Icon.png",
  "orc":       "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  "undead":    "/images/Races/Undead_Icon.png",
};

const raceLabels: Record<string, string> = {
  "human":     "Human",
  "orc":       "Orc",
  "night-elf": "Night Elf",
  "undead":    "Undead",
};

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
  "Priestess of the Moon": "/images/Heroes/PriestessOfTheMoon.png",
  "Warden":                "/images/Heroes/HeroWarden.png",
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

const attrIcon: Record<string, string> = {
  Strength:     "💪",
  Agility:      "⚡",
  Intelligence: "🔮",
};

const heroNameAlias: Record<string, string> = {
  "Dreadlord": "Dread Lord",
};

function ensureSentencePeriod(value: string) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export default async function MatchupDetailPage({ params }: Props) {
  const { slug } = await params;
  const matchup = await getMatchupBySlug(slug);

  if (!matchup) notFound();

  const [slugA = "", slugB = ""] = slug.split("-vs-");

  return (
    <div className="page-shell page-stack" style={{ paddingTop: "1.5rem" }}>

      {/* Top nav */}
      <div className="flex justify-start">
        <Link href="/matchups" className="button button--ghost button--sm">
          ← Back to Matchups
        </Link>
      </div>

      {/* Hero row */}
      <div className="panel flex items-center gap-4 flex-wrap" style={{ padding: "1.5rem" }}>
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-center">
          <GameImage
            src={raceImages[slugA] ?? "/placeholder.svg"}
            alt={raceLabels[slugA] ?? slugA}
            width={56}
            height={56}
            className="rounded-[10px] object-cover shadow-md shrink-0"
          />
          <span className="text-lg font-bold text-text">{raceLabels[slugA] ?? slugA}</span>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0 px-2">
          <span className="text-[0.6rem] font-bold text-muted uppercase tracking-widest opacity-50">vs</span>
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-center flex-row-reverse">
          <GameImage
            src={raceImages[slugB] ?? "/placeholder.svg"}
            alt={raceLabels[slugB] ?? slugB}
            width={56}
            height={56}
            className="rounded-[10px] object-cover shadow-md shrink-0"
          />
          <span className="text-lg font-bold text-text">{raceLabels[slugB] ?? slugB}</span>
        </div>
      </div>

      {/* Summary + difficulty */}
      <div className="flex flex-col gap-2">
        <div><DifficultyBadge value={matchup.difficulty} /></div>
        <p className="page-intro m-0">{matchup.summary}</p>
      </div>

      {/* Game plan + Hero focus */}
      <div className="detail-grid">
        <article className="detail-panel" style={{ alignSelf: "stretch", display: "flex", flexDirection: "column" }}>
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#c9a35b" }}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Game Plan
          </h2>
          <div className="flex flex-col gap-3" style={{ flex: 1 }}>
            <div className="flex gap-2.5 rounded-[10px] border border-line bg-white/[0.02] p-2.5" style={{ flex: 1 }}>
              <span className="shrink-0 mt-0.5 flex items-center justify-center rounded-full text-[0.6rem] font-bold uppercase tracking-wide" style={{ width: 20, height: 20, minWidth: 20, background: "rgba(201,163,91,0.15)", color: "#c9a35b", border: "1px solid rgba(201,163,91,0.3)" }}>E</span>
              <p className="m-0 text-muted leading-relaxed" style={{ fontSize: "0.88rem" }}>{matchup.earlyGamePlan}</p>
            </div>
            <div className="flex gap-2.5 rounded-[10px] border border-line bg-white/[0.02] p-2.5" style={{ flex: 1 }}>
              <span className="shrink-0 mt-0.5 flex items-center justify-center rounded-full text-[0.6rem] font-bold uppercase tracking-wide" style={{ width: 20, height: 20, minWidth: 20, background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}>M</span>
              <p className="m-0 text-muted leading-relaxed" style={{ fontSize: "0.88rem" }}>{matchup.midGamePlan}</p>
            </div>
            <div className="flex gap-2.5 rounded-[10px] border border-line bg-white/[0.02] p-2.5" style={{ flex: 1 }}>
              <span className="shrink-0 mt-0.5 flex items-center justify-center rounded-full text-[0.6rem] font-bold uppercase tracking-wide" style={{ width: 20, height: 20, minWidth: 20, background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>L</span>
              <p className="m-0 text-muted leading-relaxed" style={{ fontSize: "0.88rem" }}>{matchup.lateGamePlan}</p>
            </div>
          </div>
        </article>

        <article className="detail-panel" style={{ alignSelf: "stretch", display: "flex", flexDirection: "column" }}>
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#c9a35b" }}>
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/>
            </svg>
            Hero Focus
          </h2>
          <div className="grid grid-cols-2 gap-2" style={{ flex: 1, gridTemplateRows: `repeat(${Math.ceil(matchup.heroChoices.length / 2)}, 1fr)` }}>
            {matchup.heroChoices.map((hero) => {
              const heroData = heroes.find((h) => h.name === (heroNameAlias[hero] ?? hero));
              const attr = heroData?.primaryAttribute;
              return (
                <Link
                  key={hero}
                  href={`/heroes/${heroData?.slug ?? hero.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-line bg-white/[0.02] p-2 hero-focus-card"
                >
                  <div className="relative w-full" style={{ maxWidth: 64, aspectRatio: "1/1" }}>
                    <GameImage
                      src={heroImages[hero] ?? "/placeholder.svg"}
                      alt={hero}
                      width={64}
                      height={64}
                      className="w-full h-full rounded-[6px] object-cover border border-line"
                    />
                  </div>
                  <span className="text-text text-center leading-snug font-semibold" style={{ fontSize: "0.75rem" }}>{hero}</span>
                  {attr && (
                    <span className="text-muted text-center leading-none" style={{ fontSize: "0.68rem" }}>
                      <span aria-hidden="true">{attrIcon[attr]} </span>{attr}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </article>
      </div>

      {/* Common mistakes */}
      <article className="detail-panel">
        <h2 className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#f87171" }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Common Mistakes
        </h2>
        <ul className="list-none pl-0 flex flex-col gap-2 m-0">
          {matchup.commonMistakes.map((mistake) => (
            <li key={mistake} className="flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-70 mt-0.5" style={{ color: "#f87171" }}>
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span className="text-muted leading-relaxed" style={{ fontSize: "0.88rem" }}>{ensureSentencePeriod(mistake)}</span>
            </li>
          ))}
        </ul>
      </article>

    </div>
  );
}
