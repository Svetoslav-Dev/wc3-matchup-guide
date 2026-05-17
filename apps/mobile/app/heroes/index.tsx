import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useHeroesContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function HeroesScreen() {
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState<string>("all");
  const { data: heroes, error, live, loading } = useHeroesContent();
  const normalizedSearch = search.trim().toLowerCase();
  const raceOptions = ["all", ...Array.from(new Set(heroes.map((hero) => hero.raceName)))];
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
      <SectionLabel>Hero Guides</SectionLabel>
      <PageTitle>Core heroes and their pressure points.</PageTitle>
      <PageIntro>
        Hero pages focus on role clarity, primary attribute, and the tools that define each race’s strongest openings and transitions.
      </PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading hero guides…</Text> : null}
      {error ? <Text style={{ color: colors.muted }}>API unavailable. Showing fallback heroes.</Text> : null}
      <Text style={{ color: colors.muted }}>{live ? "Live API content" : "Shared fallback content"}</Text>
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search heroes</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by hero, role, or highlight"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.chipRow}>
          {raceOptions.map((race) => {
            const active = race === raceFilter;

            return (
              <Pressable
                key={race}
                onPress={() => setRaceFilter(race)}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                  {race === "all" ? "All Races" : race}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <GhostBadge>
        {filteredHeroes.length} result{filteredHeroes.length === 1 ? "" : "s"}
      </GhostBadge>
      {filteredHeroes.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No hero matches this filter.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search or switching to another race.</Text>
        </View>
      ) : null}
      {filteredHeroes.map((hero) => (
        <ListCard
          key={hero.slug}
          eyebrow={`${hero.raceName} · ${hero.role}`}
          title={hero.name}
          description={hero.description}
          href={`/heroes/${hero.slug}`}
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
  filterLabel: {
    color: colors.text,
    fontWeight: "700",
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bgSoft,
  },
  chipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  chipText: {
    color: colors.muted,
    fontWeight: "700",
  },
  chipTextActive: {
    color: colors.gold,
  },
  emptyPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyCopy: {
    color: colors.muted,
    lineHeight: 22,
  },
});
