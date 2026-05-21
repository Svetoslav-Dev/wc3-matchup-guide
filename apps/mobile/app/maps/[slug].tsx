import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMapContent } from "../../lib/live-content";
import { items } from "@warcraft3-guide-hub/shared";
import { colors } from "../../lib/theme";

const itemImageMap: Record<string, string> = Object.fromEntries(
  items.map((i) => [i.name, i.imageFile]),
);

const RACE_COLORS: Record<string, string> = {
  Human:     "#60a5fa",
  Orc:       "#4ade80",
  Undead:    "#a78bfa",
  "Night Elf": "#f97316",
};

const panelStyle = {
  backgroundColor: colors.panel,
  borderColor: colors.line,
  borderWidth: 1,
  borderRadius: 18,
  padding: 16,
  gap: 12,
} as const;

export default function MapDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: map, loading } = useMapContent(slug);

  if (!map) {
    return (
      <ScreenShell>
        <PageTitle>Map not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>Map Guide</SectionLabel>
      <PageTitle>{map.name}</PageTitle>
      {map.imageUrl ? (
        <Image
          source={{ uri: map.imageUrl }}
          style={styles.mapImage}
          resizeMode="contain"
        />
      ) : null}
      <PageIntro>{map.description}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing map guide…</Text> : null}

      {map.raceAdvantage ? (
        <View style={[panelStyle, styles.advantagePanel]}>
          <View style={styles.advantageHeader}>
            <Text style={styles.advantageLabel}>Race Advantage</Text>
            <View style={[styles.racePill, { borderColor: RACE_COLORS[map.raceAdvantage.race] ?? colors.gold }]}>
              <Text style={[styles.racePillText, { color: RACE_COLORS[map.raceAdvantage.race] ?? colors.gold }]}>
                {map.raceAdvantage.race}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.muted, lineHeight: 22 }}>{map.raceAdvantage.reason}</Text>
        </View>
      ) : null}

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Creep Notes</Text>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>{map.creepNotes}</Text>
      </View>

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Expansion Notes</Text>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>{map.expansionNotes}</Text>
      </View>

      {map.availableItems.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Available Items</Text>
          {map.availableItems.map((itemName) => {
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  mapImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: colors.bgSoft,
  },
  advantagePanel: {
    borderColor: colors.gold,
  },
  advantageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  advantageLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  racePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  racePillText: {
    fontSize: 12,
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
