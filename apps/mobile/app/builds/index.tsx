import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, DifficultyBadge, DIFFICULTY_COLORS, PageIntro, PageTitle, SectionLabel, getRaceIconUri, getRaceDisplayName } from "../../components/mobile-ui";
import { useBuildsContent } from "../../lib/live-content";
import { mobileData } from "../../lib/mobile-data";
import { colors } from "../../lib/theme";

const DIFFICULTY_OPTIONS = ["all", "Easy", "Medium", "Hard", "Very Hard"];

export default function BuildsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const { data: builds, loading } = useBuildsContent();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredBuilds = builds.filter((build) => {
    const matchesRace = raceFilter === "all" || build.raceSlug === raceFilter;
    const matchesDifficulty = difficultyFilter === "all" || build.difficulty === difficultyFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      build.title.toLowerCase().includes(normalizedSearch) ||
      build.summary.toLowerCase().includes(normalizedSearch) ||
      build.strategyType.toLowerCase().includes(normalizedSearch);

    return matchesRace && matchesDifficulty && matchesSearch;
  });
  const raceOptions = [
    { slug: "all", name: "All" },
    ...mobileData.races.filter((r) => r.slug !== "neutral").map((race) => ({ slug: race.slug, name: race.name })),
  ];

  return (
    <ScreenShell>
      <SectionLabel>Build Orders</SectionLabel>
      <PageTitle>Openings built for real games.</PageTitle>
      <PageIntro>
        The mobile build list is intentionally compact so players can check key routes before or between ladder games.
      </PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading build orders…</Text> : null}
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
                    {race.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Text style={styles.filterLabel}>Difficulty</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {DIFFICULTY_OPTIONS.map((diff) => {
              const active = diff === difficultyFilter;
              const dotColor = DIFFICULTY_COLORS[diff];
              return (
                <Pressable
                  key={diff}
                  onPress={() => setDifficultyFilter(diff)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <View style={styles.diffChipInner}>
                    {dotColor ? <View style={[styles.diffDot, { backgroundColor: dotColor }]} /> : null}
                    <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                      {diff === "all" ? "All" : diff}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
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
        <Pressable
          key={build.slug}
          onPress={() => router.push(`/builds/${build.slug}` as never)}
          style={({ hovered, pressed }) => [
            buildStyles.card,
            (hovered || pressed) ? buildStyles.cardHovered : null,
          ]}
        >
          <View style={buildStyles.topRow}>
            <Image source={{ uri: getRaceIconUri(build.raceSlug) }} style={buildStyles.raceIcon} />
            <Text style={buildStyles.raceName}>{getRaceDisplayName(build.raceSlug)}</Text>
            <DifficultyBadge value={build.difficulty} />
          </View>
          <Text style={buildStyles.title}>{build.title}</Text>
          <Text style={buildStyles.summary} numberOfLines={2}>{build.summary}</Text>
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
    gap: 8,
  },
  diffChipInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
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

const buildStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  cardHovered: { backgroundColor: colors.bgSoft },
  topRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  raceIcon: { width: 22, height: 22, borderRadius: 4 },
  raceName: { color: colors.gold, fontSize: 12, fontWeight: "700", textTransform: "uppercase", flex: 1 },
  title: { color: colors.text, fontSize: 15, fontWeight: "700" },
  summary: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
