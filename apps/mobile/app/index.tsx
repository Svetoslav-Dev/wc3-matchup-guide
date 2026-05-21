import { StyleSheet, View } from "react-native";
import { ScreenShell } from "../components/screen-shell";
import { BuildCard, GhostBadge, MatchupCard, PageIntro, PageTitle, SectionLabel, StatRow } from "../components/mobile-ui";
import { useHomeContent } from "../lib/live-content";
import { colors } from "../lib/theme";

export default function HomeScreen() {
  const { builds, matchups, stats } = useHomeContent();

  return (
    <ScreenShell>

      <SectionLabel>Mobile Companion</SectionLabel>
      <PageTitle>Warcraft III study in your pocket.</PageTitle>
      <PageIntro>
        Browse races, matchups, and build orders from a compact Expo client designed around quick ladder reference.
      </PageIntro>

      <View style={styles.grid}>
        <StatRow label="Playable Races" value={stats.races} />
        <StatRow label="Builds" value={stats.builds} />
        <StatRow label="Matchups" value={stats.matchups} />
        <StatRow label="Heroes" value={stats.heroes} />
      </View>

      <GhostBadge>Worst Matchups</GhostBadge>
      {[
        matchups.find((m) => m.slug === "human-vs-undead"),
        matchups.find((m) => m.slug === "orc-vs-human"),
        matchups.find((m) => m.slug === "undead-vs-orc"),
        matchups.find((m) => m.slug === "night-elf-vs-undead"),
      ].filter(Boolean).map((matchup) => (
        <MatchupCard
          key={matchup!.slug}
          slug={matchup!.slug}
          difficulty={matchup!.difficulty}
          summary={matchup!.summary}
        />
      ))}

      <GhostBadge>Best Matchups</GhostBadge>
      {[
        matchups.find((m) => m.slug === "human-vs-orc"),
        matchups.find((m) => m.slug === "orc-vs-undead"),
        matchups.find((m) => m.slug === "undead-vs-night-elf"),
        matchups.find((m) => m.slug === "night-elf-vs-human"),
      ].filter(Boolean).map((matchup) => (
        <MatchupCard
          key={matchup!.slug}
          slug={matchup!.slug}
          difficulty={matchup!.difficulty}
          summary={matchup!.summary}
        />
      ))}

      <GhostBadge>Build Routes</GhostBadge>
      {builds.slice(0, 2).map((build) => (
        <BuildCard
          key={build.slug}
          slug={build.slug}
          raceSlug={build.raceSlug}
          raceName={build.raceName}
          difficulty={build.difficulty}
          title={build.title}
          summary={build.summary}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
});
