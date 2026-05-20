import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { useMapsContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function MapsScreen() {
  const [search, setSearch] = useState("");
  const { data: maps, loading } = useMapsContent();
  const normalized = search.trim().toLowerCase();

  const filtered = maps.filter((map) =>
    normalized.length === 0 ||
    [map.name, map.description, map.creepNotes].join(" ").toLowerCase().includes(normalized),
  );

  return (
    <ScreenShell>
      <SectionLabel>Map Library</SectionLabel>
      <PageTitle>Map shape changes every timing window.</PageTitle>
      <PageIntro>Browse all maps with creep notes and expansion guidance.</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Loading maps…</Text> : null}
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Search maps</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by map name"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
      </View>
      <GhostBadge>{filtered.length} result{filtered.length === 1 ? "" : "s"}</GhostBadge>
      {filtered.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No maps found.</Text>
          <Text style={styles.emptyCopy}>Try clearing the search.</Text>
        </View>
      ) : null}
      {filtered.map((map) => (
        <ListCard
          key={map.slug}
          eyebrow={map.creepNotes}
          title={map.name}
          description={map.description}
          href={`/maps/${map.slug}`}
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
