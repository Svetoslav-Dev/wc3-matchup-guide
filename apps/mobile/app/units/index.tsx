import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useUnitsContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const raceFilters = [
  { slug: "all", label: "All" },
  { slug: "Human", label: "Human" },
  { slug: "Orc", label: "Orc" },
  { slug: "Undead", label: "Undead" },
  { slug: "Night Elf", label: "Night Elf" },
  { slug: "Neutral", label: "Neutral" },
];

export default function UnitsScreen() {
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
      <SectionLabel>Unit Library</SectionLabel>
      <PageTitle>Core units define timing, control, and counters.</PageTitle>
      <PageIntro>Browse units by race or search by name and type.</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading units…</Text> : null}
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search units</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by name or type"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
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
      </View>
      <GhostBadge>{filtered.length} result{filtered.length === 1 ? "" : "s"}</GhostBadge>
      {filtered.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No units match this filter.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search or switching to another race.</Text>
        </View>
      ) : null}
      {filtered.map((unit) => (
        <ListCard
          key={unit.slug}
          eyebrow={`${unit.raceName} · ${unit.tier} · ${unit.unitType}`}
          title={unit.name}
          description={unit.description}
          href={`/units/${unit.slug}`}
        />
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
  filterLabel: { color: colors.text, fontWeight: "700" },
  searchInput: {
    color: colors.text,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bgSoft,
  },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  chipText: { color: colors.muted, fontWeight: "700" },
  chipTextActive: { color: colors.gold },
  emptyPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  emptyCopy: { color: colors.muted, lineHeight: 22 },
});
