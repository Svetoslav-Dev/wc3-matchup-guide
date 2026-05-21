import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, SectionLabel } from "../../components/mobile-ui";
import { useUnitsContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const raceFilters = [
  { slug: "all",       label: "All" },
  { slug: "Human",     label: "Human" },
  { slug: "Orc",       label: "Orc" },
  { slug: "Undead",    label: "Undead" },
  { slug: "Night Elf", label: "Night Elf" },
  { slug: "Neutral",   label: "Neutral" },
];

export default function UnitsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState("all");
  const { data: units, loading } = useUnitsContent();
  const normalized = search.trim().toLowerCase();

  const filtered = units.filter((unit) => {
    const matchesRace = raceFilter === "all" || unit.raceName === raceFilter;
    const matchesSearch =
      normalized.length === 0 ||
      [unit.name, unit.description, unit.unitType, unit.raceName].join(" ").toLowerCase().includes(normalized);
    return matchesRace && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Units</SectionLabel>
      {loading ? <Text style={{ color: colors.muted }}>Loading units…</Text> : null}
      <View style={styles.filterPanel}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by name or type"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {raceFilters.map(({ slug, label }) => {
              const active = slug === raceFilter;
              return (
                <Pressable
                  key={slug}
                  onPress={() => setRaceFilter(slug)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <GhostBadge>{filtered.length} unit{filtered.length === 1 ? "" : "s"}</GhostBadge>
      {filtered.map((unit) => (
        <Pressable
          key={unit.slug}
          onPress={() => router.push(`/units/${unit.slug}` as never)}
          style={({ hovered, pressed }) => [
            styles.card,
            (hovered || pressed) ? styles.cardHovered : null,
          ]}
        >
          <View style={styles.cardRow}>
            <Image
              source={{ uri: unit.imageUrl ?? "/images/placeholder.svg" }}
              style={styles.unitImg}
            />
            <View style={styles.cardText}>
              <Text style={styles.racePill}>{unit.raceName} · {unit.unitType}</Text>
              <Text style={styles.name}>{unit.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{unit.description}</Text>
            </View>
          </View>
        </Pressable>
      ))}
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
  },
  cardHovered: { backgroundColor: colors.bgSoft },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  unitImg: { width: 52, height: 52, borderRadius: 8 },
  cardText: { flex: 1, gap: 3 },
  racePill: { color: colors.gold, fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  name: { color: colors.text, fontSize: 15, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
