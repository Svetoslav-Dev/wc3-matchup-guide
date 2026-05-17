import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel, StatRow } from "../components/mobile-ui";
import { useHomeContent } from "../lib/live-content";
import { colors } from "../lib/theme";

export default function HomeScreen() {
  const { builds, error, live, loading, matchups, stats } = useHomeContent();

  return (
    <ScreenShell>
      <SectionLabel>Mobile Companion</SectionLabel>
      <PageTitle>Warcraft III study in your pocket.</PageTitle>
      <PageIntro>
        Browse races, matchups, and build orders from a compact Expo client designed around quick ladder reference.
      </PageIntro>

      <View style={styles.actions}>
        <Link href="/races" asChild>
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Race Guides</Text>
          </Pressable>
        </Link>
        <Link href="/builds" asChild>
          <Pressable style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Build Orders</Text>
          </Pressable>
        </Link>
        <Link href="/heroes" asChild>
          <Pressable style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Hero Guides</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.grid}>
        <StatRow label="Races" value={stats.races} />
        <StatRow label="Builds" value={stats.builds} />
        <StatRow label="Matchups" value={stats.matchups} />
        <StatRow label="Heroes" value={stats.heroes} />
      </View>

      {loading ? <Text style={styles.metaText}>Refreshing mobile content…</Text> : null}
      {error ? <Text style={styles.metaText}>API unavailable. Showing fallback content.</Text> : null}
      <GhostBadge>{live ? "Live Matchups" : "Featured Matchups"}</GhostBadge>
      {matchups.slice(0, 3).map((matchup) => (
        <ListCard
          key={matchup.slug}
          eyebrow={matchup.difficulty}
          title={matchup.title}
          description={matchup.summary}
          href={`/matchups/${matchup.slug}`}
        />
      ))}
      <GhostBadge>{live ? "Live Build Routes" : "Fallback Build Routes"}</GhostBadge>
      {builds.slice(0, 2).map((build) => (
        <ListCard
          key={build.slug}
          eyebrow={`${build.raceName} · ${build.strategyType}`}
          title={build.title}
          description={build.summary}
          href={`/builds/${build.slug}`}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryAction: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryActionText: {
    color: colors.bg,
    fontWeight: "800",
  },
  secondaryAction: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryActionText: {
    color: colors.text,
    fontWeight: "700",
  },
  grid: {
    gap: 12,
  },
  metaText: {
    color: colors.muted,
    lineHeight: 20,
  },
});
