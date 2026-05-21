import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, SectionLabel } from "../../components/mobile-ui";
import { useMapsContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const MAP_FORMAT: Record<string, string> = {
  "echo-isles":           "1v1",
  "terenas-stand":        "1v1",
  "turtle-rock":          "1v1",
  "twisted-meadows":      "1v1",
  "the-two-rivers":       "1v1",
  "floodplains-1v1":      "1v1",
  "secret-valley":        "1v1",
  "lost-temple":          "1v1",
  "traversing-the-ruins": "2v2",
  "tranquil-paths":       "FFA",
  "avalanche":            "4v4",
  "the-crucible":         "4v4",
  "deadlands":            "4v4",
  "gold-rush":            "4v4",
  "market-square":        "4v4",
  "battleground":         "4v4",
  "murgul-oasis":         "4v4",
  "dustwallow-keys":      "4v4",
  "dragon-falls":         "4v4",
  "ice-crown":            "6v6",
};

const FORMAT_OPTIONS = ["All", "1v1", "2v2", "4v4", "6v6", "FFA"];

const FORMAT_COLOR: Record<string, string> = {
  "1v1": colors.gold,
  "2v2": "#4ade80",
  "4v4": "#60a5fa",
  "6v6": "#a78bfa",
  "FFA": "#f87171",
};

export default function MapsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const { data: maps, loading } = useMapsContent();
  const normalized = search.trim().toLowerCase();

  const filtered = maps.filter((map) => {
    const matchesFormat =
      formatFilter === "All" || (MAP_FORMAT[map.slug] ?? "1v1") === formatFilter;
    const matchesSearch =
      normalized.length === 0 ||
      [map.name, map.description].join(" ").toLowerCase().includes(normalized);
    return matchesFormat && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Maps</SectionLabel>
      {loading ? <Text style={{ color: colors.muted }}>Loading maps…</Text> : null}
      <View style={styles.filterPanel}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by map name"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {FORMAT_OPTIONS.map((fmt) => {
              const active = fmt === formatFilter;
              return (
                <Pressable
                  key={fmt}
                  onPress={() => setFormatFilter(fmt)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{fmt}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <GhostBadge>{filtered.length} map{filtered.length === 1 ? "" : "s"}</GhostBadge>
      {filtered.map((map) => {
        const fmt = MAP_FORMAT[map.slug] ?? "1v1";
        const fmtColor = FORMAT_COLOR[fmt] ?? colors.muted;
        return (
          <Pressable
            key={map.slug}
            onPress={() => router.push(`/maps/${map.slug}` as never)}
            style={({ hovered, pressed }) => [
              styles.card,
              (hovered || pressed) ? styles.cardHovered : null,
            ]}
          >
            <View style={styles.cardRow}>
              {map.imageUrl ? (
                <Image source={{ uri: map.imageUrl }} style={styles.mapThumb} resizeMode="cover" />
              ) : null}
              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{map.name}</Text>
                  <View style={[styles.formatTag, { borderColor: fmtColor }]}>
                    <Text style={[styles.formatTagText, { color: fmtColor }]}>{fmt}</Text>
                  </View>
                </View>
                <Text style={styles.description} numberOfLines={3}>{map.description}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  filterPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  searchInput: {
    color: colors.text,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bgSoft,
  },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  chipText: { color: colors.muted, fontWeight: "700", fontSize: 13 },
  chipTextActive: { color: colors.gold },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    overflow: "hidden",
  },
  cardHovered: { backgroundColor: colors.bgSoft },
  cardRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  mapThumb: { width: 80, height: 80, borderRadius: 8, flexShrink: 0 },
  cardBody: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { color: colors.text, fontSize: 15, fontWeight: "700", flex: 1 },
  formatTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  formatTagText: { fontSize: 11, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
