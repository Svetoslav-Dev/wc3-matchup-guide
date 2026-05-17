import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useRaceContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function RaceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: race, error, loading, live } = useRaceContent(slug);

  if (!race) {
    return (
      <ScreenShell>
        <PageTitle>Race not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>{race.badge}</SectionLabel>
      <PageTitle>{race.name}</PageTitle>
      <PageIntro>{race.description}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing race notes…</Text> : null}
      {error ? <Text style={{ color: colors.muted }}>API unavailable. Showing fallback race notes.</Text> : null}
      <Text style={{ color: colors.muted }}>{live ? "Live API content" : "Shared fallback content"}</Text>
      <GhostBadge>Ladder Focus</GhostBadge>
      <Text style={{ color: "#a7b4cd", lineHeight: 22 }}>{race.ladderFocus}</Text>
      <GhostBadge>Signature Heroes</GhostBadge>
      <Text style={{ color: "#eef3ff", lineHeight: 22 }}>{race.signatureHeroes.join(", ")}</Text>
    </ScreenShell>
  );
}
