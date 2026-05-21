import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, MatchupCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useMatchupsContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const NORMALIZE_DIFFICULTY: Record<string, string> = {
  "Easy":            "Easy",
  "Medium":          "Medium",
  "Hard":            "Hard",
  "Very Hard":       "Very Hard",
  "Technical":       "Medium",
  "Demanding":       "Hard",
  "High pressure":   "Hard",
  "Tight margins":   "Hard",
  "Execution heavy": "Hard",
  "Sharp timing":    "Hard",
  "Punishing":       "Very Hard",
  "Volatile":        "Very Hard",
  "Timing critical": "Hard",
  "Razor-thin":      "Very Hard",
};

export default function MatchupsScreen() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const { data: matchups, loading } = useMatchupsContent();
  const normalizedSearch = search.trim().toLowerCase();
  const difficultyOptions = ["all", "Easy", "Medium", "Hard", "Very Hard"];
  const filteredMatchups = matchups.filter((matchup) => {
    const normalized = NORMALIZE_DIFFICULTY[matchup.difficulty] ?? matchup.difficulty;
    const matchesDifficulty =
      difficultyFilter === "all" || normalized === difficultyFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      matchup.title.toLowerCase().includes(normalizedSearch) ||
      matchup.summary.toLowerCase().includes(normalizedSearch);
    return matchesDifficulty && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Matchups</SectionLabel>
      <PageTitle>Know the pressure window.</PageTitle>
      <PageIntro>
        Matchup pages focus on fast strategic recall for early, mid, and late game priorities.
      </PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading matchup guides…</Text> : null}
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search matchups</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by title or summary"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.chipRow}>
          {difficultyOptions.map((difficulty) => {
            const active = difficulty === difficultyFilter;
            return (
              <Pressable
                key={difficulty}
                onPress={() => setDifficultyFilter(difficulty)}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                  {difficulty === "all" ? "All Levels" : difficulty}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <GhostBadge>
        {filteredMatchups.length} result{filteredMatchups.length === 1 ? "" : "s"}
      </GhostBadge>
      {filteredMatchups.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No matchup matches this filter.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search or choosing a different difficulty band.</Text>
        </View>
      ) : null}
      {filteredMatchups.map((matchup) => (
        <MatchupCard
          key={matchup.slug}
          slug={matchup.slug}
          difficulty={matchup.difficulty}
          summary={matchup.summary}
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
