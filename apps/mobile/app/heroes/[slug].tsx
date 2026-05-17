import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useHeroContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function HeroDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: hero, error, loading, live } = useHeroContent(slug);

  if (!hero) {
    return (
      <ScreenShell>
        <PageTitle>Hero not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>{hero.raceName}</SectionLabel>
      <PageTitle>{hero.name}</PageTitle>
      <PageIntro>{hero.description}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing hero guide…</Text> : null}
      {error ? <Text style={{ color: colors.muted }}>API unavailable. Showing fallback hero guide.</Text> : null}
      <Text style={{ color: colors.muted }}>{live ? "Live API content" : "Shared fallback content"}</Text>
      <View
        style={{
          backgroundColor: colors.panel,
          borderColor: colors.line,
          borderWidth: 1,
          borderRadius: 18,
          padding: 16,
          gap: 12,
        }}
      >
        <GhostBadge>{hero.role}</GhostBadge>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
          Primary Attribute: {hero.primaryAttribute}
        </Text>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>
          Highlights: {hero.highlights.join(", ")}
        </Text>
      </View>
    </ScreenShell>
  );
}
