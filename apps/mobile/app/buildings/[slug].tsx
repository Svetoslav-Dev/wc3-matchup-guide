import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { gameImageUri } from "../../components/mobile-ui";
import { buildings } from "@warcraft3-guide-hub/shared";
import { colors } from "../../lib/theme";

const toSlug = (b: { race: string; imageFile: string }) =>
  `${b.race}-${b.imageFile.toLowerCase()}`;

const UNIT_IMAGES: Record<string, string> = {
  // Heroes (checked before units — longer names must come first in lookup)
  "Tauren Chieftain":      "/images/Heroes/HeroTaurenChieftain.png",
  "Keeper of the Grove":   "/images/Heroes/KeeperOfTheGrove.png",
  "Priestess of the Moon": "/images/Heroes/PriestessOfTheMoon.png",
  "Mountain King":         "/images/Heroes/HeroMountainKing.png",
  "Demon Hunter":          "/images/Heroes/HeroDemonHunter.png",
  "Death Knight":          "/images/Heroes/HeroDeathKnight.png",
  "Shadow Hunter":         "/images/Heroes/ShadowHunter.png",
  "Crypt Lord":            "/images/Heroes/HeroCryptLord.png",
  "Blood Mage":            "/images/Heroes/HeroBloodElfPrince.png",
  "Far Seer":              "/images/Heroes/HeroFarseer.png",
  "Dreadlord":             "/images/Heroes/HeroDreadLord.png",
  "Blademaster":           "/images/Heroes/HeroBlademaster.png",
  "Archmage":              "/images/Heroes/HeroArchMage.png",
  "Paladin":               "/images/Heroes/HeroPaladin.png",
  "Warden":                "/images/Heroes/HeroWarden.png",
  "Lich":                  "/images/Heroes/LichVersion2.png",
  // Human units
  "Gryphon Riders":        "/images/Units/GryphonRider.png",
  "Spell Breakers":        "/images/Units/SpellBreaker.png",
  "Dragonhawk Riders":     "/images/Units/DragonHawk.png",
  "Siege Engines":         "/images/Units/SeigeEngine.png",
  "Flying Machines":       "/images/Units/FlyingMachine.png",
  "Mortar Teams":          "/images/Units/MortarTeam.png",
  "Sorceresses":           "/images/Units/Sorceress.png",
  "Riflemen":              "/images/Units/Rifleman.png",
  "Footmen":               "/images/Units/Footman.png",
  "Peasants":              "/images/Units/Peasant.png",
  "Knights":               "/images/Units/Knight.png",
  "Priests":               "/images/Units/Priest.png",
  // Orc units
  "Troll Batriders":       "/images/Units/TrollBatRider.png",
  "Goblin Zeppelins":      "/images/Units/GoblinZeppelin.png",
  "Goblin Sappers":        "/images/Units/GoblinSapper.png",
  "Spirit Walkers":        "/images/Units/SpiritWalker.png",
  "Witch Doctors":         "/images/Units/WitchDoctor.png",
  "Headhunters":           "/images/Units/HeadHunter.png",
  "Shamans":               "/images/Units/Shaman.png",
  "Raiders":               "/images/Units/Raider.png",
  "Tauren":                "/images/Units/Tauren.png",
  "Grunts":                "/images/Units/Grunt.png",
  "Peons":                 "/images/Units/Peon.png",
  // Undead units
  "Crypt Fiends":          "/images/Units/CryptFiend.png",
  "Frost Wyrms":           "/images/Units/FrostWyrm.png",
  "Necromancers":          "/images/Units/Necromancer.png",
  "Abominations":          "/images/Units/Abomination.png",
  "Destroyers":            "/images/Units/Destroyer.png",
  "Gargoyles":             "/images/Units/Gargoyle.png",
  "Banshees":              "/images/Units/Banshee.png",
  "Acolytes":              "/images/Units/Acolyte.png",
  "Ghouls":                "/images/Units/Ghoul.png",
  // Night Elf units
  "Druids of the Claw":    "/images/Units/DruidOfTheClaw.png",
  "Druids of the Talon":   "/images/Units/DruidOfTheTalon.png",
  "Faerie Dragons":        "/images/Units/FaerieDragon.png",
  "Glaive Throwers":       "/images/Units/GlaiveThrower.png",
  "Hippogryphs":           "/images/Units/Hippogriff.png",
  "Huntresses":            "/images/Units/Huntress.png",
  "Chimaeras":             "/images/Units/Chimaera.png",
  "Archers":               "/images/Units/Archer.png",
  "Wisps":                 "/images/Units/Wisp.png",
};

const BUILDING_IMAGES: Record<string, string> = {
  // Upgrade targets
  "Keep":               "/images/Buildings/Keep.png",
  "Castle":             "/images/Buildings/Castle.png",
  "Stronghold":         "/images/Buildings/Stronghold.png",
  "Fortress":           "/images/Buildings/Fortress.png",
  "Halls of the Dead":  "/images/Buildings/HallsOfTheDead.png",
  "Black Citadel":      "/images/Buildings/BlackCitadel.png",
  "Tree of Ages":       "/images/Buildings/TreeOfAges.png",
  "Tree of Eternity":   "/images/Buildings/TreeOfEternity.png",
  "Spirit Tower":       "/images/Buildings/SpiritTower.png",
  "Frost Tower":        "/images/Buildings/FrostTower.png",
  "Guard Tower":        "/images/Buildings/GuardTower.png",
  "Cannon Tower":       "/images/Buildings/CannonTower.png",
  "Arcane Tower":       "/images/Buildings/ArcaneTower.png",
  // Unlock targets (single buildings)
  "Boneyard":           "/images/Buildings/Boneyard.png",
  "Chimaera Roost":     "/images/Buildings/ChimaeraRoost.png",
  "Ancient of Wind":    "/images/Buildings/AncientOfWind.png",
  "Ancient of Lore":    "/images/Buildings/AncientOfLore.png",
  "Spirit Lodge":       "/images/Buildings/SpiritLodge.png",
  "Tauren Totem":       "/images/Buildings/TaurenTotem.png",
  "Temple of the Damned": "/images/Buildings/TempleOfTheDamned.png",
  "Slaughterhouse":     "/images/Buildings/Slaughterhouse.png",
};

type ParsedItem = { prefix: string; iconPath: string | null; suffix: string };

function parseProducesItem(item: string): ParsedItem {
  // Unit / hero lookup — longer keys first to avoid partial matches
  const unitKeys = Object.keys(UNIT_IMAGES).sort((a, b) => b.length - a.length);
  for (const name of unitKeys) {
    const idx = item.indexOf(name);
    if (idx !== -1) {
      return { prefix: item.slice(0, idx), iconPath: UNIT_IMAGES[name]!, suffix: item.slice(idx) };
    }
  }
  // Building lookup — longer keys first
  const buildingKeys = Object.keys(BUILDING_IMAGES).sort((a, b) => b.length - a.length);
  for (const name of buildingKeys) {
    const idx = item.indexOf(name);
    if (idx !== -1) {
      return { prefix: item.slice(0, idx), iconPath: BUILDING_IMAGES[name]!, suffix: item.slice(idx) };
    }
  }
  return { prefix: item, iconPath: null, suffix: "" };
}

const RACE_LABEL: Record<string, string> = {
  human:       "Human",
  orc:         "Orc",
  undead:      "Undead",
  "night-elf": "Night Elf",
  neutral:     "Neutral",
};

export default function BuildingDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const building = buildings.find((b) => toSlug(b) === slug);

  if (!building) {
    return (
      <ScreenShell>
        <Text style={{ color: colors.muted }}>Building not found.</Text>
      </ScreenShell>
    );
  }

  const isMapObject = building.gold === 0 && building.lumber === 0;
  const raceLabel = RACE_LABEL[building.race] ?? building.race;

  return (
    <ScreenShell>
      {/* Back */}
      <Pressable
        onPress={() => router.back()}
        style={({ hovered, pressed }) => [
          styles.backBtn,
          (hovered || pressed) ? styles.backBtnActive : null,
        ]}
      >
        <Text style={styles.backText}>← Buildings</Text>
      </Pressable>

      {/* Hero panel */}
      <View style={styles.hero}>
        <View style={styles.heroImgWrap}>
          <Image
            source={{ uri: gameImageUri(`/images/Buildings/${building.imageFile}.png`) }}
            style={styles.heroImg}
          />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.raceLabel}>{raceLabel}</Text>
          <Text style={styles.heroTitle}>{building.name}</Text>
          {!isMapObject ? (
            <View style={styles.costRow}>
              <View style={styles.costChip}>
                <Text style={styles.costGold}>🪙 {building.gold}</Text>
              </View>
              <View style={styles.costChip}>
                <Text style={styles.costLumber}>🪵 {building.lumber}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.costChip}>
              <Text style={styles.mapObjectText}>Map Object</Text>
            </View>
          )}
        </View>
      </View>

      {/* Role & Function */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Role &amp; Function</Text>
        <Text style={styles.panelBody}>{building.description}</Text>
      </View>

      {/* Produces / Provides */}
      {building.produces?.length ? (() => {
        const heroSummons = building.produces
          .filter(item => item.startsWith("Summons ") && !item.includes("fallen"))
          .map(item => item.slice("Summons ".length));
        const producesItems = [
          ...(heroSummons.length > 0 ? ["Summon heroes"] : []),
          ...building.produces.filter(item => !(item.startsWith("Summons ") && !item.includes("fallen"))),
        ];
        const sectionTitle = producesItems.some(i => i.startsWith("Sells"))
          ? "Sells"
          : producesItems.some(i => i.startsWith("Trains"))
          ? "Trains"
          : producesItems.some(i => i.includes("Upgrades to"))
          ? "Upgrades"
          : "Upgrades & Provides";

        return (
          <>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>{sectionTitle}</Text>
              <View style={styles.producesList}>
                {producesItems.map((item) => {
                  const { prefix, iconPath, suffix } = parseProducesItem(item);
                  const displayItem = item.toLowerCase().includes("food")
                    ? item.replace(/(\+\d+)/, "🍖 $1")
                    : item;
                  return (
                    <View key={item} style={styles.producesRow}>
                      <View style={styles.producesDot} />
                      {iconPath ? (
                        <>
                          {prefix ? <Text style={styles.producesPrefix}>{prefix}</Text> : null}
                          <Image
                            source={{ uri: gameImageUri(iconPath) }}
                            style={styles.producesIcon}
                          />
                          <Text style={styles.producesText}>{suffix}</Text>
                        </>
                      ) : (
                        <Text style={styles.producesText}>{displayItem}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Can Summon */}
            {heroSummons.length > 0 ? (
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Faction Heroes</Text>
                <View style={styles.summonGrid}>
                  {heroSummons.map((heroName) => {
                    const imgPath = UNIT_IMAGES[heroName] ?? null;
                    return (
                      <View key={heroName} style={styles.summonCard}>
                        <View style={styles.summonPortraitWrap}>
                          {imgPath ? (
                            <Image
                              source={{ uri: gameImageUri(imgPath) }}
                              style={styles.summonPortrait}
                            />
                          ) : (
                            <View style={[styles.summonPortrait, styles.summonPortraitPlaceholder]} />
                          )}
                        </View>
                        <Text style={styles.summonName} numberOfLines={2}>{heroName}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </>
        );
      })() : null}

      {/* Ladder Tip */}
      <View style={styles.panel}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>Ladder Tip</Text>
          <View style={styles.tipBadge}>
            <Text style={styles.tipBadgeText}>Tip</Text>
          </View>
        </View>
        <Text style={styles.panelBody}>{building.tip}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  backBtnActive: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.gold,
  },
  backText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  heroImgWrap: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImg: {
    width: 64,
    height: 64,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  raceLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.85,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  costRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  costChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.bgSoft,
  },
  costGold: {
    color: "#c9a35b",
    fontSize: 12,
    fontWeight: "700",
  },
  costLumber: {
    color: "#7fa66b",
    fontSize: 12,
    fontWeight: "700",
  },
  mapObjectText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  panelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  panelBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  producesList: {
    gap: 8,
  },
  producesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 36,
  },
  producesIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    flexShrink: 0,
  },
  producesDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    flexShrink: 0,
  },
  producesPrefix: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  producesText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  summonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summonCard: {
    alignItems: "center",
    gap: 5,
    width: 72,
  },
  summonPortraitWrap: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.gold,
    overflow: "hidden",
  },
  summonPortrait: {
    width: 64,
    height: 64,
  },
  summonPortraitPlaceholder: {
    backgroundColor: colors.bgSoft,
  },
  summonName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 15,
  },
  tipBadge: {
    backgroundColor: "rgba(96,165,250,0.12)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tipBadgeText: {
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: "700",
  },
});
