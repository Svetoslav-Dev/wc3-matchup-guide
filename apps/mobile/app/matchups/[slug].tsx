import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { DifficultyBadge, GhostBadge, getRaceDisplayName, getRaceIconUri } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMatchupContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

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
          <View style={styles.pillRow}>
            {matchup.heroChoices.map((hero: string) => (
              <View key={hero} style={styles.pill}>
                <Text style={styles.pillText}>{hero}</Text>
              </View>
            ))}
          </View>
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
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700",
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
