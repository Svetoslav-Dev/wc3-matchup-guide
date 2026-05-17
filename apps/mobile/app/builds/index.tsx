import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useBuildsContent } from "../../lib/live-content";
import { mobileData } from "../../lib/mobile-data";
import { colors } from "../../lib/theme";

export default function BuildsScreen() {
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState<string>("all");
  const { data: builds, error, live, loading } = useBuildsContent();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredBuilds = builds.filter((build) => {
    const matchesRace = raceFilter === "all" || build.raceSlug === raceFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      build.title.toLowerCase().includes(normalizedSearch) ||
      build.summary.toLowerCase().includes(normalizedSearch) ||
      build.strategyType.toLowerCase().includes(normalizedSearch);

    return matchesRace && matchesSearch;
  });
  const raceOptions = [
    { slug: "all", name: "All" },
    ...mobileData.races.map((race) => ({ slug: race.slug, name: race.name })),
  ];

  return (
    <ScreenShell>
      <SectionLabel>Build Orders</SectionLabel>
      <PageTitle>Openings built for real games.</PageTitle>
      <PageIntro>
        The mobile build list is intentionally compact so players can check key routes before or between ladder games.
      </PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading build orders…</Text> : null}
      {error ? <Text style={{ color: colors.muted }}>API unavailable. Showing fallback build orders.</Text> : null}
      <Text style={{ color: colors.muted }}>{live ? "Live API content" : "Shared fallback content"}</Text>
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search builds</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by title, summary, or style"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
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
                  {race.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <GhostBadge>
        {filteredBuilds.length} result{filteredBuilds.length === 1 ? "" : "s"}
      </GhostBadge>
      {filteredBuilds.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No build matches this filter.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search or switching to another race.</Text>
        </View>
      ) : null}
      {filteredBuilds.map((build) => (
        <ListCard
          key={build.slug}
          eyebrow={`${build.raceName} · ${build.strategyType}`}
          title={build.title}
          description={build.summary}
          href={`/builds/${build.slug}`}
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
