import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DifficultyBadge, GhostBadge, gameImageUri, getRaceDisplayName, getRaceIconUri } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMatchupContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const HERO_IMAGES: Record<string, string> = {
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
  "Pandaren Brewmaster":   "/images/Heroes/PandarenBrewmaster.png",
  "Beastmaster":           "/images/Heroes/BeastMaster.png",
  "Tinker":                "/images/Heroes/HeroTinker.png",
  "Alchemist":             "/images/Heroes/HeroAlchemist.png",
  "Pit Lord":              "/images/Heroes/PitLord.png",
};

function parseMatchupSlug(slug: string): [string, string] {
  const parts = slug.split("-vs-");
  return [parts[0] ?? "", parts[1] ?? ""];
}

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={card.wrap}>
      <Text style={card.label}>{label}</Text>
      {children}
    </View>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  label: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export default function MatchupDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: matchup, loading } = useMatchupContent(slug);

  if (!matchup) {
    return (
      <ScreenShell>
        <Text style={styles.notFound}>Matchup not found.</Text>
      </ScreenShell>
    );
  }

  const [raceA, raceB] = parseMatchupSlug(matchup.slug);

  return (
    <ScreenShell>
      <Pressable
        onPress={() => router.back()}
        style={({ hovered, pressed }) => [styles.backBtn, (hovered || pressed) ? styles.backBtnActive : null]}
      >
        <Text style={styles.backText}>← Matchups</Text>
      </Pressable>

      {/* Matchup header card */}
      <View style={styles.heroCard}>
        <View style={styles.racesRow}>
          <View style={styles.raceBlock}>
            <Image source={{ uri: getRaceIconUri(raceA) }} style={styles.raceIcon} />
            <Text style={styles.raceName}>{getRaceDisplayName(raceA)}</Text>
          </View>
          <View style={styles.vsWrap}>
            <Text style={styles.vsText}>vs</Text>
          </View>
          <View style={styles.raceBlock}>
            <Image source={{ uri: getRaceIconUri(raceB) }} style={styles.raceIcon} />
            <Text style={styles.raceName}>{getRaceDisplayName(raceB)}</Text>
          </View>
        </View>
        <View style={styles.heroCardFooter}>
          <DifficultyBadge value={matchup.difficulty} />
          {loading ? <Text style={styles.refreshing}>Refreshing…</Text> : null}
        </View>
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{matchup.summary}</Text>

      {/* Game plans */}
      <GhostBadge>Game Plan</GhostBadge>
      <SectionCard label="Early Game">
        <Text style={styles.bodyText}>{matchup.earlyGamePlan}</Text>
      </SectionCard>
      <SectionCard label="Mid Game">
        <Text style={styles.bodyText}>{matchup.midGamePlan}</Text>
      </SectionCard>
      <SectionCard label="Late Game">
        <Text style={styles.bodyText}>{matchup.lateGamePlan}</Text>
      </SectionCard>

      {/* Hero choices */}
      {matchup.heroChoices?.length ? (
        <>
          <GhostBadge>Hero Picks</GhostBadge>
          <SectionCard label="Recommended Heroes">
            <View style={styles.heroGrid}>
              {matchup.heroChoices.map((hero: string) => {
                const imgPath = HERO_IMAGES[hero];
                return (
                  <View key={hero} style={styles.heroItem}>
                    <View style={styles.heroPortraitWrap}>
                      {imgPath ? (
                        <Image
                          source={{ uri: gameImageUri(imgPath) }}
                          style={styles.heroPortrait}
                        />
                      ) : (
                        <View style={[styles.heroPortrait, styles.heroPortraitPlaceholder]} />
                      )}
                    </View>
                    <Text style={styles.heroName} numberOfLines={2}>{hero}</Text>
                  </View>
                );
              })}
            </View>
          </SectionCard>
        </>
      ) : null}

      {/* Common mistakes */}
      {matchup.commonMistakes?.length ? (
        <>
          <GhostBadge>Common Mistakes</GhostBadge>
          <View style={styles.mistakesList}>
            {matchup.commonMistakes.map((mistake: string, i: number) => (
              <View key={i} style={styles.mistakeRow}>
                <View style={styles.mistakeDot} />
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
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
  notFound: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  racesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  raceBlock: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  raceIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  raceName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  vsWrap: {
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vsText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  heroCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
  refreshing: {
    color: colors.muted,
    fontSize: 12,
  },
  summary: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  heroItem: {
    alignItems: "center",
    gap: 5,
    width: 72,
  },
  heroPortraitWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  heroPortrait: {
    width: 64,
    height: 64,
  },
  heroPortraitPlaceholder: {
    backgroundColor: colors.bgSoft,
  },
  heroName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 15,
  },
  mistakesList: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  mistakeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  mistakeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
    marginTop: 8,
    flexShrink: 0,
  },
  mistakeText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
