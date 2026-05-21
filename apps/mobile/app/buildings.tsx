import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../components/screen-shell";
import { GhostBadge, SectionLabel } from "../components/mobile-ui";
import { buildings } from "@warcraft3-guide-hub/shared";
import { colors } from "../lib/theme";

const raceOptions = [
  { slug: "all",       label: "All" },
  { slug: "human",     label: "Human" },
  { slug: "orc",       label: "Orc" },
  { slug: "undead",    label: "Undead" },
  { slug: "night-elf", label: "Night Elf" },
  { slug: "neutral",   label: "Neutral" },
];

export default function BuildingsScreen() {
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState("all");

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = buildings.filter((b) => {
    const matchesRace = raceFilter === "all" || b.race === raceFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      b.name.toLowerCase().includes(normalizedSearch) ||
      b.description.toLowerCase().includes(normalizedSearch);
    return matchesRace && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Buildings</SectionLabel>

      <View style={styles.filterPanel}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by name or description"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {raceOptions.map((race) => {
              const active = race.slug === raceFilter;
              return (
                <Pressable
                  key={race.slug}
                  onPress={() => setRaceFilter(race.slug)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                    {race.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <GhostBadge>{filtered.length} building{filtered.length !== 1 ? "s" : ""}</GhostBadge>

      {filtered.map((building) => (
        <Pressable key={`${building.race}-${building.name}`} style={({ hovered, pressed }) => [styles.card, (hovered || pressed) ? styles.cardHovered : null]}>
          <View style={styles.cardRow}>
            <Image
              source={{ uri: `/images/Buildings/${building.imageFile}.png` }}
              style={styles.buildingImg}
              defaultSource={{ uri: "/images/placeholder.svg" }}
            />
            <View style={styles.cardText}>
              <Text style={styles.racePill}>{building.race}</Text>
              <Text style={styles.name}>{building.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{building.description}</Text>
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
  buildingImg: { width: 52, height: 52, borderRadius: 8 },
  cardText: { flex: 1, gap: 3 },
  racePill: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  name: { color: colors.text, fontSize: 15, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
