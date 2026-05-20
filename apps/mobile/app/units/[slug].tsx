import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
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
      <PageTitle>{unit.name}</PageTitle>
      <PageIntro>{unit.description}</PageIntro>
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
