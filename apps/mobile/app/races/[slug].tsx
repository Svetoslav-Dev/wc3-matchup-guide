import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { gameImageUri, getRaceIconUri, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useHeroesContent, useRaceContent } from "../../lib/live-content";
import { getApiBaseUrl } from "../../lib/api";
import { colors } from "../../lib/theme";

function resolveImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  const apiBase = getApiBaseUrl();
  if (!apiBase) return null;
  const origin = apiBase.replace(/\/api$/, "");
  return `${origin}${imageUrl}`;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:        "#4ade80",
  Medium:      "#facc15",
  Hard:        "#f97316",
  "Very Hard": "#ef4444",
};

type ItemEntry = { name: string; imageFile: string };

const BEST_ITEMS: Record<string, ItemEntry[]> = {
  human: [
    { name: "Scroll of Town Portal",    imageFile: "ScrollOfTownPortal" },
    { name: "Runed Bracers",            imageFile: "RunedBracers" },
    { name: "Orb of Fire",              imageFile: "OrbOfFire" },
    { name: "Lion Horn of Stormwind",   imageFile: "LionHornOfStormwind" },
    { name: "Boots of Speed",           imageFile: "BootsOfSpeed" },
    { name: "Circlet of Nobility",      imageFile: "CircletOfNobility" },
  ],
  orc: [
    { name: "Healing Salve",            imageFile: "PotionOfHealing" },
    { name: "Scroll of Town Portal",    imageFile: "ScrollOfTownPortal" },
    { name: "Gloves of Haste",          imageFile: "GlovesOfHaste" },
    { name: "Claws of Attack",          imageFile: "ClawsOfAttack" },
    { name: "Ancient Janggo",           imageFile: "AncientJanggoOfEndurance" },
    { name: "Boots of Speed",           imageFile: "BootsOfSpeed" },
  ],
  "night-elf": [
    { name: "Staff of Preservation",    imageFile: "StaffOfPreservation" },
    { name: "Scroll of Town Portal",    imageFile: "ScrollOfTownPortal" },
    { name: "Orb of Venom",             imageFile: "OrbOfVenom" },
    { name: "Khadgar's Pipe",           imageFile: "KhadgarsPipeOfInsight" },
    { name: "Robe of the Magi",         imageFile: "RobeOfTheMagi" },
    { name: "Boots of Speed",           imageFile: "BootsOfSpeed" },
  ],
  undead: [
    { name: "Orb of Corruption",        imageFile: "OrbOfCorruption" },
    { name: "Sobi Mask",                imageFile: "SobiMask" },
    { name: "Scroll of Town Portal",    imageFile: "ScrollOfTownPortal" },
    { name: "Runed Bracers",            imageFile: "RunedBracers" },
    { name: "Periapt of Vitality",      imageFile: "PeriaptOfVitality" },
    { name: "Boots of Speed",           imageFile: "BootsOfSpeed" },
  ],
};

const ALTAR_NAMES: Record<string, string> = {
  human:       "Altar of Kings",
  orc:         "Altar of Storms",
  "night-elf": "Altar of Elders",
  undead:      "Altar of Darkness",
};

// Common tavern hero picks for each race (hero names as returned by the API)
const TAVERN_PICKS: Record<string, string[]> = {
  human:       ["Naga Sea Witch", "Dark Ranger", "Firelord"],
  orc:         ["Beastmaster", "Naga Sea Witch", "Pandaren Brewmaster"],
  "night-elf": ["Naga Sea Witch", "Beastmaster"],
  undead:      ["Naga Sea Witch", "Beastmaster", "Pit Lord"],
};

export default function RaceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: race, loading } = useRaceContent(slug);
  const { data: allHeroes } = useHeroesContent();

  if (!race) {
    return (
      <ScreenShell>
        <Text style={{ color: colors.muted }}>Race not found.</Text>
      </ScreenShell>
    );
  }

  // All heroes belonging to this race (includes Blood Mage for Human, etc.)
  const raceHeroes = allHeroes.filter((h) => h.raceName === race.name);

  // Tavern heroes that are commonly picked for this race
  const tavernPicks = (TAVERN_PICKS[slug ?? ""] ?? []);
  const tavernHeroes = allHeroes.filter(
    (h) => h.raceName === "Tavern" && tavernPicks.includes(h.name),
  );

  const diffColor = race.playDifficulty ? (DIFFICULTY_COLORS[race.playDifficulty] ?? colors.muted) : null;

  return (
    <ScreenShell>
      <Pressable
        onPress={() => router.canGoBack() ? router.back() : router.push("/races")}
        style={({ hovered, pressed }) => [styles.backBtn, (hovered || pressed) ? styles.backBtnActive : null]}
      >
        <Text style={styles.backText}>← Races</Text>
      </Pressable>

      {/* ── header ── */}
      <View style={styles.header}>
        <Image source={{ uri: getRaceIconUri(slug ?? "") }} style={styles.raceIcon} />
        <View style={styles.headerText}>
          <SectionLabel>{race.badge}</SectionLabel>
          <Text style={styles.raceName}>{race.name}</Text>
          {race.playDifficulty && diffColor ? (
            <View style={[styles.diffBadge, { borderColor: diffColor, backgroundColor: `${diffColor}18` }]}>
              <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
              <Text style={[styles.diffLabel, { color: diffColor }]}>{race.playDifficulty}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── identity & description ── */}
      <Text style={styles.identity}>{race.identity}</Text>
      <Text style={styles.description}>{race.description}</Text>

      {loading ? <Text style={styles.refreshing}>Refreshing race notes…</Text> : null}

      {/* ── strengths ── */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Strengths</Text>
        <View style={styles.pillRow}>
          {race.strengths.map((s) => (
            <View key={s} style={styles.pill}>
              <Text style={styles.pillText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── race heroes ── */}
      <View style={styles.panel}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>Heroes</Text>
          {ALTAR_NAMES[slug ?? ""] ? (
            <View style={[styles.tavernBadge, { backgroundColor: "rgba(167,139,250,0.12)" }]}>
              <Text style={[styles.tavernBadgeText, { color: "#a78bfa" }]}>{ALTAR_NAMES[slug ?? ""]}</Text>
            </View>
          ) : null}
        </View>
        <HeroGrid
          heroes={raceHeroes}
          fallbackNames={race.signatureHeroes}
          signatureNames={raceHeroes.map((h) => h.name)}
        />
      </View>

      {/* ── tavern picks ── */}
      {(tavernHeroes.length > 0 || tavernPicks.length > 0) ? (
        <View style={styles.panel}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Best Tavern Picks</Text>
            <View style={styles.tavernBadge}>
              <Text style={styles.tavernBadgeText}>Tavern</Text>
            </View>
          </View>
          <HeroGrid
            heroes={tavernHeroes}
            fallbackNames={tavernPicks}
            signatureNames={[]}
            accent="silver"
          />
        </View>
      ) : null}

      {/* ── best items ── */}
      {(BEST_ITEMS[slug ?? ""] ?? []).length > 0 ? (
        <View style={styles.panel}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Best Items to Prioritize</Text>
            <View style={[styles.tavernBadge, { backgroundColor: "rgba(96,165,250,0.12)" }]}>
              <Text style={[styles.tavernBadgeText, { color: "#60a5fa" }]}>Items</Text>
            </View>
          </View>
          <View style={styles.heroRow}>
            {(BEST_ITEMS[slug ?? ""] ?? []).map((item) => (
              <View key={item.name} style={styles.heroCard}>
                <View style={styles.itemIconWrap}>
                  <Image
                    source={{ uri: gameImageUri(`/images/Items/${item.imageFile}.png`) }}
                    style={styles.itemIcon}
                  />
                </View>
                <Text style={styles.heroName} numberOfLines={2}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* ── ladder focus ── */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Ladder Focus</Text>
        <Text style={styles.ladderText}>{race.ladderFocus}</Text>
      </View>
    </ScreenShell>
  );
}

function HeroGrid({
  heroes,
  fallbackNames,
  signatureNames,
  accent = "default",
}: {
  heroes: { slug: string; name: string; role?: string; imageUrl?: string | null }[];
  fallbackNames: string[];
  signatureNames: string[];
  accent?: "default" | "silver";
}) {
  const items = heroes.length > 0 ? heroes : null;

  if (items) {
    return (
      <View style={styles.heroRow}>
        {items.map((hero) => {
          const uri = resolveImageUrl(hero.imageUrl);
          const isSignature = signatureNames.includes(hero.name);
          const portraitStyle = isSignature
            ? styles.heroPortraitWrapSignature
            : accent === "silver"
              ? styles.heroPortraitWrapSilver
              : styles.heroPortraitWrap;
          return (
            <View key={hero.slug} style={styles.heroCard}>
              <View style={portraitStyle}>
                {uri ? (
                  <Image source={{ uri }} style={styles.heroPortrait} />
                ) : (
                  <View style={[styles.heroPortrait, styles.heroPortraitPlaceholder]} />
                )}
              </View>
              <Text style={styles.heroName} numberOfLines={2}>{hero.name}</Text>
              {hero.role ? <Text style={styles.heroRole} numberOfLines={1}>{hero.role}</Text> : null}
            </View>
          );
        })}
      </View>
    );
  }

  // Fallback: API not configured, show name-only placeholders
  return (
    <View style={styles.heroRow}>
      {fallbackNames.map((name) => (
        <View key={name} style={styles.heroCard}>
          <View style={accent === "silver" ? styles.heroPortraitWrapSilver : styles.heroPortraitWrap}>
            <View style={[styles.heroPortrait, styles.heroPortraitPlaceholder]} />
          </View>
          <Text style={styles.heroName} numberOfLines={2}>{name}</Text>
        </View>
      ))}
    </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  raceIcon: {
    width: 72,
    height: 72,
    borderRadius: 14,
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  raceName: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 34,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  diffLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  identity: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    fontStyle: "italic",
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  refreshing: {
    color: colors.muted,
    fontSize: 13,
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
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
  tavernBadge: {
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tavernBadgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  heroRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  heroCard: {
    alignItems: "center",
    gap: 5,
    width: 82,
  },
  heroPortraitWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  heroPortraitWrapSignature: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.gold,
    overflow: "hidden",
  },
  heroPortraitWrapSilver: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#c2c9d6",
    overflow: "hidden",
  },
  heroPortrait: {
    width: 72,
    height: 72,
  },
  heroPortraitPlaceholder: {
    backgroundColor: colors.bgSoft,
  },
  itemIconWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    backgroundColor: colors.bgSoft,
  },
  itemIcon: {
    width: 56,
    height: 56,
  },
  heroName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 16,
  },
  heroRole: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  ladderText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
