import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, SectionLabel } from "../../components/mobile-ui";
import { useHeroesContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const RACE_OPTIONS = [
  { slug: "all",       label: "All" },
  { slug: "Human",     label: "Human" },
  { slug: "Orc",       label: "Orc" },
  { slug: "Undead",    label: "Undead" },
  { slug: "Night Elf", label: "Night Elf" },
  { slug: "Neutral",   label: "Neutral" },
];

export default function HeroesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState("all");
  const { data: heroes, loading } = useHeroesContent();
  const normalizedSearch = search.trim().toLowerCase();

  const filteredHeroes = heroes.filter((hero) => {
    const matchesRace = raceFilter === "all" || hero.raceName === raceFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [hero.name, hero.description, hero.role, hero.primaryAttribute, ...hero.highlights]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    return matchesRace && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Heroes</SectionLabel>
      {loading ? <Text style={{ color: colors.muted }}>Loading heroes…</Text> : null}
      <View style={styles.filterPanel}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by hero, role, or highlight"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {RACE_OPTIONS.map(({ slug, label }) => {
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
      <GhostBadge>{filteredHeroes.length} hero{filteredHeroes.length === 1 ? "" : "es"}</GhostBadge>
      {filteredHeroes.map((hero) => (
        <Pressable
          key={hero.slug}
          onPress={() => router.push(`/heroes/${hero.slug}` as never)}
          style={({ hovered, pressed }) => [
            styles.card,
            (hovered || pressed) ? styles.cardHovered : null,
          ]}
        >
          <View style={styles.cardRow}>
            <Image
              source={{ uri: hero.imageUrl ?? "/images/placeholder.svg" }}
              style={styles.heroImg}
            />
            <View style={styles.cardText}>
              <Text style={styles.racePill}>{hero.raceName} · {hero.role}</Text>
              <Text style={styles.name}>{hero.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{hero.description}</Text>
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
  heroImg: { width: 52, height: 52, borderRadius: 8 },
  cardText: { flex: 1, gap: 3 },
  racePill: { color: colors.gold, fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  name: { color: colors.text, fontSize: 15, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
