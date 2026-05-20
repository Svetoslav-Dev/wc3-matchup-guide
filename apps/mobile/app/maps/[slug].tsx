import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useMapContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

const panelStyle = {
  backgroundColor: colors.panel,
  borderColor: colors.line,
  borderWidth: 1,
  borderRadius: 18,
  padding: 16,
  gap: 12,
} as const;

export default function MapDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: map, loading } = useMapContent(slug);

  if (!map) {
    return (
      <ScreenShell>
        <PageTitle>Map not found.</PageTitle>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionLabel>Map Guide</SectionLabel>
      <PageTitle>{map.name}</PageTitle>
      <PageIntro>{map.description}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing map guide…</Text> : null}

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Creep Notes</Text>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>{map.creepNotes}</Text>
      </View>

      <View style={panelStyle}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Expansion Notes</Text>
        <Text style={{ color: colors.muted, lineHeight: 22 }}>{map.expansionNotes}</Text>
      </View>

      {map.availableItems.length > 0 ? (
        <View style={panelStyle}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Available Items</Text>
          {map.availableItems.map((item) => (
            <Text key={item} style={{ color: colors.muted, lineHeight: 22 }}>• {item}</Text>
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}
