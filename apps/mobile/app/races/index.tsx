import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useRacesContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function RacesScreen() {
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState<string>("all");
  const { data: races, error, live, loading } = useRacesContent();
  const normalizedSearch = search.trim().toLowerCase();
  const focusOptions = [
    { id: "all", label: "All Styles" },
    { id: "macro", label: "Macro" },
    { id: "pressure", label: "Pressure" },
    { id: "mobility", label: "Mobility" },
    { id: "timing", label: "Timing" },
  ];
  const filteredRaces = races.filter((race) => {
    const haystack = [
      race.name,
      race.identity,
      race.description,
      race.ladderFocus,
      ...race.signatureHeroes,
      ...race.strengths,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch.length === 0 || haystack.includes(normalizedSearch);
    const matchesFocus =
      focusFilter === "all" || race.ladderFocus.toLowerCase().includes(focusFilter);

    return matchesSearch && matchesFocus;
  });

  return (
    <ScreenShell>
      <SectionLabel>Race Guides</SectionLabel>
      <PageTitle>Four identities, four decision trees.</PageTitle>
      <PageIntro>
        The mobile client emphasizes quick recognition: race identity, ladder focus, and signature heroes.
      </PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading race guides…</Text> : null}
      {error ? <Text style={{ color: colors.muted }}>API unavailable. Showing fallback guides.</Text> : null}
      <Text style={{ color: colors.muted }}>{live ? "Live API content" : "Shared fallback content"}</Text>
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search races</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by race, strengths, or heroes"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.chipRow}>
          {focusOptions.map((focus) => {
            const active = focus.id === focusFilter;

            return (
              <Pressable
                key={focus.id}
                onPress={() => setFocusFilter(focus.id)}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                  {focus.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <GhostBadge>
        {filteredRaces.length} result{filteredRaces.length === 1 ? "" : "s"}
      </GhostBadge>
      {filteredRaces.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No race matches this filter.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search or switching to a broader focus style.</Text>
        </View>
      ) : null}
      {filteredRaces.map((race) => (
        <ListCard
          key={race.slug}
          eyebrow={race.badge}
          title={race.name}
          description={race.identity}
          href={`/races/${race.slug}`}
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
