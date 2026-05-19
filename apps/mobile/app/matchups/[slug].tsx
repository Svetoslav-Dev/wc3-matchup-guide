import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMatchupContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function MatchupDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: matchup, loading } = useMatchupContent(slug);

  if (!matchup) {
    return (
      <ScreenShell>
        <PageTitle>Matchup not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>{matchup.difficulty}</SectionLabel>
      <PageTitle>{matchup.title}</PageTitle>
      <PageIntro>{matchup.summary}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing matchup notes…</Text> : null}
      <View style={{ gap: 14 }}>
        <GhostBadge>Early Game</GhostBadge>
        <Text style={{ color: "#a7b4cd", lineHeight: 22 }}>{matchup.earlyGamePlan}</Text>
        <GhostBadge>Mid Game</GhostBadge>
        <Text style={{ color: "#a7b4cd", lineHeight: 22 }}>{matchup.midGamePlan}</Text>
        <GhostBadge>Late Game</GhostBadge>
        <Text style={{ color: "#a7b4cd", lineHeight: 22 }}>{matchup.lateGamePlan}</Text>
      </View>
    </ScreenShell>
  );
}
