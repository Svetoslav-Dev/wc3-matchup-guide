import { notFound } from "next/navigation";
import Link from "next/link";
import { getBuildingBySlug } from "../../../lib/content";
import { GameImage } from "../../../components/game-image";
import type { Building } from "@warcraft3-guide-hub/shared";

const RACE_LABEL: Record<string, string> = {
  human: "Human", orc: "Orc", undead: "Undead", "night-elf": "Night Elf", neutral: "Neutral",
};

const UNIT_IMAGE: Record<string, string> = {
  "Peasants":             "/images/Units/Peasant.png",
  "Footmen":              "/images/Units/Footman.png",
  "Riflemen":             "/images/Units/Rifleman.png",
  "Mortar Teams":         "/images/Units/MortarTeam.png",
  "Knights":              "/images/Units/Knight.png",
  "Priests":              "/images/Units/Priest.png",
  "Sorceresses":          "/images/Units/Sorceress.png",
  "Spell Breakers":       "/images/Units/SpellBreaker.png",
  "Dragon Hawks":         "/images/Units/DragonHawk.png",
  "Flying Machines":      "/images/Units/FlyingMachine.png",
  "Gryphon Riders":       "/images/Units/GryphonRider.png",
  "Siege Engines":        "/images/Units/SeigeEngine.png",
  "Peons":                "/images/Units/Peon.png",
  "Grunts":               "/images/Units/Grunt.png",
  "Headhunters":          "/images/Units/HeadHunter.png",
  "Raiders":              "/images/Units/Raider.png",
  "Kodo Beasts":          "/images/Units/KodoBeast.png",
  "Wind Riders":          "/images/Units/WindRider.png",
  "Shamans":              "/images/Units/Shaman.png",
  "Witch Doctors":        "/images/Units/WitchDoctor.png",
  "Spirit Walkers":       "/images/Units/SpiritWalker.png",
  "Taurens":              "/images/Units/Tauren.png",
  "Demolishers":          "/images/Units/Demolisher.png",
  "Troll Batriders":      "/images/Units/TrollBatRider.png",
  "Goblin Sappers":       "/images/Units/GoblinSapper.png",
  "Goblin Zeppelins":     "/images/Units/GoblinZeppelin.png",
  "Acolytes":             "/images/Units/Acolyte.png",
  "Ghouls":               "/images/Units/Ghoul.png",
  "Crypt Fiends":         "/images/Units/CryptFiend.png",
  "Gargoyles":            "/images/Units/Gargoyle.png",
  "Abominations":         "/images/Units/Abomination.png",
  "Necromancers":         "/images/Units/Necromancer.png",
  "Banshees":             "/images/Units/Banshee.png",
  "Meat Wagons":          "/images/Units/MeatWagon.png",
  "Obsidian Statues":     "/images/Units/ObsidianStatue.png",
  "Destroyers":           "/images/Units/Destroyer.png",
  "Frost Wyrms":          "/images/Units/FrostWyrm.png",
  "Wisps":                "/images/Units/Wisp.png",
  "Archers":              "/images/Units/Archer.png",
  "Huntresses":           "/images/Units/Huntress.png",
  "Glaive Throwers":      "/images/Units/GlaiveThrower.png",
  "Dryads":               "/images/Units/Dryad.png",
  "Druids of the Claw":   "/images/Units/DruidOfTheClaw.png",
  "Druids of the Talon":  "/images/Units/DruidOfTheTalon.png",
  "Mountain Giants":      "/images/Units/MountainGiant.png",
  "Hippogryphs":          "/images/Units/Hippogriff.png",
  "Faerie Dragons":       "/images/Units/FaerieDragon.png",
  "Chimaeras":            "/images/Units/Chimaera.png",
};

const BUILDING_IMAGE: Record<string, string> = {
  "Keep":                 "Keep",
  "Castle":               "Castle",
  "Guard Tower":          "GuardTower",
  "Cannon Tower":         "CannonTower",
  "Arcane Tower":         "ArcaneTower",
  "Stronghold":           "Stronghold",
  "Fortress":             "Fortress",
  "Spirit Tower":         "SpiritTower",
  "Frost Tower":          "FrostTower",
  "Halls of the Dead":    "HallsOfTheDead",
  "Black Citadel":        "BlackCitadel",
  "Boneyard":             "Boneyard",
  "Tree of Ages":         "TreeOfAges",
  "Tree of Eternity":     "TreeOfEternity",
};

const HERO_IMAGE: Record<string, string> = {
  "Archmage":             "/images/Heroes/HeroArchMage.png",
  "Mountain King":        "/images/Heroes/HeroMountainKing.png",
  "Paladin":              "/images/Heroes/HeroPaladin.png",
  "Blood Mage":           "/images/Heroes/HeroBloodElfPrince.png",
  "Blademaster":          "/images/Heroes/HeroBlademaster.png",
  "Far Seer":             "/images/Heroes/HeroFarseer.png",
  "Shadow Hunter":        "/images/Heroes/ShadowHunter.png",
  "Tauren Chieftain":     "/images/Heroes/HeroTaurenChieftain.png",
  "Demon Hunter":         "/images/Heroes/HeroDemonHunter.png",
  "Keeper of the Grove":  "/images/Heroes/KeeperOfTheGrove.png",
  "Warden":               "/images/Heroes/HeroWarden.png",
  "Priestess of the Moon":"/images/Heroes/PriestessOfTheMoon.png",
  "Death Knight":         "/images/Heroes/HeroDeathKnight.png",
  "Lich":                 "/images/Heroes/LichVersion2.png",
  "Crypt Lord":           "/images/Heroes/HeroCryptLord.png",
  "Dreadlord":            "/images/Heroes/HeroDreadLord.png",
};

function extractTrainedUnit(line: string): string | null {
  const match = line.match(/^(?:Trains|Summons) ([^(]+?)(?:\s*\(|$)/);
  return match ? match[1].trim() : null;
}

function extractUpgradeTarget(line: string): string | null {
  const match = line.match(/^Upgrades to ([^(]+?)(?:\s*\(|$)/);
  return match ? match[1].trim() : null;
}

function extractUnlockTarget(line: string): string | null {
  if (line.includes(",")) return null; // multiple targets — skip icon
  const match = line.match(/^Unlocks ([^(]+?)(?:\s*\(|$)/);
  return match ? match[1].trim() : null;
}

function withFoodIcon(text: string): React.ReactNode {
  if (!text.toLowerCase().includes("food")) return text;
  const parts = text.split(/\bfood\b/gi);
  return parts.flatMap((part, i) =>
    i < parts.length - 1
      ? [part, <span key={i}><span aria-hidden="true">🍖</span> food</span>]
      : [part],
  );
}

import type React from "react";

type Props = { params: Promise<{ slug: string }> };

export default async function BuildingDetailPage({ params }: Props) {
  const { slug } = await params;
  const building = await getBuildingBySlug(slug);

  if (!building) notFound();

  const isMapObject = building.gold === 0 && building.lumber === 0;
  const raceLabel = RACE_LABEL[building.race] ?? building.race;

  return (
    <div className="page-shell page-stack">

      <div className="flex justify-start pt-1">
        <Link href="/buildings" className="button button--ghost button--sm">
          ← Back to Buildings
        </Link>
      </div>

      {/* Hero */}
      <div className="flex items-stretch gap-6 flex-wrap">
        <div className="panel flex items-center justify-center shrink-0" style={{ width: 148, padding: "1.25rem" }}>
          <GameImage
            src={`/images/Buildings/${building.imageFile}.png`}
            alt={building.name}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
          <p className="section-label m-0">{raceLabel}</p>
          <h1 className="page-title m-0">{building.name}</h1>
          <p className="page-intro m-0">{withFoodIcon(building.description)}</p>
        </div>
        <article className="detail-panel unit-stats-card shrink-0" style={{ minWidth: 180 }}>
          <p className="section-label">
            {isMapObject ? "Map Object" : "Build Cost"}
          </p>
          {isMapObject ? (
            <p className="text-muted" style={{ fontSize: "0.88rem" }}>
              Map object — cannot be constructed by players.
            </p>
          ) : (
            <div className="unit-stats-card__costs">
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <span aria-hidden="true">🪙</span>
                  Gold
                </span>
                <span className="unit-stat-row__value">{building.gold}</span>
              </div>
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <span aria-hidden="true">🪵</span>
                  Lumber
                </span>
                <span className="unit-stat-row__value">{building.lumber}</span>
              </div>
            </div>
          )}
        </article>
      </div>

      {/* Detail panels */}
      <div className="detail-grid">
        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#c9a35b" }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Role &amp; Function
          </h2>
          <p>{withFoodIcon(building.description)}</p>
        </article>

        <article className="detail-panel">
          <h2 className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#60a5fa" }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Ladder Tip
          </h2>
          <p>{withFoodIcon(building.tip)}</p>
        </article>

        {building.produces.length > 0 ? (
          <article className="detail-panel" style={{ gridColumn: "1 / -1" }}>
            <h2 className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#a78bfa" }}>
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Trains &amp; Upgrades
            </h2>
            <ul className="list-none pl-0 flex flex-col gap-2 mt-2">
              {building.produces.map((line: Building["produces"][number]) => {
                const trainName    = extractTrainedUnit(line);
                const upgradeName  = extractUpgradeTarget(line);
                const unlockName   = extractUnlockTarget(line);

                const unitImg      = trainName   ? (UNIT_IMAGE[trainName]   ?? HERO_IMAGE[trainName])   : null;
                const buildingFile = upgradeName ? BUILDING_IMAGE[upgradeName] : unlockName ? BUILDING_IMAGE[unlockName] : null;
                const buildingImg  = buildingFile ? `/images/Buildings/${buildingFile}.png` : null;

                const img = unitImg ?? buildingImg;
                const altText = trainName ?? upgradeName ?? unlockName ?? "";
                const isUpgrade = line.startsWith("Upgrades") || line.startsWith("Unlocks");

                return (
                  <li key={line} className="flex items-center gap-3">
                    {img ? (
                      <GameImage
                        src={img}
                        alt={altText}
                        width={28}
                        height={28}
                        className="rounded-[6px] shrink-0 border border-line object-contain"
                      />
                    ) : (
                      <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-[6px] border border-line" style={{ fontSize: "0.85rem" }}>
                        {isUpgrade ? "⬆" : "◆"}
                      </span>
                    )}
                    <span className="text-muted" style={{ fontSize: "0.9rem" }}>{line}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ) : null}
      </div>

    </div>
  );
}
