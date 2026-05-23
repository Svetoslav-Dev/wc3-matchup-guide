import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { items } from "@warcraft3-guide-hub/shared";
import { GhostBadge, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useHeroContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const itemImageMap: Record<string, string> = Object.fromEntries(
  items.map((i) => [i.name, i.imageFile]),
);

const ATTR_COLORS: Record<string, string> = {
  Strength:     "#e67c74",
  Agility:      "#78c78c",
  Intelligence: "#60a5fa",
};

const ATTR_SYMBOLS: Record<string, string> = {
  Strength:     "⚔",
  Agility:      "⚡",
  Intelligence: "✦",
};

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

  const attrColor = ATTR_COLORS[hero.primaryAttribute] ?? colors.gold;
  const attrSymbol = ATTR_SYMBOLS[hero.primaryAttribute] ?? "◆";

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

        <View style={styles.attrRow}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>Primary Attribute</Text>
          <View style={[styles.attrBadge, { borderColor: attrColor, backgroundColor: `${attrColor}22` }]}>
            <Text style={[styles.attrSymbol, { color: attrColor }]}>{attrSymbol}</Text>
            <Text style={[styles.attrLabel, { color: attrColor }]}>{hero.primaryAttribute}</Text>
          </View>
        </View>

        {hero.highlights.map((h) => (
          <Text key={h} style={{ color: colors.muted, lineHeight: 22 }}>• {h}</Text>
        ))}
      </View>

      {hero.bestItems.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Best Items</Text>
          {hero.bestItems.map((itemName) => {
            const imageFile = itemImageMap[itemName];
            return (
              <View key={itemName} style={styles.itemRow}>
                {imageFile ? (
                  <Image
                    source={{ uri: `/images/Items/${imageFile}.png` }}
                    style={styles.itemIcon}
                  />
                ) : (
                  <View style={styles.itemIconPlaceholder} />
                )}
                <Text style={{ color: colors.muted }}>{itemName}</Text>
              </View>
            );
          })}
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
  attrRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attrBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  attrSymbol: {
    fontSize: 13,
  },
  attrLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  itemIconPlaceholder: {
    width: 28,
    height: 28,
  },
});
