import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMapContent } from "../../lib/live-content";
import { items } from "@warcraft3-guide-hub/shared";
import { colors } from "../../lib/theme";

const itemImageMap: Record<string, string> = Object.fromEntries(
  items.map((i) => [i.name, i.imageFile]),
);

function getItemSourceLabel(itemName: string) {
  const item = items.find((entry) => entry.name === itemName);

  if (!item) {
    return "Drop / Shop";
  }

  const hasDrop = item.shops.includes("creep-drop");
  const hasShop = item.shops.some((shop) => shop !== "creep-drop");

  if (hasDrop && hasShop) {
    return "Drop / Shop";
  }

  if (hasDrop) {
    return "Drop";
  }

  return "Shop";
}

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
  const router = useRouter();
  const { data: map, loading } = useMapContent(slug);
  const [showAllItems, setShowAllItems] = useState(false);

  useEffect(() => {
    setShowAllItems(false);
  }, [slug]);

  if (!map) {
    return (
      <ScreenShell>
        <PageTitle>Map not found.</PageTitle>
      </ScreenShell>
    );
  }

  const visibleItems = map.availableItems.filter((itemName) => itemImageMap[itemName]);
  const previewItems = showAllItems ? visibleItems : visibleItems.slice(0, 6);
  const hasMoreItems = visibleItems.length > 6;

  return (
    <ScreenShell>
      <Pressable
        onPress={() => router.back()}
        style={({ hovered, pressed }) => [styles.backBtn, (hovered || pressed) ? styles.backBtnActive : null]}
      >
        <Text style={styles.backText}>← Maps</Text>
      </Pressable>
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

      {visibleItems.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Drops / Shop Items</Text>
          {previewItems.map((itemName) => {
            const imageFile = itemImageMap[itemName];
            const sourceLabel = getItemSourceLabel(itemName);
            return (
              <View key={itemName} style={styles.itemRow}>
                <Image
                  source={{ uri: `/images/Items/${imageFile}.png` }}
                  style={styles.itemIcon}
                />
                <Text style={styles.itemName}>{itemName}</Text>
                <View style={styles.itemSourceTag}>
                  <Text style={styles.itemSourceText}>{sourceLabel}</Text>
                </View>
              </View>
            );
          })}
          {hasMoreItems ? (
            <Pressable
              onPress={() => setShowAllItems((current) => !current)}
              style={({ pressed }) => [styles.moreBtn, pressed ? styles.moreBtnActive : null]}
            >
              <Text style={styles.moreBtnText}>
                {showAllItems ? "Show less" : `Show more (${visibleItems.length - 6})`}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  backBtnActive: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.gold,
  },
  backText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
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
  itemName: {
    flex: 1,
    color: colors.muted,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  itemSourceTag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.bgSoft,
  },
  itemSourceText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  moreBtn: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgSoft,
  },
  moreBtnActive: {
    borderColor: colors.gold,
  },
  moreBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
