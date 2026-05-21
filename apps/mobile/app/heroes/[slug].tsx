import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageTitle, SectionLabel } from "../../components/mobile-ui";
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
      <View style={styles.header}>
        {hero.imageUrl ? (
          <Image source={{ uri: hero.imageUrl }} style={styles.portrait} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name}>{hero.name}</Text>
          <Text style={styles.description}>{hero.description}</Text>
        </View>
      </View>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  portrait: {
    width: 72,
    height: 72,
    borderRadius: 10,
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
