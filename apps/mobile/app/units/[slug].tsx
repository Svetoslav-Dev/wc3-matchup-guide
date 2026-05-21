import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useUnitContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const panelStyle = {
  backgroundColor: colors.panel,
  borderColor: colors.line,
  borderWidth: 1,
  borderRadius: 18,
  padding: 16,
  gap: 12,
} as const;

export default function UnitDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: unit, loading } = useUnitContent(slug);

  if (!unit) {
    return (
      <ScreenShell>
        <PageTitle>Unit not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>{unit.raceName}</SectionLabel>
      <View style={styles.header}>
        {unit.imageUrl ? (
          <Image source={{ uri: unit.imageUrl }} style={styles.portrait} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name}>{unit.name}</Text>
          <Text style={styles.description}>{unit.description}</Text>
        </View>
      </View>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing unit guide…</Text> : null}

      <View style={panelStyle}>
        <GhostBadge>{unit.tier}</GhostBadge>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          Type: {unit.unitType}
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Text style={{ color: colors.muted }}>🍖 {unit.food} food</Text>
          <Text style={{ color: colors.muted }}>🪙 {unit.gold} gold</Text>
          <Text style={{ color: colors.muted }}>🪵 {unit.lumber} lumber</Text>
        </View>
      </View>

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Strengths</Text>
        {unit.strengths.map((s) => (
          <Text key={s} style={{ color: colors.muted, lineHeight: 22 }}>• {s}</Text>
        ))}
      </View>

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Weaknesses</Text>
        {unit.weaknesses.map((w) => (
          <Text key={w} style={{ color: colors.muted, lineHeight: 22 }}>• {w}</Text>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  portrait: {
    width: 72,
    height: 72,
    borderRadius: 10,
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
