import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useHeroContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function HeroDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: hero, loading } = useHeroContent(slug);

  if (!hero) {
    return (
      <ScreenShell>
        <PageTitle>Hero not found.</PageTitle>
      </ScreenShell>
    );
  }

  const panelStyle = {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  } as const;

  return (
    <ScreenShell>
      <SectionLabel>{hero.raceName}</SectionLabel>
      <PageTitle>{hero.name}</PageTitle>
      <PageIntro>{hero.description}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing hero guide…</Text> : null}

      <View style={panelStyle}>
        <GhostBadge>{hero.role}</GhostBadge>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          Primary Attribute: {hero.primaryAttribute}
        </Text>
        {hero.highlights.map((h) => (
          <Text key={h} style={{ color: colors.muted, lineHeight: 22 }}>• {h}</Text>
        ))}
      </View>

      {hero.bestItems.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Best Items</Text>
          {hero.bestItems.map((item) => (
            <Text key={item} style={{ color: colors.muted, lineHeight: 22 }}>• {item}</Text>
          ))}
        </View>
      ) : null}

      {hero.spells.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Spells</Text>
          {hero.spells.map((spell) => (
            <View key={spell.name} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{spell.name}</Text>
                {spell.isUltimate ? (
                  <View style={{ backgroundColor: colors.goldSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: "700" }}>Ultimate</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: colors.muted, lineHeight: 20, fontSize: 13 }}>{spell.description}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}
